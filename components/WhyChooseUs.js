"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Shield, Zap, Target, TrendingUp, MousePointer2, Activity } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const valuePoints = [
    { 
        title: "AI-Powered Solutions", 
        desc: "Leveraging cutting-edge artificial intelligence to automate and optimize your business growth.", 
        icon: Sparkles 
    },
    { 
        title: "End-to-End Brand Building", 
        desc: "From name and identity to a full-scale digital presence, we build brands that last.", 
        icon: Shield 
    },
    { 
        title: "Technology + Marketing Expertise", 
        desc: "The perfect bridge between high-end software development and high-converting marketing.", 
        icon: Zap 
    },
    { 
        title: "Data-Driven Strategy", 
        desc: "Every move we make is backed by rigorous data analysis and market research.", 
        icon: Target 
    },
    { 
        title: "Scalable Growth Systems", 
        desc: "We design frameworks that don't just work today, but scale as your business expands.", 
        icon: TrendingUp 
    }
];

export default function WhyChooseUs({ dark = false }) {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        setIsDesktop(window.innerWidth >= 1024);
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const yParallax = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
    const yValue = isDesktop ? yParallax : 0;

    return (
        <section ref={sectionRef} className="w-full pt-16 md:pt-0 pb-12 md:pb-16 relative overflow-hidden bg-transparent">
            {/* Background Texture - Grid & Dots */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]"
                 style={{ backgroundImage: 'radial-gradient(#000 1.2px, transparent 1.2px)', backgroundSize: '48px 48px' }}></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-stretch">
                    
                    {/* Left: Strategic Content */}
                    <div className="lg:w-1/2 flex flex-col pt-4">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-100 rounded-full mb-10 shadow-sm"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#F05E23] animate-pulse"></span>
                            <span className="text-[0.65rem] font-bold text-[#F05E23] tracking-[0.4em] uppercase whitespace-nowrap">The Synchronous Advantage</span>
                        </motion.div>

                        <motion.h2 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[3rem] sm:text-[4.5rem] md:text-[5.5rem] font-bold tracking-tighter text-[#111] leading-[0.9] mb-12"
                        >
                            Why Choose <span className="block text-[#F05E23]">Synchronous.</span>
                        </motion.h2>

                        <div className="flex flex-col gap-4 w-full flex-1">
                            {valuePoints.map((point, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.8 }}
                                    className="group relative flex items-start gap-6 p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-[#F05E23]/20 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 flex-1 h-auto"
                                >
                                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#F05E23] group-hover:text-white group-hover:scale-110 transition-all duration-500">
                                        <point.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-xl font-bold text-[#111] mb-2 tracking-tight group-hover:text-[#F05E23] transition-colors">{point.title}</h4>
                                        <p className="text-slate-500 text-[0.95rem] leading-relaxed font-light">{point.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: High-Tech Performance Dashboard */}
                    <div className="lg:w-1/2 w-full flex flex-col mt-20 lg:mt-0">
                        <motion.div 
                            style={{ y: yValue }}
                            className="p-10 md:p-14 rounded-[4rem] bg-white border border-slate-100 shadow-[0_45px_100px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden h-full"
                        >
                            {/* Abstract Glow Inside Dashboard */}
                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#F05E23]/5 rounded-full blur-[80px] -z-10"></div>
                            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#F05E23]/5 rounded-full blur-[80px] -z-10"></div>

                            {/* Dashboard Header */}
                            <div className="flex items-center justify-between mb-12 pb-8 relative">
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#F05E23]/20 via-slate-100 to-transparent"></div>
                                <div className="space-y-1">
                                    <h3 className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-slate-300">Performance Metrics</h3>
                                    <div className="text-2xl font-black text-[#111] tracking-tight flex items-center gap-3">
                                        Verified Growth Partner
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    </div>
                                </div>
                                <Activity className="w-8 h-8 text-[#F05E23] opacity-20" />
                            </div>

                            {/* Main Stat Matrix */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                                {[
                                    { label: "Projects", value: "50+", desc: "Executed to date" },
                                    { label: "Retention", value: "98%", desc: "Long-term partners" },
                                    { label: "Growth", value: "3.2x", desc: "Avg client ROI" },
                                    { label: "Response", value: "<2h", desc: "Rapid support SLA" },
                                    { label: "Uptime", value: "99.9%", desc: "Infrastructure" },
                                    { label: "Experience", value: "8+", desc: "Years in industry" },
                                ].map((stat, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                        className="p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-[#F05E23]/20 transition-all duration-500"
                                    >
                                        <div className="text-2xl font-black text-[#111] tracking-tighter mb-1 group-hover:text-[#F05E23] transition-colors">{stat.value}</div>
                                        <div className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">{stat.label}</div>
                                        <div className="text-[0.65rem] font-medium text-slate-300 truncate">{stat.desc}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Strategic Capability Section */}
                            <div className="mb-10 p-6 rounded-3xl bg-slate-50 border border-slate-100 relative overflow-hidden group hover:border-[#F05E23]/10 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Target className="w-12 h-12 text-[#F05E23]" />
                                </div>
                                <h4 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Strategic Capability</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Headless Logic', 'Predictive Modeling', 'Neural Scaling', 'Surgical UX', 'ROAS Optimization'].map((tag, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-full bg-white border border-slate-100 text-[0.6rem] font-bold text-slate-500 uppercase tracking-wider shadow-sm hover:border-[#F05E23]/30 transition-colors cursor-default">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Progress Bars Skills */}
                            <div className="space-y-6 mb-10">
                                {[
                                    { label: "Design Quality", pct: 98 },
                                    { label: "Code Standards", pct: 95 },
                                    { label: "Client Satisfaction", pct: 100 },
                                    { label: "Technical Innovation", pct: 92 },
                                ].map((skill, i) => (
                                    <div key={i} className="space-y-2.5">
                                        <div className="flex justify-between items-end px-1">
                                            <span className="text-[0.65rem] font-bold tracking-widest text-slate-500 uppercase">{skill.label}</span>
                                            <span className="text-[0.8rem] font-black text-[#F05E23]">{skill.pct}%</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-slate-50 overflow-hidden border border-slate-100/50 p-[1px]">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.pct}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + (i * 0.1) }}
                                                className="h-full bg-gradient-to-r from-[#F05E23] to-[#F05E23]/60 rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Security / Verification Badge */}
                            <div className="mt-auto p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center gap-4 group hover:bg-white hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-500">
                                <Shield className="w-6 h-6 text-[#F05E23] fill-[#F05E23]/10" />
                                <span className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-[#F05E23] transition-colors">Industry Standard Excellence Protocol</span>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Ambient Background Glows */}
            <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#F05E23]/5 rounded-full blur-[120px] -z-10 animate-ambient" />
            <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-[#F05E23]/3 rounded-full blur-[120px] -z-10 animate-ambient" style={{ animationDelay: '2s' }} />
        </section>
    );
}
