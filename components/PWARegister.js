"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // --- 1. COMMIT & BUILD VERSION CHECKER (For Both Website & PWA) ---
    const checkVersionAndRefresh = async () => {
      try {
        const res = await fetch(`/api/version?t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" }
        });
        if (!res.ok) return;
        const data = await res.json();
        const latestCommit = data.commit;
        if (!latestCommit || latestCommit === "development-mode") return;

        const savedCommit = localStorage.getItem("app_commit_sha");

        // If we have a saved commit and it doesn't match the server's latest commit -> New Deploy!
        if (savedCommit && savedCommit !== latestCommit) {
          console.log(`[VersionChecker] New commit detected! Old: ${savedCommit} -> New: ${latestCommit}`);
          console.log("[VersionChecker] Purging all caches and performing hard refresh...");

          // Save new commit first so after reload we don't reload again
          localStorage.setItem("app_commit_sha", latestCommit);

          // 1. Purge browser Cache Storage (Service Worker & Cache API)
          if ("caches" in window) {
            try {
              const keys = await caches.keys();
              await Promise.all(keys.map(k => caches.delete(k)));
              console.log("[VersionChecker] Cache Storage purged.");
            } catch (e) {
              console.error("[VersionChecker] Cache purge error:", e);
            }
          }

          // 2. Tell Service Worker to clear its cache and skip waiting
          if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" });
            navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
          }

          // 3. Perform hard reload
          window.location.reload(true);
          return;
        }

        // First time visit or matching commit: just store it
        if (!savedCommit) {
          localStorage.setItem("app_commit_sha", latestCommit);
        }
      } catch (err) {
        console.warn("[VersionChecker] Failed to check commit version:", err);
      }
    };

    // Check immediately on mount
    checkVersionAndRefresh();

    // Check whenever tab/app comes back into focus or visibility
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkVersionAndRefresh();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", checkVersionAndRefresh);

    // Also check periodically every 45 seconds while app is open
    const versionInterval = setInterval(checkVersionAndRefresh, 45000);

    // --- 2. SERVICE WORKER REGISTRATION (For PWA) ---
    if ("serviceWorker" in navigator) {
      let refreshing = false;

      // Force instant reload when new service worker takes over
      navigator.serviceWorker.addEventListener("controllerchange", async () => {
        if (!refreshing) {
          refreshing = true;
          console.log("[PWA] Controller changed! Purging old cache and reloading...");
          if ("caches" in window) {
            try {
              const keys = await caches.keys();
              await Promise.all(keys.map(k => caches.delete(k)));
            } catch (e) {}
          }
          window.location.reload();
        }
      });

      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration.scope);

          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
            registration.waiting.postMessage({ type: "CLEAR_CACHE" });
          }

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  newWorker.postMessage({ type: "SKIP_WAITING" });
                  newWorker.postMessage({ type: "CLEAR_CACHE" });
                }
              });
            }
          });

          const checkSwUpdate = () => {
            if (document.visibilityState === "visible") {
              registration.update();
            }
          };
          document.addEventListener("visibilitychange", checkSwUpdate);

          const swInterval = setInterval(() => {
            registration.update();
          }, 60000);

          return () => {
            document.removeEventListener("visibilitychange", checkSwUpdate);
            clearInterval(swInterval);
          };
        })
        .catch((err) => {
          console.error("[PWA] Service Worker registration failed:", err);
        });
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", checkVersionAndRefresh);
      clearInterval(versionInterval);
    };
  }, []);

  return null;
}
