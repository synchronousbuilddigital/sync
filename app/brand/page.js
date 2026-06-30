"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useTheme } from "@/components/ThemeContext";
import { 
  CheckCircle2, Clock, Activity, Layout, ChevronDown, Calendar, Building2, UserCircle, 
  Table as TableIcon, LayoutGrid, Search, Filter, ArrowUpRight, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BrandManagerDashboard() {
  const { user, token, tasks: contextTasks, taskStore, fetchTasks, companyName, logout, brandManagerReviewTask } = useAuth();
  
  useEffect(() => {
    if (user?.role === "brand_manager" && token && fetchTasks) {
      fetchTasks("brand_manager", token);
    }
  }, [user?.role, token, fetchTasks]);

  // Ownership-Stamped State guard: Only display tasks if memory is explicitly stamped for brand_manager identity!
  const tasks = (taskStore?.role === "brand_manager") ? (contextTasks || []) : [];
  const { isDark } = useTheme();
  const [expandedTask, setExpandedTask] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'spreadsheet'
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [reviewForm, setReviewForm] = useState({ status: "", remarks: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Apply Tabs and Search
  const displayTasks = tasks.filter(task => {
    if (deptFilter && (task.internId?.department || task.marketingData?.departmentId?.mainDepartment || "Digital Marketing") !== deptFilter) return false;
    const matchesSearch = task.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.contentId?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === "All") return true;
    if (activeTab === "Completed") return task.status === "Complete";
    if (activeTab === "In Review") return task.marketingData?.reviewStatus === "Pending" && task.status !== "Complete";
    return task.status === activeTab;
  });

  // Group tasks by Main Department -> Sub Department for Card View
  const tasksByMainDept = displayTasks.reduce((acc, task) => {
    const mainDeptName = task.marketingData?.departmentId?.mainDepartment || "Digital Marketing";
    const subDeptName = task.marketingData?.departmentId?.name || "Uncategorized";
    
    if (!acc[mainDeptName]) acc[mainDeptName] = {};
    if (!acc[mainDeptName][subDeptName]) acc[mainDeptName][subDeptName] = [];
    
    acc[mainDeptName][subDeptName].push(task);
    return acc;
  }, {});

  const handleReviewSubmit = async (taskId) => {
    if (!reviewForm.status) return alert("Select a status");
    setSubmittingReview(true);
    await brandManagerReviewTask(taskId, reviewForm.status, reviewForm.remarks);
    setSubmittingReview(false);
    setExpandedTask(null);
  };

  if (!user || user.role !== "brand_manager") {
    return (
      <div className={`min-h-screen flex items-center justify-center font-black uppercase tracking-[0.5em] animate-pulse ${isDark ? "bg-[#050505] text-white" : "bg-[#F9F9F9] text-[#111]"}`}>
        Authenticating...
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-8 lg:p-12 font-sans selection:bg-[#F05E23] selection:text-white relative overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#050505] text-white" : "bg-[#F9F9F9] text-[#111]"}`}>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F05E23]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 relative z-10">
        <div>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-gradient-to-r from-[#F05E23] to-amber-500" />
            <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDark ? "text-white/40" : "text-[#F05E23]/70"} italic`}>Brand Manager Portal</span>
          </motion.div>
          <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none italic">
            Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F05E23] to-amber-500 drop-shadow-[0_0_20px_rgba(240,94,35,0.3)]">{companyName || user.name}</span>
          </motion.h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-md shadow-xl border ${isDark ? "bg-white/5 border-white/10 text-white/80" : "bg-white border-black/10 text-slate-600"}`}>
              <UserCircle className="w-5 h-5 text-[#F05E23]" />
              <span className="font-black uppercase tracking-widest text-[0.65rem]">{user.email}</span>
           </div>
           <button onClick={logout} className="px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 font-black uppercase tracking-widest text-[0.65rem] hover:bg-red-500 hover:text-white transition-all text-red-400 shadow-lg hover:shadow-red-500/20">
             Sign Out
           </button>
        </div>
      </div>

      {/* KPIs / Summary Cards */}
      <div className="max-w-[1600px] mx-auto relative z-10 mb-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <div className={`${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800 shadow-xl shadow-slate-200/50"} border rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-md flex flex-col justify-between hover:scale-[1.02] transition-all cursor-default group`}>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Layout className="w-5 h-5" />
          </div>
          <span className="text-4xl font-black italic">{tasks.length}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Total Tasks</span>
        </div>
        <div className={`${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800 shadow-xl shadow-slate-200/50"} border rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between hover:scale-[1.02] transition-all cursor-default group`}>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-4xl font-black italic text-amber-500">{tasks.filter(t => t.status === "Pending").length}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Pending</span>
        </div>
        <div className={`${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800 shadow-xl shadow-slate-200/50"} border rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between hover:scale-[1.02] transition-all cursor-default group`}>
          <div className="w-10 h-10 rounded-xl bg-[#F05E23]/10 text-[#F05E23] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-4xl font-black italic text-[#F05E23]">{tasks.filter(t => t.status === "Working").length}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">In Progress</span>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/10 border border-green-500/30 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between cursor-default group">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-4xl font-black italic text-green-500">{tasks.filter(t => t.status === "Complete").length}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Completed</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className={`max-w-[1600px] mx-auto relative z-10 mb-12 flex flex-col lg:flex-row justify-between items-center gap-6 border rounded-3xl p-4 backdrop-blur-md ${isDark ? "bg-white/5 border-white/10" : "bg-white border-black/10 shadow-sm"}`}>
        <div className="flex gap-2 overflow-x-auto w-full lg:w-auto scrollbar-hide">
          {["All", "Pending", "Working", "In Review", "Completed"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[0.65rem] transition-all whitespace-nowrap ${
                activeTab === tab
                  ? `bg-[#F05E23] ${isDark ? 'text-white' : 'text-slate-100'} shadow-lg shadow-[#F05E23]/20`
                  : isDark ? "text-white/40 hover:bg-white/5 hover:text-white/80" : "text-slate-500 hover:bg-black/5 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-white/30" : "text-slate-400"}`} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-xl py-3 pl-11 pr-4 text-xs font-bold outline-none focus:border-[#F05E23] transition-all ${isDark ? "bg-black/40 border-white/10 text-white placeholder:text-white/30" : "bg-white border-black/10 text-[#111] placeholder:text-slate-400"}`}
            />
          </div>

          <div className="relative group shrink-0">
            <div className="absolute -inset-0.5 bg-[#F05E23] rounded-2xl blur-sm opacity-40 group-hover:opacity-70 transition duration-300" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="relative appearance-none rounded-xl px-6 py-3.5 pr-10 text-xs font-black uppercase tracking-wider outline-none cursor-pointer shadow-lg shadow-[#F05E23]/20 bg-[#F05E23] text-white border-transparent hover:brightness-105 transition-all"
            >
              <option value="" className={isDark ? "bg-[#111] text-white font-bold" : "bg-white text-slate-900 font-bold"}>All Departments</option>
              <option value="Tech" className={isDark ? "bg-[#111] text-white font-bold" : "bg-white text-slate-900 font-bold"}>Tech</option>
              <option value="Digital Marketing" className={isDark ? "bg-[#111] text-white font-bold" : "bg-white text-slate-900 font-bold"}>Digital Marketing</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[0.6rem] font-black text-white">
              ▼
            </div>
          </div>
          
          <div className={`flex border rounded-xl p-1 shrink-0 ${isDark ? "bg-black/40 border-white/10" : "bg-white border-black/10"}`}>
            <button 
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-lg transition-all ${viewMode === "cards" ? "bg-[#F05E23] text-white shadow-md" : isDark ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-slate-800"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode("spreadsheet")}
              className={`p-2 rounded-lg transition-all ${viewMode === "spreadsheet" ? "bg-[#F05E23] text-white shadow-md" : isDark ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-slate-800"}`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto relative z-10">
        {displayTasks.length === 0 ? (
          <div className={`p-24 text-center rounded-[3rem] flex flex-col items-center justify-center backdrop-blur-md border ${isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"}`}>
             <Building2 className={`w-20 h-20 mb-8 ${isDark ? "text-white/10" : "text-slate-200"}`} />
             <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-400">No Tasks Discovered</h2>
             <p className="text-slate-400 mt-4 font-bold uppercase tracking-widest text-xs">Your brand does not have any active tasks matching the current filters.</p>
          </div>
        ) : viewMode === "cards" ? (
          /* CARD VIEW */
          <div className="space-y-24">
            {Object.entries(tasksByMainDept).map(([mainDeptName, subDepts]) => (
              <div key={mainDeptName} className="space-y-12">
                <div className="flex items-center gap-6 mb-8">
                   <h2 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter italic drop-shadow-md ${isDark ? "text-white" : "text-[#111]"}`}>
                     {mainDeptName} <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F05E23] to-amber-500">Division</span>
                   </h2>
                   <div className={`h-[2px] flex-1 bg-gradient-to-r ${isDark ? "from-white/10 to-transparent" : "from-black/10 to-transparent"}`} />
                </div>

                {Object.entries(subDepts).map(([deptName, deptTasks], index) => {
                  const completed = deptTasks.filter(t => t.status === "Complete").length;
                  const progress = deptTasks.length > 0 ? Math.round((completed / deptTasks.length) * 100) : 0;
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={deptName} 
                      className={`border rounded-[3rem] p-8 md:p-12 backdrop-blur-md shadow-2xl relative overflow-hidden ${isDark ? "bg-white/5 border-white/10" : "bg-white border-black/10"}`}
                    >
                      {/* Dept Decorative Glow */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05E23]/5 blur-[80px] pointer-events-none rounded-full" />
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
                         <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#F05E23]/20 to-amber-500/10 border border-[#F05E23]/30 flex items-center justify-center text-[#F05E23] shadow-lg shadow-[#F05E23]/10">
                               <Building2 className="w-8 h-8" />
                            </div>
                            <div>
                               <h2 className="text-3xl font-black uppercase tracking-tighter italic">{deptName} <span className="text-[#F05E23]">Department</span></h2>
                               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-2">{deptTasks.length} Active Assignments</p>
                            </div>
                         </div>
                         
                         <div className={`flex items-center gap-6 px-8 py-4 rounded-3xl border ${isDark ? "bg-black/40 border-white/5" : "bg-slate-50 border-black/5"}`}>
                            <div className="text-right">
                               <span className="block text-3xl font-black italic text-[#F05E23] leading-none">{progress}%</span>
                               <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Completion</span>
                            </div>
                            <div className={`w-32 h-3 rounded-full overflow-hidden shadow-inner ${isDark ? "bg-white/10" : "bg-slate-200"}`}>
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${progress}%` }}
                                 transition={{ duration: 1, delay: 0.5 }}
                                 className="h-full bg-gradient-to-r from-[#F05E23] to-amber-500"
                               />
                            </div>
                         </div>
                      </div>

                      <div className="grid gap-6 relative z-10">
                        {deptTasks.map((task) => (
                          <div 
                            key={task._id} 
                            className={`group border rounded-[2rem] overflow-hidden transition-all duration-500 ${isDark ? "bg-black/40 hover:bg-white/[0.05] border-white/5 hover:border-white/20" : "bg-slate-50 hover:bg-white border-black/5 hover:border-[#F05E23]/30"} hover:shadow-2xl hover:shadow-[#F05E23]/5`}
                          >
                            <div 
                              onClick={() => {
                                if (expandedTask === task._id) {
                                  setExpandedTask(null);
                                } else {
                                  setExpandedTask(task._id);
                                  setReviewForm({ 
                                    status: task.marketingData?.brandManagerReviewStatus || "", 
                                    remarks: task.marketingData?.brandManagerRemarks || "" 
                                  });
                                }
                              }}
                              className="p-8 flex items-center justify-between cursor-pointer"
                            >
                              <div className="flex items-center gap-8">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border transition-all ${task.status === 'Complete' ? `bg-gradient-to-br from-green-500 to-emerald-600 border-green-500/50 ${isDark ? 'text-white' : 'text-slate-100'} shadow-lg shadow-green-500/20` : (task.status === 'Working' ? 'bg-gradient-to-br from-[#F05E23]/20 to-amber-500/20 border-[#F05E23]/40 text-[#F05E23]' : (isDark ? 'bg-white/5 border-white/10 text-white/20' : 'bg-slate-100 border-black/10 text-slate-400'))}`}>
                                  {task.status === 'Complete' ? <CheckCircle2 className="w-8 h-8" /> : (task.status === 'Working' ? <Activity className="w-8 h-8 animate-pulse" /> : <Clock className="w-8 h-8" />)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                     {task.contentId && <span className="text-[10px] font-black uppercase tracking-widest text-[#F05E23] px-2 py-1 bg-[#F05E23]/10 rounded-md border border-[#F05E23]/20">{task.contentId}</span>}
                                     {task.internId?.department && <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 px-2 py-1 bg-blue-500/10 rounded-md border border-blue-500/20">{task.internId.department}</span>}
                                     <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md border ${task.status === 'Complete' ? 'bg-green-500/10 border-green-500/20 text-green-400' : (isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-slate-100 border-black/10 text-slate-500')}`}>{task.status}</span>
                                     <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${task.priority === 'High' ? 'text-red-400' : (task.priority === 'Low' ? 'text-blue-400' : 'text-amber-400')}`}>{task.priority} Priority</span>
                                  </div>
                                  <h4 className={`text-xl font-black uppercase tracking-tight transition-colors ${task.status === 'Complete' ? (isDark ? "text-white" : "text-[#111]") : (isDark ? "text-white/80 group-hover:text-white" : "text-slate-700 group-hover:text-[#111]")}`}>{task.title}</h4>
                                </div>
                              </div>
                              <div className={`p-3 rounded-2xl transition-transform duration-500 ${expandedTask === task._id ? `rotate-180 bg-gradient-to-br from-[#F05E23] to-amber-500 ${isDark ? 'text-white' : 'text-slate-100'} shadow-lg` : (isDark ? "bg-white/5 text-white/40" : "bg-slate-100 text-slate-400")}`}>
                                 <ChevronDown className="w-6 h-6" />
                              </div>
                            </div>

                            <AnimatePresence>
                              {expandedTask === task._id && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="px-8 pb-8 pt-0"
                                >
                                  <div className={`p-8 rounded-[2rem] border space-y-8 backdrop-blur-md ${isDark ? "bg-black/60 border-white/5" : "bg-white border-black/10"}`}>
                                    <p className={`text-sm leading-relaxed font-medium italic border-l-4 border-[#F05E23]/50 pl-6 ${isDark ? "text-white/70" : "text-slate-600"}`}>&quot;{task.description}&quot;</p>
                                    
                                    <div className="flex flex-wrap gap-4">
                                      {task.createdAt && (
                                        <div className={`flex items-center gap-3 w-fit px-5 py-3 rounded-xl border ${isDark ? "text-white/50 bg-white/5 border-white/10" : "text-slate-500 bg-slate-50 border-black/10"}`}>
                                          <Calendar className="w-5 h-5 text-blue-400" />
                                          <span className="text-[10px] font-black uppercase tracking-widest">Created On: {new Date(task.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                      )}
                                      {task.dueDate && (
                                        <div className={`flex items-center gap-3 w-fit px-5 py-3 rounded-xl border ${isDark ? "text-white/50 bg-white/5 border-white/10" : "text-slate-500 bg-slate-50 border-black/10"}`}>
                                           <Calendar className="w-5 h-5 text-[#F05E23]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Expected Delivery: {new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {(task.marketingData?.editorStatus || task.marketingData?.reviewStatus || task.marketingData?.rawLink || task.marketingData?.brandManagerReviewStatus) && (
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {task.marketingData?.editorStatus && (
                                          <div className={`${isDark ? "bg-white/5" : "bg-black/5"} p-6 rounded-2xl border ${isDark ? "border-white/10" : "border-black/10"} shadow-inner`}>
                                            <span className="block text-[9px] font-black uppercase tracking-widest text-[#F05E23] mb-2">Editor Status</span>
                                            <span className={`text-sm font-bold ${isDark ? "text-white" : "text-[#111]"}`}>{task.marketingData.editorStatus}</span>
                                          </div>
                                        )}
                                        {task.marketingData?.reviewStatus && (
                                          <div className={`${isDark ? "bg-white/5" : "bg-black/5"} p-6 rounded-2xl border ${isDark ? "border-white/10" : "border-black/10"} shadow-inner`}>
                                            <span className="block text-[9px] font-black uppercase tracking-widest text-blue-400 mb-2">HQ Review</span>
                                            <span className={`text-sm font-bold ${isDark ? "text-white" : "text-[#111]"}`}>{task.marketingData.reviewStatus}</span>
                                          </div>
                                        )}
                                        {task.marketingData?.brandManagerReviewStatus && (
                                          <div className={`${isDark ? "bg-white/5" : "bg-black/5"} p-6 rounded-2xl border ${isDark ? "border-white/10" : "border-black/10"} shadow-inner`}>
                                            <span className="block text-[9px] font-black uppercase tracking-widest text-green-400 mb-2">Your Approval</span>
                                            <span className={`text-sm font-bold ${isDark ? "text-white" : "text-[#111]"}`}>{task.marketingData.brandManagerReviewStatus}</span>
                                          </div>
                                        )}
                                        {task.marketingData?.rawLink && (
                                          <div className="md:col-span-3 bg-gradient-to-r from-[#F05E23]/10 to-amber-500/5 p-6 rounded-2xl border border-[#F05E23]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                              <span className="block text-[9px] font-black uppercase tracking-widest text-green-400 mb-2">Deliverable Access Link</span>
                                              <span className={`text-xs font-bold truncate max-w-sm block font-mono ${isDark ? "text-white/80" : "text-slate-600"}`}>{task.marketingData.rawLink}</span>
                                            </div>
                                            <a href={task.marketingData.rawLink} target="_blank" className="px-6 py-3 bg-gradient-to-r from-[#F05E23] to-amber-500 hover:scale-105 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-[#F05E23]/20 flex items-center gap-2">
                                              Open Link <ExternalLink className="w-3 h-3" />
                                            </a>
                                          </div>
                                        )}
                                        {task.marketingData?.postTracker && (
                                          <div className={`md:col-span-3 ${isDark ? "bg-white/5" : "bg-black/5"} p-6 rounded-2xl border ${isDark ? "border-white/10" : "border-black/10"} shadow-inner`}>
                                            <span className="block text-[9px] font-black uppercase tracking-widest text-blue-400 mb-4">Live Post Tracking</span>
                                            <div className="flex flex-wrap items-center justify-between gap-6">
                                              <div>
                                                <span className={`block text-[8px] uppercase tracking-widest mb-1 ${isDark ? "text-white/50" : "text-slate-400"}`}>Scheduled For</span>
                                                <span className="text-sm font-bold text-[#F05E23]">{task.marketingData.postTracker.scheduledDate || "TBA"}</span>
                                              </div>
                                              <div>
                                                <span className={`block text-[8px] uppercase tracking-widest mb-1 ${isDark ? "text-white/50" : "text-slate-400"}`}>Status</span>
                                                <span className={`text-sm font-bold ${task.marketingData.postTracker.status?.includes('Posted') ? 'text-green-400' : 'text-amber-400'}`}>{task.marketingData.postTracker.status || "Pending"}</span>
                                              </div>
                                              <div>
                                                <span className={`block text-[8px] uppercase tracking-widest mb-1 ${isDark ? "text-white/50" : "text-slate-400"}`}>Type</span>
                                                <span className={`text-sm font-bold ${isDark ? "text-white" : "text-[#111]"}`}>{task.marketingData.postTracker.postType || "-"}</span>
                                              </div>
                                              {task.marketingData.postTracker.postedLink && task.marketingData.postTracker.postedLink.trim() !== "" && (
                                                <a href={task.marketingData.postTracker.postedLink} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-all rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-500/30 shadow-lg shadow-blue-500/10">
                                                  View Live Post
                                                </a>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Brand Manager Review Section */}
                                    <div className="mt-8 pt-8 border-t border-white/10 dark:border-white/10">
                                      <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-6 bg-[#F05E23] rounded-full" />
                                        <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-white">Leave Your Review</h3>
                                      </div>
                                      <div className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10 dark:border-white/10">
                                        <div className="flex flex-wrap gap-4">
                                          {["Approved", "Changes Requested"].map((status) => (
                                            <label key={status} className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl cursor-pointer border transition-all ${reviewForm.status === status ? `bg-white/10 border-[#F05E23] ${isDark ? 'text-white' : 'text-slate-100'} shadow-lg` : (isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white' : 'bg-slate-50 border-black/10 text-slate-500 hover:bg-slate-100 hover:text-slate-800')}`}>
                                              <input
                                                type="radio"
                                                name={`reviewStatus-${task._id}`}
                                                value={status}
                                                className="hidden"
                                                checked={reviewForm.status === status}
                                                onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                                              />
                                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{status}</span>
                                            </label>
                                          ))}
                                        </div>
                                        
                                        <div className="space-y-3">
                                          <label className={`text-[9px] font-black uppercase tracking-widest pl-2 ${isDark ? "text-white/40" : "text-slate-500"}`}>Feedback & Remarks</label>
                                          <textarea 
                                            value={reviewForm.remarks}
                                            onChange={(e) => setReviewForm({ ...reviewForm, remarks: e.target.value })}
                                            placeholder="Leave your tactical feedback here..."
                                            className={`w-full rounded-2xl p-6 outline-none transition-all font-bold text-sm resize-none h-32 ${isDark ? "bg-black/60 border border-white/10 focus:border-[#F05E23]/50 text-white placeholder:text-white/20" : "bg-white border border-black/10 focus:border-[#F05E23]/50 text-[#111] placeholder:text-slate-400 shadow-inner"}`}
                                          />
                                        </div>

                                        <div className="flex justify-end">
                                          <button 
                                            onClick={() => handleReviewSubmit(task._id)}
                                            disabled={submittingReview}
                                            className="px-10 py-4 bg-gradient-to-r from-[#F05E23] to-amber-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#F05E23]/20 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                                          >
                                            {submittingReview ? "Syncing..." : "Submit Review"} <ArrowUpRight className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          /* SPREADSHEET VIEW */
          <div className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200/80 shadow-2xl"} border rounded-[2.5rem] backdrop-blur-md overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className={`border-b ${isDark ? "border-white/10 bg-black/40 text-white/40" : "border-slate-200 bg-slate-900 text-white"}`}>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">SYN ID</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Task Title</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Department</th>
                    
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">HQ Review</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Your Approval</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Work Link</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#F05E23]">Scheduled</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#F05E23]">Post Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Created At</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Due Date</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-100"}`}>
                  {displayTasks.map(task => (
                    <tr 
                      key={task._id} 
                      className={`transition-colors cursor-pointer ${isDark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50 bg-white"}`}
                      onClick={() => {
                        setViewMode("cards");
                        setExpandedTask(task._id);
                      }}
                    >
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#F05E23] bg-[#F05E23]/10 px-3 py-1.5 rounded-lg border border-[#F05E23]/20">
                          {task.contentId || "N/A"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-sm font-bold ${isDark ? "text-white" : "text-[#111]"}`}>{task.title}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs font-bold ${isDark ? "text-white/60" : "text-slate-600"}`}>
                            {task.internId?.department || task.marketingData?.departmentId?.name || task.marketingData?.postTracker?.postType || "Uncategorized"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${task.status === 'Complete' ? 'bg-green-500/10 border-green-500/20 text-green-400' : (isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-slate-100 border-black/10 text-slate-500')}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-bold ${isDark ? "text-white/80" : "text-slate-700"}`}>
                          {task.marketingData?.reviewStatus || "-"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-bold ${task.marketingData?.brandManagerReviewStatus === 'Approved' ? 'text-green-400' : (task.marketingData?.brandManagerReviewStatus === 'Changes Requested' ? 'text-amber-400' : (isDark ? "text-white/40" : "text-slate-400"))}`}>
                          {task.marketingData?.brandManagerReviewStatus || "Pending"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {task.marketingData?.editedLink || task.marketingData?.rawLink ? (
                          <a 
                            href={task.marketingData.editedLink || task.marketingData.rawLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] font-black uppercase text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Link <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className={`text-[10px] font-bold ${isDark ? "text-white/40" : "text-slate-400"}`}>-</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-[#F05E23]">
                          {task.marketingData?.postTracker?.scheduledDate || "-"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-bold ${task.marketingData?.postTracker?.status?.includes('Posted') ? 'text-green-400' : 'text-amber-400'}`}>
                          {task.marketingData?.postTracker?.status || "-"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-xs font-bold ${isDark ? "text-white/50" : "text-slate-500"}`}>
                          {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "-"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-xs font-bold ${isDark ? "text-white/50" : "text-slate-500"}`}>
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`p-4 border-t text-center ${isDark ? "bg-black/40 border-white/10" : "bg-slate-50 border-black/10"}`}>
              <span className={`text-[9px] font-black uppercase tracking-[0.3em] italic ${isDark ? "text-white/30" : "text-slate-400"}`}>Click any row to expand details in Card View</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-24 pt-8 border-t border-white/5 text-center relative z-10">
        <p className={`text-[9px] font-black uppercase tracking-[0.5em] italic ${isDark ? "text-white/20" : "text-slate-400"}`}>
          Synchronous Build Digital
        </p>
      </div>
    </div>
  );
}
