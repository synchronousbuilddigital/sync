"use client";

import { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState({ type: "", text: "" });

  const handleForgot = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: forgotEmail }),
    });
    const data = await res.json();
    setForgotMsg({ type: data.success ? "success" : "error", text: data.message });
    setSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await login(email, password);
    if (!res.success) {
      setError(res.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">{forgotPassword ? "Security Briefing" : "Access Portal"}</h1>
          <p className="text-slate-500 dark:text-white/50 text-sm font-medium tracking-wide">
            {forgotPassword ? "Enter your email to initiate recovery protocols." : "Enter your credentials to manage your sync workflow."}
          </p>
        </div>

        {!forgotPassword ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#F05E23] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#F05E23] transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="intern@synchronous.com"
                  required
                  className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-[#F05E23] focus:ring-1 focus:ring-[#F05E23] transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#F05E23]">Password</label>
                <button type="button" onClick={() => setForgotPassword(true)} className="text-[0.6rem] font-black uppercase text-slate-400 hover:text-black dark:hover:text-white transition-colors">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#F05E23] transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-[#F05E23] focus:ring-1 focus:ring-[#F05E23] transition-all text-sm font-medium"
                />
              </div>
            </div>

            {error && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs font-bold text-center">{error}</motion.p>}

            <button type="submit" disabled={submitting} className="w-full bg-[#111] dark:bg-white text-white dark:text-[#111] rounded-2xl py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Login to Portal <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgot} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#F05E23] ml-1">Recovery Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#F05E23] transition-colors" />
                <input 
                  type="email" 
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="intern@synchronous.com"
                  required
                  className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-[#F05E23] focus:ring-1 focus:ring-[#F05E23] transition-all text-sm font-medium"
                />
              </div>
            </div>

            {forgotMsg.text && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-xs font-bold text-center ${forgotMsg.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {forgotMsg.text}
              </motion.p>
            )}

            <div className="flex gap-4">
              <button type="button" onClick={() => { setForgotPassword(false); setForgotMsg({type:"",text:""}); }} className="flex-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white rounded-2xl py-4 font-bold uppercase tracking-widest text-xs hover:bg-slate-200 dark:hover:bg-white/10 transition-all">Back</button>
              <button type="submit" disabled={submitting} className="flex-2 bg-[#F05E23] text-white rounded-2xl py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F05E23]/20 disabled:opacity-50 transition-all">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Recovery"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 text-center">
          <p className="text-[0.65rem] text-slate-400 dark:text-white/30 font-bold uppercase tracking-[0.1em]">
            Sync Enterprise Management System v1.0
          </p>
        </div>
      </motion.div>
    </div>
  );
}
