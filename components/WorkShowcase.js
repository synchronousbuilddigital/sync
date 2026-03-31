"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { useTheme } from './ThemeContext';

// Featured Projects Data
const projects = [
    {
        title: "BOXFOX",
        summary: "AI-integrated custom packaging platform and 3D design ecosystem.",
        problem: "Needed modern custom packaging tools and automated ordering workflows.",
        solution: "Engineered a 3D AI-based design engine with direct-to-order manufacturing integration.",
        results: ["3D AI Design", "Custom Packaging", "Order Automation"],
        tags: ["Branding", "AI Tech"],
        image: "/website ss/boxfox.png"
    },
    {
        title: "RYM Grenergy",
        summary: "Clean energy ecosystems driven by smart AI and IoT automation.",
        problem: "Required intelligent energy auditing and smart grid infrastructure.",
        solution: "Built smart systems with AI-based inverters and IoT-driven storage automation.",
        results: ["Smart Inverters", "IoT Automation", "Clean Energy"],
        tags: ["Clean Energy", "AI IoT"],
        image: "/website ss/RYM.png"
    },
    {
        title: "Vegavruddhi",
        summary: "Field-level sales execution and operational growth platform.",
        problem: "Fragmented field teams and missing digital-to-offline lead fulfillment.",
        solution: "Managed sales architecture with real-time retail audits and campaign activation.",
        results: ["Sales Growth", "Field Accuracy", "Retail Audits"],
        tags: ["Sales Ops", "Market Growth"],
        image: "/website ss/vega.png"
    },
    {
        title: "BWorth",
        summary: "Sustainable circular fashion marketplace powered by coin rewards.",
        problem: "Low resale engagement and high textile waste in the fashion sector.",
        solution: "Circular economy app for apparel resale with integrated BWorth Coin ecosystem.",
        results: ["Sustainable Tech", "Eco-Rewards", "Circular Fashion"],
        tags: ["Eco-Tech", "Marketplace"],
        image: "/website ss/bworth.png"
    },
    {
        title: "Fashquick",
        summary: "Wear it. Flaunt it. Return it. — Affordable fashion rentals starting at ₹50/day.",
        problem: "Expensive luxury purchases and excessive closet waste.",
        solution: "Gen-Z focused rental model offering premium outfits at highly affordable daily rates.",
        results: ["Fashion Rental", "Shared Wardrobe", "₹50/Day Access"],
        tags: ["Rental Tech", "Gen-Z"],
        image: "/website ss/fashquick.png"
    }
];

// Double projects for infinite-feeling loop
const allProjects = [...projects, ...projects, ...projects];

