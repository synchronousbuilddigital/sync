"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Shield, Zap, Target, TrendingUp, Activity, ArrowUpRight, BarChart3, Rocket, HeartPulse } from "lucide-react";
import { useTheme } from './ThemeContext';

const advantages = [
    { 
        title: "AI-Powered", 
        desc: "Automating growth with cutting-edge AI.", 
        icon: Sparkles,
        color: "from-orange-500/20 to-orange-600/20"
    },
    { 
        title: "Full-Stack Brand", 
        desc: "End-to-end digital identity architecting.", 
        icon: Shield,
        color: "from-blue-500/20 to-blue-600/20"
    },
    { 
        title: "Tech + Market", 
        desc: "Bridging code with conversion logic.", 
        icon: Zap,
        color: "from-yellow-500/20 to-yellow-600/20"
    },
    { 
        title: "Data-Driven", 
        desc: "Strategic moves backed by analytics.", 
        icon: Target,
        color: "from-indigo-500/20 to-indigo-600/20"
    },
    { 
        title: "Scalable Systems", 
        desc: "Frameworks engineered for expansion.", 
        icon: TrendingUp,
        color: "from-green-500/20 to-green-600/20"
    }
];

const metrics = [
    { label: "Projects", value: "50+", desc: "Executed work" },
    { label: "Retention", value: "98%", desc: "Long-term partners" },
    { label: "Growth", value: "3.2x", desc: "Avg client ROI" },
    { label: "Response", value: "<2h", desc: "Rapid support" },
    { label: "Uptime", value: "99.9%", desc: "Infrastructure" },
    { label: "Experience", value: "8+", desc: "Years in dev" },
];

export default function WhyChooseUs() {
    const { isDark } = useTheme();
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section ref={sectionRef} className={`w-full py-24 sm:py-40 relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-[#FAFAFA]'}`}>
            {/* Background Accents */}
            <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-[0.03]' : 'opacity-[0.01]'}`}
                 style={{ backgroundImage: `radial-gradient(${isDark ? '#FFF' : '#000'} 1.2px, transparent 1.2px)`, backgroundSize: '64px 64px' }}></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-start">
                    
                    {/* Sticky Sidebar (Laptop) / Header (Mobile) */}
                    <div className="lg:w-[40%] lg:sticky lg:top-40">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 mb-8"
                        >
                            <span className="w-10 h-[1px] bg-[#F05E23]"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F05E23]">The Synchronous Advantage</span>
                        </motion.div>

                        <motion.h2 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className={`text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] mb-12 uppercase ${isDark ? 'text-white' : 'text-[#111]'}`}
                        >
                            Why Choose <span className="text-[#F05E23]">Synchronous.</span>
                        </motion.h2>

                        {/* High Impact Advantage Grid */}
                        <div className="grid grid-cols-1 gap-3">
                            {advantages.map((adv, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ x: 10 }}
                                    className={`flex items-center gap-6 p-4 rounded-3xl border transition-all duration-500 ${isDark ? 'bg-white/[0.02] border-white/5 hover:border-[#F05E23]/30' : 'bg-white border-black/[0.03] hover:shadow-xl shadow-black/5'}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${adv.color}`}>
                                        <adv.icon className="w-5 h-5 text-[#F05E23]" />
                                    </div>
                                    <div>
                                        <h4 className={`text-base font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-[#111]'}`}>{adv.title}</h4>
                                        <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{adv.desc}</p>
                                    </div>
                                    <ArrowUpRight className="ml-auto w-4 h-4 text-white/10 group-hover:text-[#F05E23] transition-colors" />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Visual Data Matrix */}
                    <div className="lg:w-[60%] space-y-8">
                        {/* Metrics Panel */}
                        <div className={`p-8 sm:p-12 rounded-[3.5rem] border relative overflow-hidden transition-all duration-700 ${isDark ? 'bg-[#0D0D0D] border-white/5' : 'bg-white border-black/[0.05] shadow-2xl shadow-black/5'}`}>
                            <div className="flex items-center justify-between mb-12">
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Performance Metrics</h3>
                                    <div className={`text-3xl font-black italic tracking-tighter uppercase ${isDark ? 'text-white' : 'text-[#111]'}`}>Verified Partner</div>
                                </div>
                                <div className="w-14 h-14 rounded-full border border-[#F05E23]/20 flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-[#F05E23] animate-pulse" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {metrics.map((m, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="space-y-1"
                                    >
                                        <div className="text-3xl font-black text-[#F05E23] tracking-tighter uppercase">{m.value}</div>
                                        <div className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-[#111]'}`}>{m.label}</div>
                                        <div className={`text-[9px] font-medium leading-none opacity-40 uppercase ${isDark ? 'text-white' : 'text-slate-500'}`}>{m.desc}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Capabilities Tags */}
                            <div className="mt-16 pt-12 border-t border-white/5">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-white/20">Strategic Capabilities</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Headless Logic', 'Predictive Modeling', 'Neural Scaling', 'Surgical UX', 'ROAS Optimization'].map((tag, i) => (
                                        <span key={i} className={`px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 text-white/40 hover:border-[#F05E23]/50 hover:text-white' : 'bg-black/5 border-black/5 text-black/40 hover:bg-[#F05E23]/5 hover:text-[#F05E23]'}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Excellence Matrix */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <div className={`p-10 rounded-[3rem] border transition-all duration-700 ${isDark ? 'bg-[#0D0D0D] border-white/5' : 'bg-white border-black/[0.05] shadow-2xl shadow-black/5'}`}>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-[#F05E23]">Quality Matrix</h3>
                                <div className="space-y-8">
                                    {[
                                        { label: "Design", pct: 98 },
                                        { label: "Code", pct: 95 },
                                        { label: "Innovation", pct: 92 },
                                    ].map((s, i) => (
                                        <div key={i} className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{s.label}</span>
                                                <span className="text-xl font-black text-[#F05E23] leading-none">{s.pct}%</span>
                                            </div>
                                            <div className={`h-[2px] w-full ${isDark ? 'bg-white/5' : 'bg-black/5'} overflow-hidden`}>
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${s.pct}%` }}
                                                    transition={{ duration: 1.5, ease: "circOut", delay: i * 0.2 }}
                                                    className="h-full bg-[#F05E23]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`p-10 rounded-[3rem] border flex flex-col justify-between transition-all duration-700 ${isDark ? 'bg-[#F05E23] border-white/10 text-white' : 'bg-[#111] border-black/5 text-white'}`}>
                                <div className="space-y-4">
                                    <HeartPulse className="w-10 h-10 mb-4 opacity-50" />
                                    <h3 className="text-2xl font-black tracking-tighter leading-none uppercase">Excellence Protocol.</h3>
                                    <p className="text-sm font-medium opacity-60 leading-relaxed">Verified long-term partnerships through surgical execution and technical innovation.</p>
                                </div>
                                <div className="pt-8 border-t border-white/10 mt-8">
                                    <div className="text-4xl font-black tracking-tighter uppercase">100%</div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Client Satisfaction</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ambient Background Number */}
            <div className="hidden lg:block absolute -bottom-10 -left-10 pointer-events-none opacity-[0.02] select-none">
                <span className={`text-[25rem] font-black leading-none ${isDark ? 'text-white' : 'text-black'}`}>WHY</span>
            </div>
        </section>
    );
}
