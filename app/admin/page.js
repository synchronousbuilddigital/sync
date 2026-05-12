"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, CheckCircle2, Clock, Plus, Trash2,
  Send, UserPlus, ClipboardList, TrendingUp,
  Mail, X, Check, Search, AlertCircle, Calendar, Briefcase, Shield,
  ExternalLink, MessageSquare, Save, Activity, PlusCircle, Zap, FileText,
  Globe, ChevronRight, Trophy
} from "lucide-react";
import AdminHiring from "../../components/AdminHiring";

export default function AdminDashboard() {
  const router = useRouter();
  const {
    user, interns, tasks, leaves, projects,
    addIntern, removeIntern, assignTask, updateTaskStatus, deleteTask, reassignTask,
    approveLeave, announceToAll, addProject, updateProject, deleteProject,
    adminClientProjects, createClient, createClientProject, updateClientProject,
    purgeClientProject, generateRoadmap, generateBrandIntel, sendAdminFeed, 
    markFeedbackAsRead, loading
  } = useAuth();

  const [activeTab, setActiveTab] = useState("interns");

  // Client Management States
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [clientForm, setClientForm] = useState({
    name: "", email: "", password: "SyncClient123", projectName: "",
    brandDescription: "", colorStyle: "", theme: "Single", features: "", pages: "",
    credentials: {
      env: "",
      gmail: { email: "", password: "" },
      vercel: { email: "", password: "" },
      github: "",
      additional: ""
    }
  });
  const [brandFormStep, setBrandFormStep] = useState(1);
  const [brandIntelLoading, setBrandIntelLoading] = useState(false);
  const [isAddingIntern, setIsAddingIntern] = useState(false);
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [newIntern, setNewIntern] = useState({ name: "", email: "", password: "SyncIntern123" });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    internId: "",
    taskType: "General",
    priority: "Medium",
    dueDate: "",
    taskCount: 1,
    clientProjectId: ""
  });
  const [projectForm, setProjectForm] = useState({
    title: "", index: "", category: "Verified Partner",
    description: "", strategyDetail: "", happinessDetail: "",
    tags: "", impact: ""
  });
  const [chatTaskId, setChatTaskId] = useState(null);
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [customTasks, setCustomTasks] = useState([]);
  const [customTaskInput, setCustomTaskInput] = useState("");
  const [feasibility, setFeasibility] = useState({ feasible: true, totalHours: 0, internLoad: 0 });
  const [chatMsg, setChatMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState({ type: "", msg: "" });
  const [selectedInternForTask, setSelectedInternForTask] = useState("");
  const [expandedHoliday, setExpandedHoliday] = useState(null);
  const [expandedBrand, setExpandedBrand] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [aiRiskResult, setAiRiskResult] = useState("");
  const [analyzingRisk, setAnalyzingRisk] = useState(false);
  const { getAIInternRecommendation, runAIRiskAnalysis, generateAIStory } = useAuth();

  // Credential Management States
  const [isEditingCredentials, setIsEditingCredentials] = useState(false);
  const [selectedCredentialProject, setSelectedCredentialProject] = useState(null);
  const [credentialForm, setCredentialForm] = useState({
    env: "",
    gmail: { email: "", password: "" },
    vercel: { email: "", password: "" },
    github: "",
    liveUrl: "",
    devUrl: "",
    additional: ""
  });

  const chatTask = tasks.find(t => t._id === chatTaskId);
  const tabLabels = {
    interns: "Team",
    tasks: "Tasks",
    holidays: "Time Off",
    portfolio: "Projects",
    brands: "Clients",
    hiring: "Hiring",
    overview: "Overview"
  };

  useEffect(() => {
    if (statusMsg.msg) {
      const timer = setTimeout(() => setStatusMsg({ type: "", msg: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  useEffect(() => {
    const calculateFeasibility = () => {
      const totalTasks = (selectedSteps || []).length + (customTasks || []).length;
      const totalHours = totalTasks * 2;

      const internTasks = (tasks || []).filter(t => t.internId?._id === newTask.internId && t.status !== 'Complete');
      const currentLoad = internTasks.reduce((acc, curr) => acc + (curr.estimatedHours || 2), 0);

      setFeasibility({
        feasible: (totalHours + currentLoad) <= 8,
        totalHours: totalHours + currentLoad,
        internLoad: currentLoad
      });
    };

    calculateFeasibility();
  }, [selectedSteps, customTasks, newTask.internId, tasks]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#050505]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Clock className="w-12 h-12 text-[#F05E23]" />
      </motion.div>
    </div>
  );

  if (!user || user.role !== "admin") {
    return <div className="p-20 text-center font-bold text-red-500 uppercase tracking-widest">Access Denied. Unauthorized Personnel.</div>;
  }

  const isCurrentMonth = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  };

  const handleApproveTask = async (taskId) => {
    const res = await updateTaskStatus(taskId, "Complete", "Task approved by Admin.", true);
    if (res.success) {
      setStatusMsg({ type: "success", msg: "Task approved and finalized!" });
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatMsg.trim() || !chatTask) return;

    // Placeholder as per structure
    const res = await { success: false };
    if (res.success) {
      setStatusMsg({ type: "success", msg: "Direct Sync active." });
      setChatMsg("");
    } else {
      setStatusMsg({ type: "error", msg: "Transmission failed." });
    }
  };

  const handleAddIntern = async (e) => {
    e.preventDefault();
    const res = await addIntern(newIntern.name, newIntern.email, newIntern.password);
    if (res.success) {
      setStatusMsg({ type: "success", msg: `Intern added!` });
      setIsAddingIntern(false);
      setNewIntern({ name: "", email: "", password: "SyncIntern123" });
    } else {
      setStatusMsg({ type: "error", msg: res.message });
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!newTask.internId) return setStatusMsg({ type: "error", msg: "Select an intern." });

    const allTaskTitles = [...selectedSteps, ...customTasks];
    if (allTaskTitles.length === 0) return setStatusMsg({ type: "error", msg: "No tasks selected." });

    let createdCount = 0;
    for (const title of allTaskTitles) {
      const res = await assignTask({
        ...newTask,
        title,
        description: `Operational task for project step: ${title}`,
        estimatedHours: 2, // Standard estimation
        dueDate: new Date().toISOString()
      });
      if (res.success) createdCount++;
    }

    if (createdCount > 0) {
      setStatusMsg({ type: "success", msg: `${createdCount} Tasks Deployed Successfully.` });
      setIsAssigningTask(false);
      setSelectedSteps([]);
      setCustomTasks([]);
      setNewTask({ ...newTask, title: "", description: "", clientProjectId: "" });
    }
  };




  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    const res = await announceToAll(broadcastMsg);
    if (res.success) {
      setStatusMsg({ type: "success", msg: res.message });
      setBroadcastMsg("");
      setIsBroadcasting(false);
    } else {
      setStatusMsg({ type: "error", msg: res.message });
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...projectForm, tags: projectForm.tags.split(",").map(t => t.trim()) };

    let res;
    if (editingProject) {
      res = await updateProject(editingProject._id, payload);
    } else {
      res = await addProject(payload);
    }

    if (res.success) {
      setStatusMsg({ type: "success", msg: `Project ${editingProject ? 'updated' : 'deployed'} successfully.` });
      setIsAddingProject(false);
      setEditingProject(null);
      setProjectForm({ title: "", index: "", category: "Verified Partner", description: "", strategyDetail: "", happinessDetail: "", tags: "", impact: "" });
    } else {
      setStatusMsg({ type: "error", msg: res.message });
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      index: project.index,
      category: project.category,
      description: project.description,
      strategyDetail: project.strategyDetail,
      happinessDetail: project.happinessDetail,
      tags: project.tags.join(", "),
      impact: project.impact || ""
    });
    setIsAddingProject(true);
  };

  const adminStats = {
    totalInterns: interns.length,
    activeTasks: tasks.filter(t => t.status !== "Complete").length,
    completedTasks: tasks.filter(t => t.status === "Complete").length,
    monthlyPerformance: tasks.filter(t => t.status === "Complete" && isCurrentMonth(t.updatedAt || t.createdAt)).length,
    blockers: tasks.filter(t => t.status === "Need Credentials" || t.status === "Need Meeting").length,
    pendingHolidays: leaves.filter(l => l.status === "Pending").length,
    priorityDistribution: {
      High: tasks.filter(t => t.priority === "High").length,
      Medium: tasks.filter(t => (t.priority === "Medium" || !t.priority)).length,
      Low: tasks.filter(t => t.priority === "Low").length,
    },
    topBottleneck: interns.map(i => {
      const pending = tasks.filter(t => t.internId?._id === i._id && t.status !== "Complete").length;
      return { name: i.name, count: pending };
    }).sort((a, b) => b.count - a.count)[0] || { name: "N/A", count: 0 }
  };

  const statCards = [
    { icon: Users, label: "Team Members", val: adminStats.totalInterns, color: "blue", desc: "On the team" },
    { icon: Clock, label: "Active Operations", val: adminStats.activeTasks, color: "orange", desc: "Currently running" },
    { icon: AlertCircle, label: "Needs Attention", val: adminStats.blockers, color: "red", desc: "Action needed" },
    { icon: Trophy, label: "Monthly Performance", val: adminStats.monthlyPerformance, color: "yellow", desc: "Resets monthly" },
    { icon: CheckCircle2, label: "All-Time Units", val: adminStats.completedTasks, color: "green", desc: "Archived" }
  ];

  const taskBuckets = {
    pending: tasks.filter((task) => task.status === "Pending"),
    working: tasks.filter((task) => ["In Progress", "Need Credentials", "Need Meeting", "Blocked"].includes(task.status)),
  };

  const openTaskModalForIntern = (internId) => {
    setSelectedInternForTask(internId);
    setNewTask((current) => ({ ...current, internId }));
    setIsAssigningTask(true);
    setActiveTab("tasks");
  };

  const getTaskProgress = (task) => {
    if (task.status === "Complete") return "Complete";
    if (["In Progress", "Need Credentials", "Need Meeting"].includes(task.status)) return task.status === "In Progress" ? "Working" : "Blocked";
    return "Pending";
  };

  const getTaskTypeClasses = (taskType) => {
    switch (taskType) {
      case "Bug Fix":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "Feature":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Design":
        return "bg-violet-500/10 text-violet-600 border-violet-500/20";
      case "Content":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Research":
        return "bg-sky-500/10 text-sky-600 border-sky-500/20";
      case "Meeting":
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const getWeeklyData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const results = [];
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayStr = d.toDateString();

      // Count tasks updated or created today
      const dayTasks = tasks.filter(t => {
        const updateDate = new Date(t.updatedAt || t.createdAt).toDateString();
        return updateDate === dayStr;
      });
      const completions = dayTasks.filter(t => t.status === "Complete").length;

      // Calculate activity level (completions + new tasks)
      const totalActivity = dayTasks.length;
      const percentage = totalActivity > 0 ? Math.min(Math.round(((completions + (totalActivity * 0.2)) / (totalActivity || 1)) * 100), 100) : 0;

      results.push({
        label: days[d.getDay()],
        val: percentage,
        height: Math.max(percentage, 5),
        count: totalActivity
      });
    }
    return results;
  };

  const getInternAwards = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const internStats = interns.map(intern => {
      const internTasks = tasks.filter(t => t.internId?._id === intern._id);
      const weekTasks = internTasks.filter(t => new Date(t.updatedAt || t.createdAt) >= oneWeekAgo && t.status === "Complete");
      const monthTasks = internTasks.filter(t => new Date(t.updatedAt || t.createdAt) >= oneMonthAgo && t.status === "Complete");

      // Calculate efficiency (completed vs assigned in that period)
      const assignedWeek = internTasks.filter(t => new Date(t.createdAt) >= oneWeekAgo).length;
      const efficiency = assignedWeek > 0 ? (weekTasks.length / assignedWeek) : 0;

      return {
        ...intern,
        weekCount: weekTasks.length,
        monthCount: monthTasks.length,
        efficiency
      };
    });

    const internOfWeek = [...internStats].sort((a, b) => b.weekCount - a.weekCount || b.efficiency - a.efficiency)[0];
    const internOfMonth = [...internStats].sort((a, b) => b.monthCount - a.monthCount)[0];

    return { internOfWeek, internOfMonth };
  };

  const generateAIInsight = (intern) => {
    const internTasks = tasks.filter(t => t.internId?._id === intern._id);
    const pending = internTasks.filter(t => t.status !== "Complete").length;
    const completed = internTasks.filter(t => t.status === "Complete").length;
    const blockers = internTasks.filter(t => ["Need Credentials", "Need Meeting"].includes(t.status)).length;
    const highPriority = internTasks.filter(t => t.priority === "High" && t.status !== "Complete").length;

    if (blockers > 2) return "Action Required: High volume of blockers. Investigate credential access for mission critical flow.";
    if (highPriority > 1) return "Warning: High priority overload. Unit requires focus support to maintain timeline integrity.";
    if (completed > 10 && pending < 2) return "Performance Peak: Exceptional velocity. Ready for high-complexity deployment scaling.";
    if (pending > 5) return "Observation: Increasing backlog detected. Recommend tactical redistribution of low-priority units.";
    return "Status Nominal: Steady operational output. Maintaining standard efficiency parameters.";
  };

  const weeklyData = getWeeklyData();
  const awards = getInternAwards();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#F05E23]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3 mb-4">
            <div className="w-12 h-0.5 bg-[#F05E23]" />
            <span className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-[#F05E23]">Admin Workspace</span>
          </motion.div>
          <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-7xl font-black tracking-tighter leading-none text-slate-950 dark:text-white">Admin <span className="text-[#F05E23] drop-shadow-[0_0_15px_rgba(240,94,35,0.2)]">Dashboard</span></motion.h1>
          <p className="mt-6 text-slate-500 dark:text-white/35 font-semibold uppercase tracking-[0.2em] text-[0.6rem] flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Logged in as <span className="text-black dark:text-white">{user?.name}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <button onClick={() => setIsBroadcasting(true)} className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-800 dark:text-white px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[0.6rem] flex items-center gap-3 transition-all border border-black/5 dark:border-white/5 active:scale-95">
            <Send className="w-3.5 h-3.5 text-[#F05E23]" /> Send Update
          </button>
          <button onClick={() => { setEditingProject(null); setProjectForm({ title: "", index: "", category: "Verified Partner", description: "", strategyDetail: "", happinessDetail: "", tags: "", impact: "" }); setIsAddingProject(true); }} className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-800 dark:text-white px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[0.6rem] flex items-center gap-3 transition-all border border-black/5 dark:border-white/5 active:scale-95">
            <Plus className="w-3.5 h-3.5 text-[#F05E23]" /> Add Project
          </button>
          <button onClick={() => {
            setClientForm({
              name: "", email: "", password: "SyncClient123", projectName: "",
              credentials: {
                env: "",
                gmail: { email: "", password: "" },
                vercel: { email: "", password: "" },
                github: "",
                additional: ""
              }
            });
            setIsAddingClient(true);
          }} className="px-8 py-5 bg-[#F05E23] text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[0.6rem] flex items-center gap-3 hover:shadow-[0_0_30px_rgba(240,94,35,0.3)] transition-all active:scale-95">
            <UserPlus className="w-3.5 h-3.5" /> Add Client
          </button>
          <button onClick={() => setIsAddingIntern(true)} className="bg-black dark:bg-white text-white dark:text-black px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[0.6rem] flex items-center gap-3 transition-all hover:opacity-90 active:scale-95">
            <UserPlus className="w-3.5 h-3.5" /> Add Team Member
          </button>
          <button onClick={() => setIsAssigningTask(true)} className="bg-slate-900/5 dark:bg-white/5 text-slate-800 dark:text-white px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[0.6rem] flex items-center gap-3 border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-95">
            <Plus className="w-3.5 h-3.5" /> Create Task
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
        {statCards.map((stat, i) => (
          <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-white/3 border border-black/5 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm hover:border-[#F05E23]/20 transition-all group relative overflow-hidden backdrop-blur-sm">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/[0.025] rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`} />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className={`p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 group-hover:border-[#F05E23]/20 transition-all`}>
                <stat.icon className={`w-5 h-5 text-${stat.color === 'orange' ? '[#F05E23]' : stat.color + '-500'}`} />
              </div>
              <span className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/20">{stat.label}</span>
            </div>
            <div className="text-5xl font-black mb-2 relative z-10 tracking-tighter italic text-slate-900 dark:text-white">{stat.val}</div>
            <p className="text-[0.55rem] font-bold text-slate-400 dark:text-white/10 uppercase tracking-widest relative z-10">{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: "interns", icon: Users },
          { id: "tasks", icon: ClipboardList },
          { id: "holidays", icon: Calendar },
          { id: "portfolio", icon: Briefcase },
          { id: "brands", icon: Shield },
          { id: "hiring", icon: UserPlus },
          { id: "overview", icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[0.65rem] transition-all relative flex items-center gap-3 ${activeTab === tab.id ? "bg-[#F05E23] text-white shadow-lg shadow-[#F05E23]/30" : "bg-white dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white border border-black/5 dark:border-white/10"}`}
          >
            <tab.icon className="w-4 h-4" />
            {tabLabels[tab.id]}
          </button>
        ))}
      </div>

      <div className="min-h-100">
        {activeTab === "interns" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {interns.map((intern) => {
                const iTasks = tasks.filter(t => t.internId?._id === intern._id);
                const completedMonthly = iTasks.filter(t => t.status === "Complete" && isCurrentMonth(t.updatedAt || t.createdAt)).length;
                const totalMonthly = iTasks.filter(t => isCurrentMonth(t.createdAt)).length || 1;
                const rate = Math.round((completedMonthly / totalMonthly) * 100);
                const pendingTasks = iTasks.filter(t => t.status !== "Complete").length;

                return (
                  <motion.div layout initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} key={intern._id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-5 rounded-2xl relative group overflow-hidden hover:border-[#F05E23]/20 transition-all">
                    <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => openTaskModalForIntern(intern._id)} className="p-2 bg-[#F05E23]/10 text-[#F05E23] rounded-lg hover:bg-[#F05E23] hover:text-white transition-all" title="Assign task">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => removeIntern(intern._id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#F05E23] to-[#FF8C61] flex items-center justify-center text-white font-black text-lg shadow-lg shrink-0">
                        {intern.name?.[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-sm truncate text-slate-900 dark:text-white">{intern.name}</h3>
                        <p className="text-[0.6rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight truncate">{intern.email}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[0.55rem] font-black uppercase text-slate-500 dark:text-slate-400 tracking-tight">Performance (Monthly)</span>
                          <span className="#F05E23 font-black text-xs">{rate}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${rate}%` }} className="h-full bg-[#F05E23]" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
                          <span className="block text-[0.5rem] font-black text-slate-500 dark:text-slate-400 uppercase mb-0.5">Active</span>
                          <span className="text-base font-black text-slate-900 dark:text-white">{pendingTasks}</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
                          <span className="block text-[0.5rem] font-black text-slate-500 dark:text-slate-400 uppercase mb-0.5">Score</span>
                          <span className="text-base font-black text-green-600 dark:text-green-400">{completedMonthly}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[0.55rem] font-black uppercase tracking-tight text-slate-500 dark:text-slate-400">Recent tasks</span>
                          <button onClick={() => openTaskModalForIntern(intern._id)} className="text-[0.5rem] font-black uppercase tracking-tight text-[#F05E23] hover:opacity-70 transition-all">+ Add</button>
                        </div>
                        <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/20 scrollbar-track-transparent">
                          {iTasks.filter(t => t.status !== "Complete").length > 0 ? iTasks.filter(t => t.status !== "Complete").slice(0, 5).map((task) => (
                            <button key={task._id} onClick={() => setChatTaskId(task._id)} className="w-full flex items-start justify-between gap-2 rounded-lg bg-slate-50 dark:bg-white/3 px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-left group/task">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover/task:text-[#F05E23]">{task.title}</p>
                                <span className={`text-[0.45rem] font-black uppercase tracking-tight border px-1 py-0.5 rounded inline-block mt-0.5 ${getTaskTypeClasses(task.taskType || "General")}`}>
                                  {task.taskType || "General"}
                                </span>
                              </div>
                              <span className="text-[0.45rem] font-black uppercase text-slate-500 dark:text-slate-400 shrink-0">{getTaskProgress(task)}</span>
                            </button>
                          )) : (
                            <div className="rounded-lg border border-dashed border-slate-300 dark:border-white/10 px-3 py-3 text-[0.6rem] text-slate-400 text-center">
                              No tasks assigned
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              { key: "pending", title: "Pending", description: "Tasks waiting to be started", accent: "orange" },
              { key: "working", title: "Working", description: "Tasks in progress or blocked", accent: "blue" },
            ].map((column) => (
              <div key={column.key} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] p-5 shadow-sm min-h-120">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex-1">
                    <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900 dark:text-white">{column.title}</h3>
                    <p className="text-[0.55rem] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1">{column.description}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-[0.5rem] font-black uppercase tracking-widest whitespace-nowrap shrink-0 ${column.accent === 'orange' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' : column.accent === 'blue' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-green-500/10 text-green-600 dark:text-green-400'}`}>
                    {taskBuckets[column.key].length}
                  </span>
                </div>

                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {taskBuckets[column.key].map((task) => {
                      const isBlocked = ["Need Credentials", "Need Meeting", "Blocked"].includes(task.status);
                      return (
                        <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} key={task._id} className="rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-white/3 p-3.5 shadow-sm hover:border-[#F05E23]/20 hover:shadow-md transition-all group">
                          <div className="flex items-start justify-between gap-2 mb-2.5">
                            <div className="min-w-0 flex-1">
                              <h4 className="font-black text-xs tracking-tight truncate text-slate-900 dark:text-white">{task.title}</h4>
                              <p className="text-[0.6rem] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">{task.internId?.name || "Unassigned"}</p>
                            </div>
                            <button onClick={() => deleteTask(task._id)} className="p-1.5 rounded-lg bg-red-500/0 text-red-500 hover:bg-red-500/10 transition-all shrink-0 opacity-0 group-hover:opacity-100">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          {task.note && (
                            <p className="text-[0.6rem] text-slate-500 dark:text-slate-400 italic mb-2 line-clamp-1 border-l-2 border-[#F05E23]/30 pl-2">
                              &quot;{task.note}&quot;
                            </p>
                          )}

                          <div className="flex flex-wrap gap-1.5 mb-3">
                            <span className={`text-[0.45rem] font-black px-1.5 py-1 rounded-md uppercase tracking-widest border ${isBlocked ? 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5' : column.key === 'complete' ? 'border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/5' : column.key === 'working' ? 'border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5' : 'border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-500/5'}`}>
                              {isBlocked ? 'Blocked' : task.status}
                            </span>
                            <span className={`text-[0.45rem] font-black px-1.5 py-1 rounded-md uppercase tracking-widest border ${task.priority === 'High' ? 'border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/5' : 'border-slate-400/30 text-slate-600 dark:text-slate-300 bg-slate-500/5'}`}>
                              {task.priority || 'Medium'}
                            </span>
                            <span className={`text-[0.45rem] font-black px-1.5 py-1 rounded-md uppercase tracking-widest border ${getTaskTypeClasses(task.taskType || "General")}`}>
                              {task.taskType || "General"}
                            </span>
                          </div>

                          <div className="flex gap-1.5 flex-wrap">
                            {column.key !== 'complete' && task.status !== 'Complete' && (
                              <button onClick={() => updateTaskStatus(task._id, 'Complete', 'Marked complete.', true)} className="flex-1 min-w-[50px] bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-lg font-black uppercase tracking-widest text-[0.45rem] transition-all shadow-sm shadow-green-500/20">
                                Done
                              </button>
                            )}
                            {column.key !== 'working' && task.status !== 'Complete' && (
                              <button onClick={() => updateTaskStatus(task._id, 'In Progress', 'Moved to working.', true)} className="flex-1 min-w-[50px] bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded-lg font-black uppercase tracking-widest text-[0.45rem] transition-all shadow-sm shadow-blue-500/20">
                                Start
                              </button>
                            )}
                            {task.status === 'Complete' && !task.isApproved && (
                              <button onClick={() => handleApproveTask(task._id)} className="flex-1 min-w-[50px] bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white py-1.5 rounded-lg font-black uppercase tracking-widest text-[0.45rem] transition-all shadow-sm">
                                Review
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {taskBuckets[column.key].length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 dark:border-white/10 px-4 py-8 text-center">
                      <div className="text-slate-400 dark:text-slate-500 mb-2">
                        <Clock className="w-6 h-6 mx-auto opacity-40" />
                      </div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">No tasks in this column.</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "brands" && (
          <div className="space-y-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Brand <span className="text-[#F05E23]">Sync</span> Matrix</h3>
                <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3 border-l-2 border-[#F05E23] pl-3">Active project surveillance active</p>
              </div>
              <button 
                onClick={() => setIsAddingClient(true)} 
                className="group relative overflow-hidden bg-black text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[0.7rem] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#F05E23] to-[#d04a1a] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-3">
                  <UserPlus className="w-4 h-4" /> Add New Unit
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {adminClientProjects.map((project) => {
                const totalSteps = project.workflow?.length || 0;
                const completedSteps = project.workflow?.filter(s => s.status === 'Complete').length || 0;
                const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
                
                return (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.push(`/admin/brands/${project._id}`)}
                    className="w-full text-left bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between hover:border-[#F05E23] hover:shadow-2xl hover:shadow-[#F05E23]/10 transition-all group cursor-pointer relative overflow-hidden"
                  >
                    {/* Progress Background */}
                    <div 
                      className="absolute left-0 bottom-0 h-1 bg-[#F05E23]/20 transition-all duration-1000" 
                      style={{ width: `${progress}%` }} 
                    />

                    <div className="flex items-center gap-10 flex-1">
                      <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-[#F05E23]/5 group-hover:border-[#F05E23]/20 transition-all relative">
                        <Briefcase className="w-8 h-8 text-slate-300 group-hover:text-[#F05E23] transition-colors" />
                        {project.feedbacks?.some(f => !f.isRead) && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full border-4 border-white animate-pulse" />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <h4 className="font-black text-2xl uppercase tracking-tighter text-slate-900 group-hover:text-[#F05E23] italic leading-none transition-colors">
                            {project.projectName}
                          </h4>
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full ${project.status === 'Active' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {project.status === 'Active' ? 'Operational' : project.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> {project.projectType || 'Standard Unit'}</span>
                          <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> EST. {project.estCompletion || 'TBD'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-12 mt-6 md:mt-0">
                      <div className="text-right hidden sm:block">
                        <span className="block text-[0.6rem] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Execution Level</span>
                        <span className="text-xl font-black italic text-slate-900">{progress}%</span>
                      </div>
                      
                      {project.feedbacks?.some(f => !f.isRead) && (
                        <div className="flex items-center gap-3 px-5 py-2.5 bg-amber-50 rounded-2xl border border-amber-100">
                          <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                          <span className="text-[9px] font-black uppercase text-amber-600 tracking-widest">Priority Intel</span>
                        </div>
                      )}

                      <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-[#F05E23] group-hover:text-white transition-all shadow-sm">
                        <ChevronRight className="w-7 h-7" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project._id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-8 rounded-[3rem] relative group">
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleEditProject(project)} className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><Plus className="w-4 h-4" /></button>
                    <button onClick={() => deleteProject(project._id)} className="p-3 bg-red-500/10 text-red-500 rounded-2xl"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <span className="text-[0.6rem] font-black text-[#F05E23] uppercase tracking-[0.2em] mb-4 block">{project.index}</span>
                  <h3 className="font-black text-2xl uppercase tracking-tighter italic">{project.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-white/40 mt-4 leading-relaxed line-clamp-2">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "holidays" && (
          <div className="space-y-3">
            {leaves.map((leave) => (
              !expandedHoliday || expandedHoliday !== leave._id ? (
                <motion.button
                  key={leave._id}
                  onClick={() => setExpandedHoliday(leave._id)}
                  className="w-full text-left bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-4 flex items-center justify-between hover:border-[#F05E23]/30 transition-all group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">{leave.internId?.name}</h3>
                      <p className="text-[0.6rem] text-slate-500 dark:text-white/40 uppercase tracking-tight mt-0.5">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[0.5rem] font-black uppercase px-3 py-1 rounded-full ${leave.status === 'Approved' ? 'bg-green-500/10 text-green-500' : (leave.status === 'Rejected' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-600')
                      }`}>{leave.status}</span>
                    <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#F05E23] transition-colors" />
                  </div>
                </motion.button>
              ) : (
                <motion.div
                  key={leave._id}
                  layout
                  className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2.5rem] overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedHoliday(null)}
                    className="w-full text-left bg-white dark:bg-white/5 border-b border-black/5 dark:border-white/10 p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/8 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">{leave.internId?.name}</h3>
                      </div>
                    </div>
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                  <div className="p-10 space-y-8">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-1">
                        <span className="block text-[0.6rem] font-black text-slate-500 dark:text-white/40 uppercase tracking-tight mb-2">From</span>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{new Date(leave.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="col-span-1">
                        <span className="block text-[0.6rem] font-black text-slate-500 dark:text-white/40 uppercase tracking-tight mb-2">To</span>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{new Date(leave.endDate).toLocaleDateString()}</p>
                      </div>
                      <div className="col-span-1">
                        <span className="block text-[0.6rem] font-black text-slate-500 dark:text-white/40 uppercase tracking-tight mb-2">Days</span>
                        <p className="text-sm font-black text-slate-900 dark:text-white">
                          {Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[0.6rem] font-black text-slate-500 dark:text-white/40 uppercase tracking-tight mb-3">Reason</span>
                      <p className="text-sm italic text-slate-600 dark:text-white/60 leading-relaxed bg-slate-50 dark:bg-white/3 p-4 rounded-2xl border border-black/5 dark:border-white/10">
                        &quot;{leave.reason}&quot;
                      </p>
                    </div>
                    {leave.status === 'Pending' && (
                      <div className="flex gap-4 pt-4 border-t border-black/5 dark:border-white/10">
                        <button
                          onClick={() => {
                            approveLeave(leave._id, "Approved");
                            setExpandedHoliday(null);
                          }}
                          className="flex-1 bg-green-500 text-white px-6 py-3 rounded-xl font-black uppercase text-[0.6rem] tracking-widest shadow-lg shadow-green-500/20 hover:scale-105 transition-all"
                        >
                          Grant
                        </button>
                        <button
                          onClick={() => {
                            approveLeave(leave._id, "Rejected");
                            setExpandedHoliday(null);
                          }}
                          className="flex-1 bg-transparent border border-red-500/30 text-red-500 px-6 py-3 rounded-xl font-black uppercase text-[0.6rem] tracking-widest hover:bg-red-500 hover:text-white transition-all"
                        >
                          Deny
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            ))}
          </div>
        )}

        {activeTab === "hiring" && <AdminHiring />}

        {activeTab === "overview" && (
          <div className="flex flex-col gap-12">
            {/* Top Row: Chart & Awards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Weekly Analytics */}
              <div className="lg:col-span-7 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-10 rounded-[3.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                  <TrendingUp className="w-40 h-40" />
                </div>
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight italic">Operational <span className="text-[#F05E23]">Velocity</span></h3>
                    <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest mt-1">7-Day execution matrix</p>
                  </div>
                  <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[0.6rem] font-black uppercase text-green-500 tracking-widest">Live Sync</span>
                  </div>
                </div>
                <div className="h-64 flex items-end gap-4 px-2 relative z-10">
                  {weeklyData.map((day, i) => (
                    <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                      <div className="flex-1 bg-slate-50 dark:bg-white/5 rounded-2xl relative overflow-hidden flex items-end mb-4">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${day.height}%` }}
                          transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.1 }}
                          className={`w-full ${day.val > 80 ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : (day.val > 40 ? 'bg-[#F05E23] shadow-[0_0_20px_rgba(240,94,35,0.3)]' : 'bg-slate-300 dark:bg-white/10')} transition-all`}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <span className="bg-black text-white text-[0.6rem] font-black px-2 py-1 rounded-md">{day.val}%</span>
                        </div>
                      </div>
                      <span className="text-[0.6rem] font-black uppercase text-slate-400 text-center">{day.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Awards Section */}
              <div className="lg:col-span-5 grid grid-cols-1 gap-6">
                {/* Intern of the Week */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                  <Zap className="absolute -top-10 -right-10 w-48 h-48 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
                  <div className="relative z-10">
                    <span className="bg-white/20 backdrop-blur-md text-[0.5rem] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6 inline-block">Elite Recognition</span>
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none mb-4">Intern of <br /> the <span className="text-blue-200 underline decoration-4 underline-offset-8">Week</span></h3>

                    {awards.internOfWeek ? (
                      <div className="flex items-center gap-6 mt-8 p-4 bg-white/10 rounded-[2rem] border border-white/10">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black">
                          {awards.internOfWeek.name[0]}
                        </div>
                        <div>
                          <span className="block text-xl font-black uppercase tracking-tighter">{awards.internOfWeek.name}</span>
                          <span className="text-[0.6rem] font-bold uppercase opacity-60">{awards.internOfWeek.weekCount} Objectives Finalized</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm opacity-60 italic mt-8">Analyzing performance data...</p>
                    )}
                  </div>
                </div>

                {/* Intern of the Month */}
                <div className="bg-gradient-to-br from-[#F05E23] to-[#d04a1a] rounded-[3rem] p-10 text-white relative overflow-hidden group">
                  <Shield className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:-rotate-12 transition-transform duration-700" />
                  <div className="relative z-10">
                    <span className="bg-white/20 backdrop-blur-md text-[0.5rem] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6 inline-block">Legacy Achievement</span>
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none mb-4">Intern of <br /> the <span className="text-orange-200 underline decoration-4 underline-offset-8">Month</span></h3>

                    {awards.internOfMonth ? (
                      <div className="flex items-center gap-6 mt-8 p-4 bg-white/10 rounded-[2rem] border border-white/10">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black">
                          {awards.internOfMonth.name[0]}
                        </div>
                        <div>
                          <span className="block text-xl font-black uppercase tracking-tighter">{awards.internOfMonth.name}</span>
                          <span className="text-[0.6rem] font-bold uppercase opacity-60">{awards.internOfMonth.monthCount} Monthly Objectives</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm opacity-60 italic mt-8">Calculating monthly matrix...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Row: AI Insights & Workspace Parameters */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* AI Operational Insights */}
              <div className="lg:col-span-8 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-10 rounded-[3.5rem]">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black uppercase tracking-tight italic">AI Tactical <span className="text-blue-500">Insights</span></h3>
                  <Activity className="w-6 h-6 text-blue-500 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {interns.slice(0, 4).map((intern) => (
                    <div key={intern._id} className="p-6 bg-slate-50 dark:bg-white/3 rounded-[2rem] border border-black/5 dark:border-white/5 flex gap-5 group hover:border-blue-500/30 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/10 font-black">
                        {intern.name[0]}
                      </div>
                      <div className="flex-1">
                        <span className="block text-xs font-black uppercase tracking-tight mb-2">{intern.name}</span>
                        <div className="flex items-start gap-3">
                          <Zap className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                          <p className="text-[0.65rem] font-medium text-slate-500 dark:text-slate-400 italic line-clamp-2">
                            &quot;{generateAIInsight(intern)}&quot;
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {interns.length === 0 && (
                    <div className="col-span-2 py-10 text-center opacity-20">
                      <p className="text-[0.6rem] font-black uppercase tracking-widest italic">Awaiting unit deployment for intelligence analysis.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Summary Cards */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#0D0D14] rounded-[3rem] p-10 text-white relative overflow-hidden h-full">
                  <Shield className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10" />
                  <h3 className="text-xl font-black uppercase mb-12 italic tracking-tight">Workspace <span className="text-[#F05E23]">Parameters</span></h3>

                  <div className="space-y-8">
                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <div>
                        <span className="block text-[0.55rem] font-black uppercase opacity-40 mb-1">Fleet Capacity</span>
                        <span className="text-3xl font-black italic">{interns.length} Units</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[0.5rem] font-black text-green-500 uppercase">Operational</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <div>
                        <span className="block text-[0.55rem] font-black uppercase opacity-40 mb-1">Target Assets</span>
                        <span className="text-3xl font-black italic">{adminClientProjects.length} Projects</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[0.5rem] font-black text-[#F05E23] uppercase">Live Tracking</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="block text-[0.55rem] font-black uppercase opacity-40 mb-1">System Efficiency</span>
                        <span className="text-3xl font-black italic">
                          {Math.round((tasks.filter(t => t.status === "Complete").length / (tasks.length || 1)) * 100)}%
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[0.5rem] font-black text-blue-500 uppercase">Optimized</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Intelligence Snapshot */}
            <div className="bg-white dark:bg-[#0D0D14] border border-black/5 dark:border-white/5 rounded-[3.5rem] p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">Client <span className="text-[#F05E23]">Intelligence</span></h3>
                  <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Active project surveillance</p>
                </div>
                <div className="flex gap-4">
                  <div className="px-6 py-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 text-slate-900 dark:text-white">
                    <span className="text-[0.55rem] font-black uppercase text-slate-400">Total Tracking: {adminClientProjects.length}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {adminClientProjects.map((project, idx) => {
                  const totalSteps = project.workflow?.length || 0;
                  const completedSteps = project.workflow?.filter(s => s.status === 'Complete').length || 0;
                  const efficiency = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
                  const status = efficiency === 100 ? "OPTIMIZED" : (efficiency > 50 ? "STABLE" : "SYNCING");

                  return (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-slate-50 dark:bg-white/2 border border-black/5 dark:border-white/5 rounded-3xl p-8 hover:border-[#F05E23]/30 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[8px] font-black text-slate-400 uppercase mb-2 block w-fit">ID: {project._id.slice(-6)}</span>
                          <h4 className="text-xl font-black uppercase tracking-tight italic group-hover:text-[#F05E23] transition-colors text-slate-900 dark:text-white">{project.projectName}</h4>
                        </div>
                        <div className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest ${status === 'OPTIMIZED' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                          {status}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[0.6rem] font-black uppercase text-slate-400 tracking-tighter">Progress</span>
                            <span className="text-lg font-black italic text-slate-900 dark:text-white">{efficiency}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${efficiency}%` }}
                              className={`h-full ${efficiency === 100 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-[#F05E23]'} transition-all`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                            <span className="block text-[0.55rem] font-black text-slate-400 uppercase mb-1">Steps</span>
                            <span className="text-xl font-black italic text-slate-900 dark:text-white">{completedSteps}/{totalSteps}</span>
                          </div>
                          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                            <span className="block text-[0.55rem] font-black text-slate-400 uppercase mb-1">Messages</span>
                            <span className="text-xl font-black italic text-slate-900 dark:text-white">{project.discussions?.length || 0}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
                          <div>
                            <span className="text-[0.5rem] font-black uppercase text-slate-400 mb-2 block">Latest note</span>
                            <p className="text-[0.65rem] font-medium text-slate-500 dark:text-white/40 italic line-clamp-1">
                              {project.discussions?.length > 0 ? `"${project.discussions[project.discussions.length - 1].content}"` : "No messages yet."}
                            </p>
                          </div>

                          {project.requirements?.length > 0 && (
                            <div className="p-4 bg-[#F05E23]/5 rounded-2xl border border-[#F05E23]/10">
                              <span className="text-[0.5rem] font-black uppercase text-[#F05E23] mb-2 block">Client Briefing</span>
                              <div className="space-y-1.5">
                                {project.requirements.slice(0, 2).map((req, i) => (
                                  <div key={i} className="flex items-start gap-2">
                                    <div className="w-1 h-1 rounded-full bg-[#F05E23] mt-1.5 shrink-0" />
                                    <p className="text-[0.6rem] font-bold text-slate-600 dark:text-white/60 line-clamp-1">{req.content}</p>
                                  </div>
                                ))}
                                {project.requirements.length > 2 && (
                                  <p className="text-[0.5rem] font-black text-[#F05E23] mt-1">+ {project.requirements.length - 2} more requirements</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isBroadcasting && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 w-full max-w-lg p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#F05E23] to-transparent opacity-50" />
              <h2 className="text-4xl font-black uppercase mb-10 tracking-tighter text-center italic text-slate-900">Strategic <span className="text-[#F05E23]">Broadcast</span></h2>
              <form onSubmit={handleBroadcast} className="space-y-8">
                <div className="relative group">
                  <textarea
                    rows={6}
                    required
                    value={broadcastMsg}
                    onChange={e => setBroadcastMsg(e.target.value)}
                    placeholder="Directive for the synchronized collective..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-8 outline-none focus:border-[#F05E23]/30 transition-all font-medium text-sm text-slate-800 placeholder:text-slate-300 resize-none shadow-inner"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsBroadcasting(false)}
                    className="flex-1 py-5 rounded-2xl font-black uppercase text-[0.65rem] tracking-[0.2em] border border-slate-200 hover:bg-slate-50 transition-all text-slate-400"
                  >
                    Abort Sync
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#F05E23] text-white py-5 rounded-2xl font-black uppercase text-[0.65rem] tracking-[0.2em] shadow-[0_0_b0px_rgba(240,94,35,0.2)] hover:shadow-[0_0_30px_rgba(240,94,35,0.4)] transition-all active:scale-95"
                  >
                    Deploy Signal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isAddingClient && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05E23]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
              
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900">Provision <span className="text-[#F05E23]">Brand</span></h2>
                <div className="flex gap-2">
                  <div className={`w-3 h-3 rounded-full ${brandFormStep === 1 ? 'bg-[#F05E23]' : 'bg-slate-200'}`} />
                  <div className={`w-3 h-3 rounded-full ${brandFormStep === 2 ? 'bg-[#F05E23]' : 'bg-slate-200'}`} />
                </div>
              </div>

              {brandFormStep === 1 ? (
                <div className="space-y-5">
                  <span className="text-[10px] font-black uppercase text-[#F05E23] tracking-[0.3em] mb-2 block">Step 01: Core Identity</span>
                  {[
                    { id: 'name', placeholder: 'Brand Name', type: 'text' },
                    { id: 'email', placeholder: 'Contact Email', type: 'email' },
                    { id: 'projectName', placeholder: 'Primary Project Name', type: 'text' }
                  ].map((input) => (
                    <div key={input.id} className="relative group">
                      <input
                        type={input.type}
                        value={clientForm[input.id] || ""}
                        onChange={e => setClientForm({ ...clientForm, [input.id]: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 font-black uppercase text-[0.65rem] tracking-widest outline-none focus:border-[#F05E23]/30 transition-all text-slate-800 placeholder:text-slate-300"
                        placeholder={input.placeholder}
                      />
                      <div className="absolute inset-y-0 left-0 w-1 bg-[#F05E23] scale-y-0 group-focus-within:scale-y-50 transition-transform rounded-r-full" />
                    </div>
                  ))}
                  <div className="relative group">
                    <input
                      type="text"
                      value={clientForm.password}
                      onChange={e => setClientForm({ ...clientForm, password: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 font-black uppercase text-[0.65rem] tracking-widest outline-none focus:border-[#F05E23]/30 transition-all text-slate-800 placeholder:text-slate-300"
                      placeholder="Portal Password"
                    />
                    <div className="absolute inset-y-0 left-0 w-1 bg-[#F05E23] scale-y-0 group-focus-within:scale-y-50 transition-transform rounded-r-full" />
                  </div>
                  
                  <div className="flex gap-4 pt-10">
                    <button
                      onClick={() => {
                        if (!clientForm.name || !clientForm.email || !clientForm.projectName) return alert("Identity keys required for synchronization.");
                        setBrandFormStep(2);
                      }}
                      className="flex-1 bg-black text-white py-5 rounded-2xl font-black uppercase text-[0.65rem] tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all active:scale-95"
                    >
                      Configure Intelligence
                    </button>
                    <button
                      onClick={() => setIsAddingClient(false)}
                      className="px-10 py-5 rounded-2xl border border-slate-200 font-black uppercase text-[0.65rem] tracking-[0.2em] text-slate-400 hover:bg-slate-50 transition-all"
                    >
                      Abort
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <span className="text-[10px] font-black uppercase text-[#F05E23] tracking-[0.3em] mb-2 block">Step 02: Strategic Matrix</span>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Technical Description</label>
                    <textarea
                      rows={3}
                      value={clientForm.brandDescription}
                      onChange={e => setClientForm({ ...clientForm, brandDescription: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-medium text-sm text-slate-800 placeholder:text-slate-300 resize-none"
                      placeholder="High-end brand technical description..."
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">SOP Matrix (Markdown)</label>
                    <textarea
                      rows={5}
                      value={clientForm.sop}
                      onChange={e => setClientForm({ ...clientForm, sop: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-mono text-xs text-slate-800 placeholder:text-slate-300 resize-none"
                      placeholder="Custom SOP for this brand..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pl-2 mb-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Requirements</label>
                          <button 
                            type="button"
                            onClick={() => setClientForm({ ...clientForm, requirements: [...(clientForm.requirements || []), { content: "" }] })}
                            className="text-[8px] font-black uppercase text-[#F05E23] flex items-center gap-1 hover:opacity-70"
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>
                        <div className="space-y-2">
                            {(clientForm.requirements || []).map((req, i) => (
                                <div key={i} className="flex gap-2">
                                  <input
                                      type="text"
                                      value={req.content}
                                      onChange={e => {
                                          const newReqs = [...clientForm.requirements];
                                          newReqs[i].content = e.target.value;
                                          setClientForm({ ...clientForm, requirements: newReqs });
                                      }}
                                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[0.6rem] font-bold outline-none focus:border-[#F05E23]/30"
                                  />
                                  <button 
                                    type="button"
                                    onClick={() => setClientForm({ ...clientForm, requirements: clientForm.requirements.filter((_, idx) => idx !== i) })}
                                    className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pl-2 mb-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Features</label>
                          <button 
                            type="button"
                            onClick={() => setClientForm({ ...clientForm, aiFeatures: [...(clientForm.aiFeatures || []), { title: "", description: "" }] })}
                            className="text-[8px] font-black uppercase text-[#F05E23] flex items-center gap-1 hover:opacity-70"
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>
                        <div className="space-y-2">
                            {(clientForm.aiFeatures || []).map((feat, i) => (
                                <div key={i} className="flex gap-2">
                                  <input
                                      type="text"
                                      value={feat.title}
                                      onChange={e => {
                                          const newFeats = [...clientForm.aiFeatures];
                                          newFeats[i].title = e.target.value;
                                          setClientForm({ ...clientForm, aiFeatures: newFeats });
                                      }}
                                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[0.6rem] font-bold outline-none focus:border-[#F05E23]/30"
                                  />
                                  <button 
                                    type="button"
                                    onClick={() => setClientForm({ ...clientForm, aiFeatures: clientForm.aiFeatures.filter((_, idx) => idx !== i) })}
                                    className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Color Archetype</label>
                      <input
                        type="text"
                        value={clientForm.colorStyle}
                        onChange={e => setClientForm({ ...clientForm, colorStyle: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 text-[0.65rem] font-black uppercase outline-none focus:border-[#F05E23]/30"
                        placeholder="e.g. Electric Blue & Slate"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Interface Theme</label>
                      <select
                        value={clientForm.theme}
                        onChange={e => setClientForm({ ...clientForm, theme: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 text-[0.65rem] font-black uppercase outline-none focus:border-[#F05E23]/30 appearance-none"
                      >
                        <option value="Single">Single (Dark/Light)</option>
                        <option value="Dual">Dual (Dynamic Switch)</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Assigned Unit</label>
                      <select
                        value={clientForm.assignedIntern || ""}
                        onChange={e => setClientForm({ ...clientForm, assignedIntern: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 text-[0.65rem] font-black uppercase outline-none focus:border-[#F05E23]/30 appearance-none text-blue-500"
                      >
                        <option value="">Select Primary Unit</option>
                        {interns.map(i => (
                          <option key={i._id} value={i._id}>{i.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Tactical Features</label>
                    <input
                      type="text"
                      value={clientForm.features}
                      onChange={e => setClientForm({ ...clientForm, features: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 text-[0.65rem] font-black uppercase outline-none focus:border-[#F05E23]/30"
                      placeholder="e.g. AI Search, Real-time Sync, Dashboard"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Site Architecture (Pages)</label>
                    <input
                      type="text"
                      value={clientForm.pages}
                      onChange={e => setClientForm({ ...clientForm, pages: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 text-[0.65rem] font-black uppercase outline-none focus:border-[#F05E23]/30"
                      placeholder="e.g. Home, Service Nodes, Portfolio, Command Center"
                    />
                  </div>

                  <div className="flex gap-4 pt-8">
                    <button
                      disabled={brandIntelLoading}
                      onClick={async () => {
                        if (!clientForm.brandDescription) return alert("Strategic vision required for AI analysis.");
                        setBrandIntelLoading(true);
                        try {
                          const intelRes = await generateBrandIntel({
                            projectName: clientForm.projectName,
                            brandIdea: clientForm.brandDescription,
                            colorStyle: clientForm.colorStyle,
                            theme: clientForm.theme,
                            features: clientForm.features,
                            pages: clientForm.pages
                          });

                          if (intelRes.success) {
                            setClientForm(prev => ({
                              ...prev,
                              projectType: intelRes.intel.projectType,
                              brandDescription: intelRes.intel.technicalDescription,
                              requirements: intelRes.intel.requirements.map(r => ({ content: r })),
                              aiFeatures: intelRes.intel.features,
                              sop: intelRes.intel.sop,
                              workflow: intelRes.intel.workflow,
                              estimatedWeeks: intelRes.intel.estimatedWeeks
                            }));
                            setStatusMsg({ type: 'success', msg: "Intelligence Analysis Complete. Reviewing Matrix..." });
                          } else {
                            throw new Error(intelRes.message);
                          }
                        } catch (e) {
                          alert(e.message);
                        } finally {
                          setBrandIntelLoading(false);
                        }
                      }}
                      className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-[0.65rem] tracking-[0.2em] shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      {brandIntelLoading ? <Activity className="w-4 h-4 animate-pulse" /> : <Zap className="w-4 h-4" />}
                      Sync AI Intel
                    </button>
                    <button
                      disabled={brandIntelLoading}
                      onClick={async () => {
                        if (!clientForm.brandDescription) return alert("Strategic vision required.");
                        setBrandIntelLoading(true);
                        try {
                          // Step 1: Create Client User
                          const res = await createClient(clientForm.name, clientForm.email, clientForm.password);
                          if (!res.success) throw new Error(res.message);

                          // Step 2: Calculate completion date
                          const estDate = new Date();
                          estDate.setDate(estDate.getDate() + ((clientForm.estimatedWeeks || 8) * 7));

                          // Step 3: Create Project
                          await createClientProject({
                            clientId: res.client._id,
                            projectName: clientForm.projectName,
                            projectType: clientForm.projectType || "Custom Web App",
                            description: clientForm.brandDescription,
                            requirements: clientForm.requirements || [],
                            features: clientForm.aiFeatures || [],
                            sop: clientForm.sop,
                            workflow: clientForm.workflow,
                            estimatedCompletionDate: estDate,
                            systemAccessEmail: "intern@sync.com",
                            systemAccessPassword: "SyncIntern123",
                            credentials: clientForm.credentials,
                            assignedIntern: clientForm.assignedIntern
                          });

                          setIsAddingClient(false);
                          setBrandFormStep(1);
                          setStatusMsg({ type: 'success', msg: "Brand Synchronized into Digital Ecosystem." });
                        } catch (e) {
                          alert(e.message);
                        } finally {
                          setBrandIntelLoading(false);
                        }
                      }}
                      className="flex-[2] bg-[#F05E23] text-white py-6 rounded-[2rem] font-black uppercase text-[0.7rem] tracking-[0.2em] shadow-2xl shadow-[#F05E23]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      Initialize Deployment
                    </button>
                    <button
                      onClick={() => setBrandFormStep(1)}
                      className="flex-1 py-6 rounded-[2rem] font-black uppercase text-[0.7rem] tracking-[0.2em] border-2 border-slate-200 text-slate-400 hover:bg-slate-50 transition-all italic"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {isAddingIntern && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 w-full max-w-lg p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[60px]" />
              <h2 className="text-4xl font-black uppercase mb-12 tracking-tighter italic text-center text-slate-900">Onboarding</h2>
              <form onSubmit={handleAddIntern} className="space-y-5">
                <div className="relative group">
                  <input type="text" required value={newIntern.name} onChange={e => setNewIntern({ ...newIntern, name: e.target.value })} placeholder="Full Identity" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-widest text-slate-800 placeholder:text-slate-300" />
                </div>
                <div className="relative group">
                  <input type="email" required value={newIntern.email} onChange={e => setNewIntern({ ...newIntern, email: e.target.value })} placeholder="System Access Email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-widest text-slate-800 placeholder:text-slate-300" />
                </div>
                <div className="relative group">
                  <input type="text" required value={newIntern.password} onChange={e => setNewIntern({ ...newIntern, password: e.target.value })} placeholder="Initial Password" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-widest text-slate-800 placeholder:text-slate-300" />
                </div>
                <div className="flex gap-4 pt-8">
                  <button type="button" onClick={() => setIsAddingIntern(false)} className="flex-1 py-5 rounded-2xl font-black uppercase text-[0.65rem] tracking-[0.2em] border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[0.65rem] tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95">Verify & Deploy</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isAssigningTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 w-full max-w-4xl p-10 sm:p-12 rounded-[4rem] shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#F05E23]/5 rounded-full blur-[100px]" />

              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">Task <span className="text-[#F05E23]">Matrix</span></h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-4">Multi-Assignment Deployment Console</p>
                </div>
                <div className={`px-8 py-4 rounded-3xl border-2 flex flex-col items-center gap-1 transition-all ${feasibility.feasible ? 'border-green-500/20 bg-green-500/5 text-green-600' : 'border-red-500/20 bg-red-500/5 text-red-600'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest">{feasibility.feasible ? 'Feasible' : 'Overloaded'}</span>
                  <span className="text-xl font-black italic">{feasibility.totalHours}h / 8h</span>
                  <p className="text-[8px] font-bold uppercase opacity-60">AI Daily Prediction</p>
                </div>
              </div>

              <form onSubmit={handleAssignTask} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Assign To Unit</label>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!selectedSteps.length && !customTasks.length) return alert("Define objectives first.");
                            const title = selectedSteps[0] || customTasks[0];
                            const res = await getAIInternRecommendation(title, "Operational deployment.");
                            if (res.success) {
                              setAiRecommendation(res.recommendation);
                              setNewTask({ ...newTask, internId: res.recommendation.recommendedInternId });
                            }
                          }}
                          className="text-[8px] font-black uppercase tracking-widest text-[#F05E23] flex items-center gap-2 hover:opacity-70 transition-all"
                        >
                          <Zap className="w-3 h-3" /> AI Recommend
                        </button>
                      </div>
                      {aiRecommendation && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[8px] font-bold text-[#F05E23] italic pl-2">
                          AI Tip: {aiRecommendation.justification}
                        </motion.p>
                      )}
                      <select
                        required
                        value={newTask.internId}
                        onChange={e => setNewTask({ ...newTask, internId: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.7rem] tracking-widest text-slate-800 appearance-none"
                      >
                        <option value="">Select team member...</option>
                        {interns.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Link Project Scope</label>
                      <select
                        value={newTask.clientProjectId}
                        onChange={e => {
                          setNewTask({ ...newTask, clientProjectId: e.target.value });
                          setSelectedSteps([]);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.7rem] tracking-widest text-[#F05E23] appearance-none"
                      >
                        <option value="">Independent Mission...</option>
                        {adminClientProjects.map(p => <option key={p._id} value={p._id}>{p.projectName}</option>)}
                      </select>
                    </div>

                    {newTask.clientProjectId && (
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#F05E23] pl-2 flex items-center gap-2">
                          <ClipboardList className="w-4 h-4" /> Workflow Checkbox List
                        </label>
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
                          {adminClientProjects.find(p => p._id === newTask.clientProjectId)?.workflow?.filter(s => s.status !== 'Complete').map((step, idx) => (
                            <label key={idx} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white transition-all cursor-pointer group">
                              <div
                                onClick={() => {
                                  setSelectedSteps(prev => prev.includes(step.title) ? prev.filter(s => s !== step.title) : [...prev, step.title]);
                                }}
                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedSteps.includes(step.title) ? 'bg-[#F05E23] border-[#F05E23] shadow-lg shadow-[#F05E23]/20' : 'border-slate-300 group-hover:border-[#F05E23]/50'}`}
                              >
                                {selectedSteps.includes(step.title) && <Check className="w-4 h-4 text-white" />}
                              </div>
                              <span className={`text-xs font-bold uppercase tracking-tight ${selectedSteps.includes(step.title) ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Custom Objectives</label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={customTaskInput}
                          onChange={e => setCustomTaskInput(e.target.value)}
                          placeholder="Enter task title..."
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.7rem] tracking-widest text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customTaskInput.trim()) {
                              setCustomTasks([...customTasks, customTaskInput.trim()]);
                              setCustomTaskInput("");
                            }
                          }}
                          className="p-5 bg-black text-white rounded-2xl hover:bg-slate-800 transition-all shadow-xl"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-3 p-6 bg-slate-50 border border-slate-200 rounded-3xl max-h-60 overflow-y-auto scrollbar-hide">
                        {customTasks.map((task, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                            <span className="text-xs font-bold uppercase tracking-tight text-slate-700">{task}</span>
                            <button type="button" onClick={() => setCustomTasks(customTasks.filter((_, idx) => idx !== i))} className="text-red-500/40 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        {customTasks.length === 0 && <p className="text-[10px] font-black uppercase text-slate-300 text-center py-10 tracking-widest">No custom tasks added</p>}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2 italic">Assignment Metadata</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="text-[8px] font-black uppercase text-slate-300 pl-2 tracking-widest">Priority</span>
                          <select
                            value={newTask.priority}
                            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-[0.65rem] font-black uppercase outline-none focus:border-[#F05E23]/30"
                          >
                            {["Low", "Medium", "High"].map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[8px] font-black uppercase text-slate-300 pl-2 tracking-widest">Task Class</span>
                          <select
                            value={newTask.taskType}
                            onChange={e => setNewTask({ ...newTask, taskType: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-[0.65rem] font-black uppercase outline-none focus:border-[#F05E23]/30"
                          >
                            {["General", "Bug Fix", "Feature", "Design", "Research"].map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-10 border-t border-slate-100">
                  <button type="button" onClick={() => setIsAssigningTask(false)} className="flex-1 py-6 rounded-[2rem] font-black uppercase text-[0.7rem] tracking-[0.2em] border-2 border-slate-200 text-slate-400 hover:bg-slate-50 transition-all italic">Abort Deployment</button>
                  <button
                    type="submit"
                    disabled={loading || (selectedSteps.length === 0 && customTasks.length === 0)}
                    className="flex-[2] bg-[#F05E23] text-white py-6 rounded-[2rem] font-black uppercase text-[0.7rem] tracking-[0.2em] shadow-2xl shadow-[#F05E23]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 italic"
                  >
                    Deploy {selectedSteps.length + customTasks.length} Matrix Tasks
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {chatTask && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
            <motion.div key="chat-modal" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] p-0 shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[80vh]">
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

              <div className="grow p-8 overflow-y-auto space-y-6 scrollbar-hide bg-slate-50">
                {(chatTask.discussion || []).map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[0.55rem] font-black uppercase tracking-widest text-slate-400 mb-2 px-2">{msg.sender === 'admin' ? 'YOU' : 'INTERN'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <div className={`max-w-[80%] p-5 rounded-3xl font-bold text-sm shadow-sm ${msg.sender === 'admin' ? 'bg-[#F05E23] text-white rounded-tr-none' : 'bg-white border border-slate-200 rounded-tl-none text-slate-700'}`}>
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

              <form onSubmit={handleSendChat} className="p-8 border-t border-slate-200 bg-white">
                <div className="flex gap-4">
                  <input type="text" value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="Enter briefing intel..." className="grow bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-[#F05E23] font-bold text-sm" />
                  <button type="submit" className="bg-[#F05E23] text-white p-4 rounded-2xl shadow-lg shadow-[#F05E23]/30 hover:scale-105 active:scale-95 transition-all"><Send className="w-6 h-6" /></button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isAddingProject && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 w-full max-w-4xl p-12 rounded-[4rem] shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#F05E23] to-transparent opacity-30" />
              <h2 className="text-4xl font-black uppercase mb-12 tracking-tighter italic text-center text-slate-900">{editingProject ? 'Update' : 'Deploy'} <span className="text-[#F05E23]">Showcase</span></h2>
              <form onSubmit={handleProjectSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative group">
                    <input type="text" required value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="Project Title" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-widest text-slate-800 placeholder:text-slate-300" />
                  </div>
                  <div className="relative group">
                    <input type="text" value={projectForm.index} onChange={e => setProjectForm({ ...projectForm, index: e.target.value })} placeholder="Sequence Index (e.g. 01)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-widest text-slate-800 placeholder:text-slate-300" />
                  </div>
                  <div className="relative group">
                    <input type="text" value={projectForm.category} onChange={e => setProjectForm({ ...projectForm, category: e.target.value })} placeholder="Sync Category" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-widest text-[#F05E23] placeholder:text-[#F05E23]/20" />
                  </div>
                </div>
                <div className="relative group">
                  <textarea rows={4} required value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="Impact Narrative..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-8 outline-none focus:border-[#F05E23]/30 transition-all font-medium text-sm text-slate-800 placeholder:text-slate-300 resize-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <input type="text" value={projectForm.tags} onChange={e => setProjectForm({ ...projectForm, tags: e.target.value })} placeholder="Technological Stack (comma separated)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.6rem] tracking-widest text-slate-500 placeholder:text-slate-300" />
                  </div>
                  <div className="relative group">
                    <input type="text" value={projectForm.impact} onChange={e => setProjectForm({ ...projectForm, impact: e.target.value })} placeholder="Critical Output (e.g. $50k Revenue Generated)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-green-500/30 transition-all font-black uppercase text-[0.6rem] tracking-widest text-green-600 placeholder:text-green-600/20 shadow-[0_0_20px_rgba(34,197,94,0.05)]" />
                  </div>
                </div>
                <div className="flex gap-4 pt-10">
                  <button type="button" onClick={() => setIsAddingProject(false)} className="flex-1 py-6 rounded-2xl font-black uppercase text-[0.7rem] tracking-[0.2em] border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all">Abort</button>
                  <button type="submit" className="flex-1 bg-slate-900 text-white py-6 rounded-2xl font-black uppercase text-[0.7rem] tracking-[0.2em] hover:bg-black shadow-xl transition-all">Finalize Showcase</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isEditingCredentials && selectedCredentialProject && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 w-full max-w-4xl p-12 rounded-[4rem] shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-green-500/10 rounded-3xl"><Shield className="w-8 h-8 text-green-500" /></div>
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900">Credential <span className="text-[#F05E23]">Matrix</span></h2>
                  <p className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">Managing Access for {selectedCredentialProject.projectName}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Environment Config */}
                <div className="md:col-span-2 space-y-4">
                  <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#F05E23]">Synchronous Environment (.env)</label>
                  <textarea
                    rows={6}
                    value={credentialForm.env}
                    onChange={e => setCredentialForm({ ...credentialForm, env: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 outline-none focus:border-[#F05E23]/30 transition-all font-mono text-xs text-slate-800 placeholder:text-slate-300"
                    placeholder="MONGODB_URI=...&#10;JWT_SECRET=..."
                  />
                </div>

                {/* Gmail */}
                <div className="space-y-4">
                  <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-400">Google Ecosystem (Gmail)</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={credentialForm.gmail.email}
                      onChange={e => setCredentialForm({ ...credentialForm, gmail: { ...credentialForm.gmail, email: e.target.value } })}
                      placeholder="Email ID"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none focus:border-[#F05E23]/30 text-slate-800 text-xs font-bold"
                    />
                    <input
                      type="password"
                      value={credentialForm.gmail.password}
                      onChange={e => setCredentialForm({ ...credentialForm, gmail: { ...credentialForm.gmail, password: e.target.value } })}
                      placeholder="App Password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none focus:border-[#F05E23]/30 text-slate-800 text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Vercel */}
                <div className="space-y-4">
                  <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-400">Production Node (Vercel)</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={credentialForm.vercel.email}
                      onChange={e => setCredentialForm({ ...credentialForm, vercel: { ...credentialForm.vercel, email: e.target.value } })}
                      placeholder="Account Email"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none focus:border-[#F05E23]/30 text-slate-800 text-xs font-bold"
                    />
                    <input
                      type="password"
                      value={credentialForm.vercel.password}
                      onChange={e => setCredentialForm({ ...credentialForm, vercel: { ...credentialForm.vercel, password: e.target.value } })}
                      placeholder="Access Token / Pass"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none focus:border-[#F05E23]/30 text-slate-800 text-xs font-bold"
                    />
                  </div>
                </div>

                {/* GitHub */}
                <div className="space-y-4">
                  <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-400">Source Control (GitHub ID)</label>
                  <input
                    type="text"
                    value={credentialForm.github}
                    onChange={e => setCredentialForm({ ...credentialForm, github: e.target.value })}
                    placeholder="Deployment Username / Repo Path"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none focus:border-[#F05E23]/30 text-slate-800 text-xs font-bold"
                  />
                </div>

                {/* Additional */}
                <div className="space-y-4">
                  <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-400">Other Strategic Passwords</label>
                  <textarea
                    rows={1}
                    value={credentialForm.additional}
                    onChange={e => setCredentialForm({ ...credentialForm, additional: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none focus:border-[#F05E23]/30 text-slate-800 text-xs font-bold resize-none"
                    placeholder="Hosting, Domain, API Keys..."
                  />
                </div>

                {/* Google Drive Link */}
                <div className="md:col-span-2 space-y-4">
                  <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#4285F4]">Google Drive Folder Link</label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={selectedCredentialProject.googleDriveLink || ""}
                      onChange={e => {
                        setSelectedCredentialProject({ ...selectedCredentialProject, googleDriveLink: e.target.value });
                      }}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none focus:border-[#4285F4]/30 text-slate-800 text-xs font-bold"
                    />
                    <ExternalLink className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4285F4] opacity-40" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-12">
                <button
                  onClick={() => setIsEditingCredentials(false)}
                  className="flex-1 py-5 rounded-3xl font-black uppercase text-[0.65rem] tracking-[0.2em] border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Discard Changes
                </button>
                <button
                  onClick={async () => {
                    const res = await updateClientProject(selectedCredentialProject._id, {
                      credentials: credentialForm,
                      googleDriveLink: selectedCredentialProject.googleDriveLink
                    });
                    if (res.success) {
                      setStatusMsg({ type: "success", msg: "Credential Matrix Synchronized." });
                      setIsEditingCredentials(false);
                    } else {
                      alert("Sync Failure: " + res.message);
                    }
                  }}
                  className="flex-1 bg-green-500 text-white py-5 rounded-3xl font-black uppercase text-[0.65rem] tracking-[0.2em] shadow-[0_0_40px_rgba(34,197,94,0.2)] hover:shadow-[0_0_50px_rgba(34,197,94,0.4)] transition-all active:scale-95"
                >
                  Finalize & Encrypt
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {statusMsg.msg && (
          <motion.div key="status-notification" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className={`fixed bottom-10 right-10 z-200 p-6 rounded-3xl shadow-2xl flex items-center gap-4 border ${statusMsg.type === 'success' ? 'bg-green-500 border-green-400 text-white' : 'bg-red-500 border-red-400 text-white'}`}>
            <span className="font-black text-[0.7rem] uppercase tracking-widest">{statusMsg.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
