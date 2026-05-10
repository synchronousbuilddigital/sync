"use client";

import { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Clock, MessageSquare, 
  Send, ListTodo, TrendingUp, AlertCircle,
  FileText, Calendar, PlusCircle, Activity,
  Layout, ShieldCheck, ChevronDown, Plus, Zap,
  Shield, Globe, Terminal, ExternalLink
} from "lucide-react";

export default function InternDashboard() {
  const { user, tasks, leaves, updateTaskStatus, sendDiscussion, applyForLeave, loading } = useAuth();
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [chatTaskId, setChatTaskId] = useState(null);
  const [note, setNote] = useState("");
  const [chatMsg, setChatMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveReq, setLeaveReq] = useState({ startDate: "", endDate: "", reason: "" });
  const [statusMsg, setStatusMsg] = useState({ type: "", msg: "" });
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [resolving, setResolving] = useState(false);
  const { getAIBlockerSuggestion } = useAuth();

  const selectedTask = tasks.find(t => t._id === selectedTaskId);
  const chatTask = tasks.find(t => t._id === chatTaskId);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Clock className="w-12 h-12 text-[#F05E23]" />
      </motion.div>
    </div>
  );

  if (!user || user.role !== "intern") {
    return <div className="p-20 text-center font-black text-red-500 uppercase tracking-widest">Access Denied. Intern Clearance Required.</div>;
  }

  const handleUpdateTask = async (taskId, status) => {
    setSubmitting(true);
    await updateTaskStatus(taskId, status, note);
    setSelectedTaskId(null);
    setNote("");
    setSubmitting(false);
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await applyForLeave(leaveReq);
      if (res.success) {
        setStatusMsg({ type: "success", msg: "Leave request transmitted." });
        setIsLeaveModalOpen(false);
        setLeaveReq({ startDate: "", endDate: "", reason: "" });
      } else {
        setStatusMsg({ type: "error", msg: res.message });
      }
    } catch (err) {
      setStatusMsg({ type: "error", msg: "Transmission failed." });
    }
    setSubmitting(false);
    setTimeout(() => setStatusMsg({ type: "", msg: "" }), 3000);
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    await sendDiscussion(chatTask._id, chatMsg);
    setChatMsg("");
  };

  const priorityColors = {
    "High": "bg-red-500/10 text-red-500 border-red-500/20",
    "Medium": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "Low": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const stats = {
    pending: tasks.filter(t => t.status !== "Complete").length,
    completed: tasks.filter(t => t.status === "Complete").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen text-slate-900 dark:text-white relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
           <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-3 mb-6">
              <span className="bg-[#F05E23] text-white px-5 py-2 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest shadow-lg shadow-[#F05E23]/30">Intern Alpha</span>
              <span className="text-slate-400 font-bold uppercase tracking-widest text-[0.6rem] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live Uplink
              </span>
           </motion.div>
           <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase mb-4 leading-[0.8] italic">
             Commander: <span className="text-[#F05E23]">{user.name.split(' ')[0]}</span>
           </h1>
           <p className="text-slate-500 dark:text-white/40 font-bold uppercase tracking-[0.4em] text-[0.6rem]">Deploying high-impact digital solutions.</p>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <button onClick={() => setIsLeaveModalOpen(true)} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] px-8 py-6 flex items-center gap-4 shadow-sm hover:scale-105 transition-all text-[#F05E23] font-black uppercase text-[0.65rem] tracking-widest">
               <Calendar className="w-5 h-5" /> Request Leave
            </button>
            <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] p-6 flex items-center gap-6 shadow-sm min-w-[160px]">
              <div className="p-4 bg-orange-500/10 rounded-2xl"><Clock className="w-6 h-6 text-orange-500" /></div>
              <div>
                 <span className="block text-[0.55rem] font-black uppercase tracking-widest text-slate-400 mb-1">Active</span>
                 <span className="font-black text-2xl leading-none">{stats.pending}</span>
              </div>
           </div>
           <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] p-6 flex items-center gap-6 shadow-sm min-w-[160px]">
              <div className="p-4 bg-green-500/10 rounded-2xl"><CheckCircle2 className="w-6 h-6 text-green-500" /></div>
              <div>
                 <span className="block text-[0.55rem] font-black uppercase tracking-widest text-slate-400 mb-1">Finalized</span>
                 <span className="font-black text-2xl leading-none">{stats.completed}</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Task List */}
        <div className="lg:col-span-8 space-y-10">
           <div className="flex items-center gap-6 mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">Tactical <span className="text-[#F05E23]">Objectives</span></h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
           </div>

           <div className="space-y-6">
              {tasks.length === 0 ? (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-24 text-center border-2 border-dashed border-black/5 dark:border-white/10 rounded-[4rem]">
                    <Activity className="w-16 h-16 text-slate-300 mx-auto mb-6 opacity-20" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-[0.65rem]">Awaiting mission briefing. System idle.</p>
                 </motion.div>
              ) : (
                tasks.map((task, i) => (
                  <motion.div 
                    layout
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={task._id} 
                    className={`bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] p-8 sm:p-10 transition-all relative group overflow-hidden ${task.status === 'Complete' ? 'opacity-40 grayscale-[0.5]' : 'hover:shadow-2xl hover:bg-white/[0.08]'}`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10">
                       {/* Redesigned Checkbox Type Interaction */}
                       <div className="relative group/check">
                          <button 
                             onClick={() => {
                                if (task.status !== 'Complete') {
                                   setSelectedTaskId(task._id);
                                   setNote("Mission Accomplished.");
                                }
                             }}
                             className={`w-20 h-20 rounded-[2.5rem] border-4 flex items-center justify-center transition-all ${task.status === 'Complete' ? 'bg-green-500 border-green-500 shadow-xl shadow-green-500/30' : 'border-slate-200 dark:border-white/10 group-hover/check:border-[#F05E23] group-hover/check:scale-110'}`}
                          >
                             {task.status === 'Complete' ? (
                                <CheckCircle2 className="w-10 h-10 text-white" />
                             ) : (
                                <div className="w-8 h-8 rounded-full border-2 border-transparent group-hover/check:border-[#F05E23]/30 animate-pulse" />
                             )}
                          </button>
                          {task.status !== 'Complete' && (
                             <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[0.5rem] font-black uppercase tracking-widest text-slate-400 opacity-0 group-hover/check:opacity-100 transition-opacity">Finalize</span>
                          )}
                       </div>

                       <div className="flex-grow space-y-6">
                          <div className="flex flex-wrap items-center gap-3">
                             <div className={`text-[0.6rem] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border ${priorityColors[task.priority] || priorityColors.Medium}`}>
                                {task.priority} Priority
                             </div>
                             {task.clientProjectId && (
                               <div className="text-[0.6rem] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                                 Unit: {task.clientProjectId.projectName}
                               </div>
                             )}
                             <div className="text-[0.6rem] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                Est: {task.estimatedHours || 2}h
                             </div>
                          </div>
                          
                          <div className="space-y-2">
                             <h3 className={`text-3xl font-black tracking-tighter uppercase leading-none italic transition-all ${task.status === 'Complete' ? 'line-through text-slate-400' : ''}`}>{task.title}</h3>
                             <p className="text-sm text-slate-500 dark:text-white/40 font-bold leading-relaxed max-w-2xl italic">"{task.description}"</p>
                          </div>
                          
                           <div className="flex flex-wrap items-center gap-4 pt-4">
                              <button onClick={() => { setSelectedTaskId(task._id); setNote(task.note || ""); }} className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#F05E23] hover:underline underline-offset-8 decoration-2">Tactical Log</button>
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                              <button onClick={() => setChatTaskId(task._id)} className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all flex items-center gap-2">
                                 <MessageSquare className="w-4 h-4" /> Comms ({task.discussion?.length || 0})
                              </button>
                           </div>
                       </div>

                       <div className="hidden xl:flex flex-col items-center gap-2 p-6 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10">
                          <span className="text-[0.5rem] font-black uppercase tracking-[0.3em] text-slate-400">Class</span>
                          <span className="text-xs font-black uppercase italic text-slate-600 dark:text-slate-300">{task.taskType || "General"}</span>
                       </div>
                    </div>
                  </motion.div>
                ))
              )}
           </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-[#F05E23] text-white rounded-[3.5rem] p-12 flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
              <TrendingUp className="absolute top-[-20px] right-[-20px] w-56 h-56 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none relative z-10 italic">Performance <br/>Matrix</h2>
              <div className="space-y-4 relative z-10">
                 <div className="h-10 w-full bg-white/20 rounded-[1.2rem] relative overflow-hidden border border-white/10">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round((stats.completed / (tasks.length || 1)) * 100)}%` }} className="absolute inset-x-0 h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                 </div>
                 <div className="flex justify-between items-center text-[0.75rem] font-black uppercase tracking-[0.2em]">
                    <span className="opacity-70 italic">Success Rate</span>
                    <span className="text-white bg-black/20 px-3 py-1 rounded-lg">{Math.round((stats.completed / (tasks.length || 1)) * 100)}%</span>
                 </div>
              </div>
           </div>

           {/* Project Intelligence for Interns */}
           <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] p-10 shadow-sm overflow-hidden relative">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-4 italic">
                    <Layout className="w-6 h-6 text-[#F05E23]" /> Mission Intelligence
                 </h3>
                 <Zap className="w-5 h-5 text-[#F05E23] animate-pulse" />
              </div>

              <div className="space-y-10">
                 {tasks.filter(t => t.clientProjectId).length === 0 ? (
                    <div className="text-center py-12 opacity-20">
                       <p className="text-[0.65rem] font-black uppercase tracking-widest italic">No operational project context detected.</p>
                    </div>
                 ) : (
                    tasks.filter(t => t.clientProjectId).slice(0, 1).map((t) => (
                      <div key={t.clientProjectId._id} className="space-y-10">
                         {/* Brand Identity */}
                         <div className="p-6 bg-slate-50 dark:bg-black/20 rounded-3xl border border-black/5 dark:border-white/5">
                            <span className="text-[0.55rem] font-black uppercase text-[#F05E23] tracking-[0.4em] block mb-2">Target Asset</span>
                            <h4 className="text-lg font-black uppercase tracking-tighter italic">{t.clientProjectId.projectName}</h4>
                            <p className="text-[0.6rem] text-slate-400 mt-2 font-bold uppercase tracking-widest">{t.clientProjectId.projectType || "Custom Solution"}</p>
                         </div>

                         {/* SOP Link */}
                         {t.clientProjectId.sop && (
                            <div className="space-y-4">
                               <div className="flex items-center gap-3">
                                  <FileText className="w-4 h-4 text-slate-300" />
                                  <span className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">Operational SOP</span>
                               </div>
                               <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-[0.65rem] font-bold leading-relaxed text-blue-300 italic">
                                  {t.clientProjectId.sop}
                               </div>
                            </div>
                         )}

                         {/* Roadmap Progress */}
                         <div className="space-y-6">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <Activity className="w-4 h-4 text-slate-300" />
                                  <span className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">Roadmap Progress</span>
                               </div>
                               <span className="text-[0.6rem] font-black text-[#F05E23]">{t.clientProjectId.workflow?.filter(s => s.status === 'Complete').length} / {t.clientProjectId.workflow?.length}</span>
                            </div>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 scrollbar-hide">
                               {t.clientProjectId.workflow?.map((step, idx) => (
                                  <div key={idx} className="flex gap-4 group">
                                     <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full transition-all ${step.status === 'Complete' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : (step.status === 'In Progress' ? 'bg-[#F05E23] animate-pulse' : 'bg-slate-300')}`} />
                                        {idx !== (t.clientProjectId.workflow.length - 1) && <div className="w-0.5 h-10 bg-slate-100 dark:bg-white/5" />}
                                     </div>
                                     <div className="pb-4">
                                        <span className={`text-[0.65rem] font-black uppercase tracking-widest block ${step.status === 'Complete' ? 'text-green-500' : (step.status === 'In Progress' ? 'text-[#F05E23]' : 'text-slate-400')}`}>{step.title}</span>
                                        <p className="text-[0.5rem] opacity-30 uppercase font-black tracking-tighter mt-1">{step.status}</p>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>

                         {/* Requirements */}
                         {(t.clientProjectId.requirements || []).length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-white/5">
                               <div className="flex items-center gap-3">
                                  <ShieldCheck className="w-4 h-4 text-slate-300" />
                                  <span className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">Mission Directives</span>
                               </div>
                               <div className="space-y-2">
                                  {t.clientProjectId.requirements.map((req, i) => (
                                     <div key={i} className="flex items-start gap-3 p-3 bg-white/2 rounded-xl">
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${req.status === 'Approved' ? 'bg-green-500' : 'bg-[#F05E23]'}`} />
                                        <p className="text-[0.65rem] font-bold text-slate-300 line-clamp-2">{req.content}</p>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         )}
                      </div>
                    ))
                 )}
              </div>
           </div>

           <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] p-10 shadow-sm">
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-4 mb-10 italic">
                 <ShieldCheck className="w-6 h-6 text-blue-500" /> Operational Log
              </h3>
              <div className="space-y-8">
                 {tasks.filter(t => t.status === 'Complete').slice(0, 3).map((t, i) => (
                    <div key={t._id} className="flex gap-5 group">
                       <div className="w-2 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                       </div>
                       <div>
                          <span className="block text-[0.55rem] font-black uppercase tracking-[0.2em] text-[#F05E23] mb-1">Archived Objective</span>
                          <span className="text-xs font-bold leading-tight line-clamp-1 uppercase tracking-tighter italic">{t.title}</span>
                       </div>
                    </div>
                 ))}
                 {stats.completed === 0 && (
                    <div className="text-center py-12 opacity-20">
                       <FileText className="w-12 h-12 mx-auto mb-4" />
                       <p className="text-[0.65rem] font-black uppercase tracking-widest">Vault Empty.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Update Modal */}
      <AnimatePresence mode="wait">
        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80">
            <motion.div key="task-update-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-white dark:bg-[#0A0A0E] rounded-[4rem] p-12 shadow-2xl border border-white/10">
                <div className="bg-[#F05E23] w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-[#F05E23]/30">
                   <Activity className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 leading-none italic">Sync <span className="text-[#F05E23]">Status</span></h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Updating tactical parameters for unit "{selectedTask.title}"</p>
                
                <div className="space-y-12">
                   <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-[#F05E23] pl-2">Select Matrix State</label>
                     <div className="grid grid-cols-2 gap-4">
                        {["Pending", "Complete", "Need Credentials", "Need Meeting", "Blocked"].map((status) => (
                           <button key={status} onClick={() => handleUpdateTask(selectedTask._id, status)} disabled={submitting} className={`py-6 px-6 rounded-3xl text-[0.7rem] font-black uppercase tracking-widest border-2 transition-all ${selectedTask.status === status ? 'border-[#F05E23] bg-[#F05E23]/10 text-[#F05E23]' : 'border-black/5 dark:border-white/5 hover:border-[#F05E23]/30'}`}>
                              {status}
                           </button>
                        ))}
                     </div>
                   </div>

                   <div className="space-y-6">
                                             <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#F05E23] pl-2">Tactical Briefing / Blocker Intelligence</label>
                          {["Blocked", "Need Credentials", "Need Meeting"].includes(selectedTask.status) && (
                             <button 
                               onClick={async () => {
                                 setResolving(true);
                                 const res = await getAIBlockerSuggestion(selectedTask._id);
                                 if (res.success) setAiSuggestion(res.suggestion);
                                 setResolving(false);
                               }}
                               disabled={resolving}
                               className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-all"
                             >
                               <Zap className={`w-3 h-3 ${resolving ? 'animate-spin' : ''}`} /> AI Tactical Support
                             </button>
                          )}
                       </div>
                                            <textarea rows={4} value={note} onChange={e => setNote(e.target.value)} placeholder="Provide specific operational details or intelligence gaps..." className="w-full bg-slate-50 dark:bg-white/5 border-2 border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 outline-none focus:border-[#F05E23] text-sm font-bold transition-all italic" />
                      
                      {aiSuggestion && (
                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl relative overflow-hidden group/ai mt-4">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/ai:opacity-10">
                               <Terminal className="w-10 h-10" />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500 block mb-2">AI Suggestion</span>
                            <p className="text-xs font-bold text-blue-300 italic leading-relaxed">"{aiSuggestion}"</p>
                            <button onClick={() => setAiSuggestion("")} className="absolute top-2 right-2 text-blue-500/30 hover:text-blue-500 transition-all"><Plus className="w-4 h-4 rotate-45" /></button>
                         </motion.div>
                      )}
                      
                      <div className="space-y-6 pt-4 border-t border-black/5 dark:border-white/5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#F05E23] pl-2 flex items-center gap-2">
                          <Shield className="w-3 h-3" /> Project Intelligence / Tech Vault
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          {selectedTask.clientProjectId?.credentials && (
                          <div className="space-y-3">
                            {/* Environment Variables */}
                            {selectedTask.clientProjectId.credentials.env && (
                              <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-black/5 dark:border-white/5">
                                <div className="flex items-center gap-3 mb-3">
                                  <Terminal className="w-4 h-4 text-[#F05E23]" />
                                  <span className="text-[0.6rem] font-black uppercase tracking-widest text-slate-500">Environment (ENV)</span>
                                </div>
                                <pre className="text-[0.7rem] font-mono text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-black/20 p-3 rounded-xl overflow-x-auto">
                                  {selectedTask.clientProjectId.credentials.env}
                                </pre>
                              </div>
                            )}

                            {/* Github / Hosting Grid */}
                            <div className="grid grid-cols-2 gap-3">
                              {selectedTask.clientProjectId.credentials.github && (
                                <div className="bg-white/5 border border-black/5 dark:border-white/5 p-4 rounded-2xl">
                                  <span className="block text-[0.6rem] font-black uppercase tracking-widest text-slate-400 mb-2">Github Repo</span>
                                  <span className="text-[0.7rem] font-bold text-[#F05E23] break-all">{selectedTask.clientProjectId.credentials.github}</span>
                                </div>
                              )}
                              {selectedTask.clientProjectId.credentials.hosting && (
                                <div className="bg-white/5 border border-black/5 dark:border-white/5 p-4 rounded-2xl">
                                  <span className="block text-[0.6rem] font-black uppercase tracking-widest text-slate-400 mb-2">Hosting Hub</span>
                                  <span className="text-[0.7rem] font-bold text-blue-500">{selectedTask.clientProjectId.credentials.hosting}</span>
                                </div>
                              )}
                            </div>

                            {/* Service Accounts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {selectedTask.clientProjectId.credentials.gmail?.email && (
                                <div className="bg-[#EA4335]/5 border border-[#EA4335]/10 p-4 rounded-2xl">
                                  <span className="block text-[0.6rem] font-black uppercase tracking-widest text-[#EA4335] mb-2 text-center">Gmail Access</span>
                                  <div className="space-y-1">
                                    <p className="text-[0.7rem] font-bold text-center opacity-70 truncate">{selectedTask.clientProjectId.credentials.gmail.email}</p>
                                    <p className="text-[0.7rem] font-black text-center text-[#EA4335] select-all cursor-copy">{selectedTask.clientProjectId.credentials.gmail.password}</p>
                                  </div>
                                </div>
                              )}
                              {selectedTask.clientProjectId.credentials.vercel?.email && (
                                <div className="bg-black/20 border border-white/10 p-4 rounded-2xl">
                                  <span className="block text-[0.6rem] font-black uppercase tracking-widest text-white mb-2 text-center">Vercel Deployment</span>
                                  <div className="space-y-1">
                                    <p className="text-[0.7rem] font-bold text-center opacity-70 truncate">{selectedTask.clientProjectId.credentials.vercel.email}</p>
                                    <p className="text-[0.7rem] font-black text-center text-white select-all cursor-copy">{selectedTask.clientProjectId.credentials.vercel.password}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Additional Intelligence */}
                            {selectedTask.clientProjectId.credentials.additional && (
                              <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-black/5 dark:border-white/5">
                                <span className="block text-[0.6rem] font-black uppercase tracking-widest text-slate-400 mb-2">Tactical Appendices</span>
                                <p className="text-[0.7rem] text-slate-500 dark:text-slate-400 italic leading-relaxed">
                                  {selectedTask.clientProjectId.credentials.additional}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                          {(selectedTask.clientProjectId?.liveUrl || selectedTask.clientProjectId?.devUrl) && (
                            <div className="grid grid-cols-2 gap-3">
                              {selectedTask.clientProjectId.liveUrl && (
                                <a href={selectedTask.clientProjectId.liveUrl} target="_blank" rel="noopener noreferrer" className="bg-[#F05E23]/5 border border-[#F05E23]/10 p-4 rounded-2xl flex items-center justify-between group hover:bg-[#F05E23]/10 transition-all">
                                  <div className="flex items-center gap-2">
                                    <Globe className="w-3.5 h-3.5 text-[#F05E23]" />
                                    <span className="text-[0.6rem] font-black uppercase tracking-widest text-[#F05E23]">Live Environment</span>
                                  </div>
                                  <ExternalLink className="w-3 h-3 text-[#F05E23] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                              )}
                              {selectedTask.clientProjectId.devUrl && (
                                <a href={selectedTask.clientProjectId.devUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl flex items-center justify-between group hover:bg-blue-500/10 transition-all">
                                  <div className="flex items-center gap-2">
                                    <Terminal className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="text-[0.6rem] font-black uppercase tracking-widest text-blue-500">Dev Uplink</span>
                                  </div>
                                  <ExternalLink className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-5">
                         <button onClick={() => setSelectedTaskId(null)} className="flex-1 py-6 rounded-2xl font-black uppercase tracking-widest text-[0.65rem] border-2 border-black/5 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all italic">Abort</button>
                         <button onClick={() => handleUpdateTask(selectedTask._id, selectedTask.status)} disabled={submitting} className="flex-[2] bg-black dark:bg-white text-white dark:text-black py-6 rounded-2xl font-black uppercase tracking-widest text-[0.65rem] transition-all hover:opacity-90 shadow-2xl">{submitting ? "UPLOADING..." : "DEPLOY INTEL"}</button>
                      </div>
                   </div>
                </div>
            </motion.div>
          </div>
        )}

        {/* Discussion Modal */}
        {chatTask && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80">
             <motion.div key="chat-modal" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative w-full max-w-2xl bg-white dark:bg-[#0A0A0E] rounded-[4rem] p-0 shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[85vh]">
                <div className="p-10 bg-[#F05E23] text-white flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="p-4 bg-white/20 rounded-[1.5rem]"><MessageSquare className="w-8 h-8" /></div>
                      <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Mission <span className="opacity-60">Log</span></h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Uplink: {chatTask.title}</p>
                      </div>
                   </div>
                   <button onClick={() => setChatTaskId(null)} className="p-3 hover:bg-white/20 rounded-2xl transition-all"><Plus className="w-8 h-8 rotate-45" /></button>
                </div>

                <div className="flex-grow p-10 overflow-y-auto space-y-8 scrollbar-hide bg-slate-50 dark:bg-transparent">
                   {(chatTask.discussion || []).map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.sender === 'intern' ? 'items-end' : 'items-start'}`}>
                         <span className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 px-3">{msg.sender === 'intern' ? 'UNIT ALPHA' : 'COMMAND HQ'} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                         <div className={`max-w-[85%] p-6 rounded-[2rem] font-bold text-sm shadow-xl ${msg.sender === 'intern' ? 'bg-[#F05E23] text-white rounded-tr-none' : 'bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-tl-none text-slate-700 dark:text-white'}`}>
                            {msg.content}
                         </div>
                      </div>
                   ))}
                   {(chatTask.discussion || []).length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center opacity-10 py-32">
                         <Activity className="w-20 h-20 mb-8 animate-pulse" />
                         <p className="font-black uppercase tracking-[0.5em] text-xs">Waiting for operational dialogue...</p>
                      </div>
                   )}
                </div>

                <form onSubmit={handleSendChat} className="p-10 border-t border-black/5 dark:border-white/10 bg-white dark:bg-black/20">
                   <div className="flex gap-5">
                      <input type="text" value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="Transmit briefing intel..." className="flex-grow bg-slate-50 dark:bg-white/5 border-2 border-black/5 dark:border-white/5 rounded-2xl px-8 py-5 outline-none focus:border-[#F05E23] font-bold text-sm italic" />
                      <button type="submit" className="bg-[#F05E23] text-white p-5 rounded-2xl shadow-2xl shadow-[#F05E23]/30 hover:scale-105 active:scale-95 transition-all"><Send className="w-7 h-7" /></button>
                   </div>
                </form>
             </motion.div>
           </div>
        )}
        {/* Holiday Request Modal */}
        {isLeaveModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80">
              <motion.div key="leave-request-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-white dark:bg-[#0A0A0E] rounded-[4rem] p-12 shadow-2xl border border-white/10">
                 <h2 className="text-5xl font-black uppercase tracking-tighter mb-10 italic">Request <span className="text-[#F05E23]">Leave</span></h2>
                 <form onSubmit={handleApplyLeave} className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-[#F05E23] pl-2 tracking-widest">Start Parameter</label>
                          <input type="date" required value={leaveReq.startDate} onChange={e => setLeaveReq({...leaveReq, startDate: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 outline-none font-black italic text-sm" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-[#F05E23] pl-2 tracking-widest">End Parameter</label>
                          <input type="date" required value={leaveReq.endDate} onChange={e => setLeaveReq({...leaveReq, endDate: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 outline-none font-black italic text-sm" />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-[#F05E23] pl-2 tracking-widest">Operational Reason</label>
                       <textarea rows={4} required value={leaveReq.reason} onChange={e => setLeaveReq({...leaveReq, reason: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 outline-none font-bold placeholder:opacity-20 italic text-sm" placeholder="Provide justification for absence..." />
                    </div>
                    <div className="flex gap-5 pt-6">
                       <button type="button" onClick={() => setIsLeaveModalOpen(false)} className="flex-1 py-6 rounded-2xl font-black uppercase tracking-widest text-[0.65rem] border border-black/10 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all italic">Abort</button>
                       <button type="submit" disabled={submitting} className="flex-[2] bg-[#F05E23] text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[0.65rem] shadow-2xl shadow-[#F05E23]/20 hover:scale-[1.02] active:scale-95 transition-all italic">{submitting ? "SUBMITTING..." : "TRANSMIT REQUEST"}</button>
                    </div>
                 </form>
              </motion.div>
           </div>
        )}

        {statusMsg.msg && (
           <motion.div key="status-notification" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className={`fixed bottom-10 right-10 z-[200] p-8 rounded-[2.5rem] shadow-2xl flex items-center gap-5 border ${statusMsg.type === 'success' ? 'bg-green-500 border-green-400 text-white shadow-green-500/30' : 'bg-red-500 border-red-400 text-white shadow-red-500/30'}`}>
             <CheckCircle2 className="w-8 h-8" />
             <span className="font-black text-[0.75rem] uppercase tracking-[0.2em] italic">{statusMsg.msg}</span>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
