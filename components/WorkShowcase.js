"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, CheckCircle, Clock, Smile } from "lucide-react";
import { useTheme } from './ThemeContext';

const projects = [
    {
        id: "01",
        title: "BOXFOX",
        summary: "An easy-to-use custom gift box and 3D design shop.",
        solution: "We designed a smart 3D tool so customers can make their own boxes and order them instantly.",
        results: ["Custom 3D Shop", "Easy Ordering"],
        image: "/website ss/boxfox.png",
        plan: "Step: Design & Build"
    },
    {
        id: "02",
        title: "RYM Grenergy",
        summary: "Smart solar and energy systems for cleaner homes.",
        solution: "We built a simple system that uses smart tech to manage solar energy and storage automatically.",
        results: ["Better Solar Energy", "Smarter Saving"],
        image: "/website ss/RYM.png",
        plan: "Step: Simple Setup"
    },
    {
        id: "03",
        title: "Vegavruddhi",
        summary: "A helpful app for sales teams to track their work and grow.",
        solution: "We created a mobile app that helps sales teams see where to go and how to close more deals.",
        results: ["Fast Sales Growth", "Better Tracking"],
        image: "/website ss/vega.png",
        plan: "Step: Team Support"
    },
    {
        id: "04",
        title: "BWorth",
        summary: "A friendly online store for buying and selling pre-owned clothes.",
        solution: "We made a simple app where users can sell clothes and earn rewards for choosing eco-friendly options.",
        results: ["Better Shopping", "Eco Rewards"],
        image: "/website ss/bworth.png",
        plan: "Step: Smart Marketplace"
    },
    {
        id: "05",
        title: "Fashquick",
        summary: "Premium fashion rentals for any occasion starting today.",
        solution: "We built an affordable rental shop where anyone can rent high-end outfits for a low daily price.",
        results: ["Fashion Rental", "Affordable Price"],
        image: "/website ss/fashquick.png",
        plan: "Step: Daily Rentals"
    }
];

export default function WorkShowcase() {
    const { isDark } = useTheme();
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-scroll logic (continuous felt sliding)
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % projects.length);
        }, 8000); // Increased from 5s to 8s
        return () => clearInterval(interval);
    }, []);

    return (
        <section 
            className={`relative w-full min-h-screen py-24 sm:py-32 flex flex-col items-center justify-center overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#0A0A10]' : 'bg-[#FFF9F5]'}`}
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
            <div className="max-w-7xl mx-auto px-6 w-full mb-16 relative z-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-[2px] bg-[#F05E23]" />
                        <span className={`text-[12px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-white/30' : 'text-black/30'}`}>Work Spotlight</span>
                        <div className="w-12 h-[2px] bg-[#F05E23]" />
                    </div>
                    <h2 className={`text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none ${isDark ? 'text-white' : 'text-black'}`}>
                        Our best <span className="text-[#F05E23]">Work.</span>
                    </h2>
                </motion.div>
            </div>

            {/* Project Navigation - All Company Names */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-12 mb-16 relative z-20 px-6">
                {projects.map((project, i) => (
                    <motion.button
                        key={project.id}
                        onClick={() => setActiveIndex(i)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative group px-2 py-1 flex flex-col items-center gap-2`}
                    >
                        <span className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 ${activeIndex === i ? 'text-[#F05E23]' : (isDark ? 'text-white/20 group-hover:text-white/50' : 'text-black/20 group-hover:text-black/50')}`}>
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

            {/* Horizontal Filmstrip Wrapper - "At a time card, no gap" */}
            <div className="relative w-full max-w-6xl h-[550px] sm:h-[700px] z-10">
                <motion.div 
                    animate={{ x: `-${activeIndex * 100}%` }}
                    transition={{ duration: 1.8, ease: [0.32, 0.72, 0, 1] }}
                    className="flex w-full h-full"
                >
                    {projects.map((project, index) => (
                        <div key={project.id} className="w-full flex-shrink-0 px-4 sm:px-10 h-full flex items-center justify-center">
                            <motion.div 
                                animate={{ 
                                    scale: activeIndex === index ? 1 : 0.85,
                                    opacity: activeIndex === index ? 1 : 0.4,
                                    filter: activeIndex === index ? "blur(0px)" : "blur(4px)"
                                }}
                                transition={{ duration: 1 }}
                                className={`w-full max-w-5xl h-full rounded-[2.5rem] overflow-hidden border relative flex flex-col ${isDark ? 'bg-[#0D0D14]/80 backdrop-blur-3xl border-white/5' : 'bg-white border-black/5 shadow-2xl shadow-black/5'}`}
                            >
                                {/* Card Image - Now on Top */}
                                <div className="w-full h-[65%] relative overflow-hidden border-b border-white/5">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover object-top transition-transform duration-[3s]"
                                        style={{ transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[12px] font-black text-[#F05E23] uppercase tracking-[0.3em]">{project.id}</span>
                                            <div className="w-12 h-[1px] bg-[#F05E23]" />
                                        </div>
                                        <h3 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">{project.title}</h3>
                                    </div>
                                </div>
                                
                                {/* Card Content - Now on Bottom */}
                                <div className="w-full h-[35%] p-6 sm:p-10 flex flex-col justify-between">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="space-y-2 max-w-2xl">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="relative">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                                                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-white/30' : 'text-black/30'}`}>Verified Partner</span>
                                            </div>
                                            <p className={`text-xl sm:text-2xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-black'}`}>
                                                {project.summary}
                                            </p>
                                        </div>

                                        <div className="flex gap-8 border-l border-white/10 pl-8">
                                            <div className="space-y-1">
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-white/20' : 'text-black/20'}`}>Strategy</span>
                                                <p className={`text-[11px] font-black uppercase ${isDark ? 'text-white/80' : 'text-black/80'}`}>{project.plan}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-white/20' : 'text-black/20'}`}>Happiness</span>
                                                <p className={`text-[11px] font-black uppercase ${isDark ? 'text-white/80' : 'text-black/80'}`}>100% Success</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex flex-wrap gap-2">
                                            {project.results.map((tag, i) => (
                                                <span key={i} className={`text-[8px] font-black uppercase py-1.5 px-3 rounded-md border ${isDark ? 'border-white/10 text-white/40 bg-white/5' : 'border-[#F05E23]/20 text-[#F05E23] bg-[#F05E23]/5'}`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <motion.div 
                                            whileHover={{ scale: 1.1, rotate: 45 }}
                                            className="w-12 h-12 rounded-2xl bg-[#F05E23] flex items-center justify-center text-white shadow-xl shadow-[#F05E23]/20 transition-transform"
                                        >
                                            <ArrowUpRight strokeWidth={4} className="w-6 h-6" />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </motion.div>

                {/* Progress Indicators */}
                <div className="absolute -bottom-16 flex gap-4 left-1/2 -translate-x-1/2">
                    {projects.map((_, i) => (
                        <div 
                            key={i} 
                            onClick={() => setActiveIndex(i)}
                            className={`h-2 rounded-full transition-all duration-700 cursor-pointer ${activeIndex === i ? 'w-16 bg-[#F05E23]' : 'w-4 bg-[#F05E23]/20'}`} 
                        />
                    ))}
                </div>
            </div>
            
            {/* Ambient Background Number */}
            <div className="absolute -bottom-10 -right-10 pointer-events-none opacity-[0.02] select-none">
                <span className={`text-[20rem] font-black ${isDark ? 'text-white' : 'text-black'}`}>0{activeIndex + 1}</span>
            </div>
        </section>
    );
}
