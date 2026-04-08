"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  CheckCircle2, Clock, Layout, Activity, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicBrandPage() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedStep, setExpandedStep] = useState(null);

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

          <div className="grid grid-cols-1 gap-6">
            {project.workflow.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`p-1 border border-white/5 rounded-[2.5rem] transition-all duration-700 ${step.status === 'Complete' ? 'bg-[#F05E23]/5 border-[#F05E23]/20' : 'hover:border-white/10'}`}
              >
                 <div className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                       <span className="text-xs font-black text-white/20 italic tracking-widest">0{idx + 1}</span>
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${step.status === 'Complete' ? 'bg-[#F05E23] border-[#F05E23] text-white' : (step.status === 'In Progress' ? 'bg-[#F05E23]/10 border-[#F05E23]/30 text-[#F05E23]' : 'bg-white/5 border-white/10 text-white/10')}`}>
                          {step.status === 'Complete' ? <CheckCircle2 className="w-7 h-7" /> : (step.status === 'In Progress' ? <Activity className="w-7 h-7 animate-pulse" /> : <Clock className="w-7 h-7" />)}
                       </div>
                       <div>
                          <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight italic">{step.title}</h4>
                          <span className={`text-[8px] font-black uppercase tracking-[0.4em] ${step.status === 'Complete' ? 'text-[#F05E23]' : 'text-white/20'}`}>{step.status}</span>
                       </div>
                    </div>
                    <div className="max-w-md sm:text-right">
                       <p className="text-sm font-medium text-white/40 leading-relaxed">{step.description}</p>
                    </div>
                 </div>
                 {step.adminNote && (
                   <div className="mx-8 mb-8 mt-2 p-6 rounded-3xl bg-black/40 border border-white/5 flex gap-4 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F05E23] mt-1.5 shrink-0 shadow-[0_0_10px_#F05E23]" />
                      <p className="text-xs text-[#F05E23] italic font-medium">Technical Directive: "{step.adminNote}"</p>
                   </div>
                 )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-24 pb-12 text-center border-t border-white/5">
           <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/20 italic">Synchronous Build Digital Matrix</p>
        </div>
      </div>
    </div>
  );
}
