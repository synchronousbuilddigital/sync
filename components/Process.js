"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Search, Compass, Cpu, Rocket, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
    { 
        id: "01", 
        title: "Discover", 
        desc: "Analyzing your business, target audience, and competitive search landscape.", 
        icon: <Search className="w-5 h-5 md:w-6 md:h-6" />,
        color: "#F05E23"
    },
    { 
        id: "02", 
        title: "Strategy", 
        desc: "Formulating a high-converting digital branding and robust SEO strategy.", 
        icon: <Compass className="w-5 h-5 md:w-6 md:h-6" />,
        color: "#F05E23"
    },
    { 
        id: "03", 
        title: "Build", 
        desc: "Engineering fast, SEO-optimized web platforms and cohesive brand identities.", 
        icon: <Cpu className="w-5 h-5 md:w-6 md:h-6" />,
        color: "#F05E23"
    },
    { 
        id: "04", 
        title: "Launch", 
        desc: "Deploying growth-marketing campaigns and scalable software solutions.", 
        icon: <Rocket className="w-5 h-5 md:w-6 md:h-6" />,
        color: "#F05E23"
    },
    { 
        id: "05", 
        title: "Scale", 
        desc: "Continuously optimizing conversion rates and search rankings via data automation.", 
        icon: <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />,
        color: "#F05E23"
    }
];

export default function Process() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const pathLength = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);

    return (
        <section ref={containerRef} className="w-full py-24 md:py-40 relative overflow-hidden bg-[#111]">
            {/* Background Grain & Dots */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
                 style={{ backgroundImage: 'radial-gradient(#fff 1.2px, transparent 1.2px)', backgroundSize: '40px 40px' }}></div>
            
            {/* Ambient Glows */}
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full -z-10 opacity-[0.07] blur-[150px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)' }}
            />
            <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] rounded-full -z-10 opacity-[0.05] blur-[150px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)' }}
            />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-32">
                    <div className="max-w-3xl">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-10"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse shadow-[0_0_8px_#F05E23]"></span>
                            <span className="text-[0.65rem] font-black text-white/60 tracking-[0.4em] uppercase">Methodology</span>
                        </motion.div>
                        
                        <motion.h2 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[3.5rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] font-bold tracking-tighter text-white leading-[0.9] flex flex-col"
                        >
                            <span>Our <em className="not-italic text-[#F05E23]">Data-Driven</em></span>
                            <span>Process.</span>
                        </motion.h2>
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:mb-4 border-l-2 border-[#F05E23]/30 pl-8 max-w-sm"
                    >
                        <p className="text-[1.1rem] text-white/40 font-light leading-relaxed italic">
                            Transparent methodologies build trust. Discover how our proprietary SEO and marketing frameworks accelerate your growth.
                        </p>
                    </motion.div>
                </div>

                {/* Vertical/Horizontal Roadmap Container */}
                <div className="relative pt-20">
                    
                    {/* The Connecting Path (Desktop Only - SVG Path with Scroll Animation) */}
                    <div className="hidden lg:block absolute top-[60px] left-0 w-full h-[120px] z-0 pointer-events-none overflow-visible">
                        <svg width="100%" height="100%" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
                            <motion.path 
                                d="M0 60 C 200 60, 200 0, 400 0 C 600 0, 600 120, 800 120 C 1000 120, 1000 60, 1440 60" 
                                stroke="rgba(255,255,255,0.05)" 
                                strokeWidth="2"
                                strokeDasharray="10 10"
                            />
                            <motion.path 
                                d="M0 60 C 200 60, 200 0, 400 0 C 600 0, 600 120, 800 120 C 1000 120, 1000 60, 1440 60" 
                                stroke="#F05E23" 
                                strokeWidth="3"
                                style={{ pathLength }}
                                className="drop-shadow-[0_0_8px_rgba(240,94,35,0.5)]"
                            />
                        </svg>
                    </div>

                    {/* Step Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="relative group flex flex-col items-center lg:block"
                            >
                                {/* Vertical Connector Line (Desktop) */}
                                <div className="hidden lg:block absolute top-[50px] left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-white/10 to-transparent group-hover:from-[#F05E23]/50 transition-all duration-700"></div>

                                {/* Step Bubble */}
                                <div className="relative mb-12 flex justify-center">
                                    <div 
                                        className="w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-[#F05E23] shadow-2xl group-hover:bg-[#F05E23] group-hover:text-white group-hover:border-[#F05E23] group-hover:-translate-y-2 transition-all duration-700 ease-[0.16, 1, 0.3, 1] relative z-20 group-hover:shadow-[0_20px_40px_-10px_rgba(240,94,35,0.4)]"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#F05E23]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem]"></div>
                                        {step.icon}
                                        
                                        {/* Step ID Label */}
                                        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-[0.7rem] font-black text-white group-hover:bg-white group-hover:text-[#F05E23] transition-all duration-700 shadow-xl group-hover:rotate-12">
                                            {step.id}
                                        </div>
                                    </div>
                                    
                                    {/* Pulse Ring */}
                                    <div className="absolute inset-x-0 top-0 mx-auto w-24 h-24 rounded-full border border-[#F05E23]/20 animate-[ping_3s_linear_infinite] group-hover:opacity-100 opacity-20 transition-opacity"></div>
                                </div>

                                {/* Content */}
                                <div className="text-center lg:mt-32 px-2">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-5 tracking-tight group-hover:text-[#F05E23] transition-colors duration-500">
                                        {step.title}
                                    </h3>
                                    <p className="text-[0.95rem] md:text-[1.05rem] text-white/30 leading-relaxed font-light group-hover:text-white/60 transition-all duration-500 max-w-[260px] mx-auto">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Link href="/process" className="group flex items-center gap-6 px-12 py-6 bg-white/5 border border-white/10 rounded-full text-white text-[0.85rem] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-[#111] transition-all duration-700 shadow-xl shadow-orange-500/5">
                                Learn our full process
                                <div className="w-8 h-8 rounded-full bg-[#F05E23] flex items-center justify-center group-hover:bg-[#111] transition-all">
                                    <ArrowRight className="w-4 h-4 text-white group-hover:text-white" strokeWidth={3} />
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Dynamic Wavy Floor Decoration - Matching User Image Style */}
                <div className="absolute bottom-0 left-0 w-full h-40 overflow-hidden pointer-events-none opacity-40">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent z-10"></div>
                    <svg className="w-[120%] h-full ml-[-10%]" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <motion.path
                            animate={{ 
                                d: [
                                    "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,154.7C672,160,768,224,864,229.3C960,235,1056,181,1152,170.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                    "M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,213.3C672,213,768,171,864,154.7C960,139,1056,149,1152,176C1248,203,1344,245,1392,266.7L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                    "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,154.7C672,160,768,224,864,229.3C960,235,1056,181,1152,170.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                                ]
                            }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                            fill="url(#footer-gradient)"
                        />
                        <defs>
                            <linearGradient id="footer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#F05E23', stopOpacity: 0.4 }} />
                                <stop offset="50%" style={{ stopColor: '#F05E23', stopOpacity: 0.1 }} />
                                <stop offset="100%" style={{ stopColor: '#F05E23', stopOpacity: 0.4 }} />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
        </section>
    );
}
