"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Sparkles, X, Bell } from "lucide-react";

export default function NotificationToaster({ statusMsg, onClose, duration = 4500 }) {
  useEffect(() => {
    if (statusMsg?.msg) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [statusMsg, duration, onClose]);

  if (!statusMsg || !statusMsg.msg) return null;

  const isSuccess = statusMsg.type === "success";
  const isError = statusMsg.type === "error";

  return (
    <AnimatePresence>
      {statusMsg.msg && (
        <motion.div
          key="global-notification-toast"
          initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, y: 30, scale: 0.9, transition: { duration: 0.2 } }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[99999] max-w-sm sm:max-w-md w-[calc(100vw-3rem)] pointer-events-auto"
        >
          <div
            className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-6 backdrop-blur-2xl shadow-2xl border transition-all duration-300 ${
              isSuccess
                ? "bg-slate-900/95 dark:bg-[#0b101b]/95 border-emerald-500/40 shadow-emerald-500/20"
                : isError
                ? "bg-slate-900/95 dark:bg-[#180b0f]/95 border-rose-500/40 shadow-rose-500/20"
                : "bg-slate-900/95 dark:bg-[#120f1c]/95 border-[#F05E23]/40 shadow-[#F05E23]/20"
            }`}
          >
            {/* Background Ambient Glow */}
            <div
              className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-30 ${
                isSuccess
                  ? "bg-emerald-500"
                  : isError
                  ? "bg-rose-500"
                  : "bg-[#F05E23]"
              }`}
            />

            <div className="flex items-start gap-4 relative z-10">
              {/* Icon Badge */}
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  isSuccess
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30 text-white"
                    : isError
                    ? "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/30 text-white"
                    : "bg-gradient-to-br from-[#F05E23] to-amber-500 shadow-[#F05E23]/30 text-white"
                }`}
              >
                {isSuccess ? (
                  <CheckCircle2 className="w-6 h-6 animate-pulse" />
                ) : isError ? (
                  <AlertCircle className="w-6 h-6 animate-pulse" />
                ) : (
                  <Sparkles className="w-6 h-6 animate-pulse" />
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[0.6rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      isSuccess
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : isError
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-[#F05E23]/20 text-[#FF8C61] border border-[#F05E23]/30"
                    }`}
                  >
                    {isSuccess
                      ? "Success"
                      : isError
                      ? "Attention Needed"
                      : "System Notice"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed tracking-wide break-words">
                  {statusMsg.msg}
                </p>
              </div>

              {/* Close Button */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors shrink-0"
                  title="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className={`h-full ${
                  isSuccess
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : isError
                    ? "bg-gradient-to-r from-rose-500 to-red-500"
                    : "bg-gradient-to-r from-[#F05E23] to-amber-400"
                }`}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
