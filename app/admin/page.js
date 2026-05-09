"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, CheckCircle2, Clock, Plus, Trash2, 
  Send, UserPlus, ClipboardList, TrendingUp,
  Mail, X, Check, Search, AlertCircle, Calendar, Briefcase, Shield,
  ExternalLink, MessageSquare, Save, Activity, PlusCircle
} from "lucide-react";

export default function AdminDashboard() {
  const auth = useAuth();
  const { 
    user, interns, tasks, leaves, projects, adminClientProjects,
    addIntern, removeIntern, assignTask, updateTaskStatus, 
    deleteTask, reassignTask, announceToAll, approveLeave,
    addProject, updateProject, deleteProject,
    createClient, createClientProject, updateClientProject, purgeClientProject, loading 
  } = auth;

  const [activeTab, setActiveTab] = useState("interns");
  
  // Client Management States
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [clientForm, setClientForm] = useState({ 
    name: "", email: "", password: "SyncClient123", projectName: "",
    credentials: {
      env: "",
      gmail: { email: "", password: "" },
      vercel: { email: "", password: "" },
      github: "",
      additional: ""
    }
  });
  const [isAddingIntern, setIsAddingIntern] = useState(false);
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [newIntern, setNewIntern] = useState({ name: "", email: "" });
  const [newTask, setNewTask] = useState({ 
    title: "", 
    description: "", 
    internId: "",
    taskType: "General",
    priority: "Medium",
    dueDate: "",
    taskCount: 1
  });
  const [projectForm, setProjectForm] = useState({
    title: "", index: "", category: "Verified Partner", 
    description: "", strategyDetail: "", happinessDetail: "", 
    tags: "", impact: ""
  });
  const [chatTaskId, setChatTaskId] = useState(null);
  const [chatMsg, setChatMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState({ type: "", msg: "" });
  const [selectedInternForTask, setSelectedInternForTask] = useState("");
  const [expandedHoliday, setExpandedHoliday] = useState(null);
  const [expandedBrand, setExpandedBrand] = useState(null);
  
  // Credential Management States
  const [isEditingCredentials, setIsEditingCredentials] = useState(false);
  const [selectedCredentialProject, setSelectedCredentialProject] = useState(null);
  const [credentialForm, setCredentialForm] = useState({
    env: "",
    gmail: { email: "", password: "" },
    vercel: { email: "", password: "" },
    github: "",
    additional: ""
  });

  const chatTask = tasks.find(t => t._id === chatTaskId);
  const tabLabels = {
    interns: "Team",
    tasks: "Tasks",
    holidays: "Time Off",
    portfolio: "Projects",
    brands: "Clients",
    overview: "Overview"
  };

  useEffect(() => {
    if (statusMsg.msg) {
      const timer = setTimeout(() => setStatusMsg({ type: "", msg: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

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

  const handleApproveTask = async (taskId) => {
    const res = await updateTaskStatus(taskId, "Complete", "Task approved by Admin.", true);
    if (res.success) {
       setStatusMsg({ type: "success", msg: "Task approved and finalized!" });
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatMsg.trim() || !chatTask) return;
    
    const res = await auth.sendDiscussion(chatTask._id, chatMsg);
    if (res.success) {
      setStatusMsg({ type: "success", msg: "Direct Sync active." });
      setChatMsg("");
    } else {
      setStatusMsg({ type: "error", msg: "Transmission failed." });
    }
  };

  const handleAddIntern = async (e) => {
    e.preventDefault();
    const res = await addIntern(newIntern.name, newIntern.email);
    if (res.success) {
      setStatusMsg({ type: "success", msg: `Intern added!` });
      setIsAddingIntern(false);
      setNewIntern({ name: "", email: "" });
    } else {
      setStatusMsg({ type: "error", msg: res.message });
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    const count = Math.max(1, Number(newTask.taskCount) || 1);
    const baseTitle = newTask.title.trim();
    const description = newTask.description.trim();

    if (!baseTitle || !description || !newTask.internId) {
      setStatusMsg({ type: "error", msg: "Please fill task title, team member, and description." });
      return;
    }

    let created = 0;

    for (let i = 0; i < count; i += 1) {
      const payload = {
        ...newTask,
        title: count > 1 ? `${baseTitle} (${i + 1}/${count})` : baseTitle,
        description,
        taskCount: 1
      };

      const res = await assignTask(payload);
      if (!res.success) {
        setStatusMsg({ type: "error", msg: res.message });
        return;
      }

      created += 1;
    }

    if (created > 0) {
      setStatusMsg({ type: "success", msg: created === 1 ? "Task assigned properly!" : `${created} tasks assigned properly!` });
      setIsAssigningTask(false);
      setNewTask({ title: "", description: "", internId: "", taskType: "General", priority: "Medium", dueDate: "", taskCount: 1 });
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

  const stats = {
    totalInterns: interns.length,
    activeTasks: tasks.filter(t => t.status === "Pending").length,
    completedTasks: tasks.filter(t => t.status === "Complete").length,
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
    { icon: Users, label: "Team Members", val: stats.totalInterns, color: "blue", desc: "On the team" },
    { icon: Clock, label: "Open Tasks", val: stats.activeTasks, color: "orange", desc: "In progress" },
    { icon: AlertCircle, label: "Needs Attention", val: stats.blockers, color: "red", desc: "Action needed" },
    { icon: Calendar, label: "Time Off Requests", val: stats.pendingHolidays, color: "purple", desc: "Awaiting approval" },
    { icon: CheckCircle2, label: "Completed Work", val: stats.completedTasks, color: "green", desc: "Done" }
  ];

  const taskBuckets = {
    pending: tasks.filter((task) => task.status === "Pending"),
    working: tasks.filter((task) => ["In Progress", "Need Credentials", "Need Meeting"].includes(task.status)),
    complete: tasks.filter((task) => task.status === "Complete")
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
        
        const dayTasks = tasks.filter(t => new Date(t.updatedAt || t.createdAt).toDateString() === dayStr);
        const completions = dayTasks.filter(t => t.status === "Complete").length;
        
        const percentage = dayTasks.length > 0 ? Math.round((completions / dayTasks.length) * 100) : 0;
        results.push({ 
          label: days[d.getDay()], 
          val: percentage,
          height: Math.max(percentage, 8)
        });
     }
     return results;
  };

  const weeklyData = getWeeklyData();

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
                const completedTasks = iTasks.filter(t => t.status === "Complete").length;
                const rate = Math.round((completedTasks / (iTasks.length || 1)) * 100);
                const pendingTasks = iTasks.filter(t => t.status === "Pending").length;
                
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
                           <span className="text-[0.55rem] font-black uppercase text-slate-500 dark:text-slate-400 tracking-tight">Progress</span>
                           <span className="text-[#F05E23] font-black text-xs">{rate}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: `${rate}%` }} className="h-full bg-[#F05E23]" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
                           <span className="block text-[0.5rem] font-black text-slate-500 dark:text-slate-400 uppercase mb-0.5">Total</span>
                           <span className="text-base font-black text-slate-900 dark:text-white">{iTasks.length}</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
                           <span className="block text-[0.5rem] font-black text-slate-500 dark:text-slate-400 uppercase mb-0.5">Done</span>
                           <span className="text-base font-black text-green-600 dark:text-green-400">{completedTasks}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[0.55rem] font-black uppercase tracking-tight text-slate-500 dark:text-slate-400">Recent tasks</span>
                          <button onClick={() => openTaskModalForIntern(intern._id)} className="text-[0.5rem] font-black uppercase tracking-tight text-[#F05E23] hover:opacity-70 transition-all">+ Add</button>
                        </div>
                        <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/20 scrollbar-track-transparent">
                          {iTasks.length > 0 ? iTasks.slice(0, 5).map((task) => (
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
              { key: "complete", title: "Complete", description: "Finished tasks ready to review", accent: "green" }
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
                      const isBlocked = ["Need Credentials", "Need Meeting"].includes(task.status);
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
                            <button onClick={() => setChatTaskId(task._id)} className="flex-1 min-w-[50px] bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white py-1.5 rounded-lg font-black uppercase tracking-widest text-[0.45rem] flex items-center justify-center gap-1 border border-slate-200 dark:border-white/10 hover:border-[#F05E23]/30 hover:bg-slate-50 dark:hover:bg-white/15 transition-all">
                              <Mail className="w-2.5 h-2.5" /> Message
                            </button>
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
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black uppercase tracking-tighter">Brand <span className="text-[#F05E23]">Sync</span> Matrix</h3>
              <button onClick={() => setIsAddingClient(true)} className="px-8 py-4 bg-[#F05E23] text-white rounded-2xl text-[0.7rem] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-[#F05E23]/20">
                <UserPlus className="w-4 h-4" /> Add Client
              </button>
            </div>
            
            <div className="space-y-3">
               {adminClientProjects.map((project) => (
                 !expandedBrand || expandedBrand !== project._id ? (
                   <motion.button
                     key={project._id}
                     onClick={() => setExpandedBrand(project._id)}
                     className="w-full text-left bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-[#F05E23]/30 transition-all group"
                   >
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg bg-[#F05E23]/10 flex items-center justify-center">
                         <Briefcase className="w-5 h-5 text-[#F05E23]" />
                       </div>
                       <div className="flex-1">
                         <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-[#F05E23]">{project.projectName}</h4>
                         <p className="text-[0.6rem] text-slate-500 dark:text-white/40 uppercase tracking-tight mt-0.5">Status: {project.status}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                       <span className={`text-[0.5rem] font-black uppercase px-3 py-1 rounded-full ${
                         project.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-500'
                       }`}>{project.status}</span>
                       <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#F05E23] transition-colors" />
                     </div>
                   </motion.button>
                 ) : (
                   <motion.div
                     key={project._id}
                     layout
                     className="bg-white dark:bg-[#0D0D14] border border-black/5 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5"
                   >
                     <button
                       onClick={() => setExpandedBrand(null)}
                       className="w-full text-left bg-white dark:bg-[#0D0D14] border-b border-black/5 dark:border-white/5 p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/2 transition-all"
                     >
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-lg bg-[#F05E23]/10 flex items-center justify-center">
                           <Briefcase className="w-5 h-5 text-[#F05E23]" />
                         </div>
                         <div>
                           <h4 className="font-black text-sm uppercase tracking-tight text-[#F05E23]">{project.projectName}</h4>
                         </div>
                       </div>
                       <X className="w-4 h-4 text-slate-400" />
                     </button>
                     <div className="p-10 border-b border-black/5 dark:border-white/5 flex flex-col lg:flex-row justify-between gap-10">
                       <div className="space-y-4 max-w-2xl">
                         <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[9px] font-black uppercase flex items-center gap-2 w-fit">
                           <Activity className="w-3 h-3 animate-pulse" /> {project.status}
                         </span>
                         <div className="flex justify-between items-start gap-4">
                           <div>
                             <h4 className="text-2xl font-black uppercase tracking-tighter italic">{project.projectName}</h4>
                             <p className="text-xs text-slate-500 dark:text-white/40 mt-3 leading-relaxed">{project.description}</p>
                           </div>
                           <div className="flex gap-2 shrink-0">
                             <button 
                                onClick={() => {
                                  setSelectedCredentialProject(project);
                                  setCredentialForm(project.credentials || {
                                    env: "",
                                    gmail: { email: "", password: "" },
                                    vercel: { email: "", password: "" },
                                    github: "",
                                    additional: ""
                                  });
                                  setIsEditingCredentials(true);
                                }}
                                className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all shrink-0"
                                title="Access details"
                             >
                                <Shield className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => {
                                  const url = `${window.location.origin}/brands/${project.publicId}`;
                                  navigator.clipboard.writeText(url);
                                  setStatusMsg({ type: "success", msg: "Share link copied." });
                                }}
                                className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shrink-0"
                                title="Copy Share Link"
                             >
                                <ExternalLink className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => {
                                  if (confirm("Delete this client project?")) {
                                    if (purgeClientProject) {
                                      purgeClientProject(project._id);
                                      setExpandedBrand(null);
                                    }
                                  }
                                }}
                                className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shrink-0"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                         </div>
                       </div>
                       <div className="lg:w-96 flex flex-col gap-4">
                          <div className="flex-1 bg-black/5 dark:bg-black/20 rounded-3xl p-6 h-40 overflow-y-auto space-y-4 scrollbar-hide text-[10px]">
                             {project.discussions?.slice(-3).map((msg, i) => (
                               <div key={i} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                                 <span className="text-[7px] font-black uppercase opacity-30 mb-1">{msg.sender}</span>
                                 <p className={`p-3 rounded-2xl ${msg.sender === 'admin' ? 'bg-[#F05E23] text-white rounded-tr-none' : 'bg-white/10 rounded-tl-none'}`}>
                                   {msg.content}
                                 </p>
                               </div>
                             ))}
                          </div>
                          <input 
                             type="text" 
                             placeholder="Message for the client..."
                             onKeyPress={(e) => {
                               if (e.key === 'Enter') {
                                 updateClientProject(project._id, { message: e.target.value });
                                 e.target.value = "";
                               }
                             }}
                             className="w-full bg-slate-50 dark:bg-black/40 border border-black/5 dark:border-white/10 rounded-2xl py-4 px-6 text-[0.7rem] font-black uppercase tracking-widest focus:outline-none focus:border-[#F05E23]"
                          />
                       </div>
                     </div>
                       <div className="p-8 bg-slate-50 dark:bg-white/2 border-t border-black/5 dark:border-white/5">
                       <div className="flex items-center justify-between mb-8">
                         <h5 className="text-[0.6rem] font-black uppercase tracking-[0.4em] text-[#F05E23] flex items-center gap-3">
                           <ClipboardList className="w-4 h-4" /> Plan
                         </h5>
                         <button 
                           onClick={() => {
                              const title = prompt("New step title:");
                              if (title) {
                                 updateClientProject(project._id, { workflow: [...project.workflow, { title, description: "Short description", status: "Pending" }] });
                              }
                           }}
                           className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-all shadow-lg"
                         >
                           <Plus className="w-3 h-3" /> Add Step
                         </button>
                       </div>

                       <div className="overflow-x-auto">
                         <table className="w-full border-separate border-spacing-y-4">
                           <thead>
                             <tr className="text-[0.55rem] font-black uppercase tracking-[0.3em] text-slate-400">
                               <th className="text-left px-6 py-3">Order</th>
                               <th className="text-left px-6 py-3">Step</th>
                               <th className="text-center px-6 py-3">Status</th>
                               <th className="text-left px-6 py-3">Notes</th>
                               <th className="px-6 py-3"></th>
                             </tr>
                           </thead>
                           <tbody>
                             {project.workflow.map((step, idx) => (
                               <tr key={idx} className="group bg-white dark:bg-[#12121A] border border-black/5 dark:border-white/5 rounded-3xl transition-all hover:shadow-xl hover:shadow-black/5">
                                 <td className="px-6 py-8 rounded-l-[2rem]">
                                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all ${step.status === 'Complete' ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20' : (step.status === 'In Progress' ? 'bg-[#F05E23]/10 border-[#F05E23]/30 text-[#F05E23]' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400')}`}>
                                     {step.status === 'Complete' ? <CheckCircle2 className="w-6 h-6" /> : (step.status === 'In Progress' ? <Activity className="w-6 h-6 animate-pulse" /> : <Clock className="w-6 h-6" />)}
                                   </div>
                                 </td>
                                 <td className="px-6 py-8 max-w-sm">
                                   <input 
                                      type="text"
                                      defaultValue={step.title}
                                      onBlur={(e) => {
                                         const newWF = [...project.workflow];
                                         newWF[idx].title = e.target.value;
                                         updateClientProject(project._id, { workflow: newWF });
                                      }}
                                      className="w-full bg-transparent text-sm font-black uppercase text-slate-900 dark:text-white outline-none focus:text-[#F05E23] transition-colors mb-2"
                                   />
                                   <textarea
                                      defaultValue={step.description}
                                      onBlur={(e) => {
                                         const newWF = [...project.workflow];
                                         newWF[idx].description = e.target.value;
                                         updateClientProject(project._id, { workflow: newWF });
                                      }}
                                      rows={1}
                                      className="w-full bg-transparent text-[0.65rem] text-slate-500 dark:text-white/40 font-medium leading-relaxed outline-none focus:text-slate-700 dark:focus:text-white transition-colors resize-none scrollbar-hide"
                                   />
                                 </td>
                                 <td className="px-6 py-8">
                                    <div className="flex items-center justify-center gap-2 bg-black/3 dark:bg-white/3 p-2 rounded-2xl border border-black/5 dark:border-white/5">
                                       {["Pending", "In Progress", "Complete"].map((s) => (
                                         <button
                                           key={s}
                                           onClick={() => {
                                              const newWF = [...project.workflow];
                                              newWF[idx].status = s;
                                              updateClientProject(project._id, { workflow: newWF });
                                           }}
                                           className={`px-4 py-2 rounded-xl text-[0.5rem] font-black uppercase tracking-widest transition-all ${step.status === s ? (s === 'Complete' ? 'bg-green-500 text-white' : (s === 'In Progress' ? 'bg-[#F05E23] text-white' : 'bg-slate-400 text-white')) : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                                         >
                                           {s}
                                         </button>
                                       ))}
                                    </div>
                                 </td>
                                 <td className="px-6 py-8 min-w-50">
                                    <div className="relative group/input">
                                       <input 
                                          type="text"
                                          defaultValue={step.adminNote}
                                          onBlur={(e) => {
                                             const newWF = [...project.workflow];
                                             newWF[idx].adminNote = e.target.value;
                                             updateClientProject(project._id, { workflow: newWF });
                                          }}
                                          placeholder="Add a note..."
                                          className="w-full bg-black/5 dark:bg-white/3 border border-black/5 dark:border-white/5 rounded-2xl py-4 px-6 text-[0.65rem] text-slate-800 dark:text-white italic font-medium outline-none focus:border-[#F05E23]/30"
                                       />
                                       <Activity className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F05E23] opacity-30 group-focus-within/input:opacity-100 transition-opacity" />
                                    </div>
                                 </td>
                                 <td className="px-6 py-8 rounded-r-[2rem]">
                                    <button 
                                       onClick={() => {
                                          if (confirm("Delete this step?")) {
                                             const newWF = project.workflow.filter((_, i) => i !== idx);
                                             updateClientProject(project._id, { workflow: newWF });
                                          }
                                       }}
                                       className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                                    >
                                       <X className="w-4 h-4" />
                                    </button>
                                 </td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                     </div>
                   </motion.div>
                 )
               ))}
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
                    <span className={`text-[0.5rem] font-black uppercase px-3 py-1 rounded-full ${
                      leave.status === 'Approved' ? 'bg-green-500/10 text-green-500' : (leave.status === 'Rejected' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-600')
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

        {activeTab === "overview" && (
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-10 rounded-[3rem]">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-2xl font-black uppercase tracking-tight">Weekly <span className="text-[#F05E23]">Overview</span></h3>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[0.6rem] font-black uppercase text-slate-400">Updated live</span>
                   </div>
                </div>
                <div className="h-64 flex items-end gap-3 px-2">
                  {weeklyData.map((day, i) => (
                    <div key={i} className="flex-1 bg-slate-50 dark:bg-white/5 rounded-2xl relative overflow-hidden h-full flex items-end">
                      <motion.div initial={{ height: 0 }} animate={{ height: `${day.height}%` }} className={`w-full ${day.val > 70 ? 'bg-green-500' : 'bg-[#F05E23]'} transition-all`} />
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[0.5rem] font-black text-slate-400 opacity-0 hover:opacity-100 transition-opacity">
                        {day.val}%
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-6 px-1">
                  {weeklyData.map((day, i) => <span key={i} className="text-[0.6rem] font-black uppercase text-slate-300">{day.label}</span>)}
                </div>
              </div>

              <div className="bg-[#F05E23] rounded-[3rem] p-10 text-white relative overflow-hidden">
                 <Shield className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10" />
                 <h3 className="text-xl font-black uppercase mb-2">Workspace Summary</h3>
                 <p className="text-[0.6rem] font-bold uppercase opacity-60 tracking-widest mb-10">A quick snapshot of the workspace</p>
                 <div className="space-y-6">
                    <div className="p-6 bg-white/10 rounded-2xl border border-white/10">
                       <span className="block text-[0.5rem] font-black uppercase opacity-60 mb-1">People & projects</span>
                       <span className="text-2xl font-black italic">{interns.length + adminClientProjects.length}</span>
                    </div>
                    <div className="p-6 bg-white/10 rounded-2xl border border-white/10">
                       <span className="block text-[0.5rem] font-black uppercase opacity-60 mb-1">Response time</span>
                       <span className="text-2xl font-black italic">Fast and steady</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0D0D14] border border-black/5 dark:border-white/5 rounded-[3.5rem] p-10">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic">Client <span className="text-[#F05E23]">Overview</span></h3>
                    <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Progress at a glance</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="px-6 py-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
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
                            <h4 className="text-xl font-black uppercase tracking-tight italic group-hover:text-[#F05E23] transition-colors">{project.projectName}</h4>
                          </div>
                          <div className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest ${status === 'OPTIMIZED' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {status}
                          </div>
                        </div>

                        <div className="space-y-6">
                           <div>
                              <div className="flex justify-between items-center mb-3">
                                 <span className="text-[0.6rem] font-black uppercase text-slate-400 tracking-tighter">Progress</span>
                                 <span className="text-lg font-black italic">{efficiency}%</span>
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
                                 <span className="text-xl font-black italic">{completedSteps}/{totalSteps}</span>
                              </div>
                              <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                                 <span className="block text-[0.55rem] font-black text-slate-400 uppercase mb-1">Messages</span>
                                 <span className="text-xl font-black italic">{project.discussions?.length || 0}</span>
                              </div>
                           </div>

                           <div className="pt-4 border-t border-black/5 dark:border-white/5">
                              <span className="text-[0.5rem] font-black uppercase text-slate-400 mb-2 block">Latest note</span>
                              <p className="text-[0.65rem] font-medium text-slate-500 dark:text-white/40 italic line-clamp-1">
                                {project.discussions?.length > 0 ? `"${project.discussions[project.discussions.length - 1].content}"` : "No messages yet."}
                              </p>
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
              className="bg-white border border-slate-200 w-full max-w-xl rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05E23]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
              <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-12 text-slate-900">Provision <span className="text-[#F05E23]">Brand</span></h2>
              <div className="space-y-5">
                {[
                  { id: 'name', placeholder: 'Brand Name', type: 'text' },
                  { id: 'email', placeholder: 'Contact Email', type: 'email' },
                  { id: 'projectName', placeholder: 'Primary Project Name', type: 'text' }
                ].map((input) => (
                  <div key={input.id} className="relative group">
                    <input 
                      type={input.type} 
                      value={clientForm[input.id] || ""} 
                      onChange={e => setClientForm({...clientForm, [input.id]: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 font-black uppercase text-[0.65rem] tracking-widest outline-none focus:border-[#F05E23]/30 transition-all text-slate-800 placeholder:text-slate-300" 
                      placeholder={input.placeholder} 
                    />
                    <div className="absolute inset-y-0 left-0 w-1 bg-[#F05E23] scale-y-0 group-focus-within:scale-y-50 transition-transform rounded-r-full" />
                  </div>
                ))}
                <div className="flex gap-4 pt-10">
                  <button 
                    onClick={async () => {
                      if (!clientForm.name || !clientForm.email || !clientForm.projectName) return alert("All synchronization keys required");
                       const res = await createClient(clientForm.name, clientForm.email, clientForm.password);
                       if (res.success) {
                         await createClientProject({ 
                           clientId: res.client._id, 
                           projectName: clientForm.projectName, 
                           description: `Ecosystem for ${clientForm.name}`,
                           credentials: clientForm.credentials 
                         });
                         setIsAddingClient(false);
                        setStatusMsg({ type: 'success', msg: "Brand Integrated into Matrix." });
                      } else {
                        alert(res.message);
                      }
                    }} 
                    className="flex-1 bg-[#F05E23] text-white py-5 rounded-2xl font-black uppercase text-[0.65rem] tracking-[0.2em] shadow-[0_0_30px_rgba(240,94,35,0.2)] hover:shadow-[0_0_40px_rgba(240,94,35,0.4)] transition-all active:scale-95"
                  >
                    Establish Node
                  </button>
                  <button 
                    onClick={() => setIsAddingClient(false)} 
                    className="px-10 py-5 rounded-2xl border border-slate-200 font-black uppercase text-[0.65rem] tracking-[0.2em] text-slate-400 hover:bg-slate-50 transition-all"
                  >
                    Abort
                  </button>
                </div>
              </div>
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
                <h2 className="text-4xl font-black uppercase mb-12 tracking-tighter italic text-center text-slate-900">Onboard <span className="text-[#F05E23]">Intern</span></h2>
                <form onSubmit={handleAddIntern} className="space-y-5">
                   <div className="relative group">
                      <input type="text" required value={newIntern.name} onChange={e => setNewIntern({...newIntern, name: e.target.value})} placeholder="Full Identity" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-widest text-slate-800 placeholder:text-slate-300" />
                   </div>
                   <div className="relative group">
                      <input type="email" required value={newIntern.email} onChange={e => setNewIntern({...newIntern, email: e.target.value})} placeholder="System Access Email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-widest text-slate-800 placeholder:text-slate-300" />
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
           <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }} 
               animate={{ scale: 1, opacity: 1, y: 0 }} 
               className="bg-white border border-slate-200 w-full max-w-3xl p-10 sm:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
             >
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#F05E23]/5 rounded-full blur-[100px]" />
                 <h2 className="text-4xl sm:text-5xl font-black uppercase mb-8 tracking-tighter italic text-slate-900">Add <span className="text-[#F05E23]">Task</span></h2>
                <form onSubmit={handleAssignTask} className="space-y-6">
                   <input
                     type="text"
                     required
                     value={newTask.title}
                     onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                     placeholder="Task title"
                     className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-5 px-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-[0.18em] text-slate-800 placeholder:text-slate-300"
                   />

                   <select
                     required
                     value={newTask.internId}
                     onChange={e => setNewTask({ ...newTask, internId: e.target.value })}
                     className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-5 px-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-[0.14em] text-slate-800 appearance-none"
                   >
                     <option value="" className="bg-white">Select team member...</option>
                     {interns.map(i => <option key={i._id} value={i._id} className="bg-white">{i.name}</option>)}
                   </select>

                   <div className="grid grid-cols-2 gap-4">
                     <select
                       value={newTask.taskType}
                       onChange={e => setNewTask({ ...newTask, taskType: e.target.value })}
                       className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-5 px-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.6rem] tracking-[0.12em] text-slate-800 appearance-none text-center"
                     >
                       {["General", "Bug Fix", "Feature", "Design", "Content", "Research", "Meeting"].map((type) => (
                         <option key={type} value={type} className="bg-white text-left">{type}</option>
                       ))}
                     </select>
                     <input
                       type="number"
                       min="1"
                       max="20"
                       value={newTask.taskCount}
                       onChange={e => setNewTask({ ...newTask, taskCount: e.target.value })}
                       className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-5 px-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-[0.14em] text-slate-800 text-center"
                     />
                   </div>

                   <div className="space-y-2">
                     <div className="flex items-center justify-between">
                       <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-400">Task Details {Math.max(1, Number(newTask.taskCount) || 1) > 1 ? `(${Math.max(1, Number(newTask.taskCount) || 1)} items expected)` : ""}</span>
                       <span className="text-[0.55rem] font-bold text-[#F05E23]/60">Use • for bullet points</span>
                     </div>
                     <textarea
                       rows={Math.max(5, Math.ceil((Number(newTask.taskCount) || 1) * 1.8))}
                       required
                       value={newTask.description}
                       onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                       placeholder="• Describe the task&#10;• Add multiple points with bullet markers&#10;• One point per line"
                       className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-medium text-sm text-slate-800 placeholder:text-slate-300 resize-none"
                     />
                   </div>

                   <div className="flex gap-3">
                    <button type="button" onClick={() => setIsAssigningTask(false)} className="flex-1 py-5 rounded-3xl font-black uppercase text-[0.65rem] tracking-[0.2em] border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
                    <button type="submit" className="flex-1 bg-[#F05E23] text-white py-5 rounded-3xl font-black uppercase text-[0.65rem] tracking-[0.2em] shadow-[0_0_30px_rgba(240,94,35,0.2)] hover:shadow-[0_0_30px_rgba(240,94,35,0.4)] transition-all active:scale-95">Create Task</button>
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
                         <span className="text-[0.55rem] font-black uppercase tracking-widest text-slate-400 mb-2 px-2">{msg.sender === 'admin' ? 'YOU' : 'INTERN'} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
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
                         <input type="text" required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} placeholder="Project Title" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-widest text-slate-800 placeholder:text-slate-300" />
                      </div>
                      <div className="relative group">
                         <input type="text" value={projectForm.index} onChange={e => setProjectForm({...projectForm, index: e.target.value})} placeholder="Sequence Index (e.g. 01)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-widest text-slate-800 placeholder:text-slate-300" />
                      </div>
                      <div className="relative group">
                         <input type="text" value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})} placeholder="Sync Category" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-widest text-[#F05E23] placeholder:text-[#F05E23]/20" />
                      </div>
                   </div>
                   <div className="relative group">
                      <textarea rows={4} required value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} placeholder="Impact Narrative..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-8 outline-none focus:border-[#F05E23]/30 transition-all font-medium text-sm text-slate-800 placeholder:text-slate-300 resize-none" />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                         <input type="text" value={projectForm.tags} onChange={e => setProjectForm({...projectForm, tags: e.target.value})} placeholder="Technological Stack (comma separated)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.6rem] tracking-widest text-slate-500 placeholder:text-slate-300" />
                      </div>
                      <div className="relative group">
                         <input type="text" value={projectForm.impact} onChange={e => setProjectForm({...projectForm, impact: e.target.value})} placeholder="Critical Output (e.g. $50k Revenue Generated)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-green-500/30 transition-all font-black uppercase text-[0.6rem] tracking-widest text-green-600 placeholder:text-green-600/20 shadow-[0_0_20px_rgba(34,197,94,0.05)]" />
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
                        onChange={e => setCredentialForm({...credentialForm, env: e.target.value})}
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
                           onChange={e => setCredentialForm({...credentialForm, gmail: {...credentialForm.gmail, email: e.target.value}})}
                           placeholder="Email ID" 
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none focus:border-[#F05E23]/30 text-slate-800 text-xs font-bold"
                         />
                         <input 
                           type="password" 
                           value={credentialForm.gmail.password} 
                           onChange={e => setCredentialForm({...credentialForm, gmail: {...credentialForm.gmail, password: e.target.value}})}
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
                           onChange={e => setCredentialForm({...credentialForm, vercel: {...credentialForm.vercel, email: e.target.value}})}
                           placeholder="Account Email" 
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none focus:border-[#F05E23]/30 text-slate-800 text-xs font-bold"
                         />
                         <input 
                           type="password" 
                           value={credentialForm.vercel.password} 
                           onChange={e => setCredentialForm({...credentialForm, vercel: {...credentialForm.vercel, password: e.target.value}})}
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
                        onChange={e => setCredentialForm({...credentialForm, github: e.target.value})}
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
                        onChange={e => setCredentialForm({...credentialForm, additional: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none focus:border-[#F05E23]/30 text-slate-800 text-xs font-bold resize-none" 
                        placeholder="Hosting, Domain, API Keys..."
                      />
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
                         const res = await updateClientProject(selectedCredentialProject._id, { credentials: credentialForm });
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