export default function WorkShowcase() {
    const { isDark } = useTheme();
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(0);
    const resumeTimerRef = useRef(null);

    // Manual Scroll Logic
    const scroll = (direction) => {
        setIsPaused(true);
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);

        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            const target = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({
                left: target,
                behavior: 'smooth'
            });
        }

        // Scroll resume timer removed to keep carousel stopped after manual interaction
    };

    // Initial Position setup (one-time)
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        // Ensure we wait for layout
        const initScroll = () => {
            const singleSetWidth = scrollContainer.scrollWidth / 3;
            if (singleSetWidth > 0) {
                scrollContainer.scrollLeft = singleSetWidth;
            }
        };

        // Small timeout to ensure content is measured after layout
        const timer = setTimeout(initScroll, 100);
        return () => clearTimeout(timer);
    }, []);

    // Smooth Infinite Loop Animation Loop
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrameId;
        let lastTime = 0;

        const animate = (time) => {
            if (!isPaused && !isDragging) {
                const deltaTime = time - lastTime;
                if (deltaTime > 16) { // ~60fps throttle
                    const singleSetWidth = scrollContainer.scrollWidth / 3;

                    // Infinite wrap-around logic
                    if (scrollContainer.scrollLeft <= 0) {
                        scrollContainer.scrollLeft = singleSetWidth;
                    } else if (scrollContainer.scrollLeft >= singleSetWidth * 2) {
                        scrollContainer.scrollLeft = singleSetWidth;
                    }

                    scrollContainer.scrollLeft -= 1.2; // Precise speed (left-to-right)
                    lastTime = time;
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, isDragging]);

    // Horizontal Wheel & Smooth Auto-scroll pausing
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const handleWheel = (e) => {
            // Only pause if the user is intentionally scrolling horizontally with their wheel
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                setIsPaused(true);
                if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
                // Auto-resume removed to keep carousel stopped after horizontal wheel usage
            }
        };

        scrollContainer.addEventListener('wheel', handleWheel, { passive: true });
        return () => scrollContainer.removeEventListener('wheel', handleWheel);
    }, []);

    return (
        <section className={`w-full pt-16 md:pt-24 pb-12 md:pb-16 relative overflow-hidden transition-colors duration-700 selection:bg-[#F05E23]/20 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
            <div className="max-w-[1440px] mx-auto px-6 w-full mb-8 md:mb-12">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`inline-flex items-center gap-3 px-4 py-2 border rounded-full mb-6 shadow-sm transition-colors duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                            <span className={`text-[0.65rem] font-black tracking-[0.4em] uppercase transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Showcase v4.2</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] font-bold tracking-tighter leading-[0.9] transition-colors duration-700 ${isDark ? 'text-white' : 'text-[#111]'}`}
                        >
                            Selected <em className="not-italic text-[#F05E23]">Cases.</em>
                        </motion.h2>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex gap-4 md:mb-4">
                        <button
                            onClick={() => scroll('left')}
                            className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 group shadow-md active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-white/40 hover:bg-[#F05E23] hover:text-white hover:border-[#F05E23]' : 'bg-white border-slate-200 text-slate-400 hover:bg-[#F05E23] hover:text-white hover:border-[#F05E23]'}`}
                        >
                            <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 group shadow-md active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-white/40 hover:bg-[#F05E23] hover:text-white hover:border-[#F05E23]' : 'bg-white border-slate-200 text-slate-400 hover:bg-[#F05E23] hover:text-white hover:border-[#F05E23]'}`}
                        >
                            <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrolling Projects Container */}
            <div
                className="relative w-full"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div
                    ref={scrollRef}
                    className="flex items-stretch overflow-x-hidden scrollbar-hide gap-6 px-6 md:px-12 pb-10 no-scrollbar touch-pan-x pointer-events-auto"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {allProjects.map((project, i) => (
                        <div
                            key={i}
                            className={`w-[85vw] sm:w-[450px] md:w-[480px] lg:w-[520px] group relative flex flex-col rounded-[3rem] border overflow-hidden hover:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.1)] transition-all duration-700 shrink-0 select-none ${isDark ? 'bg-[#111] border-white/5 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.5)]' : 'bg-white border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]'}`}
                        >
                            {/* Card Content Overlay */}
                            <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[1200ms] group-hover:scale-105"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t from-[#111]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                                <div className="absolute top-8 right-8 z-20">
                                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] bg-white/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#F05E23] group-hover:border-[#F05E23] transition-all duration-700 group-hover:rotate-45 shadow-2xl`}>
                                        <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2} />
                                    </div>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className={`p-6 lg:p-8 relative flex-grow flex flex-col transition-colors duration-500 ${isDark ? 'bg-[#111]' : 'bg-white'}`}>
                                <div className="mb-6">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags.map((tag, idx) => (
                                            <span key={idx} className={`text-[0.55rem] font-bold tracking-[0.2em] uppercase px-3 py-1 border rounded-lg transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10 text-white/40 group-hover:text-[#F05E23] group-hover:border-[#F05E23]/30 group-hover:bg-[#F05E23]/5' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-[#F05E23] group-hover:border-[#F05E23]/30 group-hover:bg-[#F05E23]/5'}`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className={`text-2xl md:text-3xl font-black tracking-tighter leading-tight mb-2 group-hover:text-[#F05E23] transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}>
                                        {project.title}
                                    </h3>
                                    <p className={`text-[0.7rem] md:text-[0.75rem] font-bold leading-relaxed max-w-sm uppercase tracking-[0.1em] transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                                        {project.summary}
                                    </p>
                                </div>

                                <div className={`mt-auto pt-6 border-t transition-colors duration-500 ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></div>
                                                <h4 className="text-[0.6rem] font-black uppercase tracking-[0.4em] text-[#F05E23]">Solution</h4>
                                            </div>
                                            <p className={`text-[0.8rem] font-medium leading-relaxed transition-colors duration-500 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{project.solution}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${isDark ? 'bg-white/20 group-hover:bg-[#F05E23]' : 'bg-slate-200 group-hover:bg-[#F05E23]'}`}></div>
                                                <h4 className={`text-[0.6rem] font-black uppercase tracking-[0.4em] transition-colors duration-500 ${isDark ? 'text-white/20' : 'text-slate-400'}`}>Yield</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                {project.results.map((res, idx) => (
                                                    <span key={idx} className={`text-[0.7rem] font-bold tracking-tight transition-colors duration-500 ${isDark ? 'text-white/80' : 'text-slate-800'}`}>{res}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Final spacer */}
                    <div className="shrink-0 w-12 md:w-24 h-full"></div>
                </div>

                {/* Floating Navigation Arrows (Side Overlay) */}
                <div className="hidden xl:flex absolute inset-y-0 left-0 items-center pl-8 pointer-events-none group/left">
                    <button
                        onClick={() => scroll('left')}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl pointer-events-auto opacity-0 group-hover/left:opacity-100 -translate-x-10 group-hover/left:translate-x-0 ${isDark ? 'bg-[#111]/80 backdrop-blur-xl border-white/5 text-white/40 hover:text-white hover:bg-[#F05E23] hover:border-[#F05E23]' : 'bg-white/80 backdrop-blur-xl border border-slate-100 text-slate-400 hover:bg-[#F05E23] hover:text-white hover:border-[#F05E23]'}`}
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                </div>
                <div className="hidden xl:flex absolute inset-y-0 right-0 items-center pr-8 pointer-events-none group/right">
                    <button
                        onClick={() => scroll('right')}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl pointer-events-auto opacity-0 group-hover/right:opacity-100 translate-x-10 group-hover/right:translate-x-0 ${isDark ? 'bg-[#111]/80 backdrop-blur-xl border-white/5 text-white/40 hover:text-white hover:bg-[#F05E23] hover:border-[#F05E23]' : 'bg-white/80 backdrop-blur-xl border border-slate-100 text-slate-400 hover:bg-[#F05E23] hover:text-white hover:border-[#F05E23]'}`}
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

        </section>
    );
}
