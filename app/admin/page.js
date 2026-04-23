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
    priority: "Medium",
    dueDate: ""
  });
  const [projectForm, setProjectForm] = useState({
    title: "", index: "", category: "Verified Partner", 
    description: "", strategyDetail: "", happinessDetail: "", 
    tags: "", impact: ""
  });
  const [chatTaskId, setChatTaskId] = useState(null);
  const [chatMsg, setChatMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState({ type: "", msg: "" });
  
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
    const res = await assignTask(newTask);
    if (res.success) {
      setStatusMsg({ type: "success", msg: "Task assigned properly!" });
      setIsAssigningTask(false);
      setNewTask({ title: "", description: "", internId: "", priority: "Medium", dueDate: "" });
    } else {
      setStatusMsg({ type: "error", msg: res.message });
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
             <span className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-[#F05E23]">Synchronous Command</span>
          </motion.div>
          <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-7xl font-black tracking-tighter uppercase italic leading-none">Management <span className="text-[#F05E23] drop-shadow-[0_0_15px_rgba(240,94,35,0.2)]">Matrix</span></motion.h1>
          <p className="mt-6 text-slate-500 dark:text-white/30 font-bold uppercase tracking-[0.2em] text-[0.6rem] flex items-center gap-3">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </span>
             Nexus Administrator: <span className="text-black dark:text-white">{user?.name}</span>
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 relative z-10">
          <button onClick={() => setIsBroadcasting(true)} className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-800 dark:text-white px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[0.6rem] flex items-center gap-3 transition-all border border-black/5 dark:border-white/5 active:scale-95">
            <Send className="w-3.5 h-3.5 text-[#F05E23]" /> Signal Team
          </button>
          <button onClick={() => { setEditingProject(null); setProjectForm({ title: "", index: "", category: "Verified Partner", description: "", strategyDetail: "", happinessDetail: "", tags: "", impact: "" }); setIsAddingProject(true); }} className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-800 dark:text-white px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[0.6rem] flex items-center gap-3 transition-all border border-black/5 dark:border-white/5 active:scale-95">
            <Plus className="w-3.5 h-3.5 text-[#F05E23]" /> New Showcase
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
            <UserPlus className="w-3.5 h-3.5" /> Provision Brand
          </button>
          <button onClick={() => setIsAddingIntern(true)} className="bg-black dark:bg-white text-white dark:text-black px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[0.6rem] flex items-center gap-3 transition-all hover:opacity-90 active:scale-95">
            <UserPlus className="w-3.5 h-3.5" /> Integrate Talent
          </button>
          <button onClick={() => setIsAssigningTask(true)} className="bg-slate-900/5 dark:bg-white/5 text-slate-800 dark:text-white px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[0.6rem] flex items-center gap-3 border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-95">
            <Plus className="w-3.5 h-3.5" /> Mission Patch
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
        {[
          { icon: Users, label: "Asset Manifest", val: stats.totalInterns, color: "blue", desc: "Active Nodes" },
          { icon: Clock, label: "Active Syncs", val: stats.activeTasks, color: "orange", desc: "Processing" },
          { icon: AlertCircle, label: "Critical Halts", val: stats.blockers, color: "red", desc: "Attention Req" },
          { icon: Calendar, label: "Rest Protocols", val: stats.pendingHolidays, color: "purple", desc: "Pending Review" },
          { icon: CheckCircle2, label: "Sync Efficiency", val: stats.completedTasks, color: "green", desc: "Successful Commits" }
        ].map((stat, i) => (
          <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm hover:border-[#F05E23]/20 transition-all group relative overflow-hidden backdrop-blur-sm">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/[0.025] rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`} />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className={`p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 group-hover:border-[#F05E23]/20 transition-all`}>
                <stat.icon className={`w-5 h-5 text-${stat.color === 'orange' ? '[#F05E23]' : stat.color + '-500'}`} />
              </div>
              <span className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/20">{stat.label}</span>
            </div>
            <div className="text-5xl font-black mb-2 relative z-10 tracking-tighter italic text-slate-900 dark:text-white">{stat.val}</div>
            <p className="text-[0.55rem] font-bold text-slate-400 dark:text-white/10 uppercase tracking-[0.1em] relative z-10">{stat.desc}</p>
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
            {tab.id}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === "interns" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {interns.map((intern) => {
                const iTasks = tasks.filter(t => t.internId?._id === intern._id);
                const rate = Math.round((iTasks.filter(t => t.status === "Complete").length / (iTasks.length || 1)) * 100);
                return (
                  <motion.div layout initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} key={intern._id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-8 rounded-[2.5rem] relative group overflow-hidden">
                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                       <button onClick={() => removeIntern(intern._id)} className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="flex items-center gap-5 mb-8">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-[#F05E23] to-[#FF8C61] flex items-center justify-center text-white font-black text-2xl shadow-lg">
                        {intern.name?.[0]}
                      </div>
                      <div>
                        <h3 className="font-black text-xl mb-1">{intern.name}</h3>
                        <p className="text-[0.65rem] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">{intern.email}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[0.6rem] font-black uppercase text-slate-400 tracking-tighter">Velocity Score</span>
                           <span className="text-[#F05E23] font-black text-sm">{rate}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: `${rate}%` }} className="h-full bg-[#F05E23]" />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                           <span className="block text-[0.55rem] font-black text-slate-400 uppercase mb-1">Queue</span>
                           <span className="text-lg font-black">{iTasks.length}</span>
                        </div>
                        <div className="flex-1 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                           <span className="block text-[0.55rem] font-black text-slate-400 uppercase mb-1">Health</span>
                           <span className="text-[0.65rem] font-black text-green-500 uppercase">Elite</span>
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
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <motion.div layout initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={task._id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-8 rounded-[2.5rem] flex flex-col lg:flex-row lg:items-center justify-between gap-8 group">
                  <div className="flex-grow space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-black text-xl tracking-tight">{task.title}</h3>
                      <span className={`text-[0.55rem] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] ${task.status === "Complete" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`}>{task.status}</span>
                      <span className={`text-[0.55rem] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] border ${task.priority === 'High' ? 'border-red-500/30 text-red-500 bg-red-500/5' : 'border-slate-500/30 text-slate-500 bg-slate-500/5'}`}>
                         Priority: {task.priority || 'Medium'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-white/40 leading-relaxed max-w-3xl font-medium">{task.description}</p>
                  </div>
                  
                    <div className="flex lg:flex-col gap-3 min-w-[200px]">
                      <div className="flex gap-2">
                        <button onClick={() => setChatTaskId(task._id)} className="flex-1 bg-slate-50 dark:bg-white/10 text-slate-600 dark:text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[0.6rem] flex items-center justify-center gap-2 border border-black/5 dark:border-white/10">
                          <Mail className="w-3 h-3" /> Chat
                        </button>
                        <button onClick={() => deleteTask(task._id)} className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {task.meetingLink && (
                        <a href={task.meetingLink} target="_blank" className="bg-blue-500 text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[0.6rem] flex items-center justify-center gap-2">
                          <Activity className="w-3 h-3" /> Sync Link
                        </a>
                      )}
                      {task.status === "Complete" && !task.isApproved && (
                        <button onClick={() => handleApproveTask(task._id)} className="bg-green-500 text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[0.6rem]">Approve</button>
                      )}
                    </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {activeTab === "brands" && (
          <div className="space-y-10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black uppercase tracking-tighter">Brand <span className="text-[#F05E23]">Sync</span> Matrix</h3>
              <button onClick={() => setIsAddingClient(true)} className="px-8 py-4 bg-[#F05E23] text-white rounded-2xl text-[0.7rem] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-[#F05E23]/20">
                <UserPlus className="w-4 h-4" /> Provision Brand
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-10">
               {adminClientProjects.map((project) => (
                 <motion.div key={project._id} layout className="bg-white dark:bg-[#0D0D14] border border-black/5 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5">
                   <div className="p-10 border-b border-black/5 dark:border-white/5 flex flex-col lg:flex-row justify-between gap-10">
                     <div className="space-y-4 max-w-2xl">
                       <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[9px] font-black uppercase flex items-center gap-2 w-fit">
                         <Activity className="w-3 h-3 animate-pulse" /> {project.status}
                       </span>
                       <div className="flex justify-between items-start">
                         <h4 className="text-4xl font-black uppercase tracking-tighter italic">{project.projectName}</h4>
                         <div className="flex gap-2">
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
                              className="p-3 bg-green-500/10 text-green-500 rounded-2xl hover:bg-green-500 hover:text-white transition-all shrink-0"
                              title="Project Credentials"
                           >
                              <Shield className="w-4 h-4" />
                           </button>
                           <button 
                              onClick={() => {
                                const url = `${window.location.origin}/brands/${project.publicId}`;
                                navigator.clipboard.writeText(url);
                                setStatusMsg({ type: "success", msg: "Strategic share link copied!" });
                              }}
                              className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl hover:bg-blue-500 hover:text-white transition-all shrink-0"
                              title="Copy Share Link"
                           >
                              <ExternalLink className="w-4 h-4" />
                           </button>
                           <button 
                              onClick={() => {
                                if (confirm("Permanently purge this project matrix?")) {
                                  if (purgeClientProject) {
                                    purgeClientProject(project._id);
                                  } else {
                                    console.error("Purge function not found in context");
                                    alert("System sync error. Please refresh.");
                                  }
                                }
                              }}
                              className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shrink-0"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                       </div>
                       <p className="text-slate-500 dark:text-white/40 text-sm leading-relaxed">{project.description}</p>
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
                           placeholder="Directive for Brand..."
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
                    <div className="p-8 bg-slate-50 dark:bg-white/[0.02] border-t border-black/5 dark:border-white/5">
                      <div className="flex items-center justify-between mb-8">
                        <h5 className="text-[0.6rem] font-black uppercase tracking-[0.4em] text-[#F05E23] flex items-center gap-3">
                          <ClipboardList className="w-4 h-4" /> Mission Roadmap Configuration
                        </h5>
                        <button 
                          onClick={() => {
                             const title = prompt("New Objective Title:");
                             if (title) {
                                updateClientProject(project._id, { workflow: [...project.workflow, { title, description: "Mission objective parameters", status: "Pending" }] });
                             }
                          }}
                          className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-all shadow-lg"
                        >
                          <Plus className="w-3 h-3" /> Insert Objective
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-y-4">
                          <thead>
                            <tr className="text-[0.55rem] font-black uppercase tracking-[0.3em] text-slate-400">
                              <th className="text-left px-6 py-3">Sequence</th>
                              <th className="text-left px-6 py-3">Mission Parameter</th>
                              <th className="text-center px-6 py-3">Status Matrix</th>
                              <th className="text-left px-6 py-3">Directives</th>
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
                                   <div className="flex items-center justify-center gap-2 bg-black/[0.03] dark:bg-white/[0.03] p-2 rounded-2xl border border-black/5 dark:border-white/5">
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
                                <td className="px-6 py-8 min-w-[200px]">
                                   <div className="relative group/input">
                                      <input 
                                         type="text"
                                         defaultValue={step.adminNote}
                                         onBlur={(e) => {
                                            const newWF = [...project.workflow];
                                            newWF[idx].adminNote = e.target.value;
                                            updateClientProject(project._id, { workflow: newWF });
                                         }}
                                         placeholder="System Directive..."
                                         className="w-full bg-black/5 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl py-4 px-6 text-[0.65rem] text-slate-800 dark:text-white italic font-medium outline-none focus:border-[#F05E23]/30"
                                      />
                                      <Activity className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F05E23] opacity-30 group-focus-within/input:opacity-100 transition-opacity" />
                                   </div>
                                </td>
                                <td className="px-6 py-8 rounded-r-[2rem]">
                                   <button 
                                      onClick={() => {
                                         if (confirm("Purge this objective?")) {
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
          <div className="space-y-6">
            {leaves.map((leave) => (
              <div key={leave._id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-10 rounded-[2.5rem] flex items-center justify-between gap-8 group hover:border-[#F05E23]/20 transition-all">
                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                         <Calendar className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                         <h3 className="font-black text-xl uppercase tracking-tighter italic text-slate-900 dark:text-white">{leave.internId?.name}</h3>
                         <p className="text-[10px] text-[#F05E23] uppercase font-black tracking-widest">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
                      </div>
                   </div>
                   <p className="text-xs text-slate-500 dark:text-white/40 font-medium italic leading-relaxed">"{leave.reason}"</p>
                </div>
                {leave.status === 'Pending' ? (
                  <div className="flex gap-4">
                    <button onClick={() => approveLeave(leave._id, "Approved")} className="bg-green-500 text-white px-8 py-4 rounded-xl font-black uppercase text-[0.6rem] tracking-widest shadow-lg shadow-green-500/20 hover:scale-105 transition-all">Grant</button>
                    <button onClick={() => approveLeave(leave._id, "Rejected")} className="bg-transparent border border-red-500/30 text-red-500 px-8 py-4 rounded-xl font-black uppercase text-[0.6rem] tracking-widest hover:bg-red-500 hover:text-white transition-all">Deny</button>
                  </div>
                ) : (
                   <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${leave.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {leave.status}
                   </span>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "overview" && (
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-10 rounded-[3rem]">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-2xl font-black uppercase tracking-tight">System <span className="text-[#F05E23]">Pulse</span></h3>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[0.6rem] font-black uppercase text-slate-400">Live Load Tracking</span>
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
                 <h3 className="text-xl font-black uppercase mb-2">Nexus Security</h3>
                 <p className="text-[0.6rem] font-bold uppercase opacity-60 tracking-widest mb-10">Administrative Level Protocol</p>
                 <div className="space-y-6">
                    <div className="p-6 bg-white/10 rounded-2xl border border-white/10">
                       <span className="block text-[0.5rem] font-black uppercase opacity-60 mb-1">Encrypted Nodes</span>
                       <span className="text-2xl font-black italic">{(interns.length + adminClientProjects.length) * 4} Units</span>
                    </div>
                    <div className="p-6 bg-white/10 rounded-2xl border border-white/10">
                       <span className="block text-[0.5rem] font-black uppercase opacity-60 mb-1">Response Latency</span>
                       <span className="text-2xl font-black italic">0.4ms Synchronized</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0D0D14] border border-black/5 dark:border-white/5 rounded-[3.5rem] p-10">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic">Client <span className="text-[#F05E23]">Performance</span> Matrix</h3>
                    <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Efficiency & Objective Sync Analysis</p>
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
                        className="bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-3xl p-8 hover:border-[#F05E23]/30 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-8">
                          <div>
                            <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[8px] font-black text-slate-400 uppercase mb-2 block w-fit">PID: {project._id.slice(-6)}</span>
                            <h4 className="text-xl font-black uppercase tracking-tight italic group-hover:text-[#F05E23] transition-colors">{project.projectName}</h4>
                          </div>
                          <div className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest ${status === 'OPTIMIZED' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {status}
                          </div>
                        </div>

                        <div className="space-y-6">
                           <div>
                              <div className="flex justify-between items-center mb-3">
                                 <span className="text-[0.6rem] font-black uppercase text-slate-400 tracking-tighter">Sync Health</span>
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
                                 <span className="block text-[0.55rem] font-black text-slate-400 uppercase mb-1">Objectives</span>
                                 <span className="text-xl font-black italic">{completedSteps}/{totalSteps}</span>
                              </div>
                              <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                                 <span className="block text-[0.55rem] font-black text-slate-400 uppercase mb-1">Sync Comms</span>
                                 <span className="text-xl font-black italic">{project.discussions?.length || 0}</span>
                              </div>
                           </div>

                           <div className="pt-4 border-t border-black/5 dark:border-white/5">
                              <span className="text-[0.5rem] font-black uppercase text-slate-400 mb-2 block">Latest Directive Trace</span>
                              <p className="text-[0.65rem] font-medium text-slate-500 dark:text-white/40 italic line-clamp-1">
                                 {project.discussions?.length > 0 ? `"${project.discussions[project.discussions.length - 1].content}"` : "No active signal trace detected."}
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              className="bg-white border border-slate-200 w-full max-w-lg p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F05E23] to-transparent opacity-50" />
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-8 font-black uppercase text-[0.65rem] tracking-[0.1em] outline-none focus:border-[#F05E23]/30 transition-all text-slate-800 placeholder:text-slate-300" 
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
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }} 
               animate={{ scale: 1, opacity: 1, y: 0 }} 
               className="bg-white border border-slate-200 w-full max-w-lg p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[60px]" />
                <h2 className="text-4xl font-black uppercase mb-12 tracking-tighter italic text-center text-slate-900">Onboard <span className="text-[#F05E23]">Intern</span></h2>
                <form onSubmit={handleAddIntern} className="space-y-5">
                   <div className="relative group">
                      <input type="text" required value={newIntern.name} onChange={e => setNewIntern({...newIntern, name: e.target.value})} placeholder="Full Identity" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-[0.1em] text-slate-800 placeholder:text-slate-300" />
                   </div>
                   <div className="relative group">
                      <input type="email" required value={newIntern.email} onChange={e => setNewIntern({...newIntern, email: e.target.value})} placeholder="System Access Email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-[0.1em] text-slate-800 placeholder:text-slate-300" />
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
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }} 
               animate={{ scale: 1, opacity: 1, y: 0 }} 
               className="bg-white border border-slate-200 w-full max-w-2xl p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
             >
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#F05E23]/5 rounded-full blur-[100px]" />
                <h2 className="text-4xl font-black uppercase mb-12 tracking-tighter italic text-slate-900">Deploy <span className="text-[#F05E23]">Assignment</span></h2>
                <form onSubmit={handleAssignTask} className="space-y-6">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="relative group">
                        <input type="text" required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Mission Directive" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-[0.1em] text-slate-800 placeholder:text-slate-300" />
                      </div>
                      <div className="relative group">
                        <select required value={newTask.internId} onChange={e => setNewTask({...newTask, internId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-[0.1em] text-slate-800 appearance-none">
                           <option value="" className="bg-white">Select Asset...</option>
                           {interns.map(i => <option key={i._id} value={i._id} className="bg-white">{i.name}</option>)}
                        </select>
                      </div>
                   </div>
                   <div className="relative group">
                      <textarea rows={5} required value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Tactical Objective Parameters..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-8 outline-none focus:border-[#F05E23]/30 transition-all font-medium text-sm text-slate-800 placeholder:text-slate-300 resize-none shadow-inner" />
                   </div>
                   <div className="flex gap-4 pt-10">
                     <button type="button" onClick={() => setIsAssigningTask(false)} className="flex-1 py-5 rounded-2xl font-black uppercase text-[0.65rem] tracking-[0.2em] border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all">Abort</button>
                     <button type="submit" className="flex-1 bg-[#F05E23] text-white py-5 rounded-2xl font-black uppercase text-[0.65rem] tracking-[0.2em] shadow-[0_0_b0px_rgba(240,94,35,0.2)] hover:shadow-[0_0_30px_rgba(240,94,35,0.4)] transition-all active:scale-95">Finalize Deployment</button>
                   </div>
                </form>
             </motion.div>
           </div>
        )}

        {chatTask && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
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

                <div className="flex-grow p-8 overflow-y-auto space-y-6 scrollbar-hide bg-slate-50">
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
                      <input type="text" value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="Enter briefing intel..." className="flex-grow bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-[#F05E23] font-bold text-sm" />
                      <button type="submit" className="bg-[#F05E23] text-white p-4 rounded-2xl shadow-lg shadow-[#F05E23]/30 hover:scale-105 active:scale-95 transition-all"><Send className="w-6 h-6" /></button>
                   </div>
                </form>
             </motion.div>
           </div>
        )}

        {isAddingProject && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }} 
               animate={{ scale: 1, opacity: 1, y: 0 }} 
               className="bg-white border border-slate-200 w-full max-w-4xl p-12 rounded-[4rem] shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide"
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F05E23] to-transparent opacity-30" />
                <h2 className="text-4xl font-black uppercase mb-12 tracking-tighter italic text-center text-slate-900">{editingProject ? 'Update' : 'Deploy'} <span className="text-[#F05E23]">Showcase</span></h2>
                <form onSubmit={handleProjectSubmit} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="relative group">
                         <input type="text" required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} placeholder="Project Title" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-[0.1em] text-slate-800 placeholder:text-slate-300" />
                      </div>
                      <div className="relative group">
                         <input type="text" value={projectForm.index} onChange={e => setProjectForm({...projectForm, index: e.target.value})} placeholder="Sequence Index (e.g. 01)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-[0.1em] text-slate-800 placeholder:text-slate-300" />
                      </div>
                      <div className="relative group">
                         <input type="text" value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})} placeholder="Sync Category" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.65rem] tracking-[0.1em] text-[#F05E23] placeholder:text-[#F05E23]/20" />
                      </div>
                   </div>
                   <div className="relative group">
                      <textarea rows={4} required value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} placeholder="Impact Narrative..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-8 outline-none focus:border-[#F05E23]/30 transition-all font-medium text-sm text-slate-800 placeholder:text-slate-300 resize-none" />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                         <input type="text" value={projectForm.tags} onChange={e => setProjectForm({...projectForm, tags: e.target.value})} placeholder="Technological Stack (comma separated)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-[#F05E23]/30 transition-all font-black uppercase text-[0.6rem] tracking-[0.1em] text-slate-500 placeholder:text-slate-300" />
                      </div>
                      <div className="relative group">
                         <input type="text" value={projectForm.impact} onChange={e => setProjectForm({...projectForm, impact: e.target.value})} placeholder="Critical Output (e.g. $50k Revenue Generated)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:border-green-500/30 transition-all font-black uppercase text-[0.6rem] tracking-[0.1em] text-green-600 placeholder:text-green-600/20 shadow-[0_0_20px_rgba(34,197,94,0.05)]" />
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
           <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
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
           <motion.div key="status-notification" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className={`fixed bottom-10 right-10 z-[200] p-6 rounded-3xl shadow-2xl flex items-center gap-4 border ${statusMsg.type === 'success' ? 'bg-green-500 border-green-400 text-white' : 'bg-red-500 border-red-400 text-white'}`}>
             <span className="font-black text-[0.7rem] uppercase tracking-[0.1em]">{statusMsg.msg}</span>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
