"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from "react";
import { Sparkles, Zap, Target, Search, MousePointer2, BarChart3, Globe2, Rocket, ArrowRight } from 'lucide-react';
import Magnetic from './Magnetic';

// Floating Card Component for Reusability & Animation
// Floating Card Component with Reveal Logic
const FloatingCard = ({ children, className, services = [], delay = 0, isHovered, index }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ 
            opacity: 1, 
            scale: 1, 
            y: (isHovered && index !== undefined) ? (index * -25) : 0,
            x: (isHovered && index !== undefined) ? (index * 140) : 0,
            rotate: (isHovered && index !== undefined) 
                ? (index * 5 - 5) 
                : (index !== undefined ? [0, -12, -6, 3][index + 1] : undefined)
        }}
        transition={{ 
            duration: 0.7, 
            delay: isHovered ? 0 : delay, 
            ease: [0.23, 1, 0.32, 1] 
        }}
        className={`${className} cursor-pointer group/card overflow-hidden transition-shadow duration-500 hover:shadow-2xl hover:shadow-[#F05E23]/20`}
    >
        <div className="absolute inset-0 p-5 flex flex-col h-full justify-between z-10 bg-white/5 group-hover/card:bg-transparent transition-colors">
            {children}
        </div>
        
        {/* Revealed Services on Hover */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-[#0A0A0A]/95 p-4 flex flex-col justify-center gap-2 z-20"
        >
            <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse" />
                <div className="text-[9px] uppercase tracking-[0.2em] font-black text-white/40">Core Capability</div>
            </div>
            {services.map((service, i) => (
                <div key={i} className="flex items-center gap-2 group/item">
                    <div className="w-1 h-[1px] bg-[#F05E23]/30 group-hover/item:w-3 transition-all" />
                    <span className="text-white/90 font-bold text-[11px] tracking-tight">{service}</span>
                </div>
            ))}
        </motion.div>
    </motion.div>
);

export default function Hero() {
    const containerRef = useRef(null);
    const [stackHovered, setStackHovered] = useState(false);
    const [isEffortlessHovered, setIsEffortlessHovered] = useState(false);
    const [activeTheme, setActiveTheme] = useState('sync'); // sync, grow
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const cardData = [
        {
            title: "Scaling",
            icon: <Rocket className="w-8 h-8 text-yellow-900" />,
            bg: "bg-[#FFD700]",
            border: "border-yellow-300",
            text: "text-yellow-900",
            services: ["Market Arbitrage", "ROAS Optimization", "ROAS Logic"]
        },
        {
            title: "Precision",
            icon: <BarChart3 className="w-8 h-8 text-indigo-400" />,
            bg: "bg-[#111]",
            border: "border-slate-800",
            text: "text-white",
            services: ["Neural Predictons", "Surgical Data", "Equity Vectors"]
        },
        {
            title: "Infrastructure",
            icon: <Globe2 className="w-8 h-8 text-white" />,
            bg: "bg-[#3B82F6]",
            border: "border-blue-400",
            text: "text-white",
            services: ["Edge Architecture", "Global CDN", "Micro-Services"]
        }
    ];

    // Parallax values - subtle for a premium feel
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -250]);

    // Mouse movement parallax & Spotlight logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const spotlightX = useMotionValue(0);
    const spotlightY = useMotionValue(0);
    
    const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });
    const spotX = useSpring(spotlightX, { stiffness: 50, damping: 20 });
    const spotY = useSpring(spotlightY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const x = (clientX / innerWidth - 0.5) * 40;
            const y = (clientY / innerHeight - 0.5) * 40;
            mouseX.set(x);
            mouseY.set(y);
            spotlightX.set(clientX);
            spotlightY.set(clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY, spotlightX, spotlightY]);

    return (
        <section ref={containerRef} className="relative w-full min-h-[90vh] bg-[#F9F9F9] flex flex-col items-center justify-center pt-24 sm:pt-32 pb-10 sm:pb-16 overflow-hidden group/hero">
            
            {/* Interactive Spotlight Cursor Overlay */}
            <motion.div 
                className="pointer-events-none fixed inset-0 z-50 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-1000"
                style={{
                    background: useTransform(
                        [spotX, spotY],
                        ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(240, 94, 35, 0.05), transparent 80%)`
                    )
                }}
            />

            {/* Background Texture - Grid & Dots */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
                 style={{ backgroundImage: 'radial-gradient(#000 1.2px, transparent 1.2px)', backgroundSize: '48px 48px' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full flex flex-col items-center">
                
                <div className="relative w-full flex flex-col items-center">
                    
                    {/* Floating Marketing Cards - Scaled & Positioned for better responsiveness */}
                    <div 
                        className="absolute -top-32 sm:-top-24 left-0 lg:left-[2%] xl:left-[5%] z-20 opacity-40 lg:opacity-100 scale-[0.5] sm:scale-[0.7] lg:scale-100 pointer-events-none lg:pointer-events-auto"
                        onMouseEnter={() => setStackHovered(true)}
                        onMouseLeave={() => setStackHovered(false)}
                    >
                        <motion.div style={{ y: y1, x: useTransform(springX, x => x * -1.5) }} className="relative h-[200px] w-[300px]">
                            {cardData.map((card, index) => (
                                <FloatingCard 
                                    key={card.title}
                                    index={index}
                                    isHovered={stackHovered}
                                    delay={0.2 + index * 0.2} 
                                    services={card.services}
                                    className={`w-52 h-36 rounded-2xl shadow-2xl absolute border ${card.bg} ${card.border}`}
                                    style={{ 
                                        left: stackHovered ? index * 40 : index * 32,
                                        top: stackHovered ? index * 10 : index * 8,
                                        zIndex: index + 10 
                                    }}
                                >
                                    <div className="flex flex-col h-full justify-between">
                                        {card.icon}
                                        <div className={`${card.text} font-black text-xl leading-none tracking-tight`}>
                                            {card.title}
                                        </div>
                                    </div>
                                </FloatingCard>
                            ))}
                        </motion.div>
                    </div>

                    {/* AI Boost Badge - Premium Addition */}
                    <div className="absolute -top-36 sm:-top-20 right-0 sm:right-4 lg:right-5 z-40">
                        <Magnetic>
                            <motion.button 
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1 }}
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -15px rgba(79, 70, 229, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 bg-indigo-600 rounded-full shadow-2xl text-white border border-indigo-400/30"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                >
                                    <Sparkles className="w-5 h-5 text-indigo-100" />
                                </motion.div>
                                <span className="font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] whitespace-nowrap">AI Boost Active</span>
                            </motion.button>
                        </Magnetic>
                    </div>

                    {/* Main Headline Body - Corrected scaling for Desktop & Phone */}
                    <div className="relative z-30 flex flex-col items-center w-full">
                        <div className="w-full flex flex-col items-center select-none">
                            {/* Line 1: Marketing + Toggle */}
                            <motion.div 
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="flex items-center justify-center gap-2 sm:gap-6 w-full"
                            >
                                <h1 className="text-[10vw] sm:text-[7vw] md:text-[6rem] lg:text-[7.5rem] xl:text-[8.5rem] font-bold text-[#111] leading-[0.85] tracking-[-0.05em]">
                                    Marketing
                                </h1>
                                <Magnetic>
                                    <motion.button 
                                        onClick={() => setActiveTheme(prev => prev === 'sync' ? 'grow' : 'sync')}
                                        className="w-16 h-8 sm:w-24 sm:h-12 lg:w-36 lg:h-16 bg-white border-2 border-black/5 rounded-full p-1.5 flex items-center shadow-inner relative group"
                                    >
                                        <motion.div 
                                            animate={{ x: activeTheme === 'sync' ? '0%' : '150%' }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            className="w-5 h-5 sm:w-9 sm:h-9 lg:w-13 lg:h-13 bg-[#F05E23] rounded-full shadow-lg flex items-center justify-center"
                                        >
                                            <Zap className="w-3 h-3 sm:w-5 sm:h-5 text-white fill-white" />
                                        </motion.div>
                                        <div className="absolute inset-0 flex items-center justify-around px-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <div className="w-1 h-1 rounded-full bg-black"></div>
                                            <div className="w-1 h-1 rounded-full bg-black"></div>
                                        </div>
                                    </motion.button>
                                </Magnetic>
                            </motion.div>

                            {/* Line 2: that feels */}
                            <motion.h2 
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="text-[10vw] sm:text-[7vw] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7.5rem] font-bold text-[#111] leading-[0.9] tracking-[-0.04em]"
                            >
                                that feels
                            </motion.h2>

                            {/* Line 3: effortless + Cursor */}
                            <div className="flex items-center justify-center relative mt-[-2px] sm:mt-0">
                                <motion.h1 
                                    onMouseEnter={() => setIsEffortlessHovered(true)}
                                    onMouseLeave={() => setIsEffortlessHovered(false)}
                                    animate={{ 
                                        letterSpacing: isEffortlessHovered ? "0.05em" : "-0.05em",
                                        scale: isEffortlessHovered ? 1.02 : 1
                                    }}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ 
                                        opacity: 1, 
                                        y: 0,
                                        transition: { duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
                                    }}
                                    className="text-[11vw] sm:text-[9vw] md:text-[7rem] lg:text-[8.5rem] xl:text-[10rem] font-black text-[#F05E23] leading-[0.85] tracking-[-0.05em] whitespace-nowrap transition-all duration-500 drop-shadow-[0_20px_50px_rgba(240,94,35,0.15)] overflow-visible"
                                >
                                    effortless
                                </motion.h1>
                                
                                <motion.div 
                                    className="absolute -bottom-8 -right-8 sm:-bottom-16 sm:-right-8 z-50 drop-shadow-2xl pointer-events-none"
                                    animate={{ 
                                        x: isEffortlessHovered ? [0, -40, 0] : [0, -20, 0], 
                                        y: isEffortlessHovered ? [0, -20, 0] : [0, -10, 0],
                                        rotate: isEffortlessHovered ? [0, 45, 0] : 0
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <MousePointer2 className="w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 fill-black stroke-white stroke-[2px]" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Description - Optimized font sizes */}
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="mt-4 sm:mt-6 text-slate-500 text-sm sm:text-lg md:text-xl font-medium max-w-[90%] sm:max-w-xl mx-auto leading-relaxed md:leading-normal text-center"
                        >
                            Designed for modern marketing experiences that feel seamless from the first click up to final conversion.
                        </motion.p>

                        {/* CTA Unit - Refined widths */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="mt-8 sm:mt-12 w-full flex justify-center px-6 relative z-50"
                        >
                            <Magnetic>
                                <a 
                                    href="https://wa.me/919161391566?text=I'd like to start scaling my business with Synchronous Build Digital." 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative group overflow-hidden bg-[#111] px-12 sm:px-16 py-6 sm:py-7 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all active:scale-95 text-center flex items-center justify-center border border-white/10"
                                >
                                    <div className="text-white font-black text-base sm:text-lg tracking-[0.1em] uppercase relative z-10 flex items-center justify-center gap-4">
                                        Start Your Acquisition Cycle
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />
                                    </div>
                                    <div className="absolute inset-0 bg-[#F05E23] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16, 1, 0.3, 1]"></div>
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 mask-triangle z-20 group-hover:scale-125 transition-transform duration-700"></div>
                                </a>
                            </Magnetic>
                        </motion.div>
                    </div>

                    {/* Right Decorative Orbitals - Enhanced Interactivity */}
                    <div className="absolute top-1/2 right-0 lg:right-[2%] xl:right-[5%] -translate-y-1/2 z-20 opacity-30 lg:opacity-100 scale-[0.5] sm:scale-[0.7] lg:scale-100 pointer-events-none lg:pointer-events-auto">
                        <motion.div style={{ y: y3, x: useTransform(springX, x => x * 1.2), rotate: useTransform(springX, x => x * 0.1) }} className="space-y-10 flex flex-col items-end">
                            <Magnetic>
                                <FloatingCard delay={0.8} className="w-16 h-16 sm:w-24 sm:h-24 bg-[#0A0A0A] rounded-3xl shadow-2xl flex items-center justify-center rotate-12 border border-white/5 hover:border-[#F05E23]/30 transition-colors">
                                    <Zap className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400 fill-yellow-400" />
                                </FloatingCard>
                            </Magnetic>
                            <Magnetic>
                                <FloatingCard delay={1.0} className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-3xl shadow-2xl flex items-center justify-center rotate-[-8deg] border border-black/5 relative mr-12 sm:mr-16">
                                    <Target className="w-8 h-8 sm:w-12 sm:h-12 text-slate-800" />
                                    <div className="absolute inset-0 border border-black/5 rounded-3xl animate-ping opacity-10"></div>
                                </FloatingCard>
                            </Magnetic>
                            <Magnetic>
                                <FloatingCard delay={1.2} className="w-24 h-16 sm:w-32 sm:h-24 bg-[#3B82F6] rounded-3xl shadow-2xl flex items-center justify-center rotate-6 border-b-8 border-blue-700 hover:translate-y-1 transition-transform">
                                    <Search className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                                </FloatingCard>
                            </Magnetic>
                        </motion.div>
                    </div>

                </div>

            </div>

            {/* Premium Ambient Fluid Background Orbs */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.25, 0.15],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                    backgroundColor: activeTheme === 'sync' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(240, 94, 35, 0.1)'
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full blur-[120px] -z-10" 
            />
            <motion.div 
                 animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.2, 0.1],
                    x: [0, -60, 0],
                    y: [0, 40, 0],
                    backgroundColor: activeTheme === 'sync' ? 'rgba(240, 94, 35, 0.1)' : 'rgba(79, 70, 229, 0.1)'
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-15%] w-[500px] h-[500px] rounded-full blur-[120px] -z-10" 
            />
            
            {/* Fine Grain Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-10 mix-blend-overlay"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
            ></div>
        </section>
    );
}
