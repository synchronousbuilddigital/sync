"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";

export default function PWAInstallButton({ isScrolled, isDark, mobile, floating }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) {
        setIsStandalone(true);
      }

      const handlePrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener("beforeinstallprompt", handlePrompt);
      return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
    }
  }, []);

  if (isStandalone) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        alert("To install app on iOS:\n1. Tap the Share button at the bottom of Safari.\n2. Tap 'Add to Home Screen'.");
      } else {
        alert("To install app on your device:\nClick the browser menu (⋮ or ⋯ in top right) and select 'Install Synchronous Build Digital' or 'Add to Home Screen'.");
      }
    }
  };

  if (mobile && !floating) {
    return (
      <button
        onClick={handleInstall}
        className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs transition-all shadow-md border ${
          isDark
            ? "bg-gradient-to-r from-[#F05E23] to-amber-500 text-white border-transparent"
            : "bg-gradient-to-r from-[#F05E23] to-amber-500 text-white border-transparent"
        }`}
      >
        <Download className="w-4 h-4 animate-bounce" />
        <span>Download App</span>
      </button>
    );
  }

  // Floating bottom corner button
  return (
    <div className="fixed bottom-6 left-6 z-[90]">
      <button
        onClick={handleInstall}
        title="Download & Install App"
        className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#111] dark:bg-white text-white dark:text-[#111] font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(240,94,35,0.35)] border border-[#F05E23] hover:bg-[#F05E23] hover:text-white dark:hover:bg-[#F05E23] dark:hover:text-white hover:scale-105 active:scale-95 transition-all group"
      >
        <Download className="w-4 h-4 shrink-0 text-[#F05E23] group-hover:text-white transition-colors animate-bounce" />
        <span>Install App</span>
      </button>
    </div>
  );
}
