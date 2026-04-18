"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, CheckCircle, Clock, Smile, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from './ThemeContext';
import { useAuth } from "./AuthContext";

export default function WorkShowcase() {
    const { projects } = useAuth();
    const { isDark } = useTheme();
    const [activeIndex, setActiveIndex] = useState(0);

    const displayProjects = projects.length > 0 ? projects.map(p => ({
        id: p.index || "00",
        title: p.title,
        summary: p.description,
        plan: p.strategyDetail,
        happiness: p.happinessDetail,
        results: p.tags,
        image: p.imageUrl || "/website ss/boxfox.png", // fallback
        category: p.category,
        impact: p.impact
    })) : [
        {
            id: "01",
            title: "BOXFOX",
            summary: "An easy-to-use custom gift box and 3D design shop.",
            plan: "Step: Design & Build",
            happiness: "100% Success",
            results: ["Custom 3D Shop", "Easy Ordering"],
            impact: "Boosted digital presence and secured $15k in small business innovation grants.",
            image: "/website ss/boxfox.png",
            category: "Verified Partner"
        },
        {
            id: "02",
            title: "RYM Grenergy",
            summary: "Smart solar and energy systems for cleaner homes.",
            plan: "Step: Simple Setup",
            happiness: "100% Success",
            results: ["Better Solar Energy", "Smarter Saving"],
            impact: "Enhanced SEO rankings helping them secure green energy subsidies.",
            image: "/website ss/RYM.png",
            category: "Verified Partner"
        }
    ];

    // Auto-scroll logic (continuous felt sliding)
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % displayProjects.length);
        }, 8000); 
        return () => clearInterval(interval);
    }, [displayProjects.length]);

    return (
        <section 
            className={`relative w-full min-h-screen py-20 sm:py-32 flex flex-col items-center justify-center overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#0A0A10]' : 'bg-[#FFF9F5]'}`}
        >
            {/* Soft Light Orange Background Flair */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 opacity-[0.05] ${isDark ? 'mix-blend-overlay' : ''}`} 
                    style={{ backgroundImage: 'radial-gradient(#F05E23 1px, transparent 0)', backgroundSize: '50px 50px' }} 
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 12, repeat: Infinity }}
                    className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[150px] bg-[#F05E23]/10" 
                />
            </div>

            {/* Title */}
            <div className="max-w-7xl mx-auto px-6 w-full mb-10 sm:mb-16 relative z-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-[2px] bg-[#F05E23]" />
                        <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.4em] text-[#F05E23]">Work Spotlight</span>
                        <div className="w-12 h-[2px] bg-[#F05E23]" />
                    </div>
                    <h2 className={`text-4xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none ${isDark ? 'text-white' : 'text-black'}`}>
                        Our best <span className="text-[#F05E23]">Work.</span>
                    </h2>
                </motion.div>
            </div>

            {/* Project Navigation - Horizontal scroll on mobile */}
            <div className="w-full max-w-7xl px-6 relative z-20 mb-10 sm:mb-16">
                <div className="flex items-center gap-6 sm:gap-12 overflow-x-auto pb-4 sm:justify-center no-scrollbar">
                    {displayProjects.map((project, i) => (
                        <motion.button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`relative shrink-0 px-2 py-1 flex flex-col items-center gap-2`}
                        >
                            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all duration-500 ${activeIndex === i ? 'text-[#F05E23]' : (isDark ? 'text-white/20 hover:text-white/50' : 'text-black/20 hover:text-black/50')}`}>
                                {project.title}
                            </span>
                            {activeIndex === i && (
                                <motion.div 
                                    layoutId="activeUnderline"
                                    className="w-full h-[2px] bg-[#F05E23] rounded-full shadow-[0_0_10px_#F05E23]" 
                                />
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Carousel Content */}
            <div className="relative w-full max-w-[95%] sm:max-w-6xl h-auto lg:h-[750px] z-10 flex flex-col">
                <div className="relative w-full overflow-hidden flex-1">
                    <motion.div 
                        animate={{ x: `-${activeIndex * 100}%` }}
                        transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
                        className="flex w-full h-full"
                    >
                        {displayProjects.map((project, index) => (
                            <div key={index} className="w-full flex-shrink-0 px-2 sm:px-6 lg:px-10 h-full flex items-center justify-center">
                                <motion.div 
                                    animate={{ 
                                        scale: activeIndex === index ? 1 : 0.95,
                                        opacity: activeIndex === index ? 1 : 0.3,
                                    }}
                                    transition={{ duration: 0.6 }}
                                    className={`w-full max-w-5xl h-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border relative flex flex-col ${isDark ? 'bg-[#0D0D14]/80 backdrop-blur-3xl border-white/5' : 'bg-white border-black/5 shadow-2xl shadow-black/5'}`}
                                >
                                    {/* Card Image - Using aspect ratio on mobile for stability */}
                                    <div className="w-full aspect-[16/10] sm:h-[50%] lg:h-[60%] relative overflow-hidden border-b border-white/5 shrink-0">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="object-cover object-top transition-transform duration-[3s]"
                                            style={{ transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)' }}
                                            priority={index === activeIndex}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                        <div className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                                <span className="text-[10px] sm:text-[12px] font-black text-[#F05E23] uppercase tracking-[0.2em] sm:tracking-[0.3em]">{project.id}</span>
                                                <div className="w-8 sm:w-12 h-[1px] bg-[#F05E23]" />
                                            </div>
                                            <h3 className="text-3xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">{project.title}</h3>
                                        </div>
                                    </div>
                                    
                                    {/* Card Content */}
                                    <div className="w-full flex-1 p-6 sm:p-10 flex flex-col justify-between gap-6 sm:gap-10">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            <div className="space-y-3 lg:max-w-2xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                                                        <div className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
                                                    </div>
                                                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-white/40' : 'text-black/40'}`}>{project.category}</span>
                                                </div>
                                                <p className={`text-xl sm:text-3xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-black'}`}>
                                                    {project.summary}
                                                </p>
                                                {project.impact && (
                                                    <div className="inline-flex items-center gap-2 p-2 rounded-lg bg-[#F05E23]/5 border border-[#F05E23]/10">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] flex-shrink-0" />
                                                        <p className="text-[9px] sm:text-[10px] font-bold text-[#F05E23] uppercase tracking-wider">
                                                            {project.impact}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-6 sm:gap-10 border-t sm:border-t-0 sm:border-l border-white/10 pt-6 sm:pt-0 sm:pl-10">
                                                <div className="space-y-1">
                                                    <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-white/20' : 'text-black/20'}`}>Strategy</span>
                                                    <p className={`text-[10px] sm:text-[11px] font-black uppercase ${isDark ? 'text-white/80' : 'text-black/80'}`}>{project.plan}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-white/20' : 'text-black/20'}`}>Happiness</span>
                                                    <p className={`text-[10px] sm:text-[11px] font-black uppercase ${isDark ? 'text-white/80' : 'text-black/80'}`}>{project.happiness}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 mt-auto">
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                                {project.results.map((tag, i) => (
                                                    <span key={i} className={`text-[8px] font-black uppercase py-1.5 px-3 rounded-lg border ${isDark ? 'border-white/10 text-white/50 bg-white/5' : 'border-[#F05E23]/20 text-[#F05E23] bg-[#F05E23]/5'}`}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <motion.div 
                                                whileHover={{ scale: 1.1, rotate: 45 }}
                                                className="w-12 h-12 rounded-2xl bg-[#F05E23] flex items-center justify-center text-white shadow-xl shadow-[#F05E23]/20 flex-shrink-0"
                                            >
                                                <ArrowUpRight strokeWidth={4} className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-3 justify-center mt-10 sm:mt-16">
                    {displayProjects.map((_, i) => (
                        <div 
                            key={i} 
                            onClick={() => setActiveIndex(i)}
                            className={`h-1.5 rounded-full transition-all duration-700 cursor-pointer ${activeIndex === i ? 'w-12 bg-[#F05E23]' : 'w-3 bg-[#F05E23]/20'}`} 
                        />
                    ))}
                </div>

                {/* Navigation Arrows - Hidden on small mobile, refined on larger screens */}
                <div className="hidden sm:flex absolute top-1/2 -translate-y-1/2 sm:-left-20 lg:-left-32 sm:-right-20 lg:-right-32 pointer-events-none z-30 justify-between px-4">
                    <motion.button
                        whileHover={{ scale: 1.1, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setActiveIndex((prev) => (prev - 1 + displayProjects.length) % displayProjects.length)}
                        className={`pointer-events-auto w-12 h-12 lg:w-20 lg:h-20 rounded-full flex items-center justify-center backdrop-blur-3xl border border-[#F05E23]/20 group transition-all duration-500 ${isDark ? 'bg-white/5 hover:bg-[#F05E23]/10' : 'bg-black/5 hover:bg-[#F05E23]/5'}`}
                    >
                        <ChevronLeft strokeWidth={1.5} className={`w-6 h-6 lg:w-10 lg:h-10 transition-colors ${isDark ? 'text-white/30 group-hover:text-[#F05E23]' : 'text-black/30 group-hover:text-[#F05E23]'}`} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1, x: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setActiveIndex((prev) => (prev + 1) % displayProjects.length)}
                        className={`pointer-events-auto w-12 h-12 lg:w-20 lg:h-20 rounded-full flex items-center justify-center backdrop-blur-3xl border border-[#F05E23]/20 group transition-all duration-500 ${isDark ? 'bg-white/5 hover:bg-[#F05E23]/10' : 'bg-black/5 hover:bg-[#F05E23]/5'}`}
                    >
                        <ChevronRight strokeWidth={1.5} className={`w-6 h-6 lg:w-10 lg:h-10 transition-colors ${isDark ? 'text-white/30 group-hover:text-[#F05E23]' : 'text-black/30 group-hover:text-[#F05E23]'}`} />
                    </motion.button>
                </div>
            </div>
            
            {/* Ambient Background Number - Hidden on small mobile */}
            <div className="hidden sm:block absolute -bottom-10 -right-10 pointer-events-none opacity-[0.02] select-none">
                <span className={`text-[20rem] font-black ${isDark ? 'text-white' : 'text-black'}`}>0{activeIndex + 1}</span>
            </div>
        </section>
    );
}
