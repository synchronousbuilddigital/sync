"use client";

import { useState, useEffect } from "react";
import { Download, Smartphone } from "lucide-react";

export default function PWAInstallButton({ isScrolled, isDark, mobile }) {
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

  if (mobile) {
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

  return (
    <button
      onClick={handleInstall}
      title="Download & Install App"
      className={`relative overflow-hidden flex items-center gap-2 ${
        isScrolled ? "px-3.5 py-1.5 rounded-full text-[0.6rem]" : "px-4 py-2.5 rounded-xl text-[0.65rem]"
      } font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-sm border ${
        isDark
          ? "bg-gradient-to-r from-[#F05E23]/20 to-amber-500/20 border-[#F05E23]/40 text-[#F05E23] hover:bg-[#F05E23] hover:text-white"
          : "bg-gradient-to-r from-[#F05E23]/10 to-amber-500/10 border-[#F05E23]/30 text-[#F05E23] hover:bg-[#F05E23] hover:text-white"
      }`}
    >
      <Download className="w-3.5 h-3.5 shrink-0" />
      <span className="hidden xl:inline">Install App</span>
    </button>
  );
}
