"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register the service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration.scope);

          // Check for update on navigation
          registration.update();
        })
        .catch((err) => {
          console.error("[PWA] Service Worker registration failed:", err);
        });

      // Detect when a new service worker takes control (after a deploy/commit)
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          console.log("[PWA] New version detected! Hard refreshing to load latest commit...");
          window.location.reload();
        }
      });
    }
  }, []);

  return null;
}
