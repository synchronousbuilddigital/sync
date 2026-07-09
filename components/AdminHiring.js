"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Edit2, Users, FileText,
  MapPin, DollarSign, CheckCircle2, XCircle,
  ExternalLink, Loader2, ChevronRight, Briefcase
} from "lucide-react";

export default function AdminHiring() {
  const [activeSubTab, setActiveSubTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJobForApps, setSelectedJobForApps] = useState(null);

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    salary: "",
    location: "Remote",
    requirements: "",
    rounds: 3, // Defaulting to 3 rounds as per industry standard for high-performance units
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("sync_token") || localStorage.getItem("token") || "";
      const [jobsRes, appsRes] = await Promise.all([
        fetch("/api/admin/hiring/jobs", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/hiring/applications", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const jobsData = await jobsRes.json();
      const appsData = await appsRes.json();
      if (jobsData.success) setJobs(jobsData.jobs);
      if (appsData.success) setApplications(appsData.applications);
    } catch (error) {
      console.error("Fetch hiring data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("sync_token") || localStorage.getItem("token") || "";
    const method = editingJob ? "PUT" : "POST";
    const body = editingJob ? { ...jobForm, id: editingJob._id } : jobForm;

    try {
      const res = await fetch("/api/admin/hiring/jobs", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        setIsAddingJob(false);
        setEditingJob(null);
        setJobForm({ title: "", description: "", salary: "", location: "Remote", requirements: "", rounds: 2 });
        fetchData();
      }
    } catch (error) {
      alert("Failed to save job");
    }
  };

  const deleteJob = async (id) => {
    if (!confirm("Are you sure?")) return;
    const token = localStorage.getItem("sync_token") || localStorage.getItem("token") || "";
    try {
      const res = await fetch(`/api/admin/hiring/jobs?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (error) {
      alert("Failed to delete job");
    }
  };

  const updateAppStatus = async (id, status) => {
    const token = localStorage.getItem("sync_token") || localStorage.getItem("token") || "";
    try {
      const res = await fetch("/api/admin/hiring/applications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        fetchData();
        // Optional: Trigger email notification logic here or in backend
      }
    } catch (error) {
      alert("Status Sync Failure: " + error.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Sub Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveSubTab("jobs")}
          className={`px-6 py-2 rounded-xl text-[0.65rem] font-black uppercase tracking-widest transition-all ${activeSubTab === "jobs" ? "bg-white text-[#F05E23] shadow-md" : "opacity-40 hover:opacity-100"}`}
        >
          Job Openings
        </button>
        <button
          onClick={() => setActiveSubTab("applications")}
          className={`px-6 py-2 rounded-xl text-[0.65rem] font-black uppercase tracking-widest transition-all ${activeSubTab === "applications" ? "bg-white text-[#F05E23] shadow-md" : "opacity-40 hover:opacity-100"}`}
        >
          Applications ({applications.length})
        </button>
      </div>

      {(loading && applications.length === 0 && jobs.length === 0) ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#F05E23]" />
        </div>
      ) : activeSubTab === "jobs" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold uppercase tracking-tight">Active Openings</h3>
            <button
              onClick={() => { setEditingJob(null); setIsAddingJob(true); }}
              className="bg-[#F05E23] text-white px-6 py-3 rounded-xl text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Post New Job
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map(job => (
              <div key={job._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#F05E23]/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-lg">{job.title}</h4>
                    <div className="flex gap-4 text-[0.6rem] uppercase tracking-widest opacity-50 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary || "Not disclosed"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingJob(job); setJobForm(job); setIsAddingJob(true); }}
                      className="p-2 hover:bg-white/10 rounded-lg text-blue-400"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteJob(job._id)}
                      className="p-2 hover:bg-white/10 rounded-lg text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs opacity-60 line-clamp-2 mb-4">{job.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[0.6rem] font-black uppercase opacity-30">{job.rounds} Rounds</span>
                  <span className={`text-[0.5rem] font-black px-3 py-1 rounded-full ${job.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {job.isActive ? "Live" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-30 border-b border-white/10">
                  <th className="pb-4 px-4">Applicant</th>
                  <th className="pb-4 px-4">Applied For</th>
                  <th className="pb-4 px-4">Status</th>
                  <th className="pb-4 px-4">Resume</th>
                  <th className="pb-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {applications.map(app => (
                  <tr key={app._id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                    <td className="py-4 px-4">
                      <div className="font-bold text-sm">{app.name}</div>
                      <div className="opacity-40 text-[0.65rem]">{app.email}</div>
                      <div className="opacity-40 text-[0.65rem]">{app.phone}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-sm">{app.jobId?.title || "N/A"}</div>
                      <div className="opacity-40 text-[0.65rem]">{new Date(app.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-2 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          <span className={`px-2 py-0.5 rounded text-[0.5rem] font-bold uppercase tracking-tight ${app.hasExperience ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                            {app.hasExperience ? "Experienced" : "Fresher"}
                          </span>
                        </div>
                        <p className="text-[0.65rem] line-clamp-1 opacity-60"><strong>Edu:</strong> {app.education}</p>
                        <p className="text-[0.65rem] line-clamp-1 opacity-60"><strong>Skills:</strong> {app.skills}</p>
                        <p className="text-[0.65rem] line-clamp-1 opacity-60"><strong>Projects:</strong> {app.project}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-[0.55rem] font-black uppercase tracking-widest ${app.status === 'Selected' ? 'bg-green-500/10 text-green-500' :
                          app.status === 'Declined' ? 'bg-red-500/10 text-red-500' :
                            app.status === 'Round 2' ? 'bg-blue-500/10 text-blue-500' :
                              'bg-[#F05E23]/10 text-[#F05E23]'
                        }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <a href={app.resumeLink} target="_blank" className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-[#F05E23] transition-all border border-slate-100" title="View Resume">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* Round Progression Logic */}
                        {app.status === 'Applied' && (
                          <button
                            onClick={() => updateAppStatus(app._id, 'Round 2')}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-[0.55rem] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
                          >
                            Accept for Round 2
                          </button>
                        )}

                        {app.status === 'Round 2' && (
                          <button
                            onClick={() => updateAppStatus(app._id, 'Selected')}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-[0.55rem] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-green-500/20 transition-all active:scale-95"
                          >
                            Final Selection
                          </button>
                        )}

                        {app.status !== 'Declined' && app.status !== 'Selected' && (
                          <button
                            onClick={() => updateAppStatus(app._id, 'Declined')}
                            className="bg-white border border-red-200 text-red-500 px-4 py-2 rounded-lg text-[0.55rem] font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-500 transition-all active:scale-95"
                          >
                            Decline
                          </button>
                        )}

                        {app.status === 'Selected' && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg border border-green-100">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[0.55rem] font-black uppercase">Onboarded</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Job Modal */}
      <AnimatePresence>
        {isAddingJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingJob(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white border border-slate-200 rounded-[2.5rem] p-10 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 italic">
                  {editingJob ? "Edit" : "Post"} <span className="text-[#F05E23]">Opening</span>
                </h2>
                <div className="w-12 h-1 bg-slate-100 rounded-full" />
              </div>

              <form onSubmit={handleJobSubmit} className="space-y-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3 ml-1">Job Title</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Full Stack Developer"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:border-[#F05E23] focus:bg-white transition-all outline-none placeholder:text-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3 ml-1">Location</label>
                    <input
                      required
                      type="text"
                      placeholder="Remote"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:border-[#F05E23] focus:bg-white transition-all outline-none placeholder:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3 ml-1">Salary (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. $80k - $120k"
                      value={jobForm.salary}
                      onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:border-[#F05E23] focus:bg-white transition-all outline-none placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3 ml-1">Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="What does the role involve?"
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:border-[#F05E23] focus:bg-white transition-all outline-none resize-none placeholder:text-slate-300"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3 ml-1">Requirements</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Key skills, experience needed..."
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:border-[#F05E23] focus:bg-white transition-all outline-none resize-none placeholder:text-slate-300"
                  />
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddingJob(false)}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#F05E23] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[0.7rem] shadow-xl shadow-[#F05E23]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {editingJob ? "Update Opening" : "Publish Opening"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
