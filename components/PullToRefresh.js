"use client";

import { useState, useEffect } from "react";
import { RefreshCw, ArrowDown } from "lucide-react";

export default function PullToRefresh() {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const threshold = 65;

  useEffect(() => {
    let startY = 0;
    let isPulling = false;

    const handleTouchStart = (e) => {
      if (window.scrollY <= 5 && !refreshing) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling || refreshing) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;

      if (diff > 0 && window.scrollY <= 5) {
        // Apply resistance curve
        const distance = Math.min(diff * 0.4, 110);
        setPullDistance(distance);
      } else {
        setPullDistance(0);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;
      isPulling = false;

      if (pullDistance >= threshold && !refreshing) {
        setRefreshing(true);
        setPullDistance(60); // Keep spinner visible during reload
        
        // Trigger cache cleanup if service worker is present before reloading
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" });
        }
        
        setTimeout(() => {
          window.location.reload();
        }, 600);
      } else {
        setPullDistance(0);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullDistance, refreshing]);

  if (pullDistance <= 5 && !refreshing) return null;

  return (
    <div
      style={{
        transform: `translate3d(0, ${refreshing ? 20 : pullDistance - 40}px, 0)`,
      }}
      className="fixed left-0 right-0 top-0 z-[9999] flex justify-center pointer-events-none transition-transform duration-150 ease-out"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 dark:bg-black/90 backdrop-blur-xl border border-white/10 text-white rounded-full shadow-2xl text-xs font-black tracking-wider uppercase">
        {refreshing ? (
          <>
            <RefreshCw className="w-4 h-4 text-[#F05E23] animate-spin" />
            <span>Refreshing PWA...</span>
          </>
        ) : pullDistance >= threshold ? (
          <>
            <RefreshCw className="w-4 h-4 text-[#F05E23] animate-spin" />
            <span className="text-[#F05E23]">Release to Refresh</span>
          </>
        ) : (
          <>
            <ArrowDown
              className="w-4 h-4 text-slate-400 transition-transform duration-150"
              style={{ transform: `rotate(${Math.min(pullDistance * 3, 180)}deg)` }}
            />
            <span className="text-slate-300">Pull to Refresh</span>
          </>
        )}
      </div>
    </div>
  );
}
