"use client";

import { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { changePassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    setError("");
    const res = await changePassword(newPassword);
    if (!res.success) {
      setError(res.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Secure Your Account</h1>
          <p className="text-slate-500 dark:text-white/50 text-sm font-medium tracking-wide">As this is your first login, please set a new secure password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#F05E23] ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-[#F05E23] focus:ring-1 focus:ring-[#F05E23] transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#F05E23] ml-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-[#F05E23] focus:ring-1 focus:ring-[#F05E23] transition-all text-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-[#111] dark:bg-white text-white dark:text-[#111] rounded-2xl py-5 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password & Continue"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
