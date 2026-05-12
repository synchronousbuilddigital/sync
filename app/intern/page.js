"use client";

import { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
   CheckCircle2, Clock, MessageSquare,
   Send, ListTodo, TrendingUp, AlertCircle,
   FileText, Calendar, PlusCircle, Activity,
   Layout, ShieldCheck, ChevronDown, Plus, Zap,
   Shield, Globe, Terminal, ExternalLink, Key,
   Cpu as CpuIcon, Trophy, BookOpen, Newspaper, Box, 
   Sparkles, Target, Compass, HardDrive, Timer
} from "lucide-react";

export default function InternDashboard() {
   const { user, tasks, internProjects, leaves, updateTaskStatus, sendDiscussion, applyForLeave, loading } = useAuth();
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
   const [activeTool, setActiveTool] = useState(null);
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

   const isCurrentMonth = (dateString) => {
      if (!dateString) return false;
      const date = new Date(dateString);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
   };

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
      completedMonthly: tasks.filter(t => t.status === "Complete" && isCurrentMonth(t.updatedAt || t.createdAt)).length,
   };

   return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen text-slate-900 dark:text-white relative">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-3 mb-6">
                  <span className="bg-[#F05E23] text-white px-5 py-2 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest shadow-lg shadow-[#F05E23]/30">Intern</span>
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[0.6rem] flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
                  </span>
               </motion.div>
               <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase mb-4 leading-[0.8] italic">
                  Hello, <span className="text-[#F05E23]">{user.name.split(' ')[0]}</span>
               </h1>
               <p className="text-slate-500 dark:text-white/40 font-bold uppercase tracking-[0.4em] text-[0.6rem]">Bringing ideas to life together.</p>
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
                     <span className="block text-[0.55rem] font-black uppercase tracking-widest text-slate-400 mb-1">Monthly Score</span>
                     <span className="font-black text-2xl leading-none">{stats.completedMonthly}</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Primary Hub (Left) */}
            <div className="lg:col-span-8 space-y-16">

               {/* Active Projects */}
               {internProjects.length === 0 && tasks.filter(t => !t.clientProjectId).length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-24 text-center border-2 border-dashed border-black/5 dark:border-white/10 rounded-[4rem] bg-white/5">
                     <Activity className="w-16 h-16 text-slate-300 mx-auto mb-6 opacity-20" />
                     <p className="text-slate-400 font-black uppercase tracking-widest text-[0.65rem]">No active projects assigned at this time.</p>
                  </motion.div>
               ) : (
                  <div className="space-y-16">
                     {internProjects.map((project) => {
                        const projectTasks = tasks.filter(t => t.clientProjectId?._id === project._id || t.clientProjectId === project._id);
                        return (
                           <motion.section
                              key={project._id}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              className="bg-white dark:bg-[#050505] border border-black/5 dark:border-white/10 rounded-[4rem] overflow-hidden shadow-2xl relative"
                           >
                              {/* Project Header */}
                              <div className="p-10 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative overflow-hidden">
                                 <div className="absolute top-0 right-0 w-96 h-96 bg-[#F05E23]/10 blur-[100px]" />
                                 <div className="space-y-4 relative z-10">
                                    <div className="flex items-center gap-4">
                                       <span className="px-4 py-1.5 bg-[#F05E23] text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#F05E23]/20">Active Project</span>
                                       <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none">{project.projectName}</h2>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-6 relative z-10">
                                    <div className="text-right">
                                       <span className="block text-3xl font-black italic">{Math.round((project.workflow?.filter(s => s.status === 'Complete').length / (project.workflow?.length || 1)) * 100)}%</span>
                                       <span className="text-[8px] font-black uppercase text-green-500 tracking-widest">{project.status}</span>
                                    </div>
                                    <div className="w-1.5 h-12 bg-white/10 rounded-full overflow-hidden">
                                       <motion.div initial={{ height: 0 }} animate={{ height: `${(project.workflow?.filter(s => s.status === 'Complete').length / (project.workflow?.length || 1)) * 100}%` }} className="w-full bg-[#F05E23] rounded-full" />
                                    </div>
                                 </div>
                              </div>

                              <div className="p-10 space-y-12">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[2.5rem] space-y-4">
                                       <div className="flex items-center gap-3">
                                          <FileText className="w-4 h-4 text-blue-500" />
                                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Project Overview</h4>
                                       </div>
                                       <p className="text-xs text-slate-500 font-bold italic leading-relaxed">"{project.description}"</p>
                                    </div>
                                    <div className="p-8 bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[2.5rem] space-y-4">
                                       <div className="flex items-center gap-3">
                                          <ShieldCheck className="w-4 h-4 text-[#F05E23]" />
                                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Instructions</h4>
                                       </div>
                                       <div className="text-[10px] font-mono text-slate-500 max-h-24 overflow-y-auto scrollbar-hide whitespace-pre-wrap">
                                          {project.sop || "Follow standard guides for this project. Check with the team for more info."}
                                       </div>
                                    </div>
                                 </div>

                                 {/* Project Steps */}
                                 <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                       <ListTodo className="w-5 h-5 text-[#F05E23]" />
                                       <h3 className="text-2xl font-black uppercase tracking-tighter italic">Project <span className="text-[#F05E23]">Steps</span></h3>
                                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-white/5 px-4 py-1.5 rounded-full ml-auto">
                                          {project.workflow?.filter(s => s.status === 'Complete').length} / {project.workflow?.length} Done
                                       </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                       {project.workflow?.map((step, idx) => (
                                          <div key={idx} className="relative p-6 bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-3xl group">
                                             <div className="flex items-start gap-4">
                                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${step.status === 'Complete' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                                                      (step.status === 'In Progress' ? 'bg-[#F05E23] animate-pulse' : 'bg-slate-300')
                                                   }`} />
                                                <div className="space-y-2">
                                                   <div className="flex items-center gap-3">
                                                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Step {idx + 1}</span>
                                                      {step.status === 'In Progress' && <span className="px-2 py-0.5 bg-[#F05E23]/10 text-[#F05E23] text-[7px] font-black uppercase tracking-widest rounded animate-pulse">Current Focus</span>}
                                                   </div>
                                                   <h4 className={`text-xl font-black uppercase tracking-tighter italic ${step.status === 'Complete' ? 'line-through opacity-30' : ''}`}>{step.title}</h4>
                                                   <p className="text-xs text-slate-500 font-bold italic opacity-60">"{step.description}"</p>
                                                </div>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>

                                 {/* Tasks */}
                                 <div className="space-y-8 pt-8 border-t border-black/5 dark:border-white/5">
                                    <div className="flex items-center gap-4">
                                       <Zap className="w-5 h-5 text-blue-500" />
                                       <h3 className="text-xl font-black uppercase tracking-tighter italic">Extra <span className="text-blue-500">Tasks</span></h3>
                                    </div>
                                    <div className="space-y-4">
                                       {projectTasks.filter(t => t.status !== 'Complete').length === 0 ? (
                                          <div className="p-10 text-center border-2 border-dashed border-black/5 dark:border-white/10 rounded-3xl opacity-20 text-[9px] font-black uppercase tracking-widest">
                                             No additional tasks assigned.
                                          </div>
                                       ) : (
                                          projectTasks.filter(t => t.status !== 'Complete').map((task) => (
                                             <div key={task._id} className={`p-8 bg-slate-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${task.status === 'Complete' ? 'opacity-40 grayscale' : ''}`}>
                                                <div className="space-y-2">
                                                   <div className="flex items-center gap-3">
                                                      <div className={`text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${priorityColors[task.priority] || priorityColors.Medium}`}>
                                                         {task.priority}
                                                      </div>
                                                      <span className="text-[8px] font-black uppercase text-slate-400 italic">{task.taskType}</span>
                                                   </div>
                                                   <h4 className="text-xl font-black uppercase tracking-tighter italic leading-none">{task.title}</h4>
                                                   <p className="text-[11px] text-slate-500 font-bold italic">"{task.description}"</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                   <button onClick={() => { setSelectedTaskId(task._id); setNote(task.note || ""); }} className="text-[8px] font-black uppercase text-blue-500 hover:scale-110 transition-transform">Update</button>
                                                   <button onClick={() => setChatTaskId(task._id)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all">
                                                      <MessageSquare className="w-4 h-4 text-slate-400" />
                                                   </button>
                                                </div>
                                             </div>
                                          ))
                                       )}
                                    </div>
                                 </div>

                                 {/* Passwords & Links */}
                                 <div className="space-y-6 pt-10 border-t border-black/5 dark:border-white/5">
                                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#F05E23] flex items-center gap-3">
                                       <Shield className="w-4 h-4" /> Passwords & Links
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                       {[
                                          { id: 'github', label: 'GitHub', icon: Terminal, color: 'blue', value: project.credentials?.github },
                                          { id: 'vercel', label: 'Vercel', icon: Activity, color: 'orange', value: project.credentials?.vercel?.email },
                                          { id: 'gmail', label: 'Email', icon: MessageSquare, color: 'red', value: project.credentials?.gmail?.email },
                                          { id: 'drive', label: 'Files', icon: FileText, color: 'green', value: project.googleDriveLink }
                                       ].filter(v => v.value).map(vault => (
                                          <div key={vault.id} className="p-5 bg-slate-900 border border-white/5 rounded-3xl group/vault hover:border-white/20 transition-all cursor-pointer" onClick={() => vault.value && window.open(vault.value.startsWith('http') ? vault.value : `mailto:${vault.value}`, '_blank')}>
                                             <div className="flex items-center justify-between mb-3">
                                                <vault.icon className={`w-3.5 h-3.5 text-${vault.color === 'orange' ? '[#F05E23]' : vault.color + '-500'}`} />
                                                <ExternalLink className="w-3 h-3 text-white/20 group-hover/vault:text-white/60" />
                                             </div>
                                             <span className="block text-[8px] font-black uppercase text-white/40 mb-1">{vault.label}</span>
                                             <span className="text-[10px] font-mono text-white/80 truncate block">{vault.value}</span>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           </motion.section>
                        );
                     })}
                  </div>
               )}

               {/* General Operations */}
                     {tasks.filter(t => !t.clientProjectId && t.status !== 'Complete').length > 0 && (
                        <section className="space-y-10 pt-10">
                           <div className="flex items-center gap-6">
                              <h2 className="text-3xl font-black uppercase tracking-tighter italic">General <span className="text-[#F05E23]">Tasks</span></h2>
                              <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {tasks.filter(t => !t.clientProjectId && t.status !== 'Complete').map((task) => (
                                 <div key={task._id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] p-10">
                                    <div className="flex justify-between items-start mb-6">
                                       <div className={`text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${priorityColors[task.priority] || priorityColors.Medium}`}>
                                          {task.priority}
                                       </div>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-3">{task.title}</h3>
                                    <p className="text-xs text-slate-500 font-bold italic mb-8">"{task.description}"</p>
                                    <div className="flex items-center gap-6 pt-6 border-t border-black/5 dark:border-white/5">
                                       <button onClick={() => { setSelectedTaskId(task._id); setNote(task.note || ""); }} className="text-[9px] font-black uppercase text-[#F05E23]">Update</button>
                                       <button onClick={() => setChatTaskId(task._id)} className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-2">
                                          <MessageSquare className="w-4 h-4" /> Chat ({task.discussion?.length || 0})
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </section>
                     )}
            </div>
 
            {/* Side Panel (Right) */}
            <div className="lg:col-span-4 space-y-8">
               {/* Dashboard Tools */}
               <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] p-10 shadow-sm">
                  <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-4 mb-8 italic">
                     <Layout className="w-6 h-6 text-[#F05E23]" /> Dashboard Tools
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                     {[
                        { label: "Sync AI", icon: CpuIcon, color: "cyan" },
                        { label: "Leaderboard", icon: Trophy, color: "yellow" },
                     ].map((tool, i) => (
                        <button
                           key={i}
                           onClick={() => setActiveTool(tool.label)}
                           className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/5 hover:border-[#F05E23]/30 transition-all group/tool text-left flex items-center gap-6"
                        >
                           <tool.icon className={`w-8 h-8 text-slate-300 group-hover/tool:text-${tool.color === 'orange' ? '[#F05E23]' : tool.color + '-500'} transition-all group-hover/tool:scale-110`} />
                           <span className="block text-sm font-black uppercase tracking-widest text-slate-400 group-hover/tool:text-slate-600 dark:group-hover/tool:text-white transition-colors">{tool.label}</span>
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Tool Modal Content Renderer */}
         <AnimatePresence>
            {activeTool && (
               <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80">
                  <motion.div 
                     initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                     animate={{ scale: 1, opacity: 1, y: 0 }} 
                     exit={{ scale: 0.9, opacity: 0, y: 20 }} 
                     className="relative w-full max-w-4xl bg-white dark:bg-[#0A0A0E] rounded-[4rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[85vh]"
                  >
                     {/* Tool Header */}
                     <div className="p-10 bg-slate-900 text-white flex items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05E23]/10 blur-[80px]" />
                        <div className="flex items-center gap-6 relative z-10">
                           <div className="p-4 bg-[#F05E23] rounded-2xl shadow-xl shadow-[#F05E23]/20">
                              {activeTool === "Sync AI" && <CpuIcon className="w-8 h-8" />}
                              {activeTool === "Leaderboard" && <Trophy className="w-8 h-8" />}
                           </div>
                           <div>
                              <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">{activeTool}</h2>
                              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mt-1 italic">Operations Matrix / Internal Tool</p>
                           </div>
                        </div>
                        <button onClick={() => setActiveTool(null)} className="p-4 hover:bg-white/10 rounded-2xl transition-all relative z-10">
                           <Plus className="w-8 h-8 rotate-45" />
                        </button>
                     </div>

                     {/* Tool Content Container */}
                     <div className="flex-grow overflow-y-auto p-12 space-y-10 scrollbar-hide">
                        {activeTool === "Sync AI" && (
                           <div className="flex flex-col h-[50vh]">
                              <div className="flex-grow bg-slate-50 dark:bg-white/5 rounded-[3rem] p-10 mb-6 overflow-y-auto scrollbar-hide space-y-6">
                                 <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#F05E23] flex items-center justify-center text-white shrink-0"><CpuIcon className="w-6 h-6" /></div>
                                    <div className="p-6 bg-white dark:bg-white/10 rounded-3xl rounded-tl-none text-sm font-bold italic shadow-sm">
                                       "Hello {user.name.split(' ')[0]}, I am Sync AI. I can help you with technical documentation, code snippets, or task blockers. How can I assist you today?"
                                    </div>
                                 </div>
                              </div>
                              <div className="relative">
                                 <input type="text" placeholder="Ask Sync AI anything..." className="w-full bg-slate-50 dark:bg-white/5 border-2 border-black/5 dark:border-white/5 rounded-3xl px-10 py-6 outline-none focus:border-[#F05E23] font-bold text-sm italic" />
                                 <button className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-[#F05E23] text-white rounded-2xl shadow-xl"><Send className="w-5 h-5" /></button>
                              </div>
                           </div>
                        )}

                        {activeTool === "Leaderboard" && (
                           <div className="space-y-6">
                              {[
                                 { name: "Alex Rivera", score: 2450, rank: 1, avatar: "AR" },
                                 { name: "Priya Sharma", score: 2320, rank: 2, avatar: "PS" },
                                 { name: "Jordan Lee", score: 2180, rank: 3, avatar: "JL" },
                                 { name: "You", score: 1850, rank: 4, avatar: user.name?.split(' ').map(n=>n[0]).join('') || 'U' }
                              ].map((user, i) => (
                                 <div key={i} className={`p-8 rounded-[2.5rem] border flex items-center justify-between transition-all ${user.name === 'You' ? 'bg-[#F05E23] border-[#F05E23] text-white shadow-xl scale-[1.02]' : 'bg-slate-50 dark:bg-white/5 border-black/5 dark:border-white/5'}`}>
                                    <div className="flex items-center gap-6">
                                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${user.name === 'You' ? 'bg-white text-[#F05E23]' : 'bg-slate-900 text-white'}`}>{user.rank}</div>
                                       <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[10px] font-black">{user.avatar}</div>
                                       <div>
                                          <h4 className="text-xl font-black uppercase tracking-tighter italic leading-none">{user.name}</h4>
                                          <span className={`text-[10px] font-black uppercase tracking-widest ${user.name === 'You' ? 'text-white/60' : 'text-slate-400'}`}>Contribution Score</span>
                                       </div>
                                    </div>
                                    <div className="text-2xl font-black italic">{user.score} XP</div>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>

                     {/* Tool Footer */}
                     <div className="p-8 bg-slate-50 dark:bg-black/20 border-t border-black/5 dark:border-white/10 text-center">
                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400 italic">Secure Synchronous Operations / Terminal Access</span>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* Modals */}
         <AnimatePresence mode="wait">
            {selectedTask && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80">
                  <motion.div key="task-update-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-white dark:bg-[#0A0A0E] rounded-[4rem] p-12 shadow-2xl border border-white/10">
                     <div className="bg-[#F05E23] w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-[#F05E23]/30">
                        <Activity className="w-10 h-10 text-white" />
                     </div>
                     <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 leading-none italic">Update <span className="text-[#F05E23]">Status</span></h2>
                     <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Updating details for "{selectedTask.title}"</p>

                     <div className="space-y-12">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-[#F05E23] pl-2">Choose Status</label>
                           <div className="grid grid-cols-2 gap-4">
                              {["Pending", "Complete", "Need Credentials", "Need Meeting", "Blocked"].map((status) => (
                                 <button key={status} onClick={() => handleUpdateTask(selectedTask._id, status)} disabled={submitting} className={`py-6 px-6 rounded-3xl text-[0.7rem] font-black uppercase tracking-widest border-2 transition-all ${selectedTask.status === status ? 'border-[#F05E23] bg-[#F05E23]/10 text-[#F05E23]' : 'border-black/5 dark:border-white/5 hover:border-[#F05E23]/30'}`}>
                                    {status}
                                 </button>
                              ))}
                           </div>
                        </div>
                        <div className="flex gap-5">
                           <button onClick={() => setSelectedTaskId(null)} className="flex-1 py-6 rounded-2xl font-black uppercase tracking-widest text-[0.65rem] border-2 border-black/5 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all italic">Cancel</button>
                           <button onClick={() => handleUpdateTask(selectedTask._id, selectedTask.status)} disabled={submitting} className="flex-[2] bg-black dark:bg-white text-white dark:text-black py-6 rounded-2xl font-black uppercase tracking-widest text-[0.65rem] transition-all hover:opacity-90 shadow-2xl">{submitting ? "SAVING..." : "SAVE"}</button>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}

            {chatTask && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80">
                  <motion.div key="chat-modal" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative w-full max-w-2xl bg-white dark:bg-[#0A0A0E] rounded-[4rem] p-0 shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[85vh]">
                     <div className="p-10 bg-[#F05E23] text-white flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className="p-4 bg-white/20 rounded-[1.5rem]"><MessageSquare className="w-8 h-8" /></div>
                           <div>
                              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Project <span className="opacity-60">Chat</span></h2>
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Updating: {chatTask.title}</p>
                           </div>
                        </div>
                        <button onClick={() => setChatTaskId(null)} className="p-3 hover:bg-white/20 rounded-2xl transition-all"><Plus className="w-8 h-8 rotate-45" /></button>
                     </div>
                     <div className="flex-grow p-10 overflow-y-auto space-y-8 scrollbar-hide bg-slate-50 dark:bg-transparent">
                        {(chatTask.discussion || []).map((msg, idx) => (
                           <div key={idx} className={`flex flex-col ${msg.sender === 'intern' ? 'items-end' : 'items-start'}`}>
                              <span className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 px-3">{msg.sender === 'intern' ? 'MY UPDATE' : 'TEAM UPDATE'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <div className={`max-w-[85%] p-6 rounded-[2rem] font-bold text-sm shadow-xl ${msg.sender === 'intern' ? 'bg-[#F05E23] text-white rounded-tr-none' : 'bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-tl-none text-slate-700 dark:text-white'}`}>
                                 {msg.content}
                              </div>
                           </div>
                        ))}
                     </div>
                     <form onSubmit={handleSendChat} className="p-10 border-t border-black/5 dark:border-white/10 bg-white dark:bg-black/20">
                        <div className="flex gap-5">
                           <input type="text" value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="Type a message..." className="flex-grow bg-slate-50 dark:bg-white/5 border-2 border-black/5 dark:border-white/5 rounded-2xl px-8 py-5 outline-none focus:border-[#F05E23] font-bold text-sm italic" />
                           <button type="submit" className="bg-[#F05E23] text-white p-5 rounded-2xl shadow-2xl shadow-[#F05E23]/30 hover:scale-105 active:scale-95 transition-all"><Send className="w-7 h-7" /></button>
                        </div>
                     </form>
                  </motion.div>
               </div>
            )}

            {isLeaveModalOpen && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80">
                  <motion.div key="leave-request-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-white dark:bg-[#0A0A0E] rounded-[4rem] p-12 shadow-2xl border border-white/10">
                     <h2 className="text-5xl font-black uppercase tracking-tighter mb-10 italic">Request <span className="text-[#F05E23]">Leave</span></h2>
                     <form onSubmit={handleApplyLeave} className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase text-[#F05E23] pl-2 tracking-widest">Start Date</label>
                              <input type="date" required value={leaveReq.startDate} onChange={e => setLeaveReq({ ...leaveReq, startDate: e.target.value })} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 outline-none font-black italic text-sm" />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase text-[#F05E23] pl-2 tracking-widest">End Date</label>
                              <input type="date" required value={leaveReq.endDate} onChange={e => setLeaveReq({ ...leaveReq, endDate: e.target.value })} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 outline-none font-black italic text-sm" />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-[#F05E23] pl-2 tracking-widest">Reason</label>
                           <textarea rows={4} required value={leaveReq.reason} onChange={e => setLeaveReq({ ...leaveReq, reason: e.target.value })} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 outline-none font-bold placeholder:opacity-20 italic text-sm" placeholder="Tell us why you need leave..." />
                        </div>
                        <div className="flex gap-5 pt-6">
                           <button type="submit" disabled={submitting} className="flex-grow bg-[#F05E23] text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#F05E23]/30 italic">{submitting ? "Sending..." : "Send Request"}</button>
                           <button type="button" onClick={() => setIsLeaveModalOpen(false)} className="px-10 border-2 border-black/5 dark:border-white/10 rounded-2xl font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all italic text-sm">Cancel</button>
                        </div>
                     </form>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         <AnimatePresence>
            {statusMsg.msg && (
               <motion.div key="status-notification" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className={`fixed bottom-10 right-10 z-[200] p-8 rounded-[2.5rem] shadow-2xl flex items-center gap-5 border ${statusMsg.type === 'success' ? 'bg-green-500 border-green-400 text-white shadow-green-500/30' : 'bg-red-500 border-red-400 text-white shadow-red-500/30'}`}>
                  {statusMsg.type === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                  <span className="font-black text-[0.75rem] uppercase tracking-[0.2em] italic">{statusMsg.msg}</span>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}
