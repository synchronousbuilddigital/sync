"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 8) return setError("Password must be at least 8 characters");

    setSubmitting(true);
    setError("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword: password }),
    });
    const data = await res.json();

    if (data.success) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } else {
      setError(data.message);
      setSubmitting(false);
    }
  };

  if (!token) return <div className="p-20 text-center font-black uppercase text-red-500">INVALID SECURITY TOKEN</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/10 rounded-[3rem] p-10 shadow-2xl"
    >
      {success ? (
        <div className="text-center py-10 space-y-6">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
          <h2 className="text-2xl font-black uppercase">Credentials Updated</h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Protocol successful. Redirecting to login...</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">New <span className="text-[#F05E23]">Credentials</span></h1>
            <p className="text-slate-500 text-sm font-medium">Establish your new security access keys.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[0.65rem] font-black uppercase text-[#F05E23] tracking-widest pl-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-[#F05E23] font-bold" placeholder="••••••••" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[0.65rem] font-black uppercase text-[#F05E23] tracking-widest pl-1">Confirm Identity Key</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-[#F05E23] font-bold" placeholder="••••••••" />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs font-black text-center uppercase tracking-tighter">{error}</p>}

            <button type="submit" disabled={submitting} className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Update Access"}
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-[#050505]">
      <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin text-[#F05E23]" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
