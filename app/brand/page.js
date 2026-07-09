"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/components/AuthContext";
import { useTheme } from "@/components/ThemeContext";
import { 
  CheckCircle2, Clock, Activity, Layout, ChevronDown, Calendar, Building2, UserCircle, 
  Table as TableIcon, LayoutGrid, Search, Filter, ArrowUpRight, ExternalLink,
  ChevronLeft, ChevronRight, Link2, X, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BrandManagerDashboard() {
  const { user, token, tasks: contextTasks, taskStore, fetchTasks, companyName, logout, brandManagerReviewTask, refreshBrandData, dataLoading } = useAuth();
  
  useEffect(() => {
    if (user?.role === "brand_manager" && refreshBrandData) {
      refreshBrandData();
    } else if (user?.role === "brand_manager" && token && fetchTasks) {
      fetchTasks("brand_manager", token);
    }
  }, [user?.role, token, fetchTasks, refreshBrandData]);

  // Ownership-Stamped State guard: Only display tasks if memory is explicitly stamped for brand_manager identity!
  // Also allow through if still loading (dataLoading=true means fetch is in-flight, don't show empty yet)
  const tasks = (dataLoading && !contextTasks?.length) ? [] : ((taskStore?.role === "brand_manager") ? (contextTasks || []) : []);

  // Handle notification deep-link navigation
  useEffect(() => {
    const handleNotifNav = () => {
      if (!tasks || tasks.length === 0) return;
      const search = typeof window !== 'undefined' ? window.location.search : '';
      if (!search) return;
      const params = new URLSearchParams(search);
      const notifTask = params.get('notif_task');
      if (notifTask) {
        const task = tasks.find(t => t._id === notifTask);
        if (task) {
          setCalendarSelectedTask(task);
        }
        const url = new URL(window.location.href);
        url.searchParams.delete('notif_task');
        url.searchParams.delete('notif_action');
        window.history.replaceState({}, '', url.toString());
      }
    };

    const handleSwMessage = (event) => {
      if (event.data && event.data.type === 'PUSH_NOTIFICATION_CLICK' && event.data.url) {
        try {
          const params = new URLSearchParams(event.data.url.split('?')[1] || '');
          const notifTask = params.get('notif_task');
          if (notifTask) {
            const task = tasks.find(t => t._id === notifTask);
            if (task) {
              setCalendarSelectedTask(task);
            }
          }
        } catch (e) {}
      }
    };

    handleNotifNav();
    window.addEventListener('notif_navigation', handleNotifNav);
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
    }
    return () => {
      window.removeEventListener('notif_navigation', handleNotifNav);
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage);
      }
    };
  }, [tasks]);

  const { isDark } = useTheme();
  const [expandedTask, setExpandedTask] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'spreadsheet'
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [reviewForm, setReviewForm] = useState({ status: "", remarks: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [monthFilter, setMonthFilter] = useState("");
  const [dateFilterType, setDateFilterType] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarSelectedTask, setCalendarSelectedTask] = useState(null);
  const [selectedDayForModal, setSelectedDayForModal] = useState(null);

  // ── Department colour system ──────────────────────────────────────────────
  const DEPT_COLORS = {
    "Tech":              { bg: "bg-blue-500",   light: "bg-blue-500/15",  border: "border-blue-500/40",  text: "text-blue-400",   hex: "#3B82F6" },
    "Digital Marketing": { bg: "bg-[#F05E23]",  light: "bg-[#F05E23]/15", border: "border-[#F05E23]/40", text: "text-[#F05E23]", hex: "#F05E23" },
    "Social Media":      { bg: "bg-purple-500", light: "bg-purple-500/15", border: "border-purple-500/40", text: "text-purple-400", hex: "#A855F7" },
    "SEO":               { bg: "bg-green-500",  light: "bg-green-500/15",  border: "border-green-500/40",  text: "text-green-400",  hex: "#22C55E" },
    "Content":           { bg: "bg-teal-500",   light: "bg-teal-500/15",   border: "border-teal-500/40",   text: "text-teal-400",   hex: "#14B8A6" },
    "Default":           { bg: "bg-slate-500",  light: "bg-slate-500/15",  border: "border-slate-500/40",  text: "text-slate-400",  hex: "#6B7280" },
  };
  const getDeptColor = (task) => {
    const dept = task.internId?.department || task.marketingData?.departmentId?.mainDepartment || "";
    return DEPT_COLORS[dept] || DEPT_COLORS["Digital Marketing"];
  };

  // ── Resolve a task's calendar date ────────────────────────────────────────
  const getTaskDate = (task) => {
    const raw = task.marketingData?.postTracker?.scheduledDate || task.dueDate;
    if (!raw) return null;
    const str = String(raw).trim();

    // 1. Check for YYYY-MM-DD
    const ymd = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (ymd) {
      return new Date(parseInt(ymd[1]), parseInt(ymd[2]) - 1, parseInt(ymd[3]));
    }

    // 2. Check for DD-MM-YYYY or DD/MM/YYYY (e.g. 10-06-2026 or 24/06/2026)
    const dmy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (dmy) {
      let first = parseInt(dmy[1]);
      let second = parseInt(dmy[2]);
      let y = parseInt(dmy[3]);
      if (y < 100) y += 2000;

      // If second > 12, then second must be the day and first is month (MM-DD-YYYY)
      // Otherwise, assume DD-MM-YYYY (standard Indian/UK/Sheet format like 10-06-2026 = 10 June)
      if (second > 12) {
        return new Date(y, first - 1, second);
      } else {
        return new Date(y, second - 1, first);
      }
    }

    // 3. Check for DD-MMM-YY or DD Month YYYY (e.g. 10-Jun-26 or 08 June 2026)
    const dmm = str.match(/^(\d{1,2})[\/\-\s]+([A-Za-z]{3,})[\/\-\s]*(\d{0,4})$/);
    if (dmm) {
      const day = parseInt(dmm[1]);
      const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      const mIdx = monthNames.findIndex(m => dmm[2].toLowerCase().startsWith(m));
      if (mIdx !== -1) {
        let y = dmm[3] ? parseInt(dmm[3]) : new Date().getFullYear();
        if (y < 100) y += 2000;
        return new Date(y, mIdx, day);
      }
    }

    // 4. Fallback to native Date parser
    let d = new Date(str);
    return isNaN(d?.getTime()) ? null : d;
  };

  // Apply Tabs and Search
  const displayTasks = tasks.filter(task => {
    if (deptFilter && (task.internId?.department || task.marketingData?.departmentId?.mainDepartment || "Digital Marketing") !== deptFilter) return false;
    const matchesSearch = task.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.contentId?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === "All") {
      // proceed to date filters
    } else if (activeTab === "Completed") {
      if (task.status !== "Complete") return false;
    } else if (activeTab === "In Review") {
      if (!(task.marketingData?.reviewStatus === "Pending" && task.status !== "Complete")) return false;
    } else if (task.status !== activeTab) {
      return false;
    }

    if (monthFilter !== "" || dateFilterType !== "All" || fromDate || toDate) {
      const d = getTaskDate(task);
      const sheetMonth = task.marketingData?.postTracker?.month || "";

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

  // Group tasks by Main Department (Unified Cards: Digital Marketing & Tech)
  const tasksByMainDept = displayTasks.reduce((acc, task) => {
    const rawDept = `${task.marketingData?.departmentId?.mainDepartment || ""} ${task.marketingData?.departmentId?.name || ""} ${task.internId?.department || ""} ${task.taskType || ""}`.toLowerCase();
    const isTech = rawDept.includes("tech") || rawDept.includes("dev") || rawDept.includes("web") || rawDept.includes("software") || rawDept.includes("app");
    
    const mainDeptName = isTech ? "Tech" : "Digital Marketing";
    const subDeptName = isTech ? "Tech" : "Digital Marketing";
    
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

  if (dataLoading && !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-[#050505]" : "bg-[#F9F9F9]"}`}>
        <div className="flex flex-col items-center gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
            <Activity className="w-10 h-10 text-[#F05E23]" />
          </motion.div>
          <span className="text-[0.6rem] font-black uppercase tracking-[0.4em] text-[#F05E23]/60">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

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
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <div className="w-8 sm:w-12 h-[2px] bg-gradient-to-r from-[#F05E23] to-amber-500" />
            <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] ${isDark ? "text-white/40" : "text-[#F05E23]/70"} italic`}>Brand Manager Portal</span>
          </motion.div>
          <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-2xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none italic">
            Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F05E23] to-amber-500 drop-shadow-[0_0_20px_rgba(240,94,35,0.3)]">{companyName || user.name}</span>
          </motion.h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
           <div className={`flex items-center gap-2 sm:gap-3 px-3.5 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl backdrop-blur-md shadow-xl border ${isDark ? "bg-white/5 border-white/10 text-white/80" : "bg-white border-black/10 text-slate-600"}`}>
              <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#F05E23]" />
              <span className="font-black uppercase tracking-widest text-[0.55rem] sm:text-[0.65rem]">{user.email}</span>
           </div>
           <button onClick={logout} className="px-3.5 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-red-500/10 border border-red-500/20 font-black uppercase tracking-widest text-[0.55rem] sm:text-[0.65rem] hover:bg-red-500 hover:text-white transition-all text-red-400 shadow-lg hover:shadow-red-500/20">
             Sign Out
           </button>
        </div>
      </div>

      {/* KPIs / Summary Cards */}
      <div className="max-w-[1600px] mx-auto relative z-10 mb-6 sm:mb-12 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6">
        <div className={`${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800 shadow-xl shadow-slate-200/50"} border rounded-xl sm:rounded-3xl p-3 sm:p-6 backdrop-blur-md flex flex-col justify-between hover:scale-[1.02] transition-all cursor-default group`}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
            <Layout className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-2xl sm:text-4xl font-black italic">{tasks.length}</span>
          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Total Tasks</span>
        </div>
        <div className={`${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800 shadow-xl shadow-slate-200/50"} border rounded-xl sm:rounded-3xl p-3 sm:p-6 backdrop-blur-md flex flex-col justify-between hover:scale-[1.02] transition-all cursor-default group`}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-2xl sm:text-4xl font-black italic text-amber-500">{tasks.filter(t => t.status === "Pending").length}</span>
          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Pending</span>
        </div>
        <div className={`${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800 shadow-xl shadow-slate-200/50"} border rounded-xl sm:rounded-3xl p-3 sm:p-6 backdrop-blur-md flex flex-col justify-between hover:scale-[1.02] transition-all cursor-default group`}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#F05E23]/10 text-[#F05E23] flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-2xl sm:text-4xl font-black italic text-[#F05E23]">{tasks.filter(t => t.status === "Working").length}</span>
          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">In Progress</span>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/10 border border-green-500/30 rounded-xl sm:rounded-3xl p-3 sm:p-6 backdrop-blur-md flex flex-col justify-between cursor-default group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-500/20 text-green-500 flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-2xl sm:text-4xl font-black italic text-green-500">{tasks.filter(t => t.status === "Complete").length}</span>
          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Completed</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className={`max-w-[1600px] mx-auto relative z-10 mb-6 sm:mb-12 flex flex-col lg:flex-row justify-between items-center gap-3 sm:gap-6 border rounded-2xl sm:rounded-3xl p-3 sm:p-4 backdrop-blur-md ${isDark ? "bg-white/5 border-white/10" : "bg-white border-black/10 shadow-sm"}`}>
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto w-full lg:w-auto scrollbar-hide pb-1 lg:pb-0">
          {["All", "Pending", "Working", "In Review", "Completed"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-black uppercase tracking-widest text-[0.55rem] sm:text-[0.65rem] transition-all whitespace-nowrap ${
                activeTab === tab
                  ? `bg-[#F05E23] ${isDark ? 'text-white' : 'text-slate-100'} shadow-lg shadow-[#F05E23]/20`
                  : isDark ? "text-white/40 hover:bg-white/5 hover:text-white/80" : "text-slate-500 hover:bg-black/5 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className={`absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDark ? "text-white/30" : "text-slate-400"}`} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-lg sm:rounded-xl py-2 sm:py-3 pl-9 sm:pl-11 pr-3 sm:pr-4 text-[0.65rem] sm:text-xs font-bold outline-none focus:border-[#F05E23] transition-all ${isDark ? "bg-black/40 border-white/10 text-white placeholder:text-white/30" : "bg-white border-black/10 text-[#111] placeholder:text-slate-400"}`}
            />
          </div>

          <div className="relative group shrink-0">
            <div className="absolute -inset-0.5 bg-[#F05E23] rounded-xl sm:rounded-2xl blur-sm opacity-40 group-hover:opacity-70 transition duration-300" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full sm:w-auto relative appearance-none rounded-lg sm:rounded-xl px-4 py-2 sm:px-6 sm:py-3.5 pr-8 sm:pr-10 text-[0.65rem] sm:text-xs font-black uppercase tracking-wider outline-none cursor-pointer shadow-lg shadow-[#F05E23]/20 bg-[#F05E23] text-white border-transparent hover:brightness-105 transition-all"
            >
              <option value="" className={isDark ? "bg-[#111] text-white font-bold" : "bg-white text-slate-900 font-bold"}>All Departments</option>
              <option value="Tech" className={isDark ? "bg-[#111] text-white font-bold" : "bg-white text-slate-900 font-bold"}>Tech</option>
              <option value="Digital Marketing" className={isDark ? "bg-[#111] text-white font-bold" : "bg-white text-slate-900 font-bold"}>Digital Marketing</option>
            </select>
            <div className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[0.55rem] sm:text-[0.6rem] font-black text-white">
              ▼
            </div>
          </div>
          
          <div className={`flex justify-center border rounded-lg sm:rounded-xl p-1 shrink-0 ${isDark ? "bg-black/40 border-white/10" : "bg-white border-black/10"}`}>
            <button 
              onClick={() => setViewMode("cards")}
              title="Card View"
              className={`flex-1 sm:flex-initial p-2 sm:p-2.5 rounded-md sm:rounded-lg transition-all flex justify-center items-center ${viewMode === "cards" ? "bg-[#F05E23] text-white shadow-md" : isDark ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-slate-800"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button 
              onClick={() => setViewMode("spreadsheet")}
              title="Spreadsheet View"
              className={`flex-1 sm:flex-initial p-2 sm:p-2.5 rounded-md sm:rounded-lg transition-all flex justify-center items-center ${viewMode === "spreadsheet" ? "bg-[#F05E23] text-white shadow-md" : (isDark ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-[#111]")}`}
            >
              <TableIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button 
              onClick={() => setViewMode("calendar")}
              title="Calendar View"
              className={`flex-1 sm:flex-initial p-2 sm:p-2.5 rounded-md sm:rounded-lg transition-all flex justify-center items-center ${viewMode === "calendar" ? "bg-[#F05E23] text-white shadow-md" : (isDark ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-[#111]")}`}
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Date & Month Filter Bar */}
      <div className="max-w-[1600px] mx-auto relative z-10 mb-6 sm:mb-8 flex flex-wrap items-center gap-2 sm:gap-3">
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className={`px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-[0.65rem] sm:text-xs font-bold outline-none cursor-pointer border transition-all ${isDark ? "bg-black/40 border-white/10 text-white" : "bg-white border-black/10 text-[#111]"}`}
        >
          <option value="">All Months</option>
          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, idx) => (
            <option key={idx} value={idx.toString()}>{m}</option>
          ))}
        </select>

        <div className={`flex flex-wrap items-center p-1 rounded-lg sm:rounded-xl border ${isDark ? "bg-black/40 border-white/10" : "bg-white border-black/10"}`}>
          {["All", "Today", "This Week", "This Month"].map((type) => (
            <button
              key={type}
              onClick={() => { setDateFilterType(type); setFromDate(""); setToDate(""); }}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-[0.55rem] sm:text-[0.65rem] font-black uppercase tracking-widest transition-all ${dateFilterType === type && !fromDate && !toDate ? "bg-[#F05E23] text-white shadow-sm" : (isDark ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-[#111]")}`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl border text-[0.65rem] sm:text-xs font-bold ${isDark ? "bg-black/40 border-white/10 text-white" : "bg-white border-black/10 text-[#111]"}`}>
          <span className="text-[0.55rem] sm:text-[0.65rem] text-slate-400 uppercase tracking-widest font-black">From</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => { setFromDate(e.target.value); setDateFilterType("Custom"); }}
            className="bg-transparent outline-none text-[0.65rem] sm:text-xs font-bold cursor-pointer"
          />
          <span className="text-[0.55rem] sm:text-[0.65rem] text-slate-400 uppercase tracking-widest font-black ml-1">To</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => { setToDate(e.target.value); setDateFilterType("Custom"); }}
            className="bg-transparent outline-none text-[0.65rem] sm:text-xs font-bold cursor-pointer"
          />
        </div>

        {(monthFilter !== "" || dateFilterType !== "All" || fromDate || toDate) && (
          <button
            onClick={() => { setMonthFilter(""); setDateFilterType("All"); setFromDate(""); setToDate(""); }}
            className="text-[0.65rem] sm:text-xs font-bold text-[#F05E23] underline underline-offset-2 ml-1"
          >
            Clear Date Filter
          </button>
        )}
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
                              className="p-4 sm:p-8 flex items-center justify-between gap-4 cursor-pointer"
                            >
                              <div className="flex items-center gap-4 sm:gap-8 min-w-0">
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-[1.2rem] sm:rounded-[1.5rem] flex items-center justify-center border transition-all ${task.status === 'Complete' ? `bg-gradient-to-br from-green-500 to-emerald-600 border-green-500/50 ${isDark ? 'text-white' : 'text-slate-100'} shadow-lg shadow-green-500/20` : (task.status === 'Working' ? 'bg-gradient-to-br from-[#F05E23]/20 to-amber-500/20 border-[#F05E23]/40 text-[#F05E23]' : (isDark ? 'bg-white/5 border-white/10 text-white/20' : 'bg-slate-100 border-black/10 text-slate-400'))}`}>
                                  {task.status === 'Complete' ? <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" /> : (task.status === 'Working' ? <Activity className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" /> : <Clock className="w-6 h-6 sm:w-8 sm:h-8" />)}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                     {task.contentId && <span className="text-[10px] font-black uppercase tracking-widest text-[#F05E23] px-2 py-1 bg-[#F05E23]/10 rounded-md border border-[#F05E23]/20">{task.contentId}</span>}
                                     {task.internId?.department && <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 px-2 py-1 bg-blue-500/10 rounded-md border border-blue-500/20">{task.internId.department}</span>}
                                     <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md border ${task.status === 'Complete' ? 'bg-green-500/10 border-green-500/20 text-green-400' : (isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-slate-100 border-black/10 text-slate-500')}`}>{task.status}</span>
                                     <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${task.priority === 'High' ? 'text-red-400' : (task.priority === 'Low' ? 'text-blue-400' : 'text-amber-400')}`}>{task.priority} Priority</span>
                                  </div>
                                  <h4 className={`text-base sm:text-xl font-black uppercase tracking-tight truncate transition-colors ${task.status === 'Complete' ? (isDark ? "text-white" : "text-[#111]") : (isDark ? "text-white/80 group-hover:text-white" : "text-slate-700 group-hover:text-[#111]")}`}>{task.title}</h4>
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
                                  className="px-4 sm:px-8 pb-4 sm:pb-8 pt-0"
                                >
                                  <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border space-y-4 sm:space-y-6 backdrop-blur-md ${isDark ? "bg-black/60 border-white/5" : "bg-white border-black/10"}`}>
                                    {/* Completion Workflow Progress Bar */}
                                    {(() => {
                                      const isPosted = task.marketingData?.postTracker?.status?.toLowerCase().includes('posted') || task.marketingData?.postedLink || task.status === "Complete";
                                      let step = 1;
                                      if (isPosted) step = 5;
                                      else if (task.marketingData?.brandManagerReviewStatus === "Approved") step = 4;
                                      else if (task.marketingData?.reviewStatus === "Approved") step = 3;
                                      else if (task.status === "Working" || task.marketingData?.rawLink || task.marketingData?.editedLink) step = 2;

                                      const steps = [
                                        { num: 1, label: "Draft / Assigned", color: "bg-red-500", text: "text-red-500" },
                                        { num: 2, label: "Work / Links", color: "bg-amber-500", text: "text-amber-500" },
                                        { num: 3, label: "HQ Approved", color: "bg-purple-500", text: "text-purple-500" },
                                        { num: 4, label: "Brand Approved", color: "bg-blue-500", text: "text-blue-500" },
                                        { num: 5, label: "Live Posted", color: "bg-green-500", text: "text-green-500" },
                                      ];

                                      return (
                                        <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-black/10 shadow-inner"}`}>
                                          <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className={`text-[0.6rem] font-black uppercase tracking-widest ${isDark ? "text-white/50" : "text-slate-500"}`}>
                                              Workflow Progress <span className="ml-1 opacity-70">({step * 20}%)</span>
                                            </span>
                                            <span className={`text-[0.65rem] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                                              step === 5 ? "bg-green-500/10 border-green-500/20 text-green-400"
                                              : step === 4 ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                              : step === 3 ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                                              : step === 2 ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                              : "bg-red-500/10 border-red-500/20 text-red-400"
                                            }`}>
                                              Step {step} of 5: {steps[step - 1].label}
                                            </span>
                                          </div>

                                          <div className="space-y-2">
                                            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-black/40" : "bg-slate-200"}`}>
                                              <div
                                                className={`h-full transition-all duration-700 rounded-full ${steps[step - 1].color}`}
                                                style={{ width: `${step * 20}%` }}
                                              />
                                            </div>
                                            
                                            <div className="grid grid-cols-5 gap-1 pt-1">
                                              {steps.map(s => (
                                                <div key={s.num} className={`text-center transition-all ${s.num <= step ? "opacity-100" : "opacity-30"}`}>
                                                  <div className={`w-4 h-4 mx-auto rounded-full flex items-center justify-center text-[0.55rem] font-black text-white mb-1 ${s.num <= step ? s.color : (isDark ? "bg-white/20" : "bg-slate-300")}`}>
                                                    {s.num <= step ? "✓" : s.num}
                                                  </div>
                                                  <span className={`text-[0.5rem] font-black uppercase tracking-tight block truncate ${s.num === step ? s.text : (isDark ? "text-white/60" : "text-slate-600")}`}>
                                                    {s.label}
                                                  </span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    <p className={`text-xs sm:text-sm leading-relaxed font-medium italic border-l-4 border-[#F05E23]/50 pl-4 sm:pl-6 ${isDark ? "text-white/70" : "text-slate-600"}`}>&quot;{task.description}&quot;</p>
                                    
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                      {task.createdAt && (
                                        <div className={`flex items-center gap-2 sm:gap-3 w-fit px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border ${isDark ? "text-white/50 bg-white/5 border-white/10" : "text-slate-500 bg-slate-50 border-black/10"}`}>
                                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Created On: {new Date(task.createdAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                      )}
                                      {task.dueDate && (
                                        <div className={`flex items-center gap-2 sm:gap-3 w-fit px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border ${isDark ? "text-white/50 bg-white/5 border-white/10" : "text-slate-500 bg-slate-50 border-black/10"}`}>
                                           <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#F05E23]" />
                                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Expected Delivery: {new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {(task.marketingData?.editorStatus || task.marketingData?.reviewStatus || task.marketingData?.rawLink || task.marketingData?.brandManagerReviewStatus) && (
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                                        {task.marketingData?.editorStatus && (
                                          <div className={`${isDark ? "bg-white/5" : "bg-black/5"} p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${isDark ? "border-white/10" : "border-black/10"} shadow-inner`}>
                                            <span className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#F05E23] mb-1 sm:mb-2">Editor Status</span>
                                            <span className={`text-xs sm:text-sm font-bold ${isDark ? "text-white" : "text-[#111]"}`}>{task.marketingData.editorStatus}</span>
                                          </div>
                                        )}
                                        {task.marketingData?.reviewStatus && (
                                          <div className={`${isDark ? "bg-white/5" : "bg-black/5"} p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${isDark ? "border-white/10" : "border-black/10"} shadow-inner`}>
                                            <span className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1 sm:mb-2">HQ Review</span>
                                            <span className={`text-xs sm:text-sm font-bold ${isDark ? "text-white" : "text-[#111]"}`}>{task.marketingData.reviewStatus}</span>
                                          </div>
                                        )}
                                        {task.marketingData?.brandManagerReviewStatus && (
                                          <div className={`${isDark ? "bg-white/5" : "bg-black/5"} p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${isDark ? "border-white/10" : "border-black/10"} shadow-inner col-span-2 sm:col-span-1`}>
                                            <span className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-green-400 mb-1 sm:mb-2">Your Approval</span>
                                            <span className={`text-xs sm:text-sm font-bold ${isDark ? "text-white" : "text-[#111]"}`}>{task.marketingData.brandManagerReviewStatus}</span>
                                          </div>
                                        )}
                                        {task.marketingData?.rawLink && (
                                          <div className="col-span-2 sm:col-span-3 bg-gradient-to-r from-[#F05E23]/10 to-amber-500/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#F05E23]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                                            <div className="min-w-0 w-full sm:w-auto">
                                              <span className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-green-400 mb-1">Deliverable Access Link</span>
                                              <span className={`text-xs font-bold truncate max-w-full sm:max-w-sm block font-mono ${isDark ? "text-white/80" : "text-slate-600"}`}>{task.marketingData.rawLink}</span>
                                            </div>
                                            <a href={task.marketingData.rawLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto justify-center px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-[#F05E23] to-amber-500 hover:scale-105 transition-all rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-[#F05E23]/20 flex items-center gap-2">
                                              Open Link <ExternalLink className="w-3 h-3" />
                                            </a>
                                          </div>
                                        )}
                                        {task.marketingData?.postTracker && (
                                          <div className={`col-span-2 sm:col-span-3 ${isDark ? "bg-white/5" : "bg-black/5"} p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${isDark ? "border-white/10" : "border-black/10"} shadow-inner`}>
                                            <span className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-blue-400 mb-2 sm:mb-3">Live Post Tracking</span>
                                            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-6">
                                              <div>
                                                <span className={`block text-[7px] sm:text-[8px] uppercase tracking-widest mb-0.5 sm:mb-1 ${isDark ? "text-white/50" : "text-slate-400"}`}>Scheduled For</span>
                                                <span className="text-xs sm:text-sm font-bold text-[#F05E23]">{task.marketingData.postTracker.scheduledDate || "TBA"}</span>
                                              </div>
                                              <div>
                                                <span className={`block text-[7px] sm:text-[8px] uppercase tracking-widest mb-0.5 sm:mb-1 ${isDark ? "text-white/50" : "text-slate-400"}`}>Status</span>
                                                <span className={`text-xs sm:text-sm font-bold ${task.marketingData.postTracker.status?.includes('Posted') ? 'text-green-400' : 'text-amber-400'}`}>{task.marketingData.postTracker.status || "Pending"}</span>
                                              </div>
                                              <div>
                                                <span className={`block text-[7px] sm:text-[8px] uppercase tracking-widest mb-0.5 sm:mb-1 ${isDark ? "text-white/50" : "text-slate-400"}`}>Type</span>
                                                <span className={`text-xs sm:text-sm font-bold ${isDark ? "text-white" : "text-[#111]"}`}>{task.marketingData.postTracker.postType || "-"}</span>
                                              </div>
                                              {task.marketingData.postTracker.postedLink && task.marketingData.postTracker.postedLink.trim() !== "" && (
                                                <a href={task.marketingData.postTracker.postedLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-all rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest border border-blue-500/30 shadow-lg shadow-blue-500/10">
                                                  View Live Post
                                                </a>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Brand Manager Review Section */}
                                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10 dark:border-white/10">
                                      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                        <div className="w-1.5 h-4 sm:w-2 sm:h-5 bg-[#F05E23] rounded-full" />
                                        <h3 className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em] text-white">Leave Your Review</h3>
                                      </div>
                                      <div className="space-y-4 sm:space-y-6 bg-white/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 dark:border-white/10">
                                        <div className="flex flex-wrap gap-2 sm:gap-4">
                                          {["Approved", "Changes Requested"].map((status) => (
                                            <label key={status} className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-3.5 rounded-xl cursor-pointer border transition-all ${reviewForm.status === status ? `bg-white/10 border-[#F05E23] ${isDark ? 'text-white' : 'text-slate-100'} shadow-lg` : (isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white' : 'bg-slate-50 border-black/10 text-slate-500 hover:bg-slate-100 hover:text-slate-800')}`}>
                                              <input
                                                type="radio"
                                                name={`reviewStatus-${task._id}`}
                                                value={status}
                                                className="hidden"
                                                checked={reviewForm.status === status}
                                                onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                                              />
                                              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">{status}</span>
                                            </label>
                                          ))}
                                        </div>
                                        
                                        <div className="space-y-2 sm:space-y-3">
                                          <label className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest pl-1.5 ${isDark ? "text-white/40" : "text-slate-500"}`}>Feedback & Remarks</label>
                                          <textarea 
                                            value={reviewForm.remarks}
                                            onChange={(e) => setReviewForm({ ...reviewForm, remarks: e.target.value })}
                                            placeholder="Leave your tactical feedback here..."
                                            className={`w-full rounded-xl sm:rounded-2xl p-3 sm:p-4 outline-none transition-all font-bold text-xs sm:text-sm resize-none h-20 sm:h-24 ${isDark ? "bg-black/60 border border-white/10 focus:border-[#F05E23]/50 text-white placeholder:text-white/20" : "bg-white border border-black/10 focus:border-[#F05E23]/50 text-[#111] placeholder:text-slate-400 shadow-inner"}`}
                                          />
                                        </div>

                                        <div className="flex justify-end">
                                          <button 
                                            onClick={() => handleReviewSubmit(task._id)}
                                            disabled={submittingReview}
                                            className="w-full sm:w-auto justify-center px-6 py-3 sm:px-8 sm:py-3.5 bg-gradient-to-r from-[#F05E23] to-amber-500 text-white rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#F05E23]/20 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
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
        ) : viewMode === "spreadsheet" ? (
          /* SPREADSHEET VIEW */
          <div className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200/80 shadow-2xl"} border rounded-2xl sm:rounded-[2.5rem] backdrop-blur-md overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className={`border-b ${isDark ? "border-white/10 bg-black/40 text-white/40" : "border-slate-200 bg-slate-900 text-white"}`}>
                    <th className="px-3 py-3 sm:px-8 sm:py-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">SYN ID</th>
                    <th className="px-3 py-3 sm:px-8 sm:py-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Task Title</th>
                    <th className="px-3 py-3 sm:px-8 sm:py-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Department</th>
                    
                    <th className="px-3 py-3 sm:px-8 sm:py-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Status</th>
                    <th className="px-3 py-3 sm:px-8 sm:py-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">HQ Review</th>
                    <th className="px-3 py-3 sm:px-8 sm:py-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Your Approval</th>
                    <th className="px-3 py-3 sm:px-8 sm:py-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Work Link</th>
                    <th className="px-3 py-3 sm:px-8 sm:py-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#F05E23]">Scheduled</th>
                    <th className="px-3 py-3 sm:px-8 sm:py-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[#F05E23]">Post Status</th>
                    <th className="px-3 py-3 sm:px-8 sm:py-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Created At</th>
                    <th className="px-3 py-3 sm:px-8 sm:py-6 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Due Date</th>
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
                      <td className="px-3 py-3 sm:px-8 sm:py-6">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#F05E23] bg-[#F05E23]/10 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-[#F05E23]/20">
                          {task.contentId || "N/A"}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-8 sm:py-6">
                        <span className={`text-xs sm:text-sm font-bold ${isDark ? "text-white" : "text-[#111]"}`}>{task.title}</span>
                      </td>
                      <td className="px-3 py-3 sm:px-8 sm:py-6">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[10px] sm:text-xs font-bold ${isDark ? "text-white/60" : "text-slate-600"}`}>
                            {task.internId?.department || task.marketingData?.departmentId?.name || task.marketingData?.postTracker?.postType || "General Assignments"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-8 sm:py-6">
                        <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border ${task.status === 'Complete' ? 'bg-green-500/10 border-green-500/20 text-green-400' : (isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-slate-100 border-black/10 text-slate-500')}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-8 sm:py-6">
                        <span className={`text-[9px] sm:text-[10px] font-bold ${isDark ? "text-white/80" : "text-slate-700"}`}>
                          {task.marketingData?.reviewStatus || "-"}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-8 sm:py-6">
                        <span className={`text-[9px] sm:text-[10px] font-bold ${task.marketingData?.brandManagerReviewStatus === 'Approved' ? 'text-green-400' : (task.marketingData?.brandManagerReviewStatus === 'Changes Requested' ? 'text-amber-400' : (isDark ? "text-white/40" : "text-slate-400"))}`}>
                          {task.marketingData?.brandManagerReviewStatus || "Pending"}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-8 sm:py-6">
                        {task.marketingData?.editedLink || task.marketingData?.rawLink ? (
                          <a 
                            href={task.marketingData.editedLink || task.marketingData.rawLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[9px] sm:text-[10px] font-black uppercase text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Link <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className={`text-[9px] sm:text-[10px] font-bold ${isDark ? "text-white/40" : "text-slate-400"}`}>-</span>
                        )}
                      </td>
                      <td className="px-3 py-3 sm:px-8 sm:py-6">
                        <span className="text-[10px] sm:text-xs font-bold text-[#F05E23]">
                          {task.marketingData?.postTracker?.scheduledDate || "-"}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-8 sm:py-6">
                        <span className={`text-[9px] sm:text-[10px] font-bold ${task.marketingData?.postTracker?.status?.includes('Posted') ? 'text-green-400' : 'text-amber-400'}`}>
                          {task.marketingData?.postTracker?.status || "-"}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-8 sm:py-6">
                        <span className={`text-[10px] sm:text-xs font-bold ${isDark ? "text-white/50" : "text-slate-500"}`}>
                          {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "-"}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-8 sm:py-6">
                        <span className={`text-[10px] sm:text-xs font-bold ${isDark ? "text-white/50" : "text-slate-500"}`}>
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`p-3 sm:p-4 border-t text-center ${isDark ? "bg-black/40 border-white/10" : "bg-slate-50 border-black/10"}`}>
              <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] italic ${isDark ? "text-white/30" : "text-slate-400"}`}>Click any row to expand details in Card View</span>
            </div>
          </div>
        ) : null}
      </div>

      {/* ── CALENDAR VIEW ──────────────────────────────────────────────────── */}
      {viewMode === "calendar" && (
        <div className="max-w-[1600px] mx-auto relative z-10">

          {/* Department & Completion Flow Legend */}
          <div className={`mb-4 sm:mb-6 flex flex-col xl:flex-row xl:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white border-black/10 shadow-sm"}`}>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
              <span className={`text-[0.55rem] sm:text-[0.6rem] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mr-1 sm:mr-2 ${isDark ? "text-white/40" : "text-slate-400"}`}>Dept Legend:</span>
              {Object.entries(DEPT_COLORS).filter(([k]) => k !== "Default").map(([name, c]) => (
                <span key={name} className={`flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg text-[0.5rem] sm:text-[0.6rem] font-black uppercase tracking-widest ${c.light} ${c.border} border ${c.text}`}>
                  <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${c.bg}`} />{name}
                </span>
              ))}
              <span className="ml-auto xl:ml-2 flex items-center gap-1 sm:gap-1.5 text-[0.5rem] sm:text-[0.6rem] font-black uppercase tracking-widest text-green-400">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400" />Posted
              </span>
              <span className="flex items-center gap-1 sm:gap-1.5 text-[0.5rem] sm:text-[0.6rem] font-black uppercase tracking-widest text-amber-400">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400" />Pending Post
              </span>
            </div>

            <div className={`flex flex-wrap items-center gap-1.5 pt-2 xl:pt-0 border-t xl:border-t-0 w-full xl:w-auto ${isDark ? "border-white/10" : "border-slate-100"}`}>
              <span className={`text-[0.55rem] sm:text-[0.6rem] font-black uppercase tracking-[0.2em] mr-1 ${isDark ? "text-white/40" : "text-slate-400"}`}>Completion Flow:</span>
              {[
                { label: "20% Draft", color: "bg-red-500" },
                { label: "40% Work", color: "bg-amber-500" },
                { label: "60% HQ", color: "bg-purple-500" },
                { label: "80% Brand", color: "bg-blue-500" },
                { label: "100% Posted", color: "bg-green-500" },
              ].map(({ label, color }) => (
                <span key={label} className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.5rem] font-bold uppercase ${isDark ? "bg-white/5 text-white/70 border border-white/10" : "bg-slate-100 text-slate-600 border border-black/5"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Calendar Header — Month Nav */}
          <div className={`flex items-center justify-between mb-3 sm:mb-4 px-1 sm:px-2`}>
            <button
              onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
              className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border transition-all hover:scale-105 active:scale-95 ${isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-black/10 text-[#111] hover:bg-black/5"}`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="text-center">
              <h2 className={`text-lg sm:text-3xl font-black uppercase tracking-tighter italic ${isDark ? "text-white" : "text-[#111]"}`}>
                {calendarDate.toLocaleString("default", { month: "long" })}{" "}
                <span className="text-[#F05E23]">{calendarDate.getFullYear()}</span>
              </h2>
              <p className={`text-[0.5rem] sm:text-[0.6rem] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-0.5 ${isDark ? "text-white/30" : "text-slate-400"}`}>
                {displayTasks.filter(t => { const d = getTaskDate(t); return d && d.getMonth() === calendarDate.getMonth() && d.getFullYear() === calendarDate.getFullYear(); }).length} posts this month
              </p>
            </div>
            <button
              onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
              className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border transition-all hover:scale-105 active:scale-95 ${isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-black/10 text-[#111] hover:bg-black/5"}`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          {(() => {
            const year = calendarDate.getFullYear();
            const month = calendarDate.getMonth();
            const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const today = new Date();
            const startOffset = firstDay; // cells before day 1
            const totalCells = Math.ceil((daysInMonth + startOffset) / 7) * 7;

            // Map tasks to day number
            const tasksByDay = {};
            displayTasks.forEach(task => {
              const d = getTaskDate(task);
              if (d && d.getMonth() === month && d.getFullYear() === year) {
                const day = d.getDate();
                if (!tasksByDay[day]) tasksByDay[day] = [];
                tasksByDay[day].push(task);
              }
            });

            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

            return (
              <div className="overflow-x-auto w-full pb-4 scrollbar-hide">
                <div className={`w-full min-w-[320px] sm:min-w-[650px] lg:min-w-0 rounded-[2rem] border overflow-hidden ${isDark ? "bg-white/3 border-white/10" : "bg-white border-slate-200 shadow-2xl"}`}>
                  {/* Day Headers */}
                  <div className="grid grid-cols-7">
                    {dayNames.map(d => (
                      <div key={d} className={`py-2.5 sm:py-3 text-center text-[0.55rem] sm:text-[0.6rem] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] border-b ${isDark ? "border-white/10 text-white/40 bg-black/30" : "border-slate-100 text-slate-400 bg-slate-50"}`}>{d}</div>
                    ))}
                  </div>

                  {/* Day Cells */}
                  <div className="grid grid-cols-7 auto-rows-fr">
                    {Array.from({ length: totalCells }).map((_, idx) => {
                      const dayNum = idx - startOffset + 1;
                      const isValid = dayNum >= 1 && dayNum <= daysInMonth;
                      const isToday = isValid && today.getDate() === dayNum && today.getMonth() === month && today.getFullYear() === year;
                      const dayTasks = isValid ? (tasksByDay[dayNum] || []) : [];
                      const MAX_VISIBLE = 3;

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (isValid && dayTasks.length > 0 && window.innerWidth < 768) {
                              if (dayTasks.length === 1) {
                                setCalendarSelectedTask(dayTasks[0]);
                              } else {
                                const dateObj = new Date(year, month, dayNum);
                                const fullDateString = dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
                                setSelectedDayForModal({ date: dayNum, tasks: dayTasks, fullDateString });
                              }
                            }
                          }}
                          className={`min-h-[62px] sm:min-h-[110px] p-1 sm:p-2 border-b border-r transition-colors flex flex-col items-center sm:items-stretch justify-start ${
                            !isValid ? (isDark ? "bg-black/20 border-white/5" : "bg-slate-50/50 border-slate-100")
                            : isToday ? (isDark ? "bg-[#F05E23]/15 sm:bg-[#F05E23]/10 border-[#F05E23]/40" : "bg-[#F05E23]/10 sm:bg-[#F05E23]/5 border-[#F05E23]/30")
                            : (isDark ? "border-white/5 hover:bg-white/[0.03]" : "border-slate-100 hover:bg-slate-50/80")
                          }`}
                        >
                          {isValid && (
                            <>
                              <span className={`text-[0.8rem] sm:text-sm font-black leading-none text-center sm:text-left block mb-1 sm:mb-1.5 ${
                                isToday ? "text-[#F05E23]" : (isDark ? "text-white/90" : "text-slate-800")
                              }`}>
                                {dayNum}
                                {isToday && <span className="hidden sm:inline ml-1.5 text-[0.5rem] font-black uppercase bg-[#F05E23] text-white px-1.5 py-0.5 rounded-md">TODAY</span>}
                              </span>

                              {/* Mobile Compact Apple/iOS Indicator Pills (< 768px) */}
                              <div className="flex sm:hidden flex-wrap items-center justify-center gap-[3px] w-full mt-0.5">
                                {dayTasks.slice(0, 3).map(task => {
                                  const isPosted = task.marketingData?.postTracker?.status?.toLowerCase().includes('posted') || task.marketingData?.postedLink;
                                  const isComplete = isPosted || task.status === "Complete";
                                  const isWorking = task.status === "Working" || task.marketingData?.rawLink || task.marketingData?.editedLink;
                                  const pillColor = isComplete ? "bg-green-500 shadow-sm shadow-green-500/50" : isWorking ? "bg-[#F05E23] shadow-sm shadow-[#F05E23]/50" : "bg-amber-500";
                                  return (
                                    <button
                                      key={task._id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (dayTasks.length === 1) {
                                          setCalendarSelectedTask(task);
                                        } else {
                                          const dateObj = new Date(year, month, dayNum);
                                          const fullDateString = dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
                                          setSelectedDayForModal({ date: dayNum, tasks: dayTasks, fullDateString });
                                        }
                                      }}
                                      className={`w-3.5 h-1.5 rounded-full transition-transform active:scale-90 ${pillColor}`}
                                      title={`${task.contentId ? `#${task.contentId}` : task.title} (${task.status})`}
                                    />
                                  );
                                })}
                                {dayTasks.length > 3 && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white/40" />
                                )}
                              </div>

                              {/* Desktop Expanded Cards (>= 768px) */}
                              <div className="hidden sm:flex flex-col gap-1.5">
                                {dayTasks.slice(0, MAX_VISIBLE).map(task => {
                                  const dc = getDeptColor(task);
                                  const isPosted = task.marketingData?.postTracker?.status?.toLowerCase().includes('posted') || task.marketingData?.postedLink;
                                  const postColor = isPosted ? "bg-green-500" : "bg-amber-500";
                                  
                                  // Calculate completion flow step (1 to 5)
                                  let step = 1;
                                  if (isPosted || task.status === "Complete") step = 5;
                                  else if (task.marketingData?.brandManagerReviewStatus === "Approved") step = 4;
                                  else if (task.marketingData?.reviewStatus === "Approved") step = 3;
                                  else if (task.status === "Working" || task.marketingData?.rawLink || task.marketingData?.editedLink) step = 2;

                                  const stepColor = step === 5 ? "bg-green-500" : step === 4 ? "bg-blue-500" : step === 3 ? "bg-purple-500" : step === 2 ? "bg-amber-500" : "bg-red-500";

                                  return (
                                    <button
                                      key={task._id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCalendarSelectedTask(task);
                                      }}
                                      className={`w-full text-left px-1.5 py-1 rounded-lg text-[0.55rem] font-black uppercase tracking-wide truncate flex flex-col gap-1 transition-all hover:scale-[1.02] active:scale-95 shadow-sm ${dc.light} ${dc.border} border ${dc.text}`}
                                      title={`${task.title} — Step ${step}/5 (${step === 5 ? '100%' : step * 20 + '%'})`}
                                    >
                                      <div className="flex items-center justify-between gap-1 w-full truncate">
                                        <div className="flex items-center gap-1 truncate">
                                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${postColor}`} />
                                          <span className="truncate">{task.contentId ? `#${task.contentId}` : task.title?.slice(0, 14)}</span>
                                        </div>
                                        {task.marketingData?.postTracker?.postingTime && (
                                          <span className="text-[0.45rem] sm:text-[0.5rem] font-black shrink-0 px-1 py-0.2 rounded bg-black/10 dark:bg-white/15 text-[#F05E23] dark:text-amber-300">
                                            {task.marketingData.postTracker.postingTime}
                                          </span>
                                        )}
                                      </div>
                                      
                                      {/* 5-Step Progress Dots */}
                                      <div className="flex items-center justify-between w-full pt-0.5 border-t border-current/15">
                                        <div className="flex items-center gap-0.5">
                                          {[1, 2, 3, 4, 5].map(s => (
                                            <span
                                              key={s}
                                              className={`w-1 h-1 rounded-full transition-all ${
                                                s <= step ? stepColor : (isDark ? "bg-white/20" : "bg-black/15")
                                              }`}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-[0.42rem] font-black opacity-80">{step === 5 ? "100%" : `${step * 20}%`}</span>
                                      </div>
                                    </button>
                                  );
                                })}
                                {dayTasks.length > MAX_VISIBLE && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const dateObj = new Date(year, month, dayNum);
                                      const fullDateString = dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
                                      setSelectedDayForModal({ date: dayNum, tasks: dayTasks, fullDateString });
                                    }}
                                    className={`w-full text-center text-[0.5rem] font-black uppercase tracking-widest py-0.5 rounded-lg transition-all ${
                                      isDark ? "text-white/30 hover:text-white/60 bg-white/5" : "text-slate-400 hover:text-slate-700 bg-slate-100"
                                    }`}
                                  >
                                    +{dayTasks.length - MAX_VISIBLE} more
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── SELECTED DAY POSTS SELECTOR MODAL / BOTTOM DRAWER (iOS Calendar Style) ── */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedDayForModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99990] bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6"
              onClick={() => setSelectedDayForModal(null)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full sm:max-w-md max-h-[85vh] sm:max-h-[75vh] rounded-t-[2.5rem] sm:rounded-[2rem] border overflow-hidden flex flex-col shadow-2xl ${
                  isDark ? "bg-[#161618] border-white/15 text-white" : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                {/* Clean Apple iOS Calendar Header */}
                <div className={`pt-5 pb-4 px-6 border-b flex flex-col gap-2 shrink-0 ${
                  isDark ? "border-white/10 bg-[#1C1C1E]/80" : "border-slate-100 bg-slate-50/80"
                }`}>
                  <div className="flex items-center justify-between w-full">
                    <button
                      onClick={() => setSelectedDayForModal(null)}
                      className="flex items-center text-[#F05E23] font-semibold text-sm hover:opacity-80 transition-opacity -ml-1"
                    >
                      <ChevronLeft className="w-5 h-5 -mr-0.5" /> Back to Calendar
                    </button>
                    <button
                      onClick={() => setSelectedDayForModal(null)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        isDark ? "bg-white/10 hover:bg-white/20 text-white/70" : "bg-slate-200 hover:bg-slate-300 text-slate-600"
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {selectedDayForModal.fullDateString}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedDayForModal.tasks.length} {selectedDayForModal.tasks.length === 1 ? "Scheduled Post" : "Scheduled Posts"}
                    </p>
                  </div>
                </div>

                {/* Clean iOS Apple Calendar Event List */}
                <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
                  {selectedDayForModal.tasks.map((task, idx) => {
                    const pt = task.marketingData?.postTracker || {};
                    const isPosted = pt.status?.toLowerCase().includes('posted') || task.marketingData?.postedLink;
                    const postColor = isPosted ? "bg-green-500" : "bg-[#F05E23]";
                    let step = 1;
                    if (isPosted || task.status === "Complete") step = 5;
                    else if (task.marketingData?.brandManagerReviewStatus === "Approved") step = 4;
                    else if (task.marketingData?.reviewStatus === "Approved") step = 3;
                    else if (task.status === "Working" || task.marketingData?.rawLink || task.marketingData?.editedLink) step = 2;

                    return (
                      <button
                        key={task._id || idx}
                        onClick={() => {
                          setSelectedDayForModal(null);
                          setCalendarSelectedTask(task);
                        }}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all flex items-center justify-between gap-3 group border ${
                          isDark
                            ? "bg-[#242426] hover:bg-[#2C2C2E] border-white/5 active:bg-[#343436]"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 active:bg-slate-200/60"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          {/* Vertical Indicator Pill (iOS Event Style) */}
                          <div className={`w-1.5 h-11 rounded-full shrink-0 ${postColor} shadow-sm`} />
                          
                          {/* Event Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              {pt.postingTime && (
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                  ⏰ {pt.postingTime}
                                </span>
                              )}
                              {task.contentId && (
                                <span className="text-[11px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#F05E23]/15 text-[#F05E23]">
                                  #{task.contentId}
                                </span>
                              )}
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                step === 5 ? "bg-green-500/15 text-green-500" : "bg-amber-500/15 text-amber-500"
                              }`}>
                                {step === 5 ? "100% Done" : `${step * 20}% • ${task.status}`}
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold tracking-tight truncate text-slate-900 dark:text-white group-hover:text-[#F05E23] transition-colors">
                              {task.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate font-medium">
                              {pt.postType || task.taskType || "Digital Marketing Post"}
                            </p>
                          </div>
                        </div>

                        {/* Subtle Apple-Style Right Chevron */}
                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-all ${
                          isDark ? "bg-white/5 group-hover:bg-white/10 text-white/50 group-hover:text-white" : "bg-slate-200/60 group-hover:bg-slate-200 text-slate-400 group-hover:text-slate-700"
                        }`}>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      , document.body)}

      {/* ── CALENDAR TASK DETAIL PANEL ─────────────────────────────────────── */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {calendarSelectedTask && (() => {
            const t = calendarSelectedTask;
            const dc = getDeptColor(t);
            const pt = t.marketingData?.postTracker || {};
            const isPosted = pt.status?.toLowerCase().includes('posted') || t.marketingData?.postedLink;
            const scheduledDate = getTaskDate(t);
            const dept = t.internId?.department || t.marketingData?.departmentId?.mainDepartment || "Digital Marketing";
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-end"
                onClick={() => setCalendarSelectedTask(null)}
              >
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                  onClick={e => e.stopPropagation()}
                  className={`w-full max-w-md h-full overflow-y-auto flex flex-col ${isDark ? "bg-[#0A0A0E] border-l border-white/10" : "bg-white border-l border-slate-200 shadow-2xl"}`}
                >
                  {/* Panel Header */}
                  <div className={`p-6 flex items-start justify-between gap-4 border-b shrink-0 sticky top-0 z-10 backdrop-blur-md ${isDark ? "border-white/10 bg-[#0A0A0E]/90" : "border-slate-100 bg-white/90"}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${dc.light} ${dc.border} border`}>
                        <Building2 className={`w-5 h-5 ${dc.text}`} />
                      </div>
                      <div className="min-w-0">
                        <span className={`text-[0.55rem] font-black uppercase tracking-[0.3em] ${dc.text}`}>{dept}</span>
                        <h3 className={`text-sm font-black uppercase tracking-tight leading-tight truncate ${isDark ? "text-white" : "text-[#111]"}`}>{t.title}</h3>
                      </div>
                    </div>
                    <button onClick={() => setCalendarSelectedTask(null)} className={`p-2 rounded-xl transition-all shrink-0 ${isDark ? "hover:bg-white/10 text-white/50 hover:text-white" : "hover:bg-black/5 text-slate-400 hover:text-[#111]"}`} title="Close Panel">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Panel Body */}
                  <div className="flex-1 p-6 space-y-5 overflow-y-auto">

                    {/* Status + Post Status Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1.5 rounded-xl text-[0.6rem] font-black uppercase tracking-widest border ${
                        t.status === "Complete" ? "bg-green-500/15 border-green-500/30 text-green-400"
                        : t.status === "Working" ? "bg-[#F05E23]/15 border-[#F05E23]/30 text-[#F05E23]"
                        : isDark ? "bg-white/10 border-white/20 text-white/60" : "bg-slate-100 border-black/10 text-slate-500"
                      }`}>{t.status}</span>
                      <span className={`px-3 py-1.5 rounded-xl text-[0.6rem] font-black uppercase tracking-widest border ${
                        isPosted ? "bg-green-500/15 border-green-500/30 text-green-400" : "bg-amber-500/15 border-amber-500/30 text-amber-400"
                      }`}>{isPosted ? "✓ Posted" : "⏳ Pending Post"}</span>
                      {pt.postType && (
                        <span className={`px-3 py-1.5 rounded-xl text-[0.6rem] font-black uppercase tracking-widest border ${dc.light} ${dc.border} ${dc.text}`}>{pt.postType}</span>
                      )}
                    </div>

                    {/* Completion Workflow Progress Bar */}
                    {(() => {
                      let step = 1;
                      if (isPosted || t.status === "Complete") step = 5;
                      else if (t.marketingData?.brandManagerReviewStatus === "Approved") step = 4;
                      else if (t.marketingData?.reviewStatus === "Approved") step = 3;
                      else if (t.status === "Working" || t.marketingData?.rawLink || t.marketingData?.editedLink) step = 2;

                      const steps = [
                        { num: 1, label: "Draft / Assigned", color: "bg-red-500", text: "text-red-500" },
                        { num: 2, label: "Work / Links", color: "bg-amber-500", text: "text-amber-500" },
                        { num: 3, label: "HQ Approved", color: "bg-purple-500", text: "text-purple-500" },
                        { num: 4, label: "Brand Approved", color: "bg-blue-500", text: "text-blue-500" },
                        { num: 5, label: "Live Posted", color: "bg-green-500", text: "text-green-500" },
                      ];

                      return (
                        <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-black/10 shadow-inner"}`}>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className={`text-[0.55rem] font-black uppercase tracking-widest ${isDark ? "text-white/50" : "text-slate-500"}`}>
                              Workflow Progress <span className="ml-1 opacity-70">({step * 20}%)</span>
                            </span>
                            <span className={`text-[0.6rem] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                              step === 5 ? "bg-green-500/10 border-green-500/20 text-green-400"
                              : step === 4 ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                              : step === 3 ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                              : step === 2 ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}>
                              Step {step}/5: {steps[step - 1].label}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? "bg-black/40" : "bg-slate-200"}`}>
                              <div
                                className={`h-full transition-all duration-700 rounded-full ${steps[step - 1].color}`}
                                style={{ width: `${step * 20}%` }}
                              />
                            </div>
                            
                            <div className="grid grid-cols-5 gap-1 pt-1">
                              {steps.map(s => (
                                <div key={s.num} className={`text-center transition-all ${s.num <= step ? "opacity-100" : "opacity-30"}`}>
                                  <div className={`w-3.5 h-3.5 mx-auto rounded-full flex items-center justify-center text-[0.5rem] font-black text-white mb-1 ${s.num <= step ? s.color : (isDark ? "bg-white/20" : "bg-slate-300")}`}>
                                    {s.num <= step ? "✓" : s.num}
                                  </div>
                                  <span className={`text-[0.45rem] font-black uppercase tracking-tight block truncate ${s.num === step ? s.text : (isDark ? "text-white/60" : "text-slate-600")}`}>
                                    {s.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Content ID + Company */}
                    {(t.contentId || companyName) && (
                      <div className={`p-4 rounded-2xl border grid grid-cols-2 gap-4 ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-black/8"}`}>
                        {t.contentId && (
                          <div>
                            <span className={`text-[0.55rem] font-black uppercase tracking-widest block mb-1 ${isDark ? "text-white/40" : "text-slate-400"}`}>Content ID</span>
                            <span className="text-xs font-black text-[#F05E23]">#{t.contentId}</span>
                          </div>
                        )}
                        {companyName && (
                          <div>
                            <span className={`text-[0.55rem] font-black uppercase tracking-widest block mb-1 ${isDark ? "text-white/40" : "text-slate-400"}`}>Company</span>
                            <span className={`text-xs font-black uppercase truncate block ${isDark ? "text-white" : "text-[#111]"}`}>{companyName}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Schedule & Timing Info */}
                    <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-black/8"}`}>
                      {scheduledDate && (
                        <div className="flex items-center justify-between">
                          <span className={`text-[0.55rem] font-black uppercase tracking-widest ${isDark ? "text-white/40" : "text-slate-400"}`}>Scheduled Date</span>
                          <span className="text-xs font-bold text-[#F05E23]">{scheduledDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                        </div>
                      )}
                      {pt.postingTime && (
                        <div className="flex items-center justify-between">
                          <span className={`text-[0.55rem] font-black uppercase tracking-widest ${isDark ? "text-white/40" : "text-slate-400"}`}>Posting Time</span>
                          <span className={`text-xs font-bold ${isDark ? "text-white/70" : "text-slate-600"}`}>{pt.postingTime}</span>
                        </div>
                      )}
                      {t.dueDate && (
                        <div className="flex items-center justify-between">
                          <span className={`text-[0.55rem] font-black uppercase tracking-widest ${isDark ? "text-white/40" : "text-slate-400"}`}>Due Date</span>
                          <span className={`text-xs font-bold ${isDark ? "text-white/70" : "text-slate-600"}`}>{new Date(t.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Links Section */}
                    <div className="space-y-3">
                      <h4 className={`text-[0.6rem] font-black uppercase tracking-[0.3em] ${isDark ? "text-white/40" : "text-slate-400"}`}>Work Links</h4>
                      {[{
                        label: "Raw / Asset Link", key: "rawLink", val: t.marketingData?.rawLink || pt.rawLink, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20"
                      }, {
                        label: "Final / Edited Link", key: "editedLink", val: t.marketingData?.editedLink || pt.finalLink, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20"
                      }, {
                        label: "Posted Link", key: "postedLink", val: t.marketingData?.postedLink || t.marketingData?.postTracker?.postedLink || t.liveLink, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20"
                      }].map(({ label, val, color, bg }) => (
                        <div key={label} className={`flex items-center justify-between gap-2 p-3 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white border-black/10"}`}>
                          <div className="min-w-0">
                            <span className={`text-[0.5rem] font-black uppercase tracking-widest block ${isDark ? "text-white/30" : "text-slate-400"}`}>{label}</span>
                            {val ? (
                              <span className={`text-[0.6rem] font-bold truncate block max-w-[200px] ${color}`}>{val}</span>
                            ) : (
                              <span className={`text-[0.6rem] font-bold ${isDark ? "text-white/20" : "text-slate-300"}`}>Not submitted yet</span>
                            )}
                          </div>
                          {val && (
                            <a href={val} target="_blank" rel="noopener noreferrer"
                              className={`shrink-0 p-2 rounded-xl border transition-all hover:scale-110 ${bg} ${color}`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Client Remarks */}
                    {pt.clientRemarks && (
                      <div className={`rounded-2xl p-4 border ${isDark ? "bg-amber-500/10 border-amber-500/20" : "bg-amber-50 border-amber-200"}`}>
                        <span className="text-[0.55rem] font-black uppercase tracking-widest text-amber-500 block mb-1.5">Client Remarks</span>
                        <p className={`text-xs font-bold leading-relaxed ${isDark ? "text-amber-200" : "text-amber-700"}`}>{pt.clientRemarks}</p>
                      </div>
                    )}

                    {/* Description */}
                    {t.description && (
                      <div className={`rounded-2xl p-4 border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-black/8"}`}>
                        <span className={`text-[0.55rem] font-black uppercase tracking-widest block mb-1.5 ${isDark ? "text-white/40" : "text-slate-400"}`}>Description</span>
                        <p className={`text-xs font-medium leading-relaxed ${isDark ? "text-white/70" : "text-slate-600"}`}>{t.description}</p>
                      </div>
                    )}

                    {/* Dept Color Info */}
                    <div className={`rounded-2xl p-4 border flex items-center gap-3 ${dc.light} ${dc.border}`}>
                      <span className={`w-3 h-3 rounded-full shrink-0 ${dc.bg}`} />
                      <div>
                        <span className={`text-[0.55rem] font-black uppercase tracking-widest block ${dc.text}`}>{dept}</span>
                        <span className={`text-[0.6rem] font-bold ${isDark ? "text-white/50" : "text-slate-500"}`}>{t.marketingData?.departmentId?.name || pt.postType || "General"}</span>
                      </div>
                    </div>

                    {/* Review Button */}
                    {t.marketingData?.reviewStatus === "Pending" && t.status !== "Complete" && (
                      <div className={`rounded-2xl p-4 border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-black/8"}`}>
                        <h4 className={`text-[0.6rem] font-black uppercase tracking-widest mb-3 ${isDark ? "text-white/60" : "text-slate-600"}`}>Submit Brand Review</h4>
                        <div className="space-y-3">
                          <select
                            value={reviewForm.status}
                            onChange={e => setReviewForm(f => ({ ...f, status: e.target.value }))}
                            className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold outline-none ${isDark ? "bg-black/40 border-white/10 text-white" : "bg-white border-black/10 text-[#111]"}`}
                          >
                            <option value="">Select Status...</option>
                            <option value="Approved">✅ Approved</option>
                            <option value="Changes Requested">✏️ Changes Requested</option>
                            <option value="Rejected">❌ Rejected</option>
                          </select>
                          <textarea
                            value={reviewForm.remarks}
                            onChange={e => setReviewForm(f => ({ ...f, remarks: e.target.value }))}
                            placeholder="Remarks (optional)"
                            rows={2}
                            className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold outline-none resize-none ${isDark ? "bg-black/40 border-white/10 text-white placeholder:text-white/30" : "bg-white border-black/10 text-[#111] placeholder:text-slate-400"}`}
                          />
                          <button
                            onClick={async () => { await handleReviewSubmit(t._id); setCalendarSelectedTask(null); }}
                            disabled={submittingReview || !reviewForm.status}
                            className="w-full py-3 bg-gradient-to-r from-[#F05E23] to-amber-500 text-white rounded-xl font-black uppercase text-[0.6rem] tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:scale-100"
                          >
                            {submittingReview ? "Submitting..." : "Submit Review"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Panel Footer */}
                  <div className={`p-4 border-t shrink-0 flex flex-col sm:flex-row gap-2 ${isDark ? "border-white/10 bg-black/30" : "border-slate-100 bg-slate-50"}`}>
                    <button
                      onClick={() => setCalendarSelectedTask(null)}
                      className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[0.6rem] border transition-all hover:bg-red-500 hover:text-white hover:border-red-500 ${
                        isDark ? "border-white/10 text-white/70 bg-white/5" : "border-black/10 text-slate-700 bg-slate-100"
                      }`}
                    >
                      <X className="w-3.5 h-3.5 inline mr-1.5" />Close Panel
                    </button>
                    <button
                      onClick={() => { setViewMode("cards"); setExpandedTask(t._id); setCalendarSelectedTask(null); }}
                      className={`w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[0.6rem] border transition-all hover:bg-[#F05E23] hover:text-white hover:border-[#F05E23] ${
                        isDark ? "border-white/10 text-white/50" : "border-black/10 text-slate-500"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 inline mr-1.5" />View Full Details in Card View
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>,
        document.body
      )}
      
      {/* Footer */}
      <div className="mt-24 pt-8 border-t border-white/5 text-center relative z-10">
        <p className={`text-[9px] font-black uppercase tracking-[0.5em] italic ${isDark ? "text-white/20" : "text-slate-400"}`}>
          Synchronous Build Digital
        </p>
      </div>
    </div>
  );
}
