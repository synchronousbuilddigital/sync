"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, CheckCircle2, Clock, Plus, Trash2, 
  Send, UserPlus, ClipboardList, TrendingUp,
  Mail, X, Check, Search, AlertCircle, Calendar
} from "lucide-react";

export default function AdminDashboard() {
  const { user, interns, tasks, leaves, addIntern, removeIntern, assignTask, updateTaskStatus, sendDiscussion, sendInvite, approveLeave, deleteTask, reassignTask, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("interns");
  const [isAddingIntern, setIsAddingIntern] = useState(false);
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  
  const [newIntern, setNewIntern] = useState({ name: "", email: "" });
  const [newTask, setNewTask] = useState({ 
    title: "", 
    description: "", 
    internId: "",
    priority: "Medium",
    dueDate: ""
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
    await sendDiscussion(chatTaskId, chatMsg);
    setChatMsg("");
  };

  const handleAddIntern = async (e) => {
    e.preventDefault();
    const res = await addIntern(newIntern.name, newIntern.email);
    if (res.success) {
      setStatusMsg({ type: "success", msg: `Intern added! Default pass: ${res.intern.password}` });
      setIsAddingIntern(false);
      await sendInvite({ email: newIntern.email, name: newIntern.name, password: res.intern.password });
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
     for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dayTasks = tasks.filter(t => new Date(t.updatedAt || t.createdAt).toDateString() === d.toDateString());
        const completions = dayTasks.filter(t => t.status === "Complete").length;
        results.push({ label: days[d.getDay()], val: dayTasks.length > 0 ? Math.round((completions / dayTasks.length) * 100) : 0 });
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
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> System Admin: {user.name}
          </p>
        </div>
        
        <div className="flex gap-4">
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

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {["interns", "tasks", "holidays", "overview"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[0.65rem] transition-all relative ${activeTab === tab ? "bg-[#F05E23] text-white shadow-lg shadow-[#F05E23]/30" : "bg-white dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white border border-black/5 dark:border-white/10"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
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
                      <button onClick={() => sendInvite(intern)} className="p-3 bg-[#F05E23]/10 text-[#F05E23] rounded-2xl hover:bg-[#F05E23] hover:text-white transition-all"><Send className="w-4 h-4" /></button>
                      <button onClick={() => removeIntern(intern._id)} className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="flex items-center gap-5 mb-8">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-[#F05E23] to-[#FF8C61] flex items-center justify-center text-white font-black text-2xl shadow-lg">
                        {intern.name[0]}
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
                    <div className="flex flex-wrap items-center gap-6">
                       <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-lg bg-[#F05E23]/10 flex items-center justify-center"><Users className="w-4 h-4 text-[#F05E23]" /></div>
                         <span className="text-[0.65rem] font-black uppercase text-slate-400">{task.internId?.name}</span>
                       </div>
                       {task.dueDate && (
                         <div className="flex items-center gap-2">
                           <Clock className="w-4 h-4 text-slate-400" />
                           <span className="text-[0.65rem] font-black uppercase text-slate-400">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                         </div>
                       )}
                    </div>
                  </div>
                  
                    <div className="flex lg:flex-col gap-3 min-w-[200px]">
                      {task.status === "Complete" && !task.isApproved && (
                        <button onClick={() => handleApproveTask(task._id)} className="w-full bg-green-500 text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[0.6rem] hover:scale-105 active:scale-95 transition-all">Verify & Approve</button>
                      )}
                      
                      <div className="flex gap-2 w-full">
                        <button onClick={() => setChatTaskId(task._id)} className="flex-1 bg-slate-50 dark:bg-white/10 text-slate-600 dark:text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[0.6rem] flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/20 transition-all border border-black/5 dark:border-white/10">
                          <Mail className="w-3 h-3" /> Chat
                        </button>
                        <button onClick={async () => {
                          if (confirm("Delete this objective permanently?")) {
                            const res = await deleteTask(task._id);
                            if (res.success) setStatusMsg({ type: "success", msg: "Task deleted from system." });
                          }
                        }} className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="relative">
                        <select 
                          value={task.internId?._id || ""} 
                          onChange={async (e) => {
                            const newId = e.target.value;
                            if (newId && newId !== (task.internId?._id)) {
                              const res = await reassignTask(task._id, newId);
                              if (res.success) setStatusMsg({ type: "success", msg: "Task reassigned successfully." });
                            }
                          }}
                          className="w-full bg-slate-50 dark:bg-white/10 text-slate-600 dark:text-white py-3 px-4 rounded-2xl font-black uppercase tracking-widest text-[0.6rem] outline-none border border-black/5 dark:border-white/10 appearance-none cursor-pointer"
                        >
                          <option value="">Reassign Task...</option>
                          {interns.map(i => (
                            <option key={i._id} value={i._id}>{i.name}</option>
                          ))}
                        </select>
                        <UserPlus className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                      </div>

                      {task.status !== "Complete" && (
                         <div className="w-full bg-slate-50 dark:bg-white/5 p-4 rounded-2xl text-center border border-dashed border-slate-200 dark:border-white/10">
                           <span className="text-[0.55rem] font-black uppercase text-slate-400 block mb-1">Current State</span>
                           <span className="text-xs font-black text-[#F05E23] uppercase">{task.status}</span>
                         </div>
                      )}
                    </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {activeTab === "holidays" && (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {leaves.map((leave) => (
                <motion.div layout initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={leave._id} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-8 rounded-[2.5rem] flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex-grow space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-[#F05E23]/10 flex items-center justify-center text-[#F05E23] font-black">{leave.internId?.name[0]}</div>
                       <div>
                          <h3 className="font-black text-xl uppercase tracking-tight">{leave.internId?.name}</h3>
                          <span className={`text-[0.55rem] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] ${leave.status === "Approved" ? "bg-green-500/10 text-green-500" : leave.status === "Rejected" ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"}`}>{leave.status}</span>
                       </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-white/40 leading-relaxed max-w-3xl font-medium">{leave.reason}</p>
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2">
                         <Calendar className="w-4 h-4 text-[#F05E23]" />
                         <span className="text-[0.65rem] font-black uppercase text-slate-400">Duration: {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                       </div>
                    </div>
                  </div>
                  
                  {leave.status === "Pending" && (
                    <div className="flex gap-3 min-w-[200px]">
                      <button onClick={() => approveLeave(leave._id, "Approved")} className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[0.6rem] hover:scale-105 active:scale-95 transition-all">Approve</button>
                      <button onClick={() => approveLeave(leave._id, "Rejected")} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[0.6rem] hover:scale-105 active:scale-95 transition-all">Reject</button>
                    </div>
                  )}
                </motion.div>
              ))}
              {leaves.length === 0 && (
                <div key="no-leaves" className="p-20 text-center opacity-20 font-black uppercase tracking-widest italic">No holiday requests filed. System clear.</div>
              )}
            </AnimatePresence>
          </div>
        )}

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-10 rounded-[3rem] shadow-sm">
              <h3 className="text-2xl font-black uppercase mb-10 tracking-tight">Weekly <span className="text-[#F05E23]">Productivity</span></h3>
              <div className="h-64 flex items-end gap-3 relative">
                {weeklyData.map((day, i) => (
                  <div key={i} className="flex-1 group relative">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${day.val || 5}%` }} className={`w-full rounded-2xl transition-all ${day.val > 70 ? 'bg-green-500' : 'bg-[#F05E23]'}`} />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-[0.6rem] px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all font-black whitespace-nowrap">{day.val}% SUCCESS</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6 px-1">
                 {weeklyData.map((day, i) => <span key={i} className="text-[0.6rem] font-black uppercase text-slate-300">{day.label}</span>)}
              </div>
              
              <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 grid grid-cols-3 gap-4">
                 <div className="text-center">
                    <span className="block text-[0.5rem] font-black text-slate-400 uppercase mb-1">High Priority</span>
                    <span className="text-lg font-black text-red-500">{stats.priorityDistribution.High}</span>
                 </div>
                 <div className="text-center border-x border-black/5 dark:border-white/5">
                    <span className="block text-[0.5rem] font-black text-slate-400 uppercase mb-1">Medium</span>
                    <span className="text-lg font-black text-orange-500">{stats.priorityDistribution.Medium}</span>
                 </div>
                 <div className="text-center">
                    <span className="block text-[0.5rem] font-black text-slate-400 uppercase mb-1">Low</span>
                    <span className="text-lg font-black text-blue-500">{stats.priorityDistribution.Low}</span>
                 </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#F05E23] to-[#FF8C61] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <AlertCircle className="absolute top-[-20px] right-[-20px] w-64 h-64 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
                <h3 className="text-2xl font-black uppercase mb-8 relative z-10 text-white">Critical <span className="opacity-60">Bottleneck</span></h3>
                <div className="relative z-10">
                   <span className="block text-[0.6rem] font-black uppercase text-white/60 mb-2 tracking-widest">Most Overloaded Intern</span>
                   <div className="flex items-center justify-between">
                      <span className="text-3xl font-black truncate">{stats.topBottleneck.name}</span>
                      <span className="bg-white/20 px-4 py-2 rounded-xl font-black text-sm">{stats.topBottleneck.count} PENDING</span>
                   </div>
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-10 rounded-[3rem]">
                <h3 className="text-xl font-black uppercase mb-8 tracking-tight">System <span className="text-[#F05E23]">Leaderboard</span></h3>
                <div className="space-y-4">
                  {interns.slice(0, 3).map((intern, i) => {
                    const done = tasks.filter(t => t.internId?._id === intern._id && t.status === "Complete").length;
                    return (
                      <div key={intern._id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4 text-sm font-black uppercase tracking-tighter"><span className="text-[#F05E23]">#{i+1}</span> {intern.name}</div>
                        <span className="text-xs font-black text-slate-400">{done} COMPLETIONS</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence mode="wait">
        {isAddingIntern && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/40">
             <motion.div key="add-intern-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-[#0A0A0A] w-full max-w-lg p-10 rounded-[3rem] shadow-2xl border border-white/10">
                <h2 className="text-3xl font-black uppercase mb-10 tracking-tight">Onboard <span className="text-[#F05E23]">Intern</span></h2>
                <form onSubmit={handleAddIntern} className="space-y-6">
                   <div className="space-y-2">
                     <label className="text-[0.65rem] font-black uppercase text-[#F05E23] tracking-widest pl-2">Full Name</label>
                     <input type="text" required value={newIntern.name} onChange={e => setNewIntern({...newIntern, name: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none focus:border-[#F05E23] transition-all font-bold" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[0.65rem] font-black uppercase text-[#F05E23] tracking-widest pl-2">Secure Email</label>
                     <input type="email" required value={newIntern.email} onChange={e => setNewIntern({...newIntern, email: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none focus:border-[#F05E23] transition-all font-bold" />
                   </div>
                   <div className="flex gap-4 pt-4">
                     <button type="button" onClick={() => setIsAddingIntern(false)} className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs border border-black/10 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">Cancel</button>
                     <button type="submit" className="flex-1 bg-[#F05E23] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-[#F05E23]/20">Establish Access</button>
                   </div>
                </form>
             </motion.div>
           </div>
        )}

        {isAssigningTask && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/40">
             <motion.div key="assign-task-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-[#0A0A0A] w-full max-w-2xl p-10 rounded-[3rem] shadow-2xl border border-white/10">
                <h2 className="text-3xl font-black uppercase mb-10 tracking-tight">Deploy <span className="text-[#F05E23]">Assignment</span></h2>
                <form onSubmit={handleAssignTask} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[0.65rem] font-black uppercase text-[#F05E23] tracking-widest pl-2">Objective Title</label>
                        <input type="text" required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none focus:border-[#F05E23] transition-all font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.65rem] font-black uppercase text-[#F05E23] tracking-widest pl-2">Assign To</label>
                        <select required value={newTask.internId} onChange={e => setNewTask({...newTask, internId: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none appearance-none font-bold">
                           <option value="">Select Target...</option>
                           {interns.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
                        </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[0.65rem] font-black uppercase text-[#F05E23] tracking-widest pl-2">Criticality Level</label>
                        <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none appearance-none font-bold">
                           <option value="Low">Low Priority</option>
                           <option value="Medium">Medium Priority</option>
                           <option value="High">High Priority</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.65rem] font-black uppercase text-[#F05E23] tracking-widest pl-2">Deadline</label>
                        <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none font-bold" />
                      </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-[0.65rem] font-black uppercase text-[#F05E23] tracking-widest pl-2">Tactical Briefing</label>
                     <textarea rows={4} required value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 outline-none focus:border-[#F05E23] transition-all font-bold" />
                   </div>
                   
                   <div className="flex gap-4 pt-4">
                     <button type="button" onClick={() => setIsAssigningTask(false)} className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs border border-black/10 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">Abort</button>
                     <button type="submit" className="flex-1 bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs">Deploy Task</button>
                   </div>
                </form>
             </motion.div>
           </div>
        )}

        {statusMsg.msg && (
           <motion.div key="status-notification" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className={`fixed bottom-10 right-10 z-[200] p-6 rounded-3xl shadow-2xl flex items-center gap-4 border ${statusMsg.type === 'success' ? 'bg-green-500 border-green-400 text-white' : 'bg-red-500 border-red-400 text-white'}`}>
             {statusMsg.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
             <span className="font-black text-[0.7rem] uppercase tracking-[0.1em]">{statusMsg.msg}</span>
           </motion.div>
        )}
        
        {chatTaskId && chatTask && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
             <motion.div key="chat-modal" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative w-full max-w-2xl bg-white dark:bg-[#0A0A0A] rounded-[3rem] p-0 shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[80vh]">
                <div className="p-8 bg-black text-white flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#F05E23] rounded-2xl shadow-lg shadow-[#F05E23]/20"><Mail className="w-6 h-6 text-white" /></div>
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">System <span className="text-[#F05E23]">Sync</span></h2>
                        <p className="text-[0.6rem] font-black uppercase tracking-widest opacity-60">Objective Channel: {chatTask.title}</p>
                      </div>
                   </div>
                   <button onClick={() => setChatTaskId(null)} className="p-2 hover:bg-white/20 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                </div>

                <div className="flex-grow p-8 overflow-y-auto space-y-6 scrollbar-hide bg-slate-50 dark:bg-transparent">
                   {(chatTask.discussion || []).map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                         <span className="text-[0.55rem] font-black uppercase tracking-widest text-slate-400 mb-2 px-2">{msg.sender === 'admin' ? 'SYSTEM ADMIN' : 'INTERN'} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                         <div className={`max-w-[80%] p-5 rounded-3xl font-bold text-sm shadow-sm ${msg.sender === 'admin' ? 'bg-black text-white rounded-tr-none' : 'bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-tl-none text-slate-700 dark:text-white dark:border-white/20'}`}>
                            {msg.content}
                         </div>
                      </div>
                   ))}
                   {(chatTask.discussion || []).length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 text-center">
                         <Mail className="w-16 h-16 mb-4 mx-auto" />
                         <p className="font-black uppercase tracking-widest text-xs max-w-[200px]">Secure channel active. Stand by for intern briefing.</p>
                      </div>
                   )}
                </div>

                <form onSubmit={handleSendChat} className="p-8 border-t border-black/5 dark:border-white/10 bg-white dark:bg-black/20">
                   <div className="flex gap-4">
                      <input type="text" value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="Type administrative directive..." className="flex-grow bg-slate-50 dark:bg-white/5 border-2 border-black/5 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#F05E23] font-bold text-sm transition-all" />
                      <button type="submit" className="bg-[#F05E23] text-white p-4 rounded-2xl shadow-lg shadow-[#F05E23]/20 hover:scale-105 active:scale-95 transition-all"><Send className="w-6 h-6" /></button>
                   </div>
                </form>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
