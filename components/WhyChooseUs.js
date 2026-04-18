"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Shield, Zap, Target, TrendingUp, MousePointer2, Activity } from "lucide-react";
import { useTheme } from './ThemeContext';

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

export default function WhyChooseUs() {
    const { isDark } = useTheme();
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
        <section ref={sectionRef} className={`w-full py-20 sm:py-32 relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
            {/* Background Texture - Grid & Dots */}
            <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-[0.05]' : 'opacity-[0.02]'}`}
                 style={{ backgroundImage: `radial-gradient(${isDark ? '#FFF' : '#000'} 1.2px, transparent 1.2px)`, backgroundSize: '48px 48px' }}></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 sm:gap-16 lg:gap-24 items-stretch">
                    
                    {/* Left: Strategic Content */}
                    <div className="lg:w-1/2 flex flex-col">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`inline-flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-5 sm:py-2.5 border rounded-full mb-8 sm:mb-10 shadow-sm transition-colors duration-500 ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-100'}`}
                        >
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#F05E23] animate-pulse"></span>
                            <span className={`text-[0.6rem] sm:text-[0.65rem] font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase whitespace-nowrap transition-colors duration-500 ${isDark ? 'text-white/60' : 'text-[#F05E23]'}`}>The Synchronous Advantage</span>
                        </motion.div>

                        <motion.h2 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className={`text-[clamp(2.5rem,8vw,5.5rem)] font-bold tracking-tighter leading-[0.95] mb-10 sm:mb-12 transition-colors duration-700 ${isDark ? 'text-white' : 'text-[#111]'}`}
                        >
                            Why Choose <span className="block text-[#F05E23]">Synchronous.</span>
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 w-full flex-1">
                            {valuePoints.map((point, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.6 }}
                                    className={`group relative flex items-start gap-5 sm:gap-6 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border transition-all duration-700 flex-1 h-auto ${isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-[#F05E23]/20' : 'bg-white border-slate-100 hover:border-[#F05E23]/20 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]'}`}
                                >
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 ${isDark ? 'bg-white/5 border border-white/10 text-white/40 group-hover:bg-[#F05E23] group-hover:text-white' : 'bg-slate-50 border border-slate-100 text-slate-400 group-hover:bg-[#F05E23] group-hover:text-white group-hover:scale-110'}`}>
                                        <point.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className={`text-lg sm:text-xl font-bold mb-1.5 tracking-tight transition-colors group-hover:text-[#F05E23] ${isDark ? 'text-white' : 'text-[#111]'}`}>{point.title}</h4>
                                        <p className={`text-[0.85rem] sm:text-[0.95rem] leading-relaxed font-light transition-colors duration-500 ${isDark ? 'text-white/40 group-hover:text-white/60' : 'text-slate-500'}`}>{point.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: High-Tech Performance Dashboard */}
                    <div className="lg:w-1/2 w-full flex flex-col mt-12 sm:mt-16 lg:mt-0">
                        <motion.div 
                            style={{ y: yValue }}
                            className={`p-6 sm:p-10 lg:p-14 rounded-[2.5rem] sm:rounded-[4rem] border relative overflow-hidden h-full shadow-[0_45px_100px_-20px_rgba(0,0,0,0.1)] transition-colors duration-700 ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-100'}`}
                        >
                            {/* Abstract Glow Inside Dashboard */}
                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#F05E23]/5 rounded-full blur-[80px] -z-10"></div>
                            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#F05E23]/5 rounded-full blur-[80px] -z-10"></div>

                            {/* Dashboard Header */}
                            <div className="flex items-center justify-between mb-10 pb-6 relative">
                                <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r transition-colors duration-700 ${isDark ? 'from-[#F05E23]/40 via-white/5 to-transparent' : 'from-[#F05E23]/20 via-slate-100 to-transparent'}`}></div>
                                <div className="space-y-1">
                                    <h3 className={`text-[0.6rem] sm:text-[0.65rem] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] transition-colors duration-500 ${isDark ? 'text-white/20' : 'text-slate-300'}`}>Performance Metrics</h3>
                                    <div className={`text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 sm:gap-3 transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}>
                                        Verified Partner
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    </div>
                                </div>
                                <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-[#F05E23] opacity-20" />
                            </div>

                            {/* Main Stat Matrix */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">
                                {[
                                    { label: "Projects", value: "50+", desc: "Executed to date" },
                                    { label: "Retention", value: "98%", desc: "Long-term partners" },
                                    { label: "Growth", value: "3.2x", desc: "Avg client ROI" },
                                    { label: "Response", value: "<2h", desc: "Rapid support SLA" },
                                    { label: "Uptime", value: "99.9%", desc: "Infrastructure" },
                                    { label: "Experience", value: "8+", desc: "Years in industry" },
                                ] .map((stat, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 * i, duration: 0.5 }}
                                        className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border group transition-all duration-500 ${isDark ? 'bg-white/5 border-white/5 hover:border-[#F05E23]/20' : 'bg-slate-50 border-slate-100 hover:border-[#F05E23]/20'}`}
                                    >
                                        <div className={`text-xl sm:text-2xl font-black tracking-tighter mb-0.5 sm:mb-1 transition-colors group-hover:text-[#F05E23] ${isDark ? 'text-white' : 'text-[#111]'}`}>{stat.value}</div>
                                        <div className={`text-[0.5rem] sm:text-[0.55rem] font-black uppercase tracking-[0.2em] mb-0.5 transition-colors ${isDark ? 'text-white/30 group-hover:text-[#F05E23]/60' : 'text-slate-400'}`}>{stat.label}</div>
                                        <div className={`text-[0.6rem] sm:text-[0.65rem] font-medium truncate transition-colors duration-500 ${isDark ? 'text-white/10 group-hover:text-white/30' : 'text-slate-300'}`}>{stat.desc}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Strategic Capability Section */}
                            <div className={`mb-10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border relative overflow-hidden group transition-colors ${isDark ? 'bg-white/5 border-white/5 hover:border-[#F05E23]/10' : 'bg-slate-50 border-slate-100 hover:border-[#F05E23]/10'}`}>
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Target className="w-8 h-8 sm:w-12 sm:h-12 text-[#F05E23]" />
                                </div>
                                <h4 className={`text-[0.6rem] sm:text-[0.65rem] font-black uppercase tracking-[0.3em] mb-4 transition-colors ${isDark ? 'text-white/20' : 'text-slate-400'}`}>Strategic Capability</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Headless Logic', 'Predictive Modeling', 'Neural Scaling', 'Surgical UX', 'ROAS Optimization'].map((tag, i) => (
                                        <span key={i} className={`px-2.5 py-1.5 rounded-full border text-[0.55rem] sm:text-[0.6rem] font-bold uppercase tracking-wider shadow-sm transition-colors cursor-default ${isDark ? 'bg-white/5 border-white/10 text-white/40 hover:border-[#F05E23]/30' : 'bg-white border-slate-100 text-slate-500 hover:border-[#F05E23]/30'}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Progress Bars Skills */}
                            <div className="space-y-5 sm:space-y-6 mb-10">
                                {[
                                    { label: "Design Quality", pct: 98 },
                                    { label: "Code Standards", pct: 95 },
                                    { label: "Client Satisfaction", pct: 100 },
                                    { label: "Technical Innovation", pct: 92 },
                                ].map((skill, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-end px-1">
                                            <span className={`text-[0.6rem] sm:text-[0.65rem] font-bold tracking-widest uppercase transition-colors ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{skill.label}</span>
                                            <span className="text-[0.7rem] sm:text-[0.8rem] font-black text-[#F05E23]">{skill.pct}%</span>
                                        </div>
                                        <div className={`h-1.5 rounded-full overflow-hidden border p-[1px] transition-colors duration-700 ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100/50'}`}>
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.pct}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, ease: "easeOut", delay: 0.5 + (i * 0.1) }}
                                                className="h-full bg-gradient-to-r from-[#F05E23] to-[#F05E23]/60 rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Security / Verification Badge */}
                            <div className={`mt-auto p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border flex items-center justify-center gap-3 sm:gap-4 group transition-all duration-500 ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)]'}`}>
                                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#F05E23] fill-[#F05E23]/10 flex-shrink-0" />
                                <span className={`text-[0.6rem] sm:text-[0.7rem] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-center transition-colors ${isDark ? 'text-white/20 group-hover:text-white' : 'text-slate-500 group-hover:text-[#F05E23]'}`}>Industry Standard Excellence Protocol</span>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Ambient Background Glows */}
            <div className={`absolute top-[20%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[80px] sm:blur-[120px] -z-10 transition-colors duration-700 ${isDark ? 'bg-[#F05E23]/10' : 'bg-[#F05E23]/5'}`} />
            <div className={`absolute bottom-[20%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[80px] sm:blur-[120px] -z-10 transition-colors duration-700 ${isDark ? 'bg-[#F05E23]/5' : 'bg-[#F05E23]/3'}`} />
        </section>
    );
}

