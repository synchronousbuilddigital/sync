"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, Zap, CheckCircle, Clock, Smile } from "lucide-react";
import { useTheme } from './ThemeContext';

// Featured Projects Data - Simple & Friendly Language
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

    // Auto-Cycle Engine (Smoothly Switch Projects every 4 seconds for better reading)
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % projects.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className={`w-full py-24 lg:py-40 relative overflow-hidden transition-all duration-1000 ${isDark ? 'bg-[#0A0A10]' : 'bg-[#FAFAF9]'}`}>
            
            {/* Background Aesthetic - Clean & Simple */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]">
                <div className="absolute inset-x-0 h-[1.5px] bg-[#F05E23] w-full top-0"></div>
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1.5px 1.5px, #F05E23 0.8px, transparent 0)`,
                    backgroundSize: '100px 100px'
                }}></div>
            </div>

            <div className="max-w-[1700px] mx-auto h-auto lg:h-screen flex flex-col lg:flex-row relative z-10">
                
                {/* LEFT SIDE: ALL PROJECTS LIST */}
                <div className="w-full lg:w-[50%] h-full flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-32 lg:py-0">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="mb-14 flex items-center gap-4"
                    >
                        <div className="w-1.5 h-12 bg-[#F05E23]"></div>
                        <div className="flex flex-col">
                            <span className={`text-[0.75rem] font-bold tracking-[0.2em] uppercase ${isDark ? 'text-white/40' : 'text-black/40'}`}>Our Best Work</span>
                            <span className={`text-[0.6rem] ${isDark ? 'text-white/20' : 'text-black/20'}`}>Real results, every time.</span>
                        </div>
                    </motion.div>

                    <div className="space-y-6">
                        {projects.map((project, i) => (
                            <motion.div
                                key={i}
                                onMouseEnter={() => setActiveIndex(i)}
                                className={`group relative py-2 block cursor-pointer transition-all duration-500 h-20 lg:h-28 flex items-center`}
                            >
                                <span className={`absolute -left-12 text-[0.8rem] font-bold text-[#F05E23] transition-opacity duration-500 ${activeIndex === i ? 'opacity-100' : 'opacity-0'}`}>
                                    {i + 1}
                                </span>
                                
                                <h3 className={`text-4xl sm:text-6xl lg:text-[6.5rem] font-black tracking-tight leading-none transition-all duration-700 ${activeIndex === i ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-white/5' : 'text-black/5')} group-hover:pl-4`}>
                                    {project.title}
                                </h3>

                                <motion.div 
                                    animate={{ height: activeIndex === i ? '100%' : '0px' }}
                                    className="absolute left-0 w-1 bg-[#F05E23]"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE: SELECTED PROJECT DETAILS (Friendly Layout) */}
                <div className={`w-full lg:w-[50%] h-full relative transition-all duration-1000 border-l ${isDark ? 'bg-[#0D0D14] border-white/5' : 'bg-white border-black/5'}`}>
                    
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full h-full flex flex-col p-8 sm:p-12 lg:p-20"
                        >
                            {/* TOP IMAGE */}
                            <div className="w-full aspect-video rounded-[1.5rem] overflow-hidden relative shadow-2xl mb-12 shrink-0 border border-white/5">
                                <Image
                                    src={projects[activeIndex].image}
                                    alt={projects[activeIndex].title}
                                    fill
                                    className="object-cover transition-all duration-[2s]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                
                                <div className="absolute bottom-10 left-10">
                                    <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">
                                        {projects[activeIndex].title}
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-[0.65rem] font-bold tracking-widest text-white uppercase">Project Complete</span>
                                    </div>
                                </div>
                            </div>

                            {/* BELOW: SIMPLE DETAILS */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="space-y-10">
                                    {/* Project Goal */}
                                    <div className="space-y-2">
                                        <span className="text-[0.7rem] font-bold text-[#F05E23] uppercase block mb-2">The Goal</span>
                                        <p className={`text-[1rem] lg:text-[1.1rem] font-semibold leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                            {projects[activeIndex].summary}
                                        </p>
                                    </div>

                                    {/* Results Highlights */}
                                    <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-[#F05E23]" />
                                                <span className="text-[0.7rem] font-bold text-neutral-400 uppercase">Process</span>
                                            </div>
                                            <span className={`text-[0.9rem] font-bold ${isDark ? 'text-white' : 'text-black'}`}>{projects[activeIndex].plan}</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Smile className="w-5 h-5 text-[#F05E23]" />
                                                <span className="text-[0.7rem] font-bold text-neutral-400 uppercase">Happiness</span>
                                            </div>
                                            <span className={`text-[0.9rem] font-bold ${isDark ? 'text-white' : 'text-black'}`}>Client Loved The Result</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Call to action */}
                                <div className="mt-auto flex items-end justify-between pt-12 border-t border-white/5">
                                    <div className="flex flex-wrap gap-4">
                                        {projects[activeIndex].results.map((res, idx) => (
                                            <div key={idx} className="px-4 py-1.5 rounded-full border border-[#F05E23]/20 bg-[#F05E23]/5">
                                                <span className={`text-[0.65rem] font-bold ${isDark ? 'text-orange-200' : 'text-orange-700'}`}>{res}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="flex items-center gap-4 group">
                                        <span className={`text-[0.7rem] font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-black'}`}>Learn More</span>
                                        <div className="w-14 h-14 rounded-full bg-[#F05E23] flex items-center justify-center text-white shadow-xl shadow-[#F05E23]/20 group-hover:scale-110 transition-transform">
                                            <ArrowUpRight strokeWidth={4} className="w-8 h-8" />
                                        </div>
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

        </section>
    );
}
