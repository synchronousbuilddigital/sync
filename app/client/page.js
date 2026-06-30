"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { 
  CheckCircle2, Clock, Send, MessageSquare, 
  Layout, Activity, ShieldCheck, ChevronDown, ChevronUp,
  Plus, Trash2, Zap, FileText, Calendar, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientDashboard() {
  const { user, clientProject, sendClientMessage, sendClientFeed, updateClientInfo, logout, generateAIStory, getAIFeatureSuggestions } = useAuth();
  const [message, setMessage] = useState("");
  const [feedMessage, setFeedMessage] = useState("");
  const [expandedStep, setExpandedStep] = useState(null);
  const [feedback, setFeedback] = useState({ category: "Idea", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.content) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/project/${clientProject.publicId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback)
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackSuccess(true);
        setFeedback({ ...feedback, content: "" });
        setTimeout(() => setFeedbackSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Edit Modals State
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingCreds, setIsEditingCreds] = useState(false);
  const [infoForm, setInfoForm] = useState({ 
    projectName: "", 
    description: "", 
    googleDriveLink: "",
    projectType: "Custom Web App",
    requirements: [],
    features: []
  });
  const [credsForm, setCredsForm] = useState({
    env: "",
    gmail: { email: "", password: "" },
    vercel: { email: "", password: "" },
    github: "",
    hosting: "",
    domain: "",
    liveUrl: "",
    devUrl: "",
    additional: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (clientProject) {
      setInfoForm({
        projectName: clientProject.projectName || "",
        description: clientProject.description || "",
        googleDriveLink: clientProject.googleDriveLink || "",
        projectType: clientProject.projectType || "Custom Web App",
        requirements: clientProject.requirements || [],
        features: clientProject.features || []
      });
      setCredsForm(clientProject.credentials || {
        env: "",
        gmail: { email: "", password: "" },
        vercel: { email: "", password: "" },
        github: "",
        hosting: "",
        domain: "",
        liveUrl: "",
        devUrl: "",
        additional: ""
      });
    }
  }, [clientProject]);

  if (!clientProject) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-black uppercase tracking-[0.5em] animate-pulse">
      Initialising Project Matrix...
    </div>
  );

  const completedSteps = clientProject.workflow.filter(s => s.status === "Complete").length;
  const progress = Math.round((completedSteps / (clientProject.workflow.length || 1)) * 100);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendClientMessage(message);
    setMessage("");
  };

  const handleSendFeed = async (e) => {
    e.preventDefault();
    if (!feedMessage.trim()) return;
    await sendClientFeed(feedMessage);
    setFeedMessage("");
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateClientInfo(infoForm);
    setIsEditingInfo(false);
    setSaving(false);
  };

  const handleUpdateCreds = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateClientInfo({ credentials: credsForm });
    setIsEditingCreds(false);
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-8 lg:p-12 font-sans selection:bg-[#F05E23] selection:text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F05E23]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20 relative z-10">
        <div>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-[#F05E23]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 italic">Brand Sync Hub V2.0</span>
          </motion.div>
          <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none italic">
            Mission: <span className="text-[#F05E23] drop-shadow-[0_0_20px_rgba(240,94,35,0.3)]">{clientProject.projectName}</span>
          </motion.h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
           <button onClick={() => setIsEditingInfo(true)} className="flex-1 sm:flex-initial justify-center px-5 sm:px-6 py-3 rounded-xl bg-white/5 border border-white/10 font-black uppercase tracking-widest text-[0.6rem] sm:text-[0.65rem] hover:bg-[#F05E23] hover:text-white transition-all">
             Edit Project
           </button>
           <button onClick={logout} className="flex-1 sm:flex-initial justify-center px-5 sm:px-6 py-3 rounded-xl border border-white/10 font-black uppercase tracking-widest text-[0.6rem] sm:text-[0.65rem] hover:bg-red-500/10 hover:border-red-500/50 transition-all text-white/60 hover:text-white">
             Terminate Session
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* Left Column: Progress & Workflow */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Project Identity & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-4 py-1.5 rounded-full bg-[#F05E23]/20 text-[#F05E23] text-[9px] font-black uppercase tracking-widest border border-[#F05E23]/30">
                    System Status: {clientProject.status}
                  </span>
                  {clientProject.googleDriveLink && (
                    <a href={clientProject.googleDriveLink} target="_blank" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#F05E23] transition-all">
                      <Layout className="w-4 h-4" /> Drive Access
                    </a>
                  )}
                </div>
                <div>
                   <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-2">Operational Scope</h2>
                   <p className="text-white/40 text-sm leading-relaxed max-w-lg">{clientProject.description}</p>
                </div>
                <div className="flex flex-wrap gap-4 pt-4">
                   <button onClick={() => setIsEditingCreds(true)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                      <ShieldCheck className="w-4 h-4 text-[#F05E23]" /> Tech Stack Details
                   </button>
                   {clientProject.googleDriveLink ? (
                      <a href={clientProject.googleDriveLink} target="_blank" className="bg-[#F05E23] text-white px-8 py-3 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest shadow-xl shadow-[#F05E23]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                         <Activity className="w-4 h-4" /> Upload Assets
                      </a>
                   ) : (
                      <button onClick={() => setIsEditingInfo(true)} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest transition-all italic border border-white/10">
                         Set Drive Link
                      </button>
                   )}
                </div>
              </div>
            </div>

            <div className="bg-[#0D0D14] border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group flex flex-col">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#F05E23]/5 blur-3xl" />
               <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center flex-1">
                  <div className="relative">
                    <svg className="w-32 h-32 -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                      <motion.circle 
                         cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                         strokeDasharray={364.4}
                         initial={{ strokeDashoffset: 364.4 }}
                         animate={{ strokeDashoffset: 364.4 - (364.4 * progress) / 100 }}
                         className="text-[#F05E23]"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black italic leading-none">{progress}%</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/40 mt-1">Sync</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-black uppercase tracking-tighter italic mb-2">Sync Progress <span className="text-[#F05E23]">Tracker</span></h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                       {completedSteps} of {clientProject.workflow.length} objectives finalized
                    </p>
                  </div>
               </div>

               {/* AI Storyteller Section */}
               <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#F05E23]">Mission Narrative (AI)</span>
                     <button onClick={() => generateAIStory(clientProject._id)} className="p-2 rounded-lg hover:bg-white/5 transition-all text-white/20 hover:text-white">
                        <Zap className="w-3.5 h-3.5" />
                     </button>
                  </div>
                  <p className="text-xs font-bold leading-relaxed text-white/60 italic">
                     {clientProject.aiStory || "Initialising AI storyteller... Run a tactical update to generate your mission narrative."}
                  </p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-blue-500 italic">Tech Vault</h3>
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                     <span className="text-[9px] font-black uppercase text-white/30">Github Access</span>
                     <span className="text-[10px] font-black text-white/70">{clientProject.credentials?.github || "Pending"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                     <span className="text-[9px] font-black uppercase text-white/30">Vercel Deployment</span>
                     <span className="text-[10px] font-black text-white/70">{clientProject.credentials?.vercel?.email || "Not Linked"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                     <span className="text-[9px] font-black uppercase text-white/30">Primary Domain</span>
                     <span className="text-[10px] font-black text-white/70">{clientProject.credentials?.domain || "Syncing..."}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                     <span className="text-[9px] font-black uppercase text-white/30">Hosting</span>
                     <span className="text-[10px] font-black text-white/70">{clientProject.credentials?.hosting || "Initialising"}</span>
                  </div>
               </div>
               <button onClick={() => setIsEditingCreds(true)} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">View Full Manifest</button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#F05E23] italic">Operational SOP</h3>
                  <FileText className="w-4 h-4 text-white/20" />
               </div>
               <div className="bg-black/20 rounded-2xl p-6 border border-white/5 h-32 overflow-y-auto scrollbar-hide">
                  <pre className="text-[10px] text-white/60 font-mono whitespace-pre-wrap leading-relaxed">
                     {clientProject.sop || "Standard Operating Procedure pending deployment."}
                  </pre>
               </div>
               {clientProject.estimatedCompletionDate && (
                  <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                     <Calendar className="w-5 h-5 text-[#F05E23]" />
                     <div>
                        <span className="block text-[8px] font-black uppercase tracking-widest text-white/30">Target Launch Matrix</span>
                        <span className="text-xs font-black uppercase tracking-widest">{new Date(clientProject.estimatedCompletionDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                     </div>
                  </div>
               )}
            </div>
          </div>

          {/* Workflow Checklist */}
          <div className="space-y-8">
            <div className="flex items-center gap-6">
                <h3 className="text-3xl font-black uppercase tracking-tighter italic whitespace-nowrap">Project <span className="text-[#F05E23]">Roadmap</span></h3>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="grid gap-4">
              {clientProject.workflow.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group border rounded-[2rem] overflow-hidden transition-all duration-500 ${expandedStep === idx ? 'bg-white/5 border-white/20 ring-1 ring-white/10' : 'bg-transparent border-white/5 hover:bg-white/[0.02]'}`}
                >
                  <div 
                    onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                    className="p-8 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-8">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${step.status === 'Complete' ? 'bg-[#F05E23] border-[#F05E23] text-white shadow-lg shadow-[#F05E23]/20' : (step.status === 'In Progress' ? 'bg-[#F05E23]/10 border-[#F05E23]/40 text-[#F05E23]' : 'bg-white/5 border-white/10 text-white/20')}`}>
                        {step.status === 'Complete' ? <CheckCircle2 className="w-7 h-7" /> : (step.status === 'In Progress' ? <Activity className="w-7 h-7 animate-pulse" /> : <Clock className="w-7 h-7" />)}
                      </div>
                      <div>
                        <h4 className={`text-xl font-black uppercase tracking-tight transition-colors ${step.status === 'Complete' ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>{step.title}</h4>
                        <div className="flex items-center gap-3 mt-2">
                           <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${step.status === 'Complete' ? 'text-[#F05E23]' : 'text-white/20'}`}>{step.status}</span>
                           <span className="w-1 h-1 rounded-full bg-white/10" />
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/10">Phase {idx + 1}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`p-2 rounded-xl bg-white/5 transition-transform duration-500 ${expandedStep === idx ? 'rotate-180 bg-[#F05E23]/20 text-[#F05E23]' : 'text-white/20'}`}>
                       <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedStep === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 pb-8 pt-0"
                      >
                        <div className="p-8 rounded-[1.5rem] bg-black/40 border border-white/5 space-y-6">
                          <p className="text-white/50 text-sm leading-relaxed font-medium italic">"{step.description}"</p>
                          {step.adminNote && (
                            <div className="flex gap-4 p-6 rounded-2xl bg-[#F05E23]/5 border border-[#F05E23]/20 relative overflow-hidden group/note">
                              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/note:opacity-10 transition-opacity">
                                 <ShieldCheck className="w-12 h-12" />
                              </div>
                              <ShieldCheck className="w-6 h-6 text-[#F05E23] shrink-0" />
                              <div className="space-y-1 relative z-10">
                                  <span className="text-[9px] font-black uppercase text-[#F05E23] tracking-[0.3em]">Command Briefing</span>
                                  <p className="text-sm text-white/80 font-bold leading-relaxed">{step.adminNote}</p>
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

          {/* Strategic Intel Entry */}
          <div className="space-y-8">
            <div className="flex items-center gap-6">
                <h3 className="text-3xl font-black uppercase tracking-tighter italic whitespace-nowrap">Strategic <span className="text-[#F05E23]">Intel Entry</span></h3>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-4 space-y-4">
                {[
                  { id: "Idea", label: "New Idea", color: "text-amber-500", bg: "bg-amber-500/10" },
                  { id: "Feedback", label: "Feedback", color: "text-blue-500", bg: "bg-blue-500/10" },
                  { id: "Bug", label: "Report Bug", color: "text-red-500", bg: "bg-red-500/10" },
                  { id: "Question", label: "Question", color: "text-[#F05E23]", bg: "bg-[#F05E23]/10" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFeedback({ ...feedback, category: cat.id })}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${feedback.category === cat.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent opacity-40 hover:opacity-100'}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                    <div className={`w-2 h-2 rounded-full ${cat.bg} ${cat.color} border border-current`} />
                  </button>
                ))}
              </div>
              <div className="lg:col-span-8">
                <form onSubmit={handleFeedbackSubmit} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05E23]/5 blur-[100px] pointer-events-none" />
                  <div className="relative z-10 space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-[#F05E23]">{feedback.category} Chapter Entry</label>
                    <textarea 
                      required
                      value={feedback.content}
                      onChange={(e) => setFeedback({ ...feedback, content: e.target.value })}
                      placeholder={`Sync your ${feedback.category.toLowerCase()} with the matrix...`}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-bold text-sm text-white placeholder:text-white/10 resize-none italic"
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
                      {feedbackSuccess ? "Intelligence Synchronized ✓" : "Strategic Channel Active"}
                    </span>
                    <button 
                      disabled={submitting || !feedback.content}
                      className={`px-10 py-4 rounded-xl font-black uppercase text-[0.65rem] tracking-widest transition-all ${feedbackSuccess ? 'bg-green-500 text-white' : 'bg-[#F05E23] text-white hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-[#F05E23]/20'}`}
                    >
                      {submitting ? "Syncing..." : (feedbackSuccess ? "Transmitted" : "Transmit Intel")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Project Feed Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-6">
                <h3 className="text-3xl font-black uppercase tracking-tighter italic whitespace-nowrap">Mission <span className="text-blue-500">Feed</span></h3>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
              <form onSubmit={handleSendFeed} className="relative">
                <input 
                  type="text" 
                  value={feedMessage}
                  onChange={(e) => setFeedMessage(e.target.value)}
                  placeholder="Post an update to the mission feed..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/20"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>

              <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide">
                {clientProject.feeds && clientProject.feeds.length > 0 ? (
                  [...clientProject.feeds].reverse().map((feed, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${feed.sender === 'admin' ? 'bg-[#F05E23]/20 text-[#F05E23]' : 'bg-blue-500/20 text-blue-500'}`}>
                        {feed.sender === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                            {feed.sender === 'admin' ? 'HQ Command' : 'Source Alpha'}
                          </span>
                          <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                            {new Date(feed.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-white/80 leading-relaxed italic">"{feed.content}"</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 text-center opacity-20">
                    <Zap className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No updates in the mission feed yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Communications */}
        <div className="lg:col-span-4 flex flex-col h-[850px] sticky top-12">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-3xl font-black uppercase tracking-tighter italic">Direct <span className="text-[#F05E23]">Sync</span></h3>
             <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-green-500 animate-pulse">Encrypted</span>
                <MessageSquare className="w-5 h-5 text-[#F05E23]" />
             </div>
          </div>

          <div className="flex-1 bg-white/5 border border-white/10 rounded-[3rem] flex flex-col overflow-hidden backdrop-blur-sm shadow-2xl">
            {/* Messages */}
            <div className="flex-1 p-8 overflow-y-auto space-y-8 scrollbar-hide">
              {clientProject.discussions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                   <MessageSquare className="w-16 h-16 mb-6" />
                   <p className="text-xs font-black uppercase tracking-widest">Initialising Secure Channel...</p>
                </div>
              ) : clientProject.discussions.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] mb-2 opacity-30 px-2">
                      {msg.sender === 'client' ? 'Source Alpha' : 'HQ Command'}
                  </span>
                  <div className={`max-w-[90%] p-6 rounded-[2rem] shadow-xl ${msg.sender === 'client' ? 'bg-[#F05E23] text-white rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none border border-white/10'}`}>
                    <p className="text-sm font-bold leading-relaxed">{msg.content}</p>
                    <div className="flex items-center justify-end gap-2 mt-4 opacity-40">
                       <Clock className="w-3 h-3" />
                       <span className="text-[8px] uppercase font-black tracking-widest">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-8 bg-black/40 border-t border-white/10">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Transmit briefing..."
                  className="w-full bg-white/5 border border-white/20 rounded-2xl py-5 pl-8 pr-16 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-[#F05E23] transition-all placeholder:text-white/10 shadow-inner"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-[#F05E23] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F05E23]/30">
                  <Send className="w-5 h-5 text-white" />
                </button>
              </form>
            </div>
        </div>
      </div>
    </div>

    {/* Modals */}
      <AnimatePresence mode="wait">
        {isEditingInfo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-[#0D0D14] rounded-[3rem] p-12 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="flex justify-between items-center mb-10">
                 <h2 className="text-4xl font-black uppercase tracking-tighter italic">Update <span className="text-[#F05E23]">Scope</span></h2>
                 <button onClick={() => setIsEditingInfo(false)} className="p-4 rounded-2xl bg-white/5 hover:bg-red-500/10 transition-all text-white/40 hover:text-red-500"><Plus className="w-6 h-6 rotate-45" /></button>
              </div>
              <form onSubmit={handleUpdateInfo} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#F05E23] pl-2">Project Name</label>
 <input type="text" value={infoForm.projectName} onChange={e => setInfoForm({...infoForm, projectName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none font-black text-sm focus:border-[#F05E23] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#F05E23] pl-2">Sync Category</label>
 <select value={infoForm.projectType} onChange={e => setInfoForm({...infoForm, projectType: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none font-black text-xs focus:border-[#F05E23] transition-all appearance-none">
                      {["Custom Web App", "SaaS Platform", "E-commerce", "AI Integration", "Brand Identity"].map(t => <option key={t} value={t} className="bg-black">{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#F05E23] pl-2">Mission Narrative</label>
                  <textarea rows={3} value={infoForm.description} onChange={e => setInfoForm({...infoForm, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none font-bold text-sm focus:border-[#F05E23] transition-all" />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between pl-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#F05E23]">Requirement Briefing</label>
                    <button type="button" onClick={() => setInfoForm({...infoForm, requirements: [...infoForm.requirements, { content: "", status: "Pending" }]})} className="p-2 rounded-lg bg-[#F05E23]/10 text-[#F05E23] hover:bg-[#F05E23]/20 transition-all">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {infoForm.requirements.map((req, i) => (
                      <div key={i} className="flex gap-3">
                        <input type="text" value={req.content} onChange={e => {
                          const newReqs = [...infoForm.requirements];
                          newReqs[i].content = e.target.value;
                          setInfoForm({...infoForm, requirements: newReqs});
                        }} placeholder="Enter requirement..." className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold outline-none focus:border-[#F05E23]/50" />
                        <button type="button" onClick={() => setInfoForm({...infoForm, requirements: infoForm.requirements.filter((_, idx) => idx !== i)})} className="p-4 rounded-xl bg-white/5 text-white/20 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between pl-2">
                    <div className="flex items-center gap-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-[#F05E23]">Feature Deployment</label>
                       <button 
                         type="button" 
                         onClick={async () => {
                            const res = await getAIFeatureSuggestions(infoForm.projectName, infoForm.description);
                            if (res.success) {
                               const suggestions = res.suggestions.map(s => ({ title: s.title, description: s.description, priority: "Should-have" }));
                               setInfoForm({ ...infoForm, features: [...infoForm.features, ...suggestions] });
                            }
                         }}
                         className="text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-[#F05E23] flex items-center gap-1.5 transition-all"
                       >
                          <Zap className="w-3 h-3" /> AI Suggest
                       </button>
                    </div>
                    <button type="button" onClick={() => setInfoForm({...infoForm, features: [...infoForm.features, { title: "", description: "", priority: "Must-have" }]})} className="p-2 rounded-lg bg-[#F05E23]/10 text-[#F05E23] hover:bg-[#F05E23]/20 transition-all">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {infoForm.features.map((feat, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative">
                        <button type="button" onClick={() => setInfoForm({...infoForm, features: infoForm.features.filter((_, idx) => idx !== i)})} className="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                        <input type="text" value={feat.title} onChange={e => {
                          const newFeats = [...infoForm.features];
                          newFeats[i].title = e.target.value;
                          setInfoForm({...infoForm, features: newFeats});
 }} placeholder="Feature title..." className="w-full bg-transparent border-b border-white/10 p-2 text-[10px] font-black tracking-widest outline-none focus:border-[#F05E23]" />
                        <select value={feat.priority} onChange={e => {
                          const newFeats = [...infoForm.features];
                          newFeats[i].priority = e.target.value;
                          setInfoForm({...infoForm, features: newFeats});
                        }} className="bg-black/40 border border-white/10 rounded-lg p-2 text-[8px] font-black uppercase tracking-widest outline-none">
                          {["Must-have", "Should-have", "Could-have"].map(p => <option key={p} value={p} className="bg-black">{p}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#F05E23] pl-2">Google Drive Hub</label>
                  <div className="relative">
                    <Layout className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input type="url" placeholder="https://drive.google.com/..." value={infoForm.googleDriveLink} onChange={e => setInfoForm({...infoForm, googleDriveLink: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-14 outline-none font-medium text-sm focus:border-[#F05E23] transition-all" />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsEditingInfo(false)} className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-[2] bg-[#F05E23] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#F05E23]/20 hover:scale-105 active:scale-95 transition-all">{saving ? "Syncing..." : "Apply Updates"}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Tech Credentials Modal */}
        {isEditingCreds && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-3xl bg-[#0D0D14] rounded-[4rem] p-12 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="flex justify-between items-center mb-12">
                 <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none mb-2">Tech <span className="text-blue-500">Sync</span></h2>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Secure Environment Configuration</p>
                 </div>
                 <button onClick={() => setIsEditingCreds(false)} className="p-4 rounded-2xl bg-white/5 hover:bg-red-500/10 transition-all text-white/40 hover:text-red-500"><Plus className="w-6 h-6 rotate-45" /></button>
              </div>
              
              <form onSubmit={handleUpdateCreds} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-blue-400 pl-2">Environment (ENV)</label>
                      <textarea rows={3} value={credsForm.env} onChange={e => setCredsForm({...credsForm, env: e.target.value})} placeholder="API_KEY=xxx..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none font-mono text-xs focus:border-blue-500/50 transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-blue-400 pl-2">Github Access</label>
                      <input type="text" value={credsForm.github} onChange={e => setCredsForm({...credsForm, github: e.target.value})} placeholder="Repo URL or Username" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none text-xs font-bold focus:border-blue-500/50 transition-all" />
                   </div>
                   <div className="space-y-6 bg-white/3 p-6 rounded-3xl border border-white/5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#EA4335]">Gmail Hub</span>
                      <input type="email" placeholder="Email" value={credsForm.gmail.email} onChange={e => setCredsForm({...credsForm, gmail: {...credsForm.gmail, email: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none text-xs font-bold" />
                      <input type="password" placeholder="App Password" value={credsForm.gmail.password} onChange={e => setCredsForm({...credsForm, gmail: {...credsForm.gmail, password: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none text-xs font-bold mt-3" />
                   </div>
                   <div className="space-y-6 bg-white/3 p-6 rounded-3xl border border-white/5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white">Vercel Deployment</span>
                      <input type="email" placeholder="Email" value={credsForm.vercel.email} onChange={e => setCredsForm({...credsForm, vercel: {...credsForm.vercel, email: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none text-xs font-bold" />
                      <input type="password" placeholder="Token / Pass" value={credsForm.vercel.password} onChange={e => setCredsForm({...credsForm, vercel: {...credsForm.vercel, password: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none text-xs font-bold mt-3" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-blue-400 pl-2">Hosting Info</label>
                      <input type="text" value={credsForm.hosting} onChange={e => setCredsForm({...credsForm, hosting: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none text-xs font-bold focus:border-blue-500/50 transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-blue-400 pl-2">Domain Registrar</label>
                      <input type="text" value={credsForm.domain} onChange={e => setCredsForm({...credsForm, domain: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none text-xs font-bold focus:border-blue-500/50 transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-blue-400 pl-2">Live Production URL</label>
                      <input type="url" value={credsForm.liveUrl} onChange={e => setCredsForm({...credsForm, liveUrl: e.target.value})} placeholder="https://myapp.com" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none text-xs font-bold focus:border-blue-500/50 transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-blue-400 pl-2">Staging / Dev URL</label>
                      <input type="url" value={credsForm.devUrl} onChange={e => setCredsForm({...credsForm, devUrl: e.target.value})} placeholder="https://dev.myapp.com" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none text-xs font-bold focus:border-blue-500/50 transition-all" />
                   </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-blue-400 pl-2">Additional Intelligence</label>
                  <textarea rows={3} value={credsForm.additional} onChange={e => setCredsForm({...credsForm, additional: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none font-bold text-xs focus:border-blue-500/50 transition-all" />
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsEditingCreds(false)} className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-[2] bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all">{saving ? "Vaulting..." : "Save Securely"}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
