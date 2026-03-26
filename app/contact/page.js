"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Send, MapPin, Globe, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [formState, setFormState] = useState("idle");

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormState("submitting");
        setTimeout(() => setFormState("success"), 1500);
    };

    return (
        <div className="flex flex-col items-center w-full min-h-screen relative overflow-hidden pb-20 selection:bg-orange-500/20" style={{ backgroundColor: '#FAFAF8' }}>
            {/* Ambient background glows */}
            <div className="absolute top-[5%] right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 opacity-10"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(150px)' }}
            ></div>
            <div className="absolute bottom-[10%] left-[-15%] w-[800px] h-[800px] rounded-full pointer-events-none z-0 opacity-10"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(120px)' }}
            ></div>

            <section className="w-full max-w-[1400px] mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="flex flex-col lg:flex-row gap-20">
                    
                    {/* Left content: Typography & Info */}
                    <div className="lg:w-5/12 flex flex-col items-start lg:pr-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-[#111] shadow-xl shadow-orange-500/10 rounded-full mb-10"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                            <span className="text-[0.65rem] font-black text-white tracking-[0.4em] uppercase">Connect</span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] font-bold tracking-tight leading-[0.9] text-[#111] mb-12"
                        >
                            Partnering For <br />
                            <span className="italic font-light text-slate-400">Expansion.</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-[1.2rem] md:text-[1.5rem] text-slate-500 font-medium max-w-lg leading-relaxed border-l-4 border-[#F05E23] pl-10 mb-20"
                        >
                            Ready to scale your digital ecosystem? Our innovation specialists are standing by to architect your growth framework.
                        </motion.p>

                        <div className="space-y-6 w-full max-w-md">
                            {[
                                { icon: Mail, label: "Business Email", val: "biz@synchronousbuilddigital.com" },
                                { icon: Phone, label: "Call Us", val: "+91 91613 91566" },
                                { icon: Clock, label: "Availability", val: "Mon - Fri | 10AM - 7PM IST" }
                            ].map((info, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="group flex items-center gap-6 p-6 lg:p-8 rounded-[2rem] bg-white border border-[rgba(0,0,0,0.04)] shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500 overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#FAFAF8] border border-[rgba(0,0,0,0.04)] flex items-center justify-center text-[#94A3B8] transition-all duration-500 group-hover:bg-[#111] group-hover:text-[#F05E23]">
                                        <info.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                                    </div>
                                    <div className="relative z-10 flex flex-col">
                                        <span className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-1">{info.label}</span>
                                        <span className="text-lg font-bold text-[#111] tracking-tight group-hover:text-[#F05E23] transition-colors">{info.val}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right content: The Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:w-7/12 relative mt-20 lg:mt-0"
                    >
                        <div className="bg-white rounded-[4rem] p-10 md:p-16 lg:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.04)] relative overflow-hidden group/card transition-all duration-700 hover:border-orange-500/20">
                            
                            {/* Inner accent glow */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000 -z-0 translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ background: 'radial-gradient(circle, #F05E2310, transparent 70%)' }}
                            ></div>

                            <div className="relative z-10">
                                <h3 className="text-3xl lg:text-4xl font-bold text-[#111] mb-12 tracking-tight">Project Briefing</h3>
                                
                                <form className="space-y-10" onSubmit={handleSubmit}>
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Your Name</label>
                                            <input 
                                                type="text" 
                                                required
                                                placeholder="Executive Talent" 
                                                className="w-full px-8 py-5 rounded-2xl bg-[#FAFAF8] border border-[rgba(0,0,0,0.04)] focus:bg-white focus:border-[#F05E23] focus:ring-4 focus:ring-orange-500/5 placeholder:text-slate-300 outline-none transition-all duration-300 font-bold text-[#111]" 
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Digital HQ</label>
                                            <input 
                                                type="text" 
                                                placeholder="Company Name" 
                                                className="w-full px-8 py-5 rounded-2xl bg-[#FAFAF8] border border-[rgba(0,0,0,0.04)] focus:bg-white focus:border-[#F05E23] focus:ring-4 focus:ring-orange-500/5 placeholder:text-slate-300 outline-none transition-all duration-300 font-bold text-[#111]" 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Priority Objective</label>
                                        <div className="relative">
                                            <select className="w-full px-8 py-5 rounded-2xl bg-[#FAFAF8] border border-[rgba(0,0,0,0.04)] focus:bg-white focus:border-[#F05E23] focus:ring-4 focus:ring-orange-500/5 text-[#111] outline-none transition-all duration-300 font-bold appearance-none cursor-pointer pr-12">
                                                <option>Identity & Brand Systems</option>
                                                <option>Digital Product Development</option>
                                                <option>AI Operations & Automation</option>
                                                <option>Growth Engineering (SEO/Ads)</option>
                                                <option>Full-Scale Digital Audit</option>
                                            </select>
                                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#F05E23] w-2.5 h-2.5 border-r-2 border-b-2 border-current rotate-45 transform origin-center"></div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Deep Details</label>
                                        <textarea 
                                            rows="5" 
                                            placeholder="What are the critical success factors for this project?" 
                                            className="w-full px-8 py-5 rounded-3xl bg-[#FAFAF8] border border-[rgba(0,0,0,0.04)] focus:bg-white focus:border-[#F05E23] focus:ring-4 focus:ring-orange-500/5 placeholder:text-slate-300 outline-none transition-all duration-300 font-bold text-[#111] resize-none"
                                        ></textarea>
                                    </div>

                                    <div className="flex flex-col items-center gap-8 pt-4">
                                        <motion.button 
                                            type="submit"
                                            disabled={formState === "submitting" || formState === "success"}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-6 rounded-2xl text-white font-black text-[0.85rem] uppercase tracking-[0.4em] transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group shadow-2xl shadow-orange-500/20"
                                            style={{ backgroundColor: formState === "success" ? "#10B981" : "#111" }}
                                        >
                                            {formState === "idle" && (
                                                <>
                                                    Initiate Deployment
                                                    <ArrowRight className="w-4 h-4 text-[#F05E23] group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                                                </>
                                            )}
                                            {formState === "submitting" && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 border-2 border-[#F05E23] border-t-transparent rounded-full animate-spin"></div>
                                                    Processing...
                                                </div>
                                            )}
                                            {formState === "success" && "Deployment Success — We'll be in touch"}
                                        </motion.button>
                                        
                                        <p className="text-[0.65rem] text-slate-400 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                                            Encrypted & Secure Communication
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
