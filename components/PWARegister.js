"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      let refreshing = false;

      // Force instant reload and wipe caches when new service worker takes over after a deploy
      navigator.serviceWorker.addEventListener("controllerchange", async () => {
        if (!refreshing) {
          refreshing = true;
          console.log("[PWA] New commit detected! Purging old cache and hard refreshing...");
          if ("caches" in window) {
            try {
              const keys = await caches.keys();
              await Promise.all(keys.map(k => caches.delete(k)));
            } catch (e) {
              console.error("[PWA] Cache purge error:", e);
            }
          }
          window.location.reload();
        }
      });

      // Register service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration.scope);

          // Force activation if a new worker is already waiting in background
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
            registration.waiting.postMessage({ type: "CLEAR_CACHE" });
          }

          // Monitor for new service worker being found after commit
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

          // Check for new build on page focus / app resume
          const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
              registration.update();
            }
          };
          document.addEventListener("visibilitychange", handleVisibilityChange);

          // Also check periodically every 60 seconds
          const interval = setInterval(() => {
            registration.update();
          }, 60000);

          return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            clearInterval(interval);
          };
        })
        .catch((err) => {
          console.error("[PWA] Service Worker registration failed:", err);
        });
    }
  }, []);

  return null;
}
