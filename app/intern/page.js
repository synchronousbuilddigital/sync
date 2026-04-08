"use client";

import { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Clock, MessageSquare, 
  Send, ListTodo, TrendingUp, AlertCircle,
  FileText, Calendar, PlusCircle, Activity
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

  const selectedTask = tasks.find(t => t._id === selectedTaskId);
  const chatTask = tasks.find(t => t._id === chatTaskId);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#050505]">
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
    if (typeof applyForLeave !== "function") {
      console.error("Critical: applyForLeave function is missing from AuthContext!");
      setStatusMsg({ type: "error", msg: "System Service Unavailable: Leave management offline." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await applyForLeave(leaveReq);
      if (res.success) {
        setStatusMsg({ type: "success", msg: "Holiday application submitted for review!" });
        setIsLeaveModalOpen(false);
        setLeaveReq({ startDate: "", endDate: "", reason: "" });
      } else {
        setStatusMsg({ type: "error", msg: res.message });
      }
    } catch (err) {
      setStatusMsg({ type: "error", msg: "Application delivery failed. Server unreachable." });
    }
    setSubmitting(false);
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

  const statusColors = {
    "Pending": "text-orange-500 bg-orange-500/10",
    "Complete": "text-green-500 bg-green-500/10",
    "Need Credentials": "text-red-500 bg-red-500/10",
    "Need Meeting": "text-blue-500 bg-blue-500/10",
  };

  const stats = {
    pending: tasks.filter(t => t.status === "Pending").length,
    completed: tasks.filter(t => t.status === "Complete").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
           <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-3 mb-6">
              <span className="bg-[#F05E23] text-white px-5 py-2 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest shadow-lg shadow-[#F05E23]/30">Intern Core</span>
              <span className="text-slate-400 font-bold uppercase tracking-widest text-[0.6rem] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live System V2.5
              </span>
           </motion.div>
           <h1 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase mb-4 leading-[0.8] transition-all">Mission: <span className="text-[#F05E23]">{user.name.split(' ')[0]}</span></h1>
           <p className="text-slate-500 dark:text-white/40 font-bold uppercase tracking-[0.2em] text-[0.65rem]">Architecting sustainable digital ecosystems.</p>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <button onClick={() => setIsLeaveModalOpen(true)} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] px-8 py-6 flex items-center gap-4 shadow-sm hover:scale-105 transition-all text-[#F05E23] font-black uppercase text-[0.65rem] tracking-widest">
               <Calendar className="w-5 h-5" /> Request Holiday
            </button>
            <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] p-6 flex items-center gap-6 shadow-sm min-w-[160px]">
              <div className="p-4 bg-orange-500/10 rounded-2xl"><Clock className="w-6 h-6 text-orange-500" /></div>
              <div>
                 <span className="block text-[0.55rem] font-black uppercase tracking-widest text-slate-400 mb-1">Queue</span>
                 <span className="font-black text-2xl leading-none">{stats.pending}</span>
              </div>
           </div>
           <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] p-6 flex items-center gap-6 shadow-sm min-w-[160px]">
              <div className="p-4 bg-green-500/10 rounded-2xl"><CheckCircle2 className="w-6 h-6 text-green-500" /></div>
              <div>
                 <span className="block text-[0.55rem] font-black uppercase tracking-widest text-slate-400 mb-1">Done</span>
                 <span className="font-black text-2xl leading-none">{stats.completed}</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Task List */}
        <div className="lg:col-span-8 space-y-6">
           <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 mb-8">
              <ListTodo className="w-8 h-8 text-[#F05E23]" /> Tactical Objectives
           </h2>

           <div className="space-y-6">
              {tasks.length === 0 ? (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-20 text-center border-2 border-dashed border-black/5 dark:border-white/10 rounded-[3rem]">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-6" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active assignments. Stand by for deployment.</p>
                 </motion.div>
              ) : (
                tasks.map((task, i) => (
                  <motion.div 
                    layout
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={task._id} 
                    className={`bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2.5rem] p-8 transition-all relative group overflow-hidden ${task.status === 'Complete' ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-2xl hover:scale-[1.01]'}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                       <div className="flex-grow space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                             <div className={`text-[0.6rem] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${priorityColors[task.priority] || priorityColors.Medium}`}>
                                {task.priority} Priority
                             </div>
                             {task.dueDate && (
                               <div className="text-[0.6rem] font-black px-4 py-1.5 rounded-full uppercase tracking-widest bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center gap-2">
                                 <Calendar className="w-3 h-3" /> Due: {new Date(task.dueDate).toLocaleDateString()}
                               </div>
                             )}
                          </div>
                          <h3 className="text-2xl font-black tracking-tight uppercase leading-none">{task.title}</h3>
                          <p className="text-sm text-slate-500 dark:text-white/40 font-medium leading-relaxed max-w-2xl">{task.description}</p>
                          
                           <div className="flex items-center gap-4 pt-4">
                              <button onClick={() => { setSelectedTaskId(task._id); setNote(task.note || ""); }} className="bg-[#F05E23] text-white px-6 py-3 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F05E23]/20">Update Progress</button>
                              <button onClick={() => setChatTaskId(task._id)} className="bg-slate-50 dark:bg-white/10 text-slate-600 dark:text-white px-6 py-3 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-white/20 transition-all">
                                 <MessageSquare className="w-4 h-4" /> Discussion ({task.discussion?.length || 0})
                              </button>
                              {task.meetingLink && (
                                <a href={task.meetingLink} target="_blank" className="bg-blue-500 text-white px-6 py-3 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-500/20">
                                   <Activity className="w-4 h-4" /> Join Sync Meeting
                                </a>
                              )}
                           </div>
                       </div>

                       <div className="flex flex-col items-center gap-3 min-w-[120px]">
                          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center border-4 ${task.status === 'Complete' ? 'border-green-500/20 text-green-500' : 'border-orange-500/20 text-orange-500 animate-pulse'}`}>
                             {task.status === 'Complete' ? <CheckCircle2 className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
                          </div>
                          <span className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">{task.status}</span>
                       </div>
                    </div>
                  </motion.div>
                ))
              )}
           </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-black dark:bg-white text-white dark:text-black rounded-[3rem] p-10 flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
              <TrendingUp className="absolute top-[-20px] right-[-20px] w-48 h-48 opacity-5 group-hover:scale-110 transition-transform duration-1000" />
              <h2 className="text-3xl font-black uppercase tracking-tight leading-none relative z-10">Performance <span className="text-[#F05E23]">Sync</span></h2>
              <div className="space-y-4 relative z-10">
                 <div className="h-8 w-full bg-white/10 dark:bg-black/10 rounded-2xl relative overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round((stats.completed / (tasks.length || 1)) * 100)}%` }} className="absolute inset-x-0 h-full bg-[#F05E23] rounded-full" />
                 </div>
                 <div className="flex justify-between items-center text-[0.7rem] font-black uppercase tracking-widest">
                    <span className="opacity-60">Objective Yield</span>
                    <span className="text-[#F05E23]">{Math.round((stats.completed / (tasks.length || 1)) * 100)}%</span>
                 </div>
              </div>
           </div>

           <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] p-8 shadow-sm">
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 mb-8">
                 <AlertCircle className="w-6 h-6 text-blue-500" /> Operational Log
              </h3>
              <div className="space-y-6">
                 {tasks.filter(t => t.status === 'Complete').slice(0, 4).map((t, i) => (
                    <div key={t._id} className="flex gap-4 group">
                       <div className="flex flex-col items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                          {i !== 3 && <div className="w-0.5 h-10 bg-slate-100 dark:bg-white/5 rounded-full" />}
                       </div>
                       <div className="pb-4">
                          <span className="block text-[0.55rem] font-black uppercase tracking-widest text-[#F05E23] mb-1">Finalized Objective</span>
                          <span className="text-xs font-bold leading-tight line-clamp-2 uppercase tracking-tight">{t.title}</span>
                          <span className="block text-[0.6rem] text-slate-400 mt-2 font-bold uppercase">Archive Ready</span>
                       </div>
                    </div>
                 ))}
                 {stats.completed === 0 && (
                   <div className="text-center py-10 opacity-30">
                      <FileText className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-[0.65rem] font-black uppercase tracking-widest">No archival data recorded.</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Holiday Status/History Section */}
           <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] p-8 shadow-sm">
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 mb-8">
                 <Calendar className="w-6 h-6 text-[#F05E23]" /> Holiday Ledger
              </h3>
              <div className="space-y-6">
                 {leaves.length === 0 ? (
                    <div className="text-center py-10 opacity-30">
                       <p className="text-[0.65rem] font-black uppercase tracking-widest">No holiday records found.</p>
                    </div>
                 ) : (
                    leaves.slice(0, 5).map((leave) => (
                       <div key={leave._id} className="border-b border-black/5 dark:border-white/5 pb-4 last:border-0">
                          <div className="flex justify-between items-center mb-1">
                             <span className="text-[0.55rem] font-black uppercase tracking-widest text-slate-400">
                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                             </span>
                             <span className={`text-[0.5rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                leave.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 
                                leave.status === 'Rejected' ? 'bg-red-500/10 text-red-500' : 
                                'bg-orange-500/10 text-orange-500'
                             }`}>
                                {leave.status}
                             </span>
                          </div>
                          <p className="text-xs font-bold uppercase tracking-tight line-clamp-1">{leave.reason}</p>
                          {leave.adminNote && (
                            <p className="text-[0.5rem] text-slate-400 mt-1 italic">Note: {leave.adminNote}</p>
                          )}
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Update Modal */}
      <AnimatePresence mode="wait">
        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
            <motion.div key="task-update-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-white dark:bg-[#0A0A0A] rounded-[3rem] p-12 shadow-2xl border border-white/10">
                <div className="bg-[#F05E23] w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 shadow-xl shadow-[#F05E23]/30">
                   <PlusCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tight mb-4 leading-none">Objective <span className="text-[#F05E23]">Status</span></h2>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-10">Updating tactical deployment for "{selectedTask.title}"</p>
                
                <div className="space-y-10">
                   <div className="space-y-4">
                     <label className="text-[0.65rem] font-black uppercase tracking-widest text-[#F05E23] pl-2">Select State</label>
                     <div className="grid grid-cols-2 gap-4">
                        {["Pending", "Complete", "Need Credentials", "Need Meeting"].map((status) => (
                           <button key={status} onClick={() => handleUpdateTask(selectedTask._id, status)} disabled={submitting} className={`py-5 px-6 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest border-2 transition-all ${selectedTask.status === status ? 'border-[#F05E23] bg-[#F05E23]/10 text-[#F05E23]' : 'border-black/5 dark:border-white/5 hover:border-[#F05E23]/50'}`}>
                              {status}
                           </button>
                        ))}
                     </div>
                   </div>

                   <div className="space-y-4">
                     <label className="text-[0.65rem] font-black uppercase tracking-widest text-[#F05E23] pl-2">Tactical Note / Blocker Detail</label>
                     <textarea rows={4} value={note} onChange={e => setNote(e.target.value)} placeholder="Provide specific details on progress or required intelligence..." className="w-full bg-slate-50 dark:bg-white/5 border-2 border-black/5 dark:border-white/5 rounded-[2rem] p-8 outline-none focus:border-[#F05E23] text-sm font-bold transition-all" />
                     <div className="flex gap-4">
                        <button onClick={() => setSelectedTaskId(null)} className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs border-2 border-black/5 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all">Cancel</button>
                        <button onClick={() => handleUpdateTask(selectedTask._id, selectedTask.status)} disabled={submitting} className="flex-[2] bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:opacity-90">{submitting ? "Processing..." : "Deploy Update"}</button>
                     </div>
                   </div>
                </div>
            </motion.div>
          </div>
        )}

        {/* Discussion Modal */}
        {chatTask && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
             <motion.div key="chat-modal" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative w-full max-w-2xl bg-white dark:bg-[#0A0A0A] rounded-[3rem] p-0 shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[80vh]">
                <div className="p-8 bg-[#F05E23] text-white flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-2xl"><MessageSquare className="w-6 h-6" /></div>
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Mission <span className="opacity-60">Log</span></h2>
                        <p className="text-[0.6rem] font-black uppercase tracking-widest opacity-60">Active Channel: {chatTask.title}</p>
                      </div>
                   </div>
                   <button onClick={() => setChatTaskId(null)} className="p-2 hover:bg-white/20 rounded-xl transition-all"><PlusCircle className="w-6 h-6 rotate-45" /></button>
                </div>

                <div className="flex-grow p-8 overflow-y-auto space-y-6 scrollbar-hide bg-slate-50 dark:bg-transparent">
                   {(chatTask.discussion || []).map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.sender === 'intern' ? 'items-end' : 'items-start'}`}>
                         <span className="text-[0.55rem] font-black uppercase tracking-widest text-slate-400 mb-2 px-2">{msg.sender === 'intern' ? 'YOU' : 'ADMIN'} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                         <div className={`max-w-[80%] p-5 rounded-3xl font-bold text-sm shadow-sm ${msg.sender === 'intern' ? 'bg-[#F05E23] text-white rounded-tr-none' : 'bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-tl-none text-slate-700 dark:text-white'}`}>
                            {msg.content}
                         </div>
                      </div>
                   ))}
                   {(chatTask.discussion || []).length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                         <MessageSquare className="w-16 h-16 mb-4" />
                         <p className="font-black uppercase tracking-widest text-xs">Awaiting operational dialogue.</p>
                      </div>
                   )}
                </div>

                <form onSubmit={handleSendChat} className="p-8 border-t border-black/5 dark:border-white/10 bg-white dark:bg-black/20">
                   <div className="flex gap-4">
                      <input type="text" value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="Enter briefing intel..." className="flex-grow bg-slate-50 dark:bg-white/5 border-2 border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#F05E23] font-bold text-sm" />
                      <button type="submit" className="bg-[#F05E23] text-white p-4 rounded-2xl shadow-lg shadow-[#F05E23]/30 hover:scale-105 active:scale-95 transition-all"><Send className="w-6 h-6" /></button>
                   </div>
                </form>
             </motion.div>
           </div>
        )}
        {/* Holiday Request Modal */}
        {isLeaveModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
              <motion.div key="leave-request-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-white dark:bg-[#0A0A0A] rounded-[3rem] p-12 shadow-2xl border border-white/10">
                 <h2 className="text-4xl font-black uppercase tracking-tight mb-8">Request <span className="text-[#F05E23]">Holiday</span></h2>
                 <form onSubmit={handleApplyLeave} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[0.6rem] font-black uppercase text-[#F05E23] pl-2">Start Date</label>
                          <input type="date" required value={leaveReq.startDate} onChange={e => setLeaveReq({...leaveReq, startDate: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none font-bold" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[0.6rem] font-black uppercase text-[#F05E23] pl-2">End Date</label>
                          <input type="date" required value={leaveReq.endDate} onChange={e => setLeaveReq({...leaveReq, endDate: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none font-bold" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[0.6rem] font-black uppercase text-[#F05E23] pl-2">Reason</label>
                       <textarea rows={4} required value={leaveReq.reason} onChange={e => setLeaveReq({...leaveReq, reason: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none font-bold placeholder:opacity-30" placeholder="State your reason for leave..." />
                    </div>
                    <div className="flex gap-4 pt-4">
                       <button type="button" onClick={() => setIsLeaveModalOpen(false)} className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs border border-black/10 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Cancel</button>
                       <button type="submit" disabled={submitting} className="flex-[2] bg-[#F05E23] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-[#F05E23]/20 hover:scale-[1.02] active:scale-95 transition-all">{submitting ? "Submitting..." : "Apply for Leave"}</button>
                    </div>
                 </form>
              </motion.div>
           </div>
        )}

        {statusMsg.msg && (
           <motion.div key="status-notification" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className={`fixed bottom-10 right-10 z-[200] p-6 rounded-3xl shadow-2xl flex items-center gap-4 border ${statusMsg.type === 'success' ? 'bg-green-500 border-green-400 text-white' : 'bg-red-500 border-red-400 text-white'}`}>
             <CheckCircle2 className="w-6 h-6" />
             <span className="font-black text-[0.7rem] uppercase tracking-[0.1em]">{statusMsg.msg}</span>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
