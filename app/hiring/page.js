"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  Upload, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Code, 
  Layers,
  Search,
  X,
  Loader2,
  ExternalLink
} from "lucide-react";
import { useTheme } from "@/components/ThemeContext";

export default function HiringPage() {
  const { isDark } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Status check state
  const [statusEmail, setStatusEmail] = useState("");
  const [statusResult, setStatusResult] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    education: "",
    skills: "",
    project: "",
    hasExperience: false,
    experienceDetails: "",
    resumeLink: ""
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/public/jobs");
      const data = await res.json();
      if (data.success) setJobs(data.jobs);
    } catch (error) {
      console.error("Fetch jobs error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch("/api/public/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, jobId: selectedJob._id })
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess(true);
        setTimeout(() => {
          setShowForm(false);
          setFormSuccess(false);
          setFormData({
            name: "", phone: "", email: "", education: "", skills: "", project: "",
            hasExperience: false, experienceDetails: "", resumeLink: ""
          });
        }, 3000);
      } else {
        alert(data.message || "Failed to submit application");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!statusEmail) return;
    setStatusLoading(true);
    try {
      const res = await fetch(`/api/admin/hiring/applications?email=${statusEmail}`); // Note: I should probably create a public status endpoint instead of using admin one
      // Let's create a dedicated public status endpoint for security later, for now let's mock or use a safer query
      const data = await res.json();
      // Filter for this email only (if using the admin endpoint it returns all, which is bad)
      // I'll create the public endpoint now.
    } catch (error) {
      console.error("Status check error:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-white text-slate-900'}`}>
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 blur-[120px] rounded-full ${isDark ? 'bg-[#F05E23]/30' : 'bg-[#F05E23]/10'}`} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F05E23]/10 border border-[#F05E23]/20 rounded-full mb-8"
          >
            <Briefcase className="w-4 h-4 text-[#F05E23]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#F05E23]">Careers at Synchronous</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
          >
            Shape the future of <br />
            <span className="text-[#F05E23]">Synchronous Intelligence.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-xl max-w-2xl mx-auto mb-12 ${isDark ? 'text-white/60' : 'text-slate-600'}`}
          >
            Join our elite team of builders, designers, and engineers. We're looking for high-performance individuals to build the next generation of digital systems.
          </motion.p>

          {/* Status Checker */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className={`max-w-md mx-auto p-1 rounded-2xl border flex items-center transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}
          >
            <input 
              type="email" 
              placeholder="Check Application Status (Email)" 
              value={statusEmail}
              onChange={(e) => setStatusEmail(e.target.value)}
              className="flex-grow bg-transparent border-none outline-none px-4 py-3 text-sm"
            />
            <button 
              onClick={() => window.location.href = `/hiring/status?email=${statusEmail}`}
              className="bg-[#F05E23] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#d84d1a] transition-all flex items-center gap-2"
            >
              Check <Search className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Open Opportunities</h2>
          <div className={`h-px flex-grow mx-8 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
          <span className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
            {jobs.length} Positions
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 className="w-10 h-10 animate-spin text-[#F05E23] mb-4" />
            <p>Scanning for openings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className={`text-center py-20 rounded-3xl border-2 border-dashed ${isDark ? 'border-white/5 text-white/40' : 'border-slate-100 text-slate-400'}`}>
            <p className="text-lg">No active openings at the moment. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <motion.div
                key={job._id}
                whileHover={{ y: -5 }}
                className={`p-8 rounded-3xl border transition-all relative overflow-hidden group ${isDark ? 'bg-white/5 border-white/10 hover:border-[#F05E23]/50' : 'bg-slate-50/50 border-slate-200 hover:border-[#F05E23]/50'}`}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm font-medium opacity-60">
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                        {job.salary && <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {job.salary}</span>}
                      </div>
                    </div>
                    <div className="bg-[#F05E23]/10 text-[#F05E23] p-3 rounded-2xl">
                      <Briefcase className="w-6 h-6" />
                    </div>
                  </div>

                  <p className={`mb-8 line-clamp-3 text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                    {job.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <button 
                      onClick={() => handleApply(job)}
                      className="bg-[#F05E23] text-white px-8 py-3 rounded-2xl text-sm font-bold hover:scale-105 transition-all flex items-center gap-2 group-hover:shadow-[0_0_20px_rgba(240,94,35,0.3)]"
                    >
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-black uppercase tracking-widest opacity-30">{job.rounds} Rounds</span>
                  </div>
                </div>
                
                {/* Decorative background element */}
                <div className={`absolute -right-8 -bottom-8 w-32 h-32 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity bg-[#F05E23]`} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Application Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border shadow-2xl p-8 md:p-12 ${isDark ? 'bg-[#0F0F0F] border-white/10' : 'bg-white border-slate-200'}`}
            >
              <button 
                onClick={() => setShowForm(false)}
                className={`absolute top-8 right-8 p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
              >
                <X className="w-6 h-6" />
              </button>

              {formSuccess ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Application Received!</h2>
                  <p className={`mb-8 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                    We've received your application for <strong>{selectedJob.title}</strong>. <br />
                    Our hiring team will review your profile and get back to you soon.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <h2 className="text-3xl font-bold mb-2">Apply for {selectedJob.title}</h2>
                    <p className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Please provide accurate information for the review process.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                          <User className="w-3 h-3" /> Full Name
                        </label>
                        <input 
                          required
                          type="text" 
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all ${isDark ? 'bg-white/5 border-white/10 focus:border-[#F05E23] focus:bg-white/10' : 'bg-slate-50 border-slate-200 focus:border-[#F05E23] focus:bg-white'}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                          <Mail className="w-3 h-3" /> Email Address
                        </label>
                        <input 
                          required
                          type="email" 
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all ${isDark ? 'bg-white/5 border-white/10 focus:border-[#F05E23] focus:bg-white/10' : 'bg-slate-50 border-slate-200 focus:border-[#F05E23] focus:bg-white'}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                          <Phone className="w-3 h-3" /> Phone Number
                        </label>
                        <input 
                          required
                          type="tel" 
                          placeholder="+1 234 567 890"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all ${isDark ? 'bg-white/5 border-white/10 focus:border-[#F05E23] focus:bg-white/10' : 'bg-slate-50 border-slate-200 focus:border-[#F05E23] focus:bg-white'}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                          <Upload className="w-3 h-3" /> Resume Link (Google Drive)
                        </label>
                        <input 
                          required
                          type="url" 
                          placeholder="https://drive.google.com/..."
                          value={formData.resumeLink}
                          onChange={(e) => setFormData({...formData, resumeLink: e.target.value})}
                          className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all ${isDark ? 'bg-white/5 border-white/10 focus:border-[#F05E23] focus:bg-white/10' : 'bg-slate-50 border-slate-200 focus:border-[#F05E23] focus:bg-white'}`}
                        />
                        <p className="text-[0.65rem] opacity-40 uppercase tracking-tighter">Ensure "Anyone with link can view" is enabled.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <GraduationCap className="w-3 h-3" /> Education (Full Info)
                      </label>
                      <textarea 
                        required
                        placeholder="Degrees, Institutions, Years..."
                        rows={3}
                        value={formData.education}
                        onChange={(e) => setFormData({...formData, education: e.target.value})}
                        className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all resize-none ${isDark ? 'bg-white/5 border-white/10 focus:border-[#F05E23] focus:bg-white/10' : 'bg-slate-50 border-slate-200 focus:border-[#F05E23] focus:bg-white'}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                          <Code className="w-3 h-3" /> Key Skills
                        </label>
                        <input 
                          required
                          type="text" 
                          placeholder="React, Next.js, Node.js..."
                          value={formData.skills}
                          onChange={(e) => setFormData({...formData, skills: e.target.value})}
                          className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all ${isDark ? 'bg-white/5 border-white/10 focus:border-[#F05E23] focus:bg-white/10' : 'bg-slate-50 border-slate-200 focus:border-[#F05E23] focus:bg-white'}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                          <Layers className="w-3 h-3" /> Notable Projects
                        </label>
                        <input 
                          required
                          type="text" 
                          placeholder="E-commerce site, AI chatbot..."
                          value={formData.project}
                          onChange={(e) => setFormData({...formData, project: e.target.value})}
                          className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all ${isDark ? 'bg-white/5 border-white/10 focus:border-[#F05E23] focus:bg-white/10' : 'bg-slate-50 border-slate-200 focus:border-[#F05E23] focus:bg-white'}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer group w-fit">
                        <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.hasExperience ? 'bg-[#F05E23]' : (isDark ? 'bg-white/10' : 'bg-slate-200')}`}>
                          <motion.div 
                            animate={{ x: formData.hasExperience ? 24 : 0 }}
                            className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                          />
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={formData.hasExperience}
                          onChange={(e) => setFormData({...formData, hasExperience: e.target.checked})}
                        />
                        <span className="text-sm font-bold">I have professional experience</span>
                      </label>

                      <AnimatePresence>
                        {formData.hasExperience && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <textarea 
                              placeholder="Describe your previous roles and responsibilities..."
                              rows={3}
                              value={formData.experienceDetails}
                              onChange={(e) => setFormData({...formData, experienceDetails: e.target.value})}
                              className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all resize-none ${isDark ? 'bg-white/5 border-white/10 focus:border-[#F05E23] focus:bg-white/10' : 'bg-slate-50 border-slate-200 focus:border-[#F05E23] focus:bg-white'}`}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button 
                      disabled={formLoading}
                      type="submit"
                      className="w-full bg-[#F05E23] text-white py-5 rounded-[1.5rem] text-lg font-black uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(240,94,35,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      {formLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Application"}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
