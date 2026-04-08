"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { 
  CheckCircle2, Clock, Send, MessageSquare, 
  Layout, Activity, ShieldCheck, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientDashboard() {
  const { user, clientProject, sendClientMessage, logout } = useAuth();
  const [message, setMessage] = useState("");
  const [expandedStep, setExpandedStep] = useState(null);

  if (!clientProject) return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white font-black uppercase tracking-widest opacity-30">
      Initializing Project Matrix...
    </div>
  );

  const completedSteps = clientProject.workflow.filter(s => s.status === "Complete").length;
  const progress = Math.round((completedSteps / clientProject.workflow.length) * 100);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendClientMessage(message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-6 sm:p-12 font-sans selection:bg-[#F05E23] selection:text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-[2px] bg-[#F05E23]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Brand Deployment Console</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none italic">
            Welcome, <span className="text-[#F05E23]">{user?.name}</span>
          </h1>
        </div>
        <button onClick={logout} className="px-8 py-3 rounded-xl border border-white/10 font-black uppercase tracking-widest text-[0.7rem] hover:bg-white/5 transition-all">
          Secure Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Progress & Workflow */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Project Identity Card */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05E23]/10 blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
              <div className="space-y-4">
                <span className="px-4 py-1.5 rounded-full bg-[#F05E23]/20 text-[#F05E23] text-[9px] font-black uppercase tracking-widest border border-[#F05E23]/30">
                  {clientProject.status}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter">{clientProject.projectName}</h2>
                <p className="text-white/40 text-sm max-w-md">{clientProject.description}</p>
              </div>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <circle 
                    cx="64" cy="64" r="58" stroke="#F05E23" strokeWidth="8" fill="transparent" 
                    strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * progress) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black italic">{progress}%</span>
                  <span className="text-[7px] font-black uppercase tracking-widest text-white/30">Complete</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Checklist */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Operational <span className="text-[#F05E23]">Workflow</span></h3>
                <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            {clientProject.workflow.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`group border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 ${expandedStep === idx ? 'bg-white/5 border-white/20' : 'bg-transparent hover:bg-white/[0.02]'}`}
              >
                <div 
                  onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                  className="p-8 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${step.status === 'Complete' ? 'bg-[#F05E23] border-[#F05E23] text-white' : (step.status === 'In Progress' ? 'bg-[#F05E23]/20 border-[#F05E23]/40 text-[#F05E23]' : 'bg-white/5 border-white/10 text-white/20')}`}>
                      {step.status === 'Complete' ? <CheckCircle2 className="w-6 h-6" /> : (step.status === 'In Progress' ? <Activity className="w-6 h-6 animate-pulse" /> : <Clock className="w-6 h-6" />)}
                    </div>
                    <div>
                      <h4 className={`text-lg font-black uppercase tracking-tight transition-colors ${step.status === 'Complete' ? 'text-white' : 'text-white/60'}`}>{step.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                         <span className={`text-[8px] font-black uppercase tracking-widest ${step.status === 'Complete' ? 'text-[#F05E23]' : 'text-white/20'}`}>{step.status}</span>
                      </div>
                    </div>
                  </div>
                  {expandedStep === idx ? <ChevronUp className="w-5 h-5 text-white/20" /> : <ChevronDown className="w-5 h-5 text-white/20" />}
                </div>

                <AnimatePresence>
                  {expandedStep === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-8 pt-0"
                    >
                      <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                        <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
                        {step.adminNote && (
                          <div className="flex gap-3 p-4 rounded-xl bg-[#F05E23]/5 border border-[#F05E23]/20">
                            <ShieldCheck className="w-5 h-5 text-[#F05E23] shrink-0" />
                            <div className="space-y-1">
                                <span className="text-[8px] font-black uppercase text-[#F05E23] tracking-widest">Administrative Advisory</span>
                                <p className="text-xs text-white/80 italic font-medium">"{step.adminNote}"</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Communications */}
        <div className="lg:col-span-4 flex flex-col h-[800px]">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-2xl font-black uppercase tracking-tighter italic">Direct <span className="text-[#F05E23]">Sync</span></h3>
             <MessageSquare className="w-5 h-5 text-[#F05E23]" />
          </div>

          <div className="flex-1 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide">
              {clientProject.discussions.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl ${msg.sender === 'client' ? 'bg-[#F05E23] text-white rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none border border-white/10'}`}>
                    <span className="block text-[8px] font-black uppercase tracking-widest mb-1 opacity-50">
                        {msg.sender === 'client' ? 'Origin' : 'HQ Command'}
                    </span>
                    <p className="text-sm font-medium">{msg.content}</p>
                    <span className="block text-right text-[7px] mt-2 opacity-40 uppercase font-black">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 bg-black/40 border-t border-white/10">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Transmission request..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-[#F05E23]/50 transition-all placeholder:text-white/20"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#F05E23] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F05E23]/20">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
