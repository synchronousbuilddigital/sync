"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  ChevronRight, 
  Loader2, 
  Briefcase,
  ShieldCheck,
  Mail,
  Phone,
  ExternalLink
} from "lucide-react";
import { useTheme } from "@/components/ThemeContext";

function StatusContent() {
  const { isDark } = useTheme();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  
  const [email, setEmail] = useState(emailParam || "");
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (emailParam) {
      handleSearch(emailParam);
    }
  }, [emailParam]);

  const handleSearch = async (searchEmail = email) => {
    if (!searchEmail) return;
    setLoading(true);
    setError("");
    setApplication(null);

    try {
      // Note: This matches the admin API but is used publicly. 
      // In a real app, we'd have a specific public status endpoint to avoid leaking all apps.
      const res = await fetch(`/api/public/hiring/status?email=${searchEmail}`);
      const data = await res.json();
      
      if (data.success && data.application) {
        setApplication(data.application);
      } else {
        setError(data.message || "No application found with this email.");
      }
    } catch (err) {
      setError("Failed to fetch status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case 'Applied':
        return {
          icon: <Clock className="w-8 h-8 text-amber-500" />,
          color: 'text-amber-500',
          bg: 'bg-amber-500/10',
          title: 'Application Received',
          desc: 'Our team is currently reviewing your profile and portfolio assets.'
        };
      case 'Round 2':
        return {
          icon: <ChevronRight className="w-8 h-8 text-blue-500" />,
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
          title: 'Accepted for Round 2',
          desc: 'Congratulations! You have been shortlisted for the next round of evaluation.'
        };
      case 'Selected':
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
          color: 'text-green-500',
          bg: 'bg-green-500/10',
          title: 'Final Selection',
          desc: 'Welcome to Synchronous! You have been selected to join our elite intelligence unit.'
        };
      case 'Declined':
        return {
          icon: <XCircle className="w-8 h-8 text-red-500" />,
          color: 'text-red-500',
          bg: 'bg-red-500/10',
          title: 'Not Selected',
          desc: 'Thank you for your interest. We have decided to move forward with other candidates at this time.'
        };
      default:
        return {
          icon: <Clock className="w-8 h-8 text-slate-400" />,
          color: 'text-slate-400',
          bg: 'bg-slate-400/10',
          title: 'Processing',
          desc: 'Your application is currently in the sync queue.'
        };
    }
  };

  return (
    <div className={`min-h-screen py-24 px-6 ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F05E23]/10 border border-[#F05E23]/20 rounded-full mb-8">
            <ShieldCheck className="w-4 h-4 text-[#F05E23]" />
            <span className="text-[0.6rem] font-black uppercase tracking-widest text-[#F05E23]">Sync Status Matrix</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic mb-4">
            Track Your <span className="text-[#F05E23]">Progress</span>
          </h1>
          <p className={`text-lg opacity-60 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
            Enter your email to retrieve your application status in real-time.
          </p>
        </motion.div>

        <div className={`p-8 rounded-[2.5rem] border mb-12 shadow-2xl transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" />
              <input 
                type="email" 
                placeholder="registered-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className={`w-full pl-14 pr-6 py-5 rounded-2xl border outline-none transition-all font-bold ${isDark ? 'bg-black/20 border-white/10 focus:border-[#F05E23]' : 'bg-slate-50 border-slate-200 focus:border-[#F05E23]'}`}
              />
            </div>
            <button 
              onClick={() => handleSearch()}
              disabled={loading}
              className="bg-[#F05E23] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[0.7rem] shadow-xl shadow-[#F05E23]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Scan Status
            </button>
          </div>
          
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-red-500 text-sm font-bold text-center bg-red-500/5 py-3 rounded-xl border border-red-500/10"
            >
              {error}
            </motion.p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {application && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-[3rem] border overflow-hidden shadow-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}
            >
              {/* Status Header */}
              <div className={`p-10 flex flex-col items-center text-center border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                <div className={`w-20 h-20 rounded-3xl mb-6 flex items-center justify-center ${getStatusDetails(application.status).bg}`}>
                  {getStatusDetails(application.status).icon}
                </div>
                <h2 className={`text-3xl font-black uppercase tracking-tighter italic mb-2 ${getStatusDetails(application.status).color}`}>
                  {getStatusDetails(application.status).title}
                </h2>
                <p className="text-sm opacity-60 max-w-sm">
                  {getStatusDetails(application.status).desc}
                </p>
              </div>

              {/* Details Grid */}
              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <span className="block text-[0.6rem] font-black uppercase tracking-widest opacity-30 mb-2">Applicant Identity</span>
                    <p className="text-lg font-black italic">{application.name}</p>
                    <div className="flex flex-col gap-1 mt-2 opacity-60 text-xs">
                      <span className="flex items-center gap-2"><Mail className="w-3 h-3" /> {application.email}</span>
                      <span className="flex items-center gap-2"><Phone className="w-3 h-3" /> {application.phone}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[0.6rem] font-black uppercase tracking-widest opacity-30 mb-2">Target Role</span>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F05E23]/5 flex items-center justify-center border border-[#F05E23]/10">
                        <Briefcase className="w-5 h-5 text-[#F05E23]" />
                      </div>
                      <p className="font-bold">{application.jobId?.title || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="block text-[0.6rem] font-black uppercase tracking-widest opacity-30 mb-2">Submitted Assets</span>
                    <a 
                      href={application.resumeLink} 
                      target="_blank" 
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                    >
                      <div className="flex items-center gap-3">
                        <ExternalLink className="w-4 h-4 text-[#F05E23]" />
                        <span className="text-sm font-bold">Resume Profile</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-30" />
                    </a>
                  </div>
                  
                  {application.status === 'Round 2' && (
                    <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl">
                      <span className="block text-[0.6rem] font-black uppercase tracking-widest text-blue-500 mb-2">Next Step</span>
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        Please check your email for the interview schedule and technical assessment details.
                      </p>
                    </div>
                  )}

                  {application.status === 'Selected' && (
                    <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-2xl">
                      <span className="block text-[0.6rem] font-black uppercase tracking-widest text-green-500 mb-2">Deployment Status</span>
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">
                        Our HR team will reach out with the offer letter and onboarding protocols within 24 hours.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-10 pb-10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[0.6rem] font-black uppercase tracking-widest opacity-30">Recruitment Pipeline</span>
                  <span className="text-[0.6rem] font-black uppercase tracking-widest text-[#F05E23]">
                    {application.status === 'Applied' ? 'Stage 1/3' : application.status === 'Round 2' ? 'Stage 2/3' : application.status === 'Selected' ? 'Sync Complete' : 'Terminated'}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ 
                      width: application.status === 'Applied' ? '33%' : 
                             application.status === 'Round 2' ? '66%' : 
                             application.status === 'Selected' ? '100%' : '0%' 
                    }}
                    className={`h-full transition-all duration-1000 ${application.status === 'Declined' ? 'bg-red-500' : 'bg-[#F05E23]'}`}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-10 h-10 animate-spin text-[#F05E23]" />
      </div>
    }>
      <StatusContent />
    </Suspense>
  );
}
