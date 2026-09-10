"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Download, Bell } from "lucide-react";

export default function PWAInstallButton({ isScrolled, isDark, mobile, floating }) {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [notifPerm, setNotifPerm] = useState("default");

  const isAboutPage = pathname === "/about" || pathname?.startsWith("/about/");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("Notification" in window) {
        setNotifPerm(Notification.permission);
      }
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

  const handleEnableNotifs = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const perm = await Notification.requestPermission();
      setNotifPerm(perm);
      if (perm === "granted" && "serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification("Notifications Enabled 🔔", {
            body: "You will now receive native alerts on your mobile device.",
            icon: "/logo.png",
            vibrate: [200, 100, 200]
          });
        });
      }
    }
  };

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

  // Floating bottom corner mode:
  // If NOT on the about page, show WhatsApp Contact floating circular button
  if (!isAboutPage) {
    return (
      <div className="fixed bottom-6 left-6 z-[90] group flex items-center gap-3">
        <a
          href="https://wa.me/919161391566?text=Hi!%20I'd%20like%20to%20connect%20with%20Synchronous%20Build%20Digital."
          target="_blank"
          rel="noopener noreferrer"
          title="Contact on WhatsApp"
          aria-label="Contact on WhatsApp"
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_rgba(37,211,102,0.45)] border border-[#25D366] hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {/* Ambient Ping Pulse */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-35 pointer-events-none" />

          <svg className="w-7 h-7 fill-current shrink-0 relative z-10" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>

        {/* Hover Tooltip Badge */}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 py-1.5 rounded-xl bg-[#111] dark:bg-white text-white dark:text-[#111] text-[0.65rem] font-bold uppercase tracking-wider shadow-lg whitespace-nowrap pointer-events-none">
          Contact on WhatsApp
        </span>
      </div>
    );
  }

  // On About page: Show "ENABLE ALERTS" & "INSTALL APP" floating buttons
  if (isStandalone) {
    if (notifPerm === "default") {
      return (
        <div className="fixed bottom-6 left-6 z-[90]">
          <button
            onClick={handleEnableNotifs}
            title="Enable Phone Notifications"
            aria-label="Enable Phone Notifications"
            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#111] dark:bg-white text-white dark:text-[#111] font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(240,94,35,0.35)] border border-[#F05E23] hover:bg-[#F05E23] hover:text-white transition-all group"
          >
            <Bell className="w-4 h-4 shrink-0 text-[#F05E23] group-hover:text-white animate-bounce" />
            <span>Enable Notifications</span>
          </button>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-[90] flex flex-col gap-2">
      {notifPerm === "default" && (
        <button
          onClick={handleEnableNotifs}
          title="Enable Phone Notifications"
          aria-label="Enable Phone Notifications"
          className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#111] dark:bg-white text-white dark:text-[#111] font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(240,94,35,0.35)] border border-[#F05E23] hover:bg-[#F05E23] hover:text-white transition-all group"
        >
          <Bell className="w-4 h-4 shrink-0 text-[#F05E23] group-hover:text-white animate-bounce" />
          <span>Enable Alerts</span>
        </button>
      )}
      <button
        onClick={handleInstall}
        title="Download & Install App"
        aria-label="Download and Install App"
        className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#111] dark:bg-white text-white dark:text-[#111] font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(240,94,35,0.35)] border border-[#F05E23] hover:bg-[#F05E23] hover:text-white dark:hover:bg-[#F05E23] dark:hover:text-white hover:scale-105 active:scale-95 transition-all group"
      >
        <Download className="w-4 h-4 shrink-0 text-[#F05E23] group-hover:text-white transition-colors animate-bounce" />
        <span>Install App</span>
      </button>
    </div>
  );
}
