"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { 
  Shield, ExternalLink, AlertCircle, Zap, Trash2, X, Send, 
  MessageSquare, Activity, Briefcase, Mail, Key, Calendar, 
  User, FileText, Plus, Trash, CheckCircle2, Clock, ChevronDown, ChevronUp, Loader2,
  Terminal, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectMissionControl() {
  const { id } = useParams();
  const router = useRouter();
  const { 
    token, adminClientProjects, interns,
    updateClientProject, purgeClientProject, sendAdminFeed, 
    markFeedbackAsRead, generateRoadmap, runAIRiskAnalysis, generateAIStory 
  } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzingRisk, setAnalyzingRisk] = useState(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", msg: "" });
  const [directMsg, setDirectMsg] = useState("");
  const [feedMsg, setFeedMsg] = useState("");

  useEffect(() => {
    if (token && id) {
      fetchProject();
    }
  }, [token, id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/admin/client-projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setProject(data.project);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updateData) => {
    const res = await updateClientProject(id, updateData);
    if (res.success) {
      fetchProject();
      setStatusMsg({ type: "success", msg: "Matrix Synchronized." });
      setTimeout(() => setStatusMsg({ type: "", msg: "" }), 3000);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-[#F05E23]" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-black uppercase tracking-tighter">Project Not Found</h2>
      <button onClick={() => router.push("/admin")} className="text-[#F05E23] font-black uppercase text-xs tracking-widest hover:underline">Return to HQ</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans selection:bg-[#F05E23] selection:text-white pb-20">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-100 px-8 py-6 sticky top-0 z-[50] flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#F05E23]/5 flex items-center justify-center border border-[#F05E23]/10">
            <Briefcase className="w-5 h-5 text-[#F05E23]" />
          </div>
          <div>
            <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Project Mission Control</h1>
            <h2 className="text-xl font-black uppercase tracking-tighter text-[#F05E23] italic leading-tight">{project.projectName}</h2>
          </div>
        </div>
        <button onClick={() => router.push("/admin")} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-all text-slate-400">
          <X className="w-5 h-5" />
        </button>
      </nav>

      <div className="max-w-[1600px] mx-auto px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Main Intelligence Body (Left) */}
          <div className="flex-1 space-y-16">
            
            {/* Project Identity */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                  project.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                  <Activity className={`w-3 h-3 inline-block mr-2 ${project.status === 'Active' ? 'animate-pulse' : ''}`} /> {project.status === 'Active' ? 'SYNC ACTIVE' : 'IN PREP'}
                </span>
              </div>
              
              <h3 className="text-[120px] font-black uppercase tracking-tighter text-slate-900 italic leading-[0.75]">{project.projectName}</h3>
              
              <p className="text-slate-400 text-[13px] font-bold leading-relaxed max-w-2xl uppercase tracking-wider italic border-l-8 border-slate-100 pl-10 py-4">
                {project.brandDescription || project.description}
              </p>

              <div className="flex flex-wrap gap-4 pt-6">
                <button 
                  onClick={() => {
                    setStatusMsg({ type: "success", msg: "Security Matrix Verified. Integrity: 100%" });
                  }}
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-100 hover:bg-green-500 hover:text-white transition-all shadow-sm group" 
                  title="Security Audit"
                >
                  <Shield className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/brands/${project.publicId}`;
                    navigator.clipboard.writeText(url);
                    setStatusMsg({ type: "success", msg: "Share link copied." });
                  }}
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 border border-blue-100 hover:bg-blue-500 hover:text-white transition-all shadow-sm group"
                  title="Copy Share Link"
                >
                  <ExternalLink className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={async () => {
                    setAnalyzingRisk(true);
                    const res = await runAIRiskAnalysis(project._id);
                    if (res.success) fetchProject();
                    setAnalyzingRisk(false);
                  }}
                  disabled={analyzingRisk}
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm disabled:opacity-50 group"
                  title="Risk Analysis"
                >
                  <AlertCircle className={`w-6 h-6 group-hover:scale-110 transition-transform ${analyzingRisk ? 'animate-pulse' : ''}`} />
                </button>
                <button
                  onClick={async () => {
                    const res = await generateAIStory(project._id);
                    if (res.success) fetchProject();
                  }}
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-50 text-orange-500 border border-orange-100 hover:bg-orange-500 hover:text-white transition-all shadow-sm group"
                  title="AI Story"
                >
                  <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this client project?")) {
                      purgeClientProject(project._id);
                      router.push("/admin");
                    }
                  }}
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-red-50 text-red-400 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm group"
                  title="Delete Project"
                >
                  <Trash2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </section>

            {/* Project Parameters Grid */}
            <section className="space-y-10">
              <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <h3 className="text-3xl font-black uppercase tracking-tighter italic">Project <span className="text-[#F05E23]">Parameters</span></h3>
                <button 
                  onClick={async () => {
                    if (confirm("Generate AI Roadmap? This will overwrite the current plan.")) {
                      setIsGeneratingRoadmap(true);
                      await generateRoadmap(project._id);
                      setIsGeneratingRoadmap(false);
                      fetchProject();
                    }
                  }}
                  disabled={isGeneratingRoadmap}
                  className="px-6 py-3 bg-[#F05E23] text-white rounded-2xl text-[0.7rem] font-black uppercase tracking-widest shadow-xl shadow-[#F05E23]/20 flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Zap className={`w-4 h-4 ${isGeneratingRoadmap ? 'animate-spin' : ''}`} /> AI Roadmap
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {/* System Access */}
                <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><Mail className="w-4 h-4" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Access</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[8px] font-black uppercase opacity-30 block mb-1">Email</label>
                      <input 
                        type="email" 
                        value={project.systemAccessEmail || ""} 
                        onChange={(e) => handleUpdate({ systemAccessEmail: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] font-bold outline-none focus:border-blue-500"
                        placeholder="intern@sync.com"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-black uppercase opacity-30 block mb-1">Initial Password</label>
                      <input 
                        type="text" 
                        value={project.systemAccessPassword || ""} 
                        onChange={(e) => handleUpdate({ systemAccessPassword: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] font-bold outline-none focus:border-blue-500"
                        placeholder="SyncIntern123"
                      />
                    </div>
                  </div>
                </div>

                {/* Meta Data */}
                <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500"><Calendar className="w-4 h-4" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Timeline & Tech</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[8px] font-black uppercase opacity-30 block mb-1">Project Type</label>
                      <select 
                        value={project.projectType || ""} 
                        onChange={(e) => handleUpdate({ projectType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] font-bold outline-none"
                      >
                        {["Custom Web App", "SaaS Platform", "E-commerce", "AI Integration", "Brand Identity"].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[8px] font-black uppercase opacity-30 block mb-1">Est. Completion</label>
                      <input 
                        type="date" 
                        value={project.estimatedCompletionDate ? project.estimatedCompletionDate.split('T')[0] : ""} 
                        onChange={(e) => handleUpdate({ estimatedCompletionDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Assigned Unit */}
                <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500"><User className="w-4 h-4" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Unit</span>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[8px] font-black uppercase opacity-30 block mb-1">Intern Assigned</label>
                    <select 
                      value={project.assignedIntern?._id || ""} 
                      onChange={(e) => handleUpdate({ assignedIntern: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] font-bold outline-none"
                    >
                      <option value="">Unassigned</option>
                      {interns.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* SOP */}
                <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500"><FileText className="w-4 h-4" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">SOP</span>
                  </div>
                  <textarea 
                    value={project.sop || ""} 
                    onChange={(e) => handleUpdate({ sop: e.target.value })}
                    placeholder="Standard Operating Procedure..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] font-bold outline-none resize-none h-20"
                  />
                </div>
              </div>
            </section>

            {/* Technical Credentials Sync */}
            <section className="space-y-10">
              <div className="flex items-center gap-6 border-b border-slate-200 pb-6">
                <h3 className="text-3xl font-black uppercase tracking-tighter italic text-blue-600">Technical <span className="text-slate-900">Credentials</span></h3>
                <div className="px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                  <span className="text-[9px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Technical Sync Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Terminal className="w-4 h-4" /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Environment Variables</span>
                    </div>
                  </div>
                  <textarea 
                    value={project.credentials?.env || ""} 
                    onChange={(e) => handleUpdate({ credentials: { ...project.credentials, env: e.target.value } })}
                    placeholder="KEY=VALUE..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-[11px] font-mono font-bold outline-none resize-none h-48 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-6">
                  <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Globe className="w-4 h-4" /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Repository & Hosting</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[8px] font-black uppercase opacity-30 block mb-1">GitHub / Repository</label>
                        <input 
                          type="text" 
                          value={project.credentials?.github || ""} 
                          onChange={(e) => handleUpdate({ credentials: { ...project.credentials, github: e.target.value } })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-500"
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-black uppercase opacity-30 block mb-1">Hosting / Vercel</label>
                        <input 
                          type="text" 
                          value={project.credentials?.hosting || ""} 
                          onChange={(e) => handleUpdate({ credentials: { ...project.credentials, hosting: e.target.value } })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-500"
                          placeholder="Vercel Access..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white"><FileText className="w-4 h-4" /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Additional Access Notes</span>
                    </div>
                    <textarea 
                      value={project.credentials?.additional || ""} 
                      onChange={(e) => handleUpdate({ credentials: { ...project.credentials, additional: e.target.value } })}
                      placeholder="Extra technical details..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[11px] font-bold outline-none resize-none h-24 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Feature Roadmap (High Level) */}
            <section className="space-y-10">
              <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <h3 className="text-3xl font-black uppercase tracking-tighter italic whitespace-nowrap">Feature <span className="text-blue-500">Roadmap</span></h3>
                <button 
                  onClick={() => handleUpdate({ features: [...(project.features || []), { title: "", description: "", status: "Pending" }] })}
                  className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.features?.map((f, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm group relative">
                    <button 
                      onClick={() => {
                        const newFeats = project.features.filter((_, idx) => idx !== i);
                        handleUpdate({ features: newFeats });
                      }}
                      className="absolute top-6 right-6 p-2 rounded-lg hover:bg-red-50 text-slate-200 hover:text-red-500 transition-all"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        value={f.title} 
                        onChange={(e) => {
                          const newFeats = [...project.features];
                          newFeats[i].title = e.target.value;
                          handleUpdate({ features: newFeats });
                        }}
                        placeholder="Feature Title"
                        className="bg-transparent border-b border-slate-100 text-lg font-black uppercase tracking-tight focus:border-blue-500 outline-none w-[80%]"
                      />
                      <textarea 
                        value={f.description} 
                        onChange={(e) => {
                          const newFeats = [...project.features];
                          newFeats[i].description = e.target.value;
                          handleUpdate({ features: newFeats });
                        }}
                        placeholder="Feature description..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[11px] font-bold outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Detailed Workflow Checklist */}
            <section className="space-y-10">
              <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <h3 className="text-3xl font-black uppercase tracking-tighter italic">Mission <span className="text-[#F05E23]">Tactical Steps</span></h3>
                <button 
                  onClick={() => handleUpdate({ workflow: [...(project.workflow || []), { title: "", description: "", status: "Pending", order: (project.workflow?.length || 0) + 1 }] })}
                  className="p-3 bg-slate-900 text-white rounded-2xl text-[0.6rem] font-black uppercase tracking-[0.2em] hover:bg-[#F05E23] transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4 inline-block mr-2" /> Add Step
                </button>
              </div>

              <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 bg-slate-50/30">
                      <th className="px-10 py-6 w-20">Order</th>
                      <th className="px-10 py-6">Mission Step</th>
                      <th className="px-10 py-6">Status</th>
                      <th className="px-10 py-6">Assigned Unit</th>
                      <th className="px-10 py-6">Tactical Notes</th>
                      <th className="px-10 py-6 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] font-bold">
                    {project.workflow?.map((step, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                        <td className="px-10 py-8 text-center text-slate-300 font-black italic text-2xl">{step.order || i + 1}</td>
                        <td className="px-10 py-8 space-y-2">
                          <input 
                            type="text" 
                            value={step.title} 
                            onChange={(e) => {
                              const newWorkflow = [...project.workflow];
                              newWorkflow[i].title = e.target.value;
                              handleUpdate({ workflow: newWorkflow });
                            }}
                            className="bg-transparent font-black uppercase tracking-tight text-lg text-slate-900 focus:text-[#F05E23] outline-none w-full"
                            placeholder="Step Title"
                          />
                          <textarea 
                            value={step.description} 
                            onChange={(e) => {
                              const newWorkflow = [...project.workflow];
                              newWorkflow[i].description = e.target.value;
                              handleUpdate({ workflow: newWorkflow });
                            }}
                            className="w-full bg-transparent text-slate-400 font-medium text-xs outline-none resize-none"
                            placeholder="Briefing..."
                          />
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex flex-col gap-2">
                            {['Pending', 'In Progress', 'Complete'].map(s => (
                              <button 
                                key={s}
                                onClick={() => {
                                  const newWorkflow = [...project.workflow];
                                  newWorkflow[i].status = s;
                                  handleUpdate({ workflow: newWorkflow });
                                }}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                  step.status === s 
                                    ? (s === 'Complete' ? 'bg-green-500 text-white border-green-600' : (s === 'In Progress' ? 'bg-blue-500 text-white border-blue-600' : 'bg-slate-900 text-white border-slate-950'))
                                    : 'bg-white border-slate-100 text-slate-300 hover:border-slate-300'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <select 
                            value={step.assignedIntern || ""} 
                            onChange={(e) => {
                              const newWorkflow = [...project.workflow];
                              newWorkflow[i].assignedIntern = e.target.value || null;
                              handleUpdate({ workflow: newWorkflow });
                            }}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none"
                          >
                            <option value="">Unassigned</option>
                            {interns.map(int => <option key={int._id} value={int._id}>{int.name}</option>)}
                          </select>
                        </td>
                        <td className="px-10 py-8">
                          <textarea 
                            value={step.adminNote || ""} 
                            onChange={(e) => {
                              const newWorkflow = [...project.workflow];
                              newWorkflow[i].adminNote = e.target.value;
                              handleUpdate({ workflow: newWorkflow });
                            }}
                            className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[10px] font-bold outline-none resize-none h-24 w-48"
                            placeholder="Add tactical note..."
                          />
                        </td>
                        <td className="px-10 py-8">
                          <button 
                             onClick={() => {
                               const newWorkflow = project.workflow.filter((_, idx) => idx !== i);
                               handleUpdate({ workflow: newWorkflow });
                             }}
                             className="p-2 rounded-lg text-slate-200 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar Communications (Right) */}
          <div className="lg:w-[450px] space-y-10">
            
            {/* Direct Sync */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-4">
                <MessageSquare className="w-5 h-5 text-[#F05E23]" />
                <span className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Direct <span className="text-[#F05E23]">Sync</span></span>
              </div>
              <div className="bg-white border border-slate-100 rounded-[3rem] p-10 space-y-8 shadow-sm">
                <div className="h-[400px] overflow-y-auto space-y-6 scrollbar-hide">
                  {project.discussions?.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-200 mb-2">{msg.sender === 'admin' ? 'HQ Command' : 'Client Alpha'}</span>
                      <div className={`max-w-[90%] p-6 rounded-[2rem] shadow-sm ${
                        msg.sender === 'admin' 
                          ? 'bg-[#F05E23] text-white rounded-tr-none shadow-lg shadow-[#F05E23]/20' 
                          : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'
                      }`}>
                        <p className="text-[13px] font-bold leading-relaxed italic">"{msg.content}"</p>
                      </div>
                    </div>
                  ))}
                  {(!project.discussions || project.discussions.length === 0) && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                      <MessageSquare className="w-12 h-12 mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No transmissions recorded.</p>
                    </div>
                  )}
                </div>
                <div className="relative pt-4 border-t border-slate-50">
                  <input 
                    type="text" 
                    placeholder="Message for the client..."
                    value={directMsg}
                    onChange={(e) => setDirectMsg(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && directMsg.trim()) {
                        handleUpdate({ message: directMsg });
                        setDirectMsg("");
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-6 px-10 text-[12px] font-bold text-slate-800 focus:border-[#F05E23] outline-none shadow-inner transition-all placeholder:text-slate-300"
                  />
                  <button 
                    onClick={() => {
                      if (directMsg.trim()) {
                        handleUpdate({ message: directMsg });
                        setDirectMsg("");
                      }
                    }}
                    className="absolute right-4 top-[24px] w-12 h-12 rounded-full bg-[#F05E23] text-white flex items-center justify-center shadow-lg shadow-[#F05E23]/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mission Feed */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-4">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Mission <span className="text-blue-500">Feed</span></span>
              </div>
              <div className="bg-white border border-slate-100 rounded-[3rem] p-10 space-y-8 shadow-sm">
                <div className="h-[300px] overflow-y-auto space-y-6 scrollbar-hide">
                  {project.feeds?.map((feed, i) => (
                    <div key={i} className="border-l-4 border-blue-500/20 pl-6 py-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-200">{feed.sender}</span>
                        <span className="text-[8px] font-bold text-slate-200">{new Date(feed.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[13px] font-bold text-slate-700 italic">"{feed.content}"</p>
                    </div>
                  ))}
                  {(!project.feeds || project.feeds.length === 0) && <p className="text-[10px] text-slate-200 uppercase text-center py-10 italic">No feed updates.</p>}
                </div>
                <div className="relative pt-4 border-t border-slate-50">
                  <input 
                    type="text" 
                    placeholder="Post update to mission feed..."
                    value={feedMsg}
                    onChange={(e) => setFeedMsg(e.target.value)}
                    onKeyPress={async (e) => {
                      if (e.key === 'Enter' && feedMsg.trim()) {
                        await sendAdminFeed(project._id, feedMsg);
                        setFeedMsg("");
                        fetchProject();
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-6 px-10 text-[12px] font-bold text-slate-800 focus:border-blue-500 outline-none shadow-inner transition-all placeholder:text-slate-300"
                  />
                  <button 
                    onClick={async () => {
                      if (feedMsg.trim()) {
                        await sendAdminFeed(project._id, feedMsg);
                        setFeedMsg("");
                        fetchProject();
                      }
                    }}
                    className="absolute right-4 top-[24px] w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Client Intelligence */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Client <span className="text-amber-500">Intel</span></span>
                </div>
                {project.feedbacks?.some(f => !f.isRead) && (
                  <button 
                    onClick={async () => {
                      await markFeedbackAsRead(project._id);
                      fetchProject();
                    }}
                    className="text-[9px] font-black uppercase text-green-500 hover:underline tracking-[0.2em]"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="bg-white border border-slate-100 rounded-[3rem] p-10 h-[400px] overflow-y-auto space-y-6 scrollbar-hide shadow-sm">
                {project.feedbacks?.length > 0 ? (
                  [...project.feedbacks].reverse().map((f, i) => (
                    <div key={i} className={`p-8 rounded-[2rem] border transition-all ${f.isRead ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-amber-200 shadow-lg ring-1 ring-amber-100'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${
                          f.category === 'Idea' ? 'bg-amber-100 text-amber-600' :
                          f.category === 'Bug' ? 'bg-red-100 text-red-600' :
                          f.category === 'Question' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {f.category}
                        </span>
                        <span className="text-[8px] font-black text-slate-200 uppercase">{new Date(f.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[14px] font-bold text-slate-800 italic leading-relaxed">"{f.content}"</p>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                    <Zap className="w-12 h-12 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No strategic input yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
