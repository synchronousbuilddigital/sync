"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  CheckCircle2, Clock, Layout, Activity, ChevronDown, ChevronUp, Zap, MessageSquare, AlertTriangle, HelpCircle, Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationToaster from "@/components/NotificationToaster";

export default function PublicBrandPage() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedStep, setExpandedStep] = useState(null);
  const [feedback, setFeedback] = useState({ category: "Idea", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toastMsg, setToastMsg] = useState({ type: "", msg: "" });

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!feedback.content) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/project/${params.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFeedback({ ...feedback, content: "" });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/public/project/${params.id}`);
        const data = await res.json();
        if (data.success) setProject(data.project);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-2 border-[#F05E23] border-t-transparent rounded-full" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white/20 font-black uppercase tracking-widest italic">
      Unauthorized Access / Invalid Descriptor Node
    </div>
  );

  const completedSteps = project.workflow.filter(s => s.status === "Complete").length;
  const progress = Math.round((completedSteps / project.workflow.length) * 100);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-6 sm:p-24 selection:bg-[#F05E23] selection:text-white overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[#F05E23]/5 blur-[200px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        {/* Title Section */}
        <div className="text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center flex-col items-center gap-4">
             <div className="w-16 h-[2px] bg-[#F05E23]" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#F05E23] italic">Project Synchronization Report</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl sm:text-8xl lg:text-9xl font-black uppercase tracking-tighter italic leading-none"
          >
            {project.projectName}
          </motion.h1>
          <p className="text-white/40 text-sm sm:text-lg max-w-2xl mx-auto uppercase font-black tracking-widest leading-relaxed">
            Live Development Lifecycle Tracking for <span className="text-white underline decoration-[#F05E23]">{project.clientId?.name}</span>
          </p>
        </div>

        {/* Status Hub */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[3rem] p-12 flex flex-col sm:flex-row justify-between items-center gap-10">
             <div className="space-y-6">
                <span className="px-5 py-2 rounded-full border border-green-500/30 text-green-500 text-[10px] font-black uppercase tracking-widest bg-green-500/5">
                   {project.status.toUpperCase()}
                </span>
                <p className="text-white/60 text-lg leading-relaxed">{project.description}</p>
             </div>
             <div className="relative w-40 h-40 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="75" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                  <circle 
                    cx="80" cy="80" r="75" stroke="#F05E23" strokeWidth="10" fill="transparent" 
                    strokeDasharray={471} strokeDashoffset={471 - (471 * progress) / 100}
                    className="transition-all duration-[2s] ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black italic">{progress}%</span>
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">Sync</span>
                </div>
             </div>
          </div>
          <div className="bg-[#F05E23] rounded-[3rem] p-12 text-black flex flex-col justify-between overflow-hidden relative group">
             <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Layout className="w-64 h-64" />
             </div>
             <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">HQ Authentication</h4>
             <div className="space-y-2">
                <p className="text-2xl font-black uppercase italic leading-none tracking-tighter">Authorized Partner Access Only</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified Credentials Required for Console Access</p>
             </div>
          </div>
        </div>

        {/* Workflow Timeline */}
        <div className="space-y-10">
          <div className="flex items-center gap-8">
             <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic whitespace-nowrap">Development <span className="text-[#F05E23]">Lifecycle</span></h3>
             <div className="h-[2px] w-full bg-white/5 relative">
                <div className="absolute top-0 left-0 h-full bg-[#F05E23] transition-all duration-[2s]" style={{ width: `${progress}%` }} />
             </div>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {project.workflow.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group relative overflow-hidden backdrop-blur-md rounded-[3.5rem] border transition-all duration-700 ${step.status === 'Complete' ? 'bg-[#F05E23]/5 border-[#F05E23]/30' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
              >
                 <div className="absolute top-0 left-0 w-1 h-full bg-[#F05E23] opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                       <span className="text-xl font-black text-white/5 italic tracking-tighter">0{idx + 1}</span>
                       <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center border-2 transition-all shadow-2xl ${step.status === 'Complete' ? 'bg-[#F05E23] border-[#F05E23] text-white shadow-[#F05E23]/20' : (step.status === 'In Progress' ? 'bg-[#F05E23]/10 border-[#F05E23]/50 text-[#F05E23]' : 'bg-white/5 border-white/10 text-white/10')}`}>
                          {step.status === 'Complete' ? <CheckCircle2 className="w-10 h-10" /> : (step.status === 'In Progress' ? <Activity className="w-10 h-10 animate-pulse" /> : <Clock className="w-10 h-10" />)}
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter italic leading-none">{step.title}</h4>
                          <div className="flex items-center gap-3">
                             <div className={`w-2 h-2 rounded-full ${step.status === 'Complete' ? 'bg-green-500' : (step.status === 'In Progress' ? 'bg-[#F05E23] animate-pulse' : 'bg-white/20')}`} />
                             <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${step.status === 'Complete' ? 'text-green-500' : (step.status === 'In Progress' ? 'text-[#F05E23]' : 'text-white/20')}`}>{step.status}</span>
                          </div>
                       </div>
                    </div>
                    <div className="max-w-xl lg:text-right">
                       <p className="text-base sm:text-lg font-medium text-white/90 leading-relaxed mb-4 group-hover:text-white transition-colors">{step.description}</p>
                       {step.adminNote && (
                          <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-2xl py-3 px-6 lg:ml-auto">
                             <Activity className="w-3.5 h-3.5 text-[#F05E23]" />
                             <p className="text-[10px] text-[#F05E23] font-black uppercase tracking-widest italic">{step.adminNote}</p>
                          </div>
                       )}
                    </div>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Strategic Input Terminal */}
        <div className="space-y-10">
          <div className="flex items-center gap-8">
             <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic whitespace-nowrap">Strategic <span className="text-[#F05E23]">Input</span></h3>
             <div className="h-[2px] w-full bg-white/5" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 space-y-6">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4">
                 <Zap className="w-8 h-8 text-[#F05E23]" />
                 <h4 className="text-xl font-black uppercase tracking-tight">Direct Intel Synchronization</h4>
                 <p className="text-sm text-white/40 leading-relaxed uppercase font-bold tracking-widest">
                   Have a new idea or feedback? Post it here directly. Our strategic team receives these in real-time. No login required.
                 </p>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { id: "Idea", icon: Zap, label: "New Idea", color: "text-amber-500", bg: "bg-amber-500/10" },
                  { id: "Feedback", icon: MessageSquare, label: "Feedback", color: "text-blue-500", bg: "bg-blue-500/10" },
                  { id: "Bug", icon: AlertTriangle, label: "Report Bug", color: "text-red-500", bg: "bg-red-500/10" },
                  { id: "Question", icon: HelpCircle, label: "Question", color: "text-[#F05E23]", bg: "bg-[#F05E23]/10" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFeedback({ ...feedback, category: cat.id })}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${feedback.category === cat.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent opacity-40 hover:opacity-100'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.bg} ${cat.color}`}>
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8">
              <form onSubmit={submitFeedback} className="bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05E23]/5 blur-[100px] pointer-events-none" />
                
                <div className="space-y-4 relative z-10">
                   <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F05E23] flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-[#F05E23] rounded-full animate-pulse" />
                     {feedback.category} Chapter Entry
                   </label>
                   <textarea
                    required
                    rows={6}
                    value={feedback.content}
                    onChange={(e) => setFeedback({ ...feedback, content: e.target.value })}
                    placeholder={`Sync your ${feedback.category.toLowerCase()} with the project matrix...`}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-3xl p-8 outline-none focus:border-[#F05E23]/30 transition-all font-bold text-lg text-white placeholder:text-white/10 resize-none italic"
                   />
                </div>

                <div className="flex items-center justify-between relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
                     {success ? "Intelligence Synchronized ✓" : "Encrypted Channel Active"}
                   </p>
                   <button
                    disabled={submitting || !feedback.content}
                    className={`px-12 py-5 rounded-[1.5rem] font-black uppercase text-[0.7rem] tracking-[0.3em] flex items-center gap-3 transition-all ${success ? 'bg-green-500 text-white' : 'bg-[#F05E23] text-white hover:scale-105 active:scale-95 disabled:opacity-50'}`}
                   >
                     {submitting ? "Syncing..." : (success ? "Done" : "Transmit Intel")}
                     <Send className="w-4 h-4" />
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Technical Access Terminal */}
        <div className="space-y-10">
          <div className="flex items-center gap-8">
             <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic whitespace-nowrap text-blue-500">Technical <span className="text-white">Sync</span></h3>
             <div className="h-[2px] w-full bg-blue-500/10" />
          </div>

          <div className="bg-white/[0.02] border border-blue-500/10 rounded-[3.5rem] p-8 sm:p-16 space-y-12 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 blur-[150px] pointer-events-none" />
            
            <div className="max-w-3xl">
              <h4 className="text-2xl font-black uppercase tracking-tight mb-4">Operational Infrastructure Access</h4>
              <p className="text-sm text-white/40 leading-relaxed uppercase font-bold tracking-widest">
                Sync your technical environment with our engineering matrix. Provide repository access, hosting credentials, and environment variables for deployment.
              </p>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const creds = {
                  env: formData.get('env'),
                  github: formData.get('github'),
                  hosting: formData.get('hosting'),
                  additional: formData.get('additional')
                };
                
                try {
                  const res = await fetch(`/api/public/project/${params.id}/credentials`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(creds)
                  });
                  const data = await res.json();
                  if (data.success) {
                    setToastMsg({ type: "success", msg: "Technical Matrix Synchronized Successfully." });
                    e.target.reset();
                  }
                } catch (err) {
                  console.error(err);
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Environment Variables (.env)</label>
                <textarea 
                  name="env"
                  placeholder="KEY=VALUE&#10;DATABASE_URL=..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 outline-none focus:border-blue-500/30 transition-all font-mono text-sm text-white resize-none h-40"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Repository Access (GitHub/GitLab)</label>
                  <input 
                    name="github"
                    type="text"
                    placeholder="https://github.com/org/repo"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 outline-none focus:border-blue-500/30 transition-all font-bold text-sm text-white"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Hosting/Vercel Credentials</label>
                  <input 
                    name="hosting"
                    type="text"
                    placeholder="Vercel Team URL or Credentials"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 outline-none focus:border-blue-500/30 transition-all font-bold text-sm text-white"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-500">Additional Strategic Notes</label>
                <textarea 
                  name="additional"
                  placeholder="Specific instructions for deployment, domain pointers, or API keys..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 outline-none focus:border-blue-500/30 transition-all font-bold text-sm text-white resize-none h-24"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button 
                  type="submit"
                  className="px-16 py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[0.7rem] hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-blue-600/20"
                >
                  Synchronize Infrastructure
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Mission Feed */}
        <div className="space-y-10">
          <div className="flex items-center gap-8">
             <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic whitespace-nowrap">Mission <span className="text-blue-500">Updates</span></h3>
             <div className="h-[2px] w-full bg-white/5" />
          </div>

          <div className="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
            {project.feeds && project.feeds.length > 0 ? (
              [...project.feeds].reverse().map((feed, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 flex gap-8 items-start"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${feed.sender === 'admin' ? 'bg-[#F05E23]/20 text-[#F05E23]' : 'bg-blue-500/20 text-blue-500'}`}>
                    {feed.sender === 'admin' ? <Layout className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                        {feed.sender === 'admin' ? 'Strategic Intelligence' : 'Field Operations'}
                      </span>
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                        {new Date(feed.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xl font-bold text-white/90 leading-relaxed italic">"{feed.content}"</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-24 text-center border border-dashed border-white/10 rounded-[3.5rem]">
                <p className="text-sm font-black uppercase tracking-[0.5em] text-white/20">No Operational Updates Synchronized</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-24 pb-12 text-center border-t border-white/5">
           <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/20 italic">Synchronous Build Digital Matrix</p>
        </div>
      </div>
      <NotificationToaster statusMsg={toastMsg} onClose={() => setToastMsg({ type: "", msg: "" })} />
    </div>
  );
}
