"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, CheckCircle2, Clock, Plus, Trash2, 
  Send, UserPlus, ClipboardList, TrendingUp,
  Mail, X, Check, Search, AlertCircle, Calendar, Briefcase, Shield,
  ExternalLink, MessageSquare, Save, Activity
} from "lucide-react";

export default function AdminDashboard() {
  const auth = useAuth();
  const { 
    user, interns, tasks, leaves, projects, adminClientProjects,
    addIntern, removeIntern, assignTask, updateTaskStatus, 
    deleteTask, reassignTask, announceToAll, approveLeave,
    addProject, updateProject, deleteProject,
    createClient, createClientProject, updateClientProject, loading 
  } = auth;

  const [activeTab, setActiveTab] = useState("interns");
  
  // Client Management States
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [clientForm, setClientForm] = useState({ name: "", email: "", password: "SyncClient123" });
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
    tags: ""
  });
  const [chatTaskId, setChatTaskId] = useState(null);
  const [chatMsg, setChatMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState({ type: "", msg: "" });

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
    if (!chatMsg.trim()) return;
    // Assuming sendDiscussion exists in context or similar
    // For now, using updateTaskStatus logic for discussion if needed, 
    // but the task object has a discussion array.
    setStatusMsg({ type: "success", msg: "Direct Sync active." });
    setChatMsg("");
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
      setProjectForm({ title: "", index: "", category: "Verified Partner", description: "", strategyDetail: "", happinessDetail: "", tags: "" });
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
      tags: project.tags.join(", ")
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-4xl sm:text-6xl font-black tracking-tight uppercase mb-2">Management <span className="text-[#F05E23]">Console</span></motion.h1>
          <p className="text-slate-500 dark:text-white/40 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> System Admin: {user?.name}
          </p>
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => setIsBroadcasting(true)} className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[0.7rem] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all outline-none border border-black/5 dark:border-white/10">
            <Send className="w-4 h-4" /> Strategic Broadcast
          </button>
          <button onClick={() => { setEditingProject(null); setProjectForm({ title: "", index: "", category: "Verified Partner", description: "", strategyDetail: "", happinessDetail: "", tags: "" }); setIsAddingProject(true); }} className="bg-white dark:bg-white/5 text-slate-600 dark:text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[0.7rem] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all outline-none border border-black/5 dark:border-white/10">
            <Plus className="w-4 h-4 text-[#F05E23]" /> Add Project
          </button>
          <button onClick={() => setIsAddingIntern(true)} className="bg-[#F05E23] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[0.7rem] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#F05E23]/20">
            <UserPlus className="w-4 h-4" /> Add Intern
          </button>
          <button onClick={() => setIsAssigningTask(true)} className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[0.7rem] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
            <Plus className="w-4 h-4" /> New Assignment
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {[
          { icon: Users, label: "Talent Pool", val: stats.totalInterns, color: "blue", desc: "active interns" },
          { icon: Clock, label: "Live Tasks", val: stats.activeTasks, color: "orange", desc: "in progress" },
          { icon: AlertCircle, label: "System Blockers", val: stats.blockers, color: "red", desc: "need attention" },
          { icon: Calendar, label: "Pending Leave", val: stats.pendingHolidays, color: "purple", desc: "wait for review" },
          { icon: CheckCircle2, label: "Efficiency", val: stats.completedTasks, color: "green", desc: "finalized tasks" }
        ].map((stat, i) => (
          <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform`} />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-4 rounded-2xl bg-${stat.color}-500/10`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
              </div>
              <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</span>
            </div>
            <div className="text-4xl font-black mb-1 relative z-10">{stat.val}</div>
            <p className="text-[0.6rem] font-bold text-slate-400/60 uppercase relative z-10">{stat.desc}</p>
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
                       <h4 className="text-4xl font-black uppercase tracking-tighter italic">{project.projectName}</h4>
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
                   <div className="p-10 bg-black/5 dark:bg-white/[0.02] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {project.workflow.map((step, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#12121A] border border-black/5 dark:border-white/5 p-8 rounded-3xl space-y-6 group hover:border-[#F05E23]/30 transition-all">
                           <div className="flex justify-between items-start">
                             <div className={`p-3 rounded-2xl ${step.status === 'Complete' ? 'bg-green-500/10 text-green-500' : 'bg-[#F05E23]/10 text-[#F05E23]'}`}>
                               {step.status === 'Complete' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                             </div>
                             <select 
                                value={step.status} 
                                onChange={(e) => {
                                   const newWF = [...project.workflow];
                                   newWF[idx].status = e.target.value;
                                   updateClientProject(project._id, { workflow: newWF });
                                }}
                                className="bg-transparent border-none text-[8px] font-black uppercase text-white/40 outline-none"
                             >
                               <option value="Pending">Pending</option>
                               <option value="In Progress">In Progress</option>
                               <option value="Complete">Complete</option>
                             </select>
                           </div>
                           <h5 className="text-sm font-black uppercase">{step.title}</h5>
                           <input 
                              type="text"
                              defaultValue={step.adminNote}
                              onBlur={(e) => {
                                 const newWF = [...project.workflow];
                                 newWF[idx].adminNote = e.target.value;
                                 updateClientProject(project._id, { workflow: newWF });
                              }}
                              placeholder="Add Admin Note..."
                              className="w-full bg-transparent text-[9px] text-[#F05E23] italic font-medium outline-none placeholder:text-white/10"
                           />
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                           const title = prompt("New Objective Title:");
                           if (title) {
                              updateClientProject(project._id, { workflow: [...project.workflow, { title, description: "Brand mission step", status: "Pending" }] });
                           }
                        }}
                        className="border-2 border-dashed border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-white/20 hover:text-white/40 hover:bg-white/5 transition-all"
                      >
                        <Plus className="w-8 h-8" />
                        <span className="text-[8px] font-black uppercase">Add Objective</span>
                      </button>
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
              <div key={leave._id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between gap-8">
                <div>
                   <h3 className="font-black text-xl uppercase tracking-tight">{leave.internId?.name}</h3>
                   <p className="text-xs text-slate-400 mt-1 uppercase font-black">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
                   <p className="text-xs text-slate-500 mt-4 font-medium italic">{leave.reason}</p>
                </div>
                {leave.status === 'Pending' && (
                  <div className="flex gap-4">
                    <button onClick={() => approveLeave(leave._id, "Approved")} className="bg-green-500 text-white px-6 py-3 rounded-2xl font-black uppercase text-[0.65rem]">Approve</button>
                    <button onClick={() => approveLeave(leave._id, "Rejected")} className="bg-red-500 text-white px-6 py-3 rounded-2xl font-black uppercase text-[0.65rem]">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-10 rounded-[3rem]">
              <h3 className="text-2xl font-black uppercase mb-10 tracking-tight">System <span className="text-[#F05E23]">Pulse</span></h3>
              <div className="h-64 flex items-end gap-3 px-2">
                {weeklyData.map((day, i) => (
                  <div key={i} className="flex-1 bg-slate-50 dark:bg-white/5 rounded-2xl relative overflow-hidden h-full flex items-end">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${day.height}%` }} className={`w-full ${day.val > 70 ? 'bg-green-500' : 'bg-[#F05E23]'} transition-all`} />
                  </div>
                ))}
              </div>
               <div className="flex justify-between mt-6 px-1">
                 {weeklyData.map((day, i) => <span key={i} className="text-[0.6rem] font-black uppercase text-slate-300">{day.label}</span>)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isBroadcasting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#0A0A0A] w-full max-w-lg p-12 rounded-[3rem] shadow-2xl border border-white/5">
               <h2 className="text-3xl font-black uppercase mb-10 tracking-tight text-center">Strategic <span className="text-[#F05E23]">Broadcast</span></h2>
               <form onSubmit={handleBroadcast} className="space-y-6">
                  <textarea rows={6} required value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} placeholder="Directive for team..." className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 outline-none focus:border-[#F05E23] font-bold text-sm" />
                  <div className="flex gap-4">
                     <button type="button" onClick={() => setIsBroadcasting(false)} className="flex-1 py-5 rounded-2xl font-black border border-black/10 dark:border-white/10">Abort</button>
                     <button type="submit" className="flex-1 bg-[#F05E23] text-white py-5 rounded-2xl font-black shadow-lg shadow-[#F05E23]/20">Deploy</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}

        {isAddingClient && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0 backdrop-blur-xl bg-black/60">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#12121A] border border-white/10 w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-10">Provision <span className="text-[#F05E23]">Brand</span></h2>
              <div className="space-y-6">
                <input type="text" value={clientForm.name} onChange={e => setClientForm({...clientForm, name: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 font-black uppercase text-xs outline-none focus:border-[#F05E23]/50" placeholder="Brand Name" />
                <input type="email" value={clientForm.email} onChange={e => setClientForm({...clientForm, email: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 font-black uppercase text-xs outline-none focus:border-[#F05E23]/50" placeholder="Contact Email" />
                <input type="text" value={clientForm.projectName || ""} onChange={e => setClientForm({...clientForm, projectName: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 font-black uppercase text-xs outline-none focus:border-[#F05E23]/50" placeholder="Primary Project Name" />
                <div className="flex gap-4 pt-6">
                  <button onClick={async () => {
                    if (!clientForm.name || !clientForm.email || !clientForm.projectName) return alert("Fields required");
                    const res = await createClient(clientForm.name, clientForm.email);
                    if (res.success) {
                      await createClientProject({ clientId: res.client._id, projectName: clientForm.projectName, description: `Ecosystem for ${clientForm.name}` });
                      setIsAddingClient(false);
                      setStatusMsg({ type: 'success', msg: "Brand Synchronized." });
                    } else {
                      alert(res.message);
                    }
                  }} className="flex-1 bg-[#F05E23] text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl shadow-[#F05E23]/20 transition-all active:scale-95">Establish Node</button>
                  <button onClick={() => setIsAddingClient(false)} className="px-10 py-5 rounded-2xl border border-white/10 font-black uppercase text-xs text-white/40">Abort</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isAddingIntern && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/40">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#0A0A0A] w-full max-w-lg p-10 rounded-[3rem] shadow-2xl border border-white/10">
                <h2 className="text-3xl font-black uppercase mb-10 tracking-tight text-center">Onboard <span className="text-[#F05E23]">Intern</span></h2>
                <form onSubmit={handleAddIntern} className="space-y-6">
                   <input type="text" required value={newIntern.name} onChange={e => setNewIntern({...newIntern, name: e.target.value})} placeholder="Full Name" className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none font-bold" />
                   <input type="email" required value={newIntern.email} onChange={e => setNewIntern({...newIntern, email: e.target.value})} placeholder="Secure Email" className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none font-bold" />
                   <div className="flex gap-4">
                     <button type="button" onClick={() => setIsAddingIntern(false)} className="flex-1 py-5 rounded-2xl font-black border border-black/10 dark:border-white/10">Cancel</button>
                     <button type="submit" className="flex-1 bg-[#F05E23] text-white py-5 rounded-2xl font-black shadow-lg shadow-[#F05E23]/20">Deploy</button>
                   </div>
                </form>
             </motion.div>
           </div>
        )}

        {isAssigningTask && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/40">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#0A0A0A] w-full max-w-2xl p-10 rounded-[3rem] shadow-2xl border border-white/10">
                <h2 className="text-3xl font-black uppercase mb-10 tracking-tight">Deploy <span className="text-[#F05E23]">Assignment</span></h2>
                <form onSubmit={handleAssignTask} className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <input type="text" required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Title" className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none font-bold" />
                      <select required value={newTask.internId} onChange={e => setNewTask({...newTask, internId: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none font-bold">
                         <option value="">Select Intern...</option>
                         {interns.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
                      </select>
                   </div>
                   <textarea rows={4} required value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Tactical Objective..." className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none font-bold" />
                   <div className="flex gap-4">
                     <button type="button" onClick={() => setIsAssigningTask(false)} className="flex-1 py-5 rounded-2xl font-black border border-black/10 dark:border-white/10">Abort</button>
                     <button type="submit" className="flex-1 bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black">Deploy</button>
                   </div>
                </form>
             </motion.div>
           </div>
        )}

        {isAddingProject && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/40">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#0A0A0A] w-full max-w-4xl p-10 rounded-[3rem] shadow-2xl border border-white/10 overflow-y-auto max-h-[90vh]">
                <h2 className="text-3xl font-black uppercase mb-10 tracking-tight text-center">{editingProject ? 'Update' : 'Deploy'} <span className="text-[#F05E23]">Showcase</span></h2>
                <form onSubmit={handleProjectSubmit} className="space-y-6">
                   <div className="grid grid-cols-3 gap-6">
                      <input type="text" required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} placeholder="Name" className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none font-bold" />
                      <input type="text" value={projectForm.index} onChange={e => setProjectForm({...projectForm, index: e.target.value})} placeholder="Index" className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none font-bold" />
                      <input type="text" value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})} placeholder="Category" className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none font-bold" />
                   </div>
                   <textarea rows={3} required value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} placeholder="Description" className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none font-bold" />
                   <input type="text" value={projectForm.tags} onChange={e => setProjectForm({...projectForm, tags: e.target.value})} placeholder="Tags (comma separated)" className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none font-bold" />
                   <div className="flex gap-4">
                     <button type="button" onClick={() => setIsAddingProject(false)} className="flex-1 py-5 rounded-2xl font-black border border-black/10 dark:border-white/10">Abort</button>
                     <button type="submit" className="flex-1 bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black">Finalize</button>
                   </div>
                </form>
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
