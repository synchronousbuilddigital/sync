"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
   CheckCircle2, Clock, MessageSquare,
   Send, ListTodo, TrendingUp, AlertCircle,
   FileText, Calendar, PlusCircle, Activity,
   Layout, ShieldCheck, ChevronDown, Plus, Zap,
   Shield, Globe, Terminal, ExternalLink, Key,
   Cpu as CpuIcon, Trophy, BookOpen, Newspaper, Box, 
   Sparkles, Target, Compass, HardDrive, Timer, X
} from "lucide-react";

export default function InternDashboard() {
   const { user, tasks, internProjects, leaves, updateTaskStatus, sendDiscussion, applyForLeave, loading, refreshInternData } = useAuth();
   
   useEffect(() => {
     if (user?.role === "intern" && refreshInternData) {
       refreshInternData();
     }
   }, [user, refreshInternData]);

   const [selectedTaskId, setSelectedTaskId] = useState(null);
   const [updatePostData, setUpdatePostData] = useState({ contentId: "", finalLink: "", postedLink: "", status: "", clientRemarks: "" });
   const [isUpdatingPost, setIsUpdatingPost] = useState(false);
   const [isSubmittingPostUpdate, setIsSubmittingPostUpdate] = useState(false);

   const [chatTaskId, setChatTaskId] = useState(null);
   const [note, setNote] = useState("");
   const [marketingForm, setMarketingForm] = useState({ editedLink: "", rawLink: "", editorStatus: "" });
   const [chatMsg, setChatMsg] = useState("");
   const [submitting, setSubmitting] = useState(false);
   const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
   const [leaveReq, setLeaveReq] = useState({ startDate: "", endDate: "", reason: "" });
   const [statusMsg, setStatusMsg] = useState({ type: "", msg: "" });
   const [aiSuggestion, setAiSuggestion] = useState("");
   const [resolving, setResolving] = useState(false);
   const [activeTool, setActiveTool] = useState(null);
   const [taskFilter, setTaskFilter] = useState("All");
   const [viewMode, setViewMode] = useState("cards");
   const [monthFilter, setMonthFilter] = useState("");
   const [dateFilterType, setDateFilterType] = useState("All");
   const [fromDate, setFromDate] = useState("");
   const [toDate, setToDate] = useState("");
   const { getAIBlockerSuggestion } = useAuth();

   const handleUpdatePost = async (e) => {
      e.preventDefault();
      setIsSubmittingPostUpdate(true);
      try {
         const res = await fetch("/api/intern/post-tracker", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatePostData)
         });
         
         if (res.ok) {
            setIsUpdatingPost(false);
            window.location.reload();
         } else {
            const data = await res.json();
            alert(data.error || "Failed to update post");
         }
      } catch (error) {
         console.error("Error updating post:", error);
         alert("An error occurred");
      } finally {
         setIsSubmittingPostUpdate(false);
      }
   };

   const selectedTask = tasks.find(t => t._id === selectedTaskId);
   const myTasks = tasks.filter(t => {
     if (t.internId?._id !== user?._id && t.internId !== user?._id) return false;

     if (monthFilter !== "" || dateFilterType !== "All" || fromDate || toDate) {
       const dStr = t.dueDate || t.marketingData?.postTracker?.scheduledDate || t.createdAt;
       let d = null;
       if (dStr) {
         d = new Date(dStr);
         if (isNaN(d.getTime())) {
           const parts = String(dStr).trim().match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
           if (parts) {
             let year = parseInt(parts[3], 10);
             if (year < 100) year += 2000;
             d = new Date(year, parseInt(parts[2], 10) - 1, parseInt(parts[1], 10));
             if (isNaN(d.getTime())) d = null;
           } else {
             d = null;
           }
         }
       }
       const sheetMonth = t.marketingData?.postTracker?.month || "";

       if (monthFilter !== "") {
         const mIndex = parseInt(monthFilter, 10);
         const monthsFull = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
         const monthsShort = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
         const targetFull = monthsFull[mIndex];
         const targetShort = monthsShort[mIndex];
         const targetNum = (mIndex + 1).toString();
         const targetNumPad = targetNum.padStart(2, "0");

         let monthMatched = false;
         if (d && d.getMonth() === mIndex) monthMatched = true;
         if (!monthMatched && sheetMonth) {
           const sStr = String(sheetMonth).trim().toLowerCase();
           if (sStr === targetFull || sStr === targetShort || sStr === targetNum || sStr === targetNumPad || sStr.includes(targetFull) || sStr.includes(targetShort)) {
             monthMatched = true;
           }
         }
         if (!monthMatched) return false;
       }

       if (dateFilterType !== "All" || fromDate || toDate) {
         if (!d) return false;
         const now = new Date();
         if (dateFilterType === "Today" && d.toDateString() !== now.toDateString()) return false;
         if (dateFilterType === "This Week") {
           const firstDay = new Date(now);
           firstDay.setHours(0, 0, 0, 0);
           firstDay.setDate(now.getDate() - now.getDay());
           const lastDay = new Date(firstDay);
           lastDay.setDate(firstDay.getDate() + 6);
           lastDay.setHours(23, 59, 59, 999);
           if (d < firstDay || d > lastDay) return false;
         }
         if (dateFilterType === "This Month" && (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear())) return false;
         if (fromDate && new Date(fromDate + "T00:00:00") > d) return false;
         if (toDate && new Date(toDate + "T23:59:59") < d) return false;
       }
     }
     return true;
   });

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
      await updateTaskStatus(taskId, status, note, undefined, user.department === 'Digital Marketing' ? marketingForm : undefined);
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
      pending: myTasks.filter(t => t.status !== "Complete").length,
      completedMonthly: myTasks.filter(t => t.status === "Complete" && isCurrentMonth(t.updatedAt || t.createdAt)).length,
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
               <p className="text-slate-500 dark:text-white/40 font-bold uppercase tracking-[0.4em] text-[0.6rem] mb-6">Bringing ideas to life together.</p>
               <div className="relative inline-block group cursor-default">
                 <div className="absolute -inset-1 bg-gradient-to-r from-[#F05E23] via-amber-500 to-[#F05E23] rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
                 <span className="relative flex items-center gap-2 px-6 py-2.5 rounded-full text-[0.7rem] font-black uppercase tracking-[0.25em] bg-gradient-to-r from-[#F05E23] to-[#FF7A45] text-white shadow-xl shadow-[#F05E23]/30 border border-white/20 whitespace-nowrap">
                   <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                   {user?.department || "Tech"} Unit
                 </span>
               </div>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 w-full md:w-auto">
               <button onClick={() => setIsLeaveModalOpen(true)} className="col-span-2 sm:col-span-1 justify-center bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl sm:rounded-[2rem] px-6 sm:px-8 py-4 sm:py-6 flex items-center gap-3 sm:gap-4 shadow-sm hover:scale-105 transition-all text-[#F05E23] font-black uppercase text-[0.6rem] sm:text-[0.65rem] tracking-widest">
                  <Calendar className="w-4 sm:w-5 h-4 sm:h-5" /> Request Leave
               </button>
               <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 flex items-center gap-3 sm:gap-6 shadow-sm">
                  <div className="p-3 sm:p-4 bg-orange-500/10 rounded-xl sm:rounded-2xl"><Clock className="w-5 sm:w-6 h-5 sm:h-6 text-orange-500" /></div>
                  <div>
                     <span className="block text-[0.5rem] sm:text-[0.55rem] font-black uppercase tracking-widest text-slate-400 mb-1">Active</span>
                     <span className="font-black text-xl sm:text-2xl leading-none">{stats.pending}</span>
                  </div>
               </div>
               <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 flex items-center gap-3 sm:gap-6 shadow-sm">
                  <div className="p-3 sm:p-4 bg-green-500/10 rounded-xl sm:rounded-2xl"><CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-green-500" /></div>
                  <div>
                     <span className="block text-[0.5rem] sm:text-[0.55rem] font-black uppercase tracking-widest text-slate-400 mb-1">Monthly Score</span>
                     <span className="font-black text-xl sm:text-2xl leading-none">{stats.completedMonthly}</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Primary Hub (Left) */}
            <div className={`space-y-16 transition-all duration-500 ${viewMode === "spreadsheet" ? "lg:col-span-12" : "lg:col-span-8"}`}>

               {/* Task Filters */}
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full pb-2">
                 <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full sm:w-auto pb-1">
                  {["All", "Pending", "In Progress", "Completed", "Post Tracker"].map(filter => (
                     <button 
                        key={filter} 
                        onClick={() => setTaskFilter(filter)}
                        className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[0.6rem] sm:text-[0.65rem] font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${
                           taskFilter === filter 
                           ? 'bg-[#F05E23] text-white shadow-lg shadow-[#F05E23]/30' 
                           : 'bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-500 hover:border-[#F05E23]/30 hover:text-slate-800 dark:hover:text-white'
                        }`}
                     >
                        {filter}
                     </button>
                  ))}
                 </div>
                 <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
                   <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
                     <button 
                     onClick={() => setViewMode("cards")}
                     className={`p-2 rounded-lg transition-all ${viewMode === "cards" ? "bg-[#F05E23] text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                   >
                     <Layout className="w-4 h-4" />
                   </button>
                   <button 
                     onClick={() => setViewMode("spreadsheet")}
                     className={`p-2 rounded-lg transition-all ${viewMode === "spreadsheet" ? "bg-[#F05E23] text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                   >
                     <ListTodo className="w-4 h-4" />
                   </button>
                 </div>
               </div>

               {/* Date & Month Filter Bar */}
               <div className="flex flex-wrap items-center gap-3 pt-2">
                 <select
                   value={monthFilter}
                   onChange={(e) => setMonthFilter(e.target.value)}
                   className="px-4 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer border bg-white dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-700 dark:text-white transition-all"
                 >
                   <option value="">All Months</option>
                   {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, idx) => (
                     <option key={idx} value={idx.toString()}>{m}</option>
                   ))}
                 </select>

                 <div className="flex items-center p-1 rounded-xl border bg-white dark:bg-white/5 border-black/5 dark:border-white/10">
                   {["All", "Today", "This Week", "This Month"].map((type) => (
                     <button
                       key={type}
                       onClick={() => { setDateFilterType(type); setFromDate(""); setToDate(""); }}
                       className={`px-3 py-1.5 rounded-lg text-[0.65rem] font-black uppercase tracking-widest transition-all ${dateFilterType === type && !fromDate && !toDate ? "bg-[#F05E23] text-white shadow-sm" : "text-slate-400 hover:text-slate-700 dark:hover:text-white"}`}
                     >
                       {type}
                     </button>
                   ))}
                 </div>

                 <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold bg-white dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-700 dark:text-white">
                   <span className="text-[0.65rem] text-slate-400 uppercase tracking-widest font-black">From</span>
                   <input
                     type="date"
                     value={fromDate}
                     onChange={(e) => { setFromDate(e.target.value); setDateFilterType("Custom"); }}
                     className="bg-transparent outline-none text-xs font-bold cursor-pointer"
                   />
                   <span className="text-[0.65rem] text-slate-400 uppercase tracking-widest font-black ml-1">To</span>
                   <input
                     type="date"
                     value={toDate}
                     onChange={(e) => { setToDate(e.target.value); setDateFilterType("Custom"); }}
                     className="bg-transparent outline-none text-xs font-bold cursor-pointer"
                   />
                 </div>

                 {(monthFilter !== "" || dateFilterType !== "All" || fromDate || toDate) && (
                   <button
                     onClick={() => { setMonthFilter(""); setDateFilterType("All"); setFromDate(""); setToDate(""); }}
                     className="text-xs font-bold text-[#F05E23] underline underline-offset-2 ml-1"
                   >
                     Clear Date Filter
                   </button>
                 )}
               </div>
             </div>

               {viewMode === "cards" && (<>
               {/* Active Projects */}
               {(taskFilter === "All" || taskFilter === "In Progress" || taskFilter === "Pending") && (
                  internProjects.length === 0 && myTasks.filter(t => !t.clientProjectId).length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-24 text-center border-2 border-dashed border-black/5 dark:border-white/10 rounded-[4rem] bg-white/5">
                     <Activity className="w-16 h-16 text-slate-300 mx-auto mb-6 opacity-20" />
                     <p className="text-slate-400 font-black uppercase tracking-widest text-[0.65rem]">No active projects assigned at this time.</p>
                  </motion.div>
               ) : (
                  <div className="space-y-16">
                     {internProjects.map((project) => {
                        const projectTasks = myTasks.filter(t => t.clientProjectId?._id === project._id || t.clientProjectId === project._id);
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
                                                   <div className="flex items-center gap-3 flex-wrap">
                                                      <div className="flex justify-between items-start mb-6">
                                                         <div className={`text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${priorityColors[task.priority] || priorityColors.Medium}`}>
                                                            {task.priority}
                                                         </div>
                                                         {task.createdAt && <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-4">Created: {new Date(task.createdAt).toLocaleDateString()}</span>}
                                                      </div>
                                                      {task.contentId && (
                                                         <div className="text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest bg-[#F05E23]/10 text-[#F05E23]">
                                                            {task.contentId}
                                                         </div>
                                                      )}
                                                      {task.marketingData?.companyId?.name && (
                                                         <div className="text-[7px] font-black uppercase tracking-widest text-slate-500">
                                                            {task.marketingData.companyId.name}
                                                         </div>
                                                      )}
                                                   </div>
                                                   <h4 className="text-xl font-black uppercase tracking-tighter italic leading-none">{task.title}</h4>
                                                   <p className="text-[11px] text-slate-500 font-bold italic">&quot;{task.description}&quot;</p>
                                                   {task.marketingData && (
                                                      <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl space-y-2 w-full max-w-sm">
                                                         {task.marketingData.topic && (
                                                            <p className="text-[0.65rem] font-bold text-slate-300 italic text-[#F05E23]">{task.marketingData.topic}</p>
                                                         )}
                                                         {task.marketingData.rawLink && (
                                                            <a href={task.marketingData.rawLink} target="_blank" rel="noopener noreferrer" className="text-[0.6rem] font-black uppercase text-blue-400 hover:underline flex items-center gap-1">
                                                               <ExternalLink className="w-3 h-3" /> Raw Asset
                                                            </a>
                                                         )}
                                                         {task.marketingData.editedLink && (
                                                            <a href={task.marketingData.editedLink} target="_blank" rel="noopener noreferrer" className="text-[0.6rem] font-black uppercase text-purple-400 hover:underline flex items-center gap-1">
                                                               <ExternalLink className="w-3 h-3" /> Edited Output
                                                            </a>
                                                         )}
                                                         {task.marketingData.platforms && task.marketingData.platforms.length > 0 && (
                                                            <div className="flex gap-2 pt-1 flex-wrap">
                                                               {task.marketingData.platforms.map(p => (
                                                                  <span key={p} className="text-[0.5rem] font-black uppercase tracking-widest px-2 py-1 bg-[#F05E23]/20 text-[#F05E23] rounded">{p}</span>
                                                               ))}
                                                            </div>
                                                         )}
                                                         {(task.marketingData.editorStatus || task.marketingData.reviewStatus) && (
                                                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-white/10">
                                                               {task.marketingData.editorStatus && (
                                                                  <div className="text-[0.5rem] font-black uppercase tracking-widest text-slate-500">
                                                                     Edit: <span className={task.marketingData.editorStatus === 'Completed' ? 'text-green-500' : 'text-amber-500'}>{task.marketingData.editorStatus}</span>
                                                                  </div>
                                                               )}
                                                               {task.marketingData.reviewStatus && (
                                                                  <div className="text-[0.5rem] font-black uppercase tracking-widest text-slate-500">
                                                                     Rev: <span className={task.marketingData.reviewStatus === 'Approved' ? 'text-green-500' : 'text-red-500'}>{task.marketingData.reviewStatus}</span>
                                                                  </div>
                                                               )}
                                                            </div>
                                                         )}
                                                      </div>
                                                   )}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                   <button onClick={() => { setSelectedTaskId(task._id); setNote(task.note || ""); setMarketingForm({ editedLink: task.marketingData?.editedLink || "", rawLink: task.marketingData?.rawLink || "", editorStatus: task.marketingData?.editorStatus || "" }); }} className="text-[8px] font-black uppercase text-blue-500 hover:scale-110 transition-transform">Update</button>
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
               ))}

               {/* Pending Tasks */}
                     {(taskFilter === "All" || taskFilter === "Pending") && myTasks.filter(t => !t.clientProjectId && (t.status === 'Pending' || t.status === 'Need Credentials' || t.status === 'Need Meeting')).length > 0 && (
                        <section className="space-y-10 pt-10">
                           <div className="flex items-center gap-6">
                              <h2 className="text-3xl font-black uppercase tracking-tighter italic">Pending <span className="text-red-500">Tasks</span></h2>
                              <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {myTasks.filter(t => !t.clientProjectId && (t.status === 'Pending' || t.status === 'Need Credentials' || t.status === 'Need Meeting')).map((task) => (
                                 <div key={task._id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] p-10">
                                    <div className="flex justify-between items-start mb-6">
                                       <div className="flex items-center gap-2">
                                          <div className={`text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${priorityColors[task.priority] || priorityColors.Medium}`}>
                                             {task.priority}
                                          </div>
                                          {(task.marketingData?.companyId?.name || task.marketingData?.postTracker?.companyName) && (
                                             <div className="text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                                                {task.marketingData?.companyId?.name || task.marketingData?.postTracker?.companyName}
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-3">{task.title}</h3>
                                    <p className="text-xs text-slate-500 font-bold italic mb-8">&quot;{task.description}&quot;</p>
                                    {task.marketingData && (
                                       <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                                          {task.marketingData.topic && (
                                             <p className="text-xs font-bold text-slate-300 italic text-[#F05E23]">{task.marketingData.topic}</p>
                                          )}
                                          {task.marketingData.rawLink && (
                                             <a href={task.marketingData.rawLink} target="_blank" rel="noopener noreferrer" className="text-[0.65rem] font-black uppercase text-blue-400 hover:underline flex items-center gap-1">
                                                <ExternalLink className="w-3 h-3" /> Access Raw Asset
                                             </a>
                                          )}
                                          {task.marketingData.editedLink && (
                                             <a href={task.marketingData.editedLink} target="_blank" rel="noopener noreferrer" className="text-[0.65rem] font-black uppercase text-purple-400 hover:underline flex items-center gap-1">
                                                <ExternalLink className="w-3 h-3" /> Edited Output
                                             </a>
                                          )}
                                          {task.marketingData.platforms && task.marketingData.platforms.length > 0 && (
                                             <div className="flex gap-2 pt-1 flex-wrap">
                                                {task.marketingData.platforms.map(p => (
                                                   <span key={p} className="text-[0.55rem] font-black uppercase tracking-widest px-2 py-1 bg-[#F05E23]/20 text-[#F05E23] rounded">{p}</span>
                                                ))}
                                             </div>
                                          )}
                                          {(task.marketingData.editorStatus || task.marketingData.reviewStatus) && (
                                             <div className="flex justify-between items-center pt-3 mt-3 border-t border-white/10">
                                                {task.marketingData.editorStatus && (
                                                   <div className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">
                                                      Edit: <span className={task.marketingData.editorStatus === 'Completed' ? 'text-green-500' : 'text-amber-500'}>{task.marketingData.editorStatus}</span>
                                                   </div>
                                                )}
                                                {task.marketingData.reviewStatus && (
                                                   <div className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">
                                                      Rev: <span className={task.marketingData.reviewStatus === 'Approved' ? 'text-green-500' : 'text-red-500'}>{task.marketingData.reviewStatus}</span>
                                                   </div>
                                                )}
                                             </div>
                                          )}
                                          {task.contentId && (
                                             <div className="pt-3 mt-3 border-t border-white/10 flex flex-col gap-1.5">
                                                <div className="flex justify-between items-center text-[0.6rem] font-black uppercase tracking-widest text-slate-400">
                                                   <span>Scheduled: <span className="text-[#F05E23]">{task.marketingData?.postTracker?.scheduledDate || "TBA"}</span></span>
                                                   <span>Status: <span className={task.marketingData?.postTracker?.status?.includes('Posted') ? 'text-green-500' : 'text-amber-500'}>{task.marketingData?.postTracker?.status || "Pending"}</span></span>
                                                </div>
                                                <div className="flex justify-between items-center text-[0.6rem] font-black uppercase tracking-widest text-slate-400">
                                                   <span>Type: {task.marketingData?.postTracker?.postType || "-"}</span>
                                                   {task.marketingData?.postTracker?.postedLink && task.marketingData?.postTracker?.postedLink.trim() !== "" && (
                                                      <a href={task.marketingData?.postTracker?.postedLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Post</a>
                                                   )}
                                                   <button onClick={() => {
                                                      setUpdatePostData({
                                                         contentId: task.contentId,
                                                         finalLink: task.marketingData?.postTracker?.finalLink || "",
                                                         postedLink: task.marketingData?.postTracker?.postedLink || "",
                                                         status: task.marketingData?.postTracker?.status || "Pending",
                                                         clientRemarks: task.marketingData?.postTracker?.clientRemarks || ""
                                                      });
                                                      setIsUpdatingPost(true);
                                                   }} className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-105 transition-all text-white rounded font-black uppercase tracking-widest text-[0.45rem]">
                                                      Update Live Post
                                                   </button>
                                                </div>
                                             </div>
                                          )}
                                       </div>
                                    )}
                                    <div className="flex items-center gap-6 pt-6 border-t border-black/5 dark:border-white/5">
                                       <button onClick={() => { setSelectedTaskId(task._id); setNote(task.note || ""); setMarketingForm({ editedLink: task.marketingData?.editedLink || "", rawLink: task.marketingData?.rawLink || "", editorStatus: task.marketingData?.editorStatus || "" }); }} className="text-[9px] font-black uppercase text-[#F05E23]">Update</button>
                                       <button onClick={() => setChatTaskId(task._id)} className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-2">
                                          <MessageSquare className="w-4 h-4" /> Chat ({task.discussion?.length || 0})
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </section>
                     )}

               {/* In Progress Tasks */}
                     {(taskFilter === "All" || taskFilter === "In Progress") && myTasks.filter(t => !t.clientProjectId && t.status === 'In Progress').length > 0 && (
                        <section className="space-y-10 pt-10">
                           <div className="flex items-center gap-6">
                              <h2 className="text-3xl font-black uppercase tracking-tighter italic">In-Progress <span className="text-[#F05E23]">Tasks</span></h2>
                              <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {myTasks.filter(t => !t.clientProjectId && t.status === 'In Progress').map((task) => (
                                 <div key={task._id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] p-10">
                                    <div className="flex justify-between items-start mb-6">
                                       <div className="flex items-center gap-2">
                                          <div className={`text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${priorityColors[task.priority] || priorityColors.Medium}`}>
                                             {task.priority}
                                          </div>
                                          {(task.marketingData?.companyId?.name || task.marketingData?.postTracker?.companyName) && (
                                             <div className="text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                                                {task.marketingData?.companyId?.name || task.marketingData?.postTracker?.companyName}
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-3">{task.title}</h3>
                                    <p className="text-xs text-slate-500 font-bold italic mb-8">&quot;{task.description}&quot;</p>
                                    {task.marketingData && (
                                       <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                                          {task.marketingData.topic && (
                                             <p className="text-xs font-bold text-slate-300 italic text-[#F05E23]">{task.marketingData.topic}</p>
                                          )}
                                          {task.marketingData.rawLink && (
                                             <a href={task.marketingData.rawLink} target="_blank" rel="noopener noreferrer" className="text-[0.65rem] font-black uppercase text-blue-400 hover:underline flex items-center gap-1">
                                                <ExternalLink className="w-3 h-3" /> Access Raw Asset
                                             </a>
                                          )}
                                          {task.marketingData.editedLink && (
                                             <a href={task.marketingData.editedLink} target="_blank" rel="noopener noreferrer" className="text-[0.65rem] font-black uppercase text-purple-400 hover:underline flex items-center gap-1">
                                                <ExternalLink className="w-3 h-3" /> Edited Output
                                             </a>
                                          )}
                                          {task.marketingData.platforms && task.marketingData.platforms.length > 0 && (
                                             <div className="flex gap-2 pt-1 flex-wrap">
                                                {task.marketingData.platforms.map(p => (
                                                   <span key={p} className="text-[0.55rem] font-black uppercase tracking-widest px-2 py-1 bg-[#F05E23]/20 text-[#F05E23] rounded">{p}</span>
                                                ))}
                                             </div>
                                          )}
                                          {(task.marketingData.editorStatus || task.marketingData.reviewStatus) && (
                                             <div className="flex justify-between items-center pt-3 mt-3 border-t border-white/10">
                                                {task.marketingData.editorStatus && (
                                                   <div className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">
                                                      Edit: <span className={task.marketingData.editorStatus === 'Completed' ? 'text-green-500' : 'text-amber-500'}>{task.marketingData.editorStatus}</span>
                                                   </div>
                                                )}
                                                {task.marketingData.reviewStatus && (
                                                   <div className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">
                                                      Rev: <span className={task.marketingData.reviewStatus === 'Approved' ? 'text-green-500' : 'text-red-500'}>{task.marketingData.reviewStatus}</span>
                                                   </div>
                                                )}
                                             </div>
                                          )}
                                          {task.contentId && (
                                             <div className="pt-3 mt-3 border-t border-white/10 flex flex-col gap-1.5">
                                                <div className="flex justify-between items-center text-[0.6rem] font-black uppercase tracking-widest text-slate-400">
                                                   <span>Scheduled: <span className="text-[#F05E23]">{task.marketingData?.postTracker?.scheduledDate || "TBA"}</span></span>
                                                   <span>Status: <span className={task.marketingData?.postTracker?.status?.includes('Posted') ? 'text-green-500' : 'text-amber-500'}>{task.marketingData?.postTracker?.status || "Pending"}</span></span>
                                                </div>
                                                <div className="flex justify-between items-center text-[0.6rem] font-black uppercase tracking-widest text-slate-400">
                                                   <span>Type: {task.marketingData?.postTracker?.postType || "-"}</span>
                                                   {task.marketingData?.postTracker?.postedLink && task.marketingData?.postTracker?.postedLink.trim() !== "" && (
                                                      <a href={task.marketingData?.postTracker?.postedLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Post</a>
                                                   )}
                                                   <button onClick={() => {
                                                      setUpdatePostData({
                                                         contentId: task.contentId,
                                                         finalLink: task.marketingData?.postTracker?.finalLink || "",
                                                         postedLink: task.marketingData?.postTracker?.postedLink || "",
                                                         status: task.marketingData?.postTracker?.status || "Pending",
                                                         clientRemarks: task.marketingData?.postTracker?.clientRemarks || ""
                                                      });
                                                      setIsUpdatingPost(true);
                                                   }} className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-105 transition-all text-white rounded font-black uppercase tracking-widest text-[0.45rem]">
                                                      Update Live Post
                                                   </button>
                                                </div>
                                             </div>
                                          )}
                                       </div>
                                    )}
                                    <div className="flex items-center gap-6 pt-6 border-t border-black/5 dark:border-white/5">
                                       <button onClick={() => { setSelectedTaskId(task._id); setNote(task.note || ""); setMarketingForm({ editedLink: task.marketingData?.editedLink || "", rawLink: task.marketingData?.rawLink || "", editorStatus: task.marketingData?.editorStatus || "" }); }} className="text-[9px] font-black uppercase text-[#F05E23]">Update</button>
                                       <button onClick={() => setChatTaskId(task._id)} className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-2">
                                          <MessageSquare className="w-4 h-4" /> Chat ({task.discussion?.length || 0})
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </section>
                     )}

                     {(taskFilter === "Post Tracker") && myTasks.filter(t => t.contentId).length > 0 && (
                        <div className="space-y-6 pt-10 border-t border-white/5">
                           <div className="flex items-center gap-4 mb-8">
                              <h2 className="text-3xl font-black uppercase tracking-tighter italic">Post <span className="text-[#F05E23]">Tracker</span></h2>
                              <div className="h-px bg-white/10 flex-1" />
                              <span className="text-[0.6rem] font-black uppercase tracking-widest text-slate-500">{myTasks.filter(t => t.contentId).length} Tasks</span>
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              {myTasks.filter(t => t.contentId).map((task) => (
                                 <div key={task._id} className="group bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] p-10 hover:border-[#F05E23]/30 transition-all shadow-sm relative overflow-hidden flex flex-col min-h-[320px]">
                                    <div className="flex-1">
                                       <div className="flex justify-between items-start mb-6">
                                          <div className="flex items-center gap-2">
                                             <span className="text-[0.55rem] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border bg-[#F05E23]/10 border-[#F05E23]/20 text-[#F05E23]">
                                                {task.priority}
                                             </span>
                                             {(task.marketingData?.companyId?.name || task.marketingData?.postTracker?.companyName) && (
                                                <div className="text-[0.55rem] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                                                   {task.marketingData?.companyId?.name || task.marketingData?.postTracker?.companyName}
                                                </div>
                                             )}
                                          </div>
                                       </div>
                                       
                                       <div className="flex justify-between items-start mb-2 gap-2">
                                          <h4 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
                                             <span>{task.title}</span>
                                          </h4>
                                          {task.contentId && (
                                             <span className="text-[10px] font-black uppercase tracking-widest text-[#F05E23] px-2 py-1 bg-[#F05E23]/10 rounded-md border border-[#F05E23]/20 shrink-0">
                                                {task.contentId}
                                             </span>
                                          )}
                                       </div>
                                       
                                       <p className="text-[0.65rem] text-slate-500 font-bold uppercase tracking-widest leading-relaxed mb-4 line-clamp-2">
                                          "{task.description}"
                                       </p>

                                       {task.marketingData?.platforms?.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mb-6">
                                             {task.marketingData.platforms.map((platform, idx) => (
                                                <span key={idx} className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border bg-blue-500/10 border-blue-500/20 text-blue-400">
                                                   {platform}
                                                </span>
                                             ))}
                                          </div>
                                       )}

                                       {task.contentId && (
                                          <div className="pt-3 mt-3 border-t border-white/10 flex flex-col gap-1.5">
                                             <div className="flex justify-between items-center text-[0.6rem] font-black uppercase tracking-widest text-slate-400">
                                                <span>Scheduled: <span className="text-[#F05E23]">{task.marketingData?.postTracker?.scheduledDate || "TBA"}</span></span>
                                                <span>Status: <span className={task.marketingData?.postTracker?.status?.includes('Posted') ? 'text-green-500' : 'text-amber-500'}>{task.marketingData?.postTracker?.status || "Pending"}</span></span>
                                             </div>
                                             <div className="flex justify-between items-center text-[0.6rem] font-black uppercase tracking-widest text-slate-400">
                                                <span>Type: {task.marketingData?.postTracker?.postType || "-"}</span>
                                                {task.marketingData?.postTracker?.postedLink && task.marketingData?.postTracker?.postedLink.trim() !== "" && (
                                                   <a href={task.marketingData.postTracker.postedLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Post</a>
                                                )}
                                                <button onClick={() => {
                                                   setUpdatePostData({
                                                      contentId: task.contentId,
                                                      finalLink: task.marketingData?.postTracker?.finalLink || "",
                                                      postedLink: task.marketingData?.postTracker?.postedLink || "",
                                                      status: task.marketingData?.postTracker?.status || "Pending",
                                                      clientRemarks: task.marketingData?.postTracker?.clientRemarks || ""
                                                   });
                                                   setIsUpdatingPost(true);
                                                }} className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-105 transition-all text-white rounded font-black uppercase tracking-widest text-[0.45rem]">
                                                   Update Live Post
                                                </button>
                                             </div>
                                          </div>
                                       )}
                                    </div>

                                    <div className="flex items-center gap-6 pt-6 border-t border-black/5 dark:border-white/5">
                                       <button onClick={() => setSelectedTaskId(task._id)} className="text-[9px] font-black uppercase text-[#F05E23] hover:text-[#F05E23]/80 transition-colors tracking-widest">
                                          Update
                                       </button>
                                       <button onClick={() => setChatTaskId(task._id)} className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-2 hover:text-[#F05E23] transition-colors">
                                          <MessageSquare className="w-4 h-4" /> Chat ({task.discussion?.length || 0})
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {(taskFilter === "All" || taskFilter === "Completed") && myTasks.filter(t => t.status === 'Complete').length > 0 && (
                        <section className="space-y-10 pt-10">
                           <div className="flex items-center gap-6">
                              <h2 className="text-3xl font-black uppercase tracking-tighter italic">Task <span className="text-green-500">History</span></h2>
                              <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {myTasks.filter(t => t.status === 'Complete').map((task) => (
                                 <div key={task._id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] p-10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                       <div className="flex items-center gap-2">
                                          <div className={`text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${priorityColors[task.priority] || priorityColors.Medium}`}>
                                             {task.priority}
                                          </div>
                                          {(task.marketingData?.companyId?.name || task.marketingData?.postTracker?.companyName) && (
                                             <div className="text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                                                {task.marketingData?.companyId?.name || task.marketingData?.postTracker?.companyName}
                                             </div>
                                          )}
                                       </div>
                                       <span className="text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-green-500/30 text-green-500 bg-green-500/10">Complete</span>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-3">{task.title}</h3>
                                    <p className="text-xs text-slate-500 font-bold italic mb-8">&quot;{task.description}&quot;</p>
                                    {task.marketingData && (
                                       <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                                          {task.marketingData.topic && (
                                             <p className="text-xs font-bold text-slate-300 italic text-[#F05E23]">{task.marketingData.topic}</p>
                                          )}
                                          {task.marketingData.rawLink && (
                                             <a href={task.marketingData.rawLink} target="_blank" rel="noopener noreferrer" className="text-[0.65rem] font-black uppercase text-blue-400 hover:underline flex items-center gap-1">
                                                <ExternalLink className="w-3 h-3" /> Raw Asset
                                             </a>
                                          )}
                                          {task.marketingData.editedLink && (
                                             <a href={task.marketingData.editedLink} target="_blank" rel="noopener noreferrer" className="text-[0.65rem] font-black uppercase text-purple-400 hover:underline flex items-center gap-1">
                                                <ExternalLink className="w-3 h-3" /> Final Output
                                             </a>
                                          )}
                                          {task.marketingData.reviewRemarks && (
                                             <p className="text-[0.6rem] font-bold text-slate-400 italic">Admin Feedback: <span className="text-white">{task.marketingData.reviewRemarks}</span></p>
                                          )}
                                          {task.marketingData.reviewStatus && (
                                             <div className="flex justify-between items-center pt-3 mt-3 border-t border-white/10">
                                                <div className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">
                                                   Rev: <span className={task.marketingData.reviewStatus === 'Approved' ? 'text-green-500' : 'text-red-500'}>{task.marketingData.reviewStatus}</span>
                                                </div>
                                             </div>
                                          )}
                                       </div>
                                    )}
                                    <div className="flex items-center gap-6 pt-6 border-t border-black/5 dark:border-white/5">
                                       <button onClick={() => setChatTaskId(task._id)} className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-2 hover:text-[#F05E23] transition-colors">
                                          <MessageSquare className="w-4 h-4" /> View Chat ({task.discussion?.length || 0})
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </section>
                     )}
               </>)}

               {viewMode === "spreadsheet" && (
                  <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                           <thead>
                              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-900 text-white dark:bg-black/60">
                                 <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-200 dark:text-slate-400">Task Title</th>
                                 <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-200 dark:text-slate-400">Department</th>
                                 <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-200 dark:text-slate-400">Status</th>
                                 <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-200 dark:text-slate-400">Project</th>
                                 <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-200 dark:text-slate-400">Platforms</th>
                                 <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-200 dark:text-slate-400">Post Tracking</th>
                                 <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-200 dark:text-slate-400">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                              {myTasks.filter(t => taskFilter === "All" || 
                                 (taskFilter === "Pending" && (t.status === "Pending" || t.status === "Need Credentials" || t.status === "Need Meeting")) ||
                                 (taskFilter === "In Progress" && t.status === "In Progress") ||
                                 (taskFilter === "Completed" && t.status === "Complete") ||
                                 (taskFilter === "Post Tracker" && t.contentId)
                              ).map((task) => (
                                 <tr key={task._id} className="group hover:bg-slate-50 dark:hover:bg-white/5 bg-white dark:bg-transparent transition-colors">
                                    <td className="px-8 py-6">
                                       <div className="flex items-center gap-3">
                                          {task.contentId && <span className="text-[9px] font-black uppercase tracking-widest text-[#F05E23] px-2 py-1 bg-[#F05E23]/10 rounded-md border border-[#F05E23]/20 shrink-0">{task.contentId}</span>}
                                          <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#F05E23] transition-colors">{task.title}</span>
                                       </div>
                                    </td>
                                    <td className="px-8 py-6">
                                       <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                                          {task.marketingData?.departmentId?.name || task.marketingData?.postTracker?.postType || "-"}
                                       </span>
                                    </td>
                                    <td className="px-8 py-6">
                                       <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${task.status === 'Complete' ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400 font-black' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 font-black'}`}>
                                          {task.status}
                                       </span>
                                    </td>
                                    <td className="px-8 py-6">
                                       <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                          {task.clientProjectId?.projectName || "-"}
                                       </span>
                                    </td>
                                    <td className="px-8 py-6">
                                       {task.marketingData?.platforms?.length > 0 ? (
                                          <div className="flex flex-wrap gap-1">
                                             {task.marketingData.platforms.map((p, idx) => (
                                                <span key={idx} className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border bg-blue-500/10 border-blue-500/20 text-blue-400">
                                                   {p}
                                                </span>
                                             ))}
                                          </div>
                                       ) : (
                                          <span className="text-xs font-bold text-slate-500">-</span>
                                       )}
                                    </td>
                                     <td className="px-8 py-6">
                                       {task.contentId ? (
                                          <div className="flex flex-col gap-1">
                                             <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Sch: <span className="text-[#F05E23] font-black">{task.marketingData?.postTracker?.scheduledDate || "TBA"}</span></span>
                                             <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Stat: <span className={task.marketingData?.postTracker?.status?.includes('Posted') ? 'text-green-600 dark:text-green-500 font-black' : 'text-amber-600 dark:text-amber-500 font-black'}>{task.marketingData?.postTracker?.status || "Pending"}</span></span>
                                          </div>
                                       ) : (
                                          <span className="text-xs font-bold text-slate-500">-</span>
                                       )}
                                    </td>
                                    <td className="px-8 py-6">
                                       <div className="flex gap-2">
                                          <button onClick={() => setSelectedTaskId(task._id)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
                                             Details
                                          </button>
                                          {task.contentId && (
                                             <button onClick={() => {
                                                setUpdatePostData({
                                                   contentId: task.contentId,
                                                   finalLink: task.marketingData?.postTracker?.finalLink || "",
                                                   postedLink: task.marketingData?.postTracker?.postedLink || "",
                                                   status: task.marketingData?.postTracker?.status || "Pending",
                                                   clientRemarks: task.marketingData?.postTracker?.clientRemarks || ""
                                                });
                                                setIsUpdatingPost(true);
                                             }} className="px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 border border-blue-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                                Update
                                             </button>
                                          )}
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                              {myTasks.length === 0 && (
                                 <tr>
                                    <td colSpan="6" className="px-8 py-16 text-center">
                                       <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No tasks found.</p>
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}
            </div>

            {/* Side Panel (Right) */}
            <div className={`space-y-8 transition-all duration-500 ${viewMode === "spreadsheet" ? "hidden" : "lg:col-span-4"}`}>
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
                        {(selectedTask.marketingData || user.department !== 'Digital Marketing' || true) && (
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-widest text-[#F05E23] pl-2">Asset Links & Updates</label>
 <input type="url" value={marketingForm.rawLink} onChange={e => setMarketingForm({ ...marketingForm, rawLink: e.target.value })} placeholder="Raw Asset Link (Drive)" className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black text-[0.65rem] tracking-widest text-slate-800 dark:text-white" />
 <input type="url" value={marketingForm.editedLink} onChange={e => setMarketingForm({ ...marketingForm, editedLink: e.target.value })} placeholder="Final Output Link (Drive/Canva)" className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black text-[0.65rem] tracking-widest text-slate-800 dark:text-white" />
                              {user.department === 'Digital Marketing' && (
 <select value={marketingForm.editorStatus} onChange={e => setMarketingForm({ ...marketingForm, editorStatus: e.target.value })} className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black text-[0.65rem] tracking-widest text-slate-800 dark:text-white appearance-none cursor-pointer">
                                    <option value="">Select Editor Remarks...</option>
                                    <option value="Editing in process">Editing in process</option>
                                    <option value="1st Edit Completed">1st Edit Completed</option>
                                    <option value="Completed">Completed</option>
                                 </select>
                              )}
                           </div>
                        )}
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
                              {chatTask.marketingData && (
                                <div className="flex gap-4 mt-2 bg-black/20 px-3 py-1.5 rounded-lg w-max">
                                  {chatTask.marketingData.rawLink && (
                                    <a href={chatTask.marketingData.rawLink} target="_blank" rel="noopener noreferrer" className="text-[0.55rem] font-black uppercase tracking-widest text-white/90 hover:text-white hover:underline flex items-center gap-1">
                                      <ExternalLink className="w-3 h-3" /> Raw Asset
                                    </a>
                                  )}
                                  {chatTask.marketingData.editedLink && (
                                    <a href={chatTask.marketingData.editedLink} target="_blank" rel="noopener noreferrer" className="text-[0.55rem] font-black uppercase tracking-widest text-white/90 hover:text-white hover:underline flex items-center gap-1">
                                      <ExternalLink className="w-3 h-3" /> Edited Output
                                    </a>
                                  )}
                                </div>
                              )}
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

         {isUpdatingPost && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1a1a1a] rounded-3xl p-8 max-w-xl w-full border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F05E23]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                  <div className="flex justify-between items-center mb-8 relative z-10">
                     <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white">Update <span className="text-[#F05E23]">Post</span></h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Sync changes to Google Sheets</p>
                     </div>
                     <button onClick={() => setIsUpdatingPost(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-white">
                        <X className="w-5 h-5" />
                     </button>
                  </div>
                  <form onSubmit={handleUpdatePost} className="space-y-6 relative z-10">
                     <div className="grid grid-cols-1 gap-6">
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Final Output Link</label>
                           <input type="url" value={updatePostData.finalLink} onChange={(e) => setUpdatePostData({...updatePostData, finalLink: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-[#F05E23]/50 outline-none text-sm font-bold text-white transition-all" placeholder="Drive/Dropbox link" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Live Posted Link</label>
                           <input type="url" value={updatePostData.postedLink} onChange={(e) => setUpdatePostData({...updatePostData, postedLink: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-[#F05E23]/50 outline-none text-sm font-bold text-white transition-all" placeholder="Insta/FB link" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Status</label>
                           <select value={updatePostData.status} onChange={(e) => setUpdatePostData({...updatePostData, status: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-[#F05E23]/50 outline-none text-sm font-bold text-white transition-all">
                              <option value="Pending">Pending</option>
                              <option value="Posted">Posted</option>
                              <option value="Client Review">Client Review</option>
                           </select>
                        </div>
                     </div>
                     <button disabled={isSubmittingPostUpdate} type="submit" className="w-full py-5 bg-gradient-to-r from-[#F05E23] to-[#FF7B47] text-white rounded-2xl font-black uppercase tracking-widest text-[0.7rem] hover:shadow-[0_0_40px_rgba(240,94,35,0.4)] transition-all disabled:opacity-50">
                        {isSubmittingPostUpdate ? "Updating Sheet..." : "Update Post Tracker"}
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </div>
   );
}
