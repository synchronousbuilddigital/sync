"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

// Featured Projects Data
const projects = [
    {
        title: "BOXFOX",
        summary: "AI-integrated custom packaging platform and digital branding overhaul.",
        problem: "Needed modern custom packaging tools and marketing scale.",
        solution: "Rebuilt from scratch with integrated AI dynamic workflows.",
        results: ["40% ROI increase", "AI Generation", "High Conversions"],
        tags: ["Branding", "AI Design"],
        image: "/boxfox-mockup.png"
    },
    {
        title: "RYM Grenergy",
        summary: "Scalable energy management ecosystem with high-end data visualization.",
        problem: "Required advanced data visualization and grant strategy.",
        solution: "Architected AI agents and analytics that secured gov grants.",
        results: ["Secured Grants", "Scalable Tech", "Data Vision"],
        tags: ["Data", "AI Engines"],
        image: "/rym-mockup.png"
    },
    {
        title: "BWORTH",
        summary: "Unified FinTech dashboard and performance-driven growth campaigns.",
        problem: "Fragmented financial data and low conversion on ads.",
        solution: "Integrated real-time analytics with digital growth engineering.",
        results: ["Direct Market", "FinTech Scale", "Data Unity"],
        tags: ["FinTech", "Marketing"],
        image: "/bworth-mockup.png"
    },
    {
        title: "VEGA VRUDDHI",
        summary: "Agri-tech platform with AI-driven price prediction engines.",
        problem: "Limited reach and missing digital logistics infrastructure.",
        solution: "Direct farmer-to-market platform with AI price forecasting.",
        results: ["Market Access", "AI Forecasting", "25% Growth"],
        tags: ["Agri-Tech", "E-com"],
        image: "/vega-mockup.png"
    },
    {
        title: "CLOSETRUSH",
        summary: "Virtual try-on and personalized fashion discovery engine.",
        problem: "Luxury sector required a highly engaging, unique shopping UX.",
        solution: "Deployed virtual try-on tech and intelligent discovery APIs.",
        results: ["Low Returns", "High Retention", "Luxury UX"],
        tags: ["Retail", "UX/UI"],
        image: "/closet-mockup.png"
    }
];

export default function WorkShowcase() {
    return (
        <section className="w-full py-24 md:py-40 relative overflow-hidden bg-white">
            <div className="max-w-[1440px] mx-auto px-6 w-full mb-20 md:mb-28">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="max-w-3xl">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full mb-10 shadow-sm"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                            <span className="text-[0.65rem] font-bold text-slate-500 tracking-[0.4em] uppercase">Our Work</span>
                        </motion.div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold tracking-tighter text-[#111] leading-[0.9]"
                        >
                            Selected <em className="not-italic text-[#F05E23]">Cases.</em>
                        </motion.h2>
                    </div>
                </div>
            </div>

            {/* Auto Scrolling Projects Row proper with continuous motion */}
            <div className="relative w-full overflow-hidden">
                <div className="flex w-max animate-marquee-slow hover:[animation-play-state:paused] gap-10 md:gap-14 px-10">
                    {[...projects, ...projects].map((project, i) => (
                        <div
                            key={i}
                            className="w-[85vw] sm:w-[500px] md:w-[600px] lg:w-[750px] group relative flex flex-col bg-slate-50 rounded-[3rem] md:rounded-[5rem] border border-slate-100 overflow-hidden hover:bg-white hover:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.15)] transition-all duration-700 shrink-0"
                        >
                            {/* Shortened Content Overlay */}
                            <div className="relative aspect-[16/9.5] overflow-hidden">
                                <Image 
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[1200ms] group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111]/70 via-[#111]/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
                                
                                <div className="absolute top-10 right-10 z-20">
                                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#F05E23] group-hover:border-[#F05E23] transition-all duration-700 group-hover:rotate-45 shadow-2xl">
                                        <ArrowUpRight className="w-7 h-7 md:w-10 md:h-10" strokeWidth={1.5} />
                                    </div>
                                </div>

                                <div className="absolute bottom-10 left-10 right-10 z-20">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.tags.map((tag, idx) => (
                                            <span key={idx} className="text-[0.6rem] font-black tracking-widest uppercase px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/80 group-hover:text-white transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter leading-none mb-4 group-hover:text-[#F05E23] transition-colors">{project.title}</h3>
                                    <p className="text-white/60 text-sm md:text-xl font-light leading-tight max-w-xl group-hover:text-white/90 transition-colors uppercase tracking-widest">{project.summary}</p>
                                </div>
                            </div>

                            {/* Shortened Details Section */}
                            <div className="p-10 lg:p-14 border-t border-slate-100 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-[#F05E23]"></div>
                                            <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-[#F05E23]">The Core Solution</h4>
                                        </div>
                                        <p className="text-[1.05rem] text-slate-500 font-light leading-relaxed max-w-sm">{project.solution}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-slate-200 group-hover:bg-[#F05E23] transition-colors"></div>
                                            <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-slate-400">Execution Yield</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                                            {project.results.map((res, idx) => (
                                                <span key={idx} className="text-[0.85rem] font-bold text-slate-800">{res}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}
