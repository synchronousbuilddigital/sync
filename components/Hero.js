"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect } from "react";
import { Sparkles, Zap, Target, Search, MousePointer2, BarChart3, Globe2, Rocket } from 'lucide-react';
import Magnetic from './Magnetic';

// Floating Card Component for Reusability & Animation
const FloatingCard = ({ children, className, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
            duration: 1, 
            delay, 
            ease: [0.16, 1, 0.3, 1] 
        }}
        className={className}
    >
        {children}
    </motion.div>
);

export default function Hero() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Parallax values - subtle for a premium feel
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -250]);

    // Mouse movement parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const x = (clientX / innerWidth - 0.5) * 40;
            const y = (clientY / innerHeight - 0.5) * 40;
            mouseX.set(x);
            mouseY.set(y);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <section ref={containerRef} className="relative w-full min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center pt-24 sm:pt-32 pb-20 sm:pb-28 overflow-hidden">
            {/* Background Texture - Grid & Dots */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
                 style={{ backgroundImage: 'radial-gradient(#000 1.2px, transparent 1.2px)', backgroundSize: '32px 32px' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full flex flex-col items-center">
                
                <div className="relative w-full flex flex-col items-center">
                    
                    {/* Floating Marketing Cards - Scaled & Positioned for better responsiveness */}
                    <div className="absolute -top-32 sm:-top-24 left-0 lg:left-[2%] xl:left-[5%] z-20 opacity-40 lg:opacity-100 scale-[0.5] sm:scale-[0.7] lg:scale-100 pointer-events-none lg:pointer-events-auto">
                        <motion.div style={{ y: y1, x: useTransform(springX, x => x * -1.5) }} className="relative">
                            <FloatingCard delay={0.2} className="w-52 h-36 bg-[#FFD700] rounded-2xl shadow-xl -rotate-12 absolute left-0 top-0 border-2 border-yellow-300">
                                <div className="p-5 flex flex-col h-full justify-between">
                                    <Rocket className="w-8 h-8 text-yellow-900" />
                                    <div className="text-yellow-900 font-black text-xl leading-none">Growth</div>
                                </div>
                            </FloatingCard>
                            <FloatingCard delay={0.4} className="w-52 h-36 bg-[#1A1A1A] rounded-2xl shadow-2xl -rotate-6 absolute left-8 top-4 border border-slate-800">
                                <div className="p-5 flex flex-col h-full justify-between">
                                    <BarChart3 className="w-8 h-8 text-indigo-400" />
                                    <div className="text-white font-black text-xl leading-none tracking-tight">AI Insights</div>
                                </div>
                            </FloatingCard>
                            <FloatingCard delay={0.6} className="w-52 h-36 bg-[#3B82F6] rounded-2xl shadow-2xl rotate-3 relative border border-blue-400">
                                <div className="p-5 flex flex-col h-full justify-between">
                                    <Globe2 className="w-8 h-8 text-white" />
                                    <div className="text-white font-black text-xl leading-none">Global</div>
                                </div>
                            </FloatingCard>
                        </motion.div>
                    </div>

                    {/* AI Boost Badge - Requested Addition - Responsive scale */}
                    <div className="absolute -top-36 sm:-top-20 right-0 sm:right-4 lg:right-5 z-40">
                        <Magnetic>
                            <motion.button 
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-indigo-600 rounded-full shadow-xl text-white border border-indigo-400/30"
                            >
                                <Sparkles className="w-4 h-4 text-indigo-100" />
                                <span className="font-bold text-[10px] sm:text-xs uppercase tracking-widest whitespace-nowrap">AI Boost</span>
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
                                className="flex items-center justify-center gap-2 sm:gap-4 w-full"
                            >
                                <h1 className="text-[10vw] sm:text-[7vw] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7.5rem] font-bold text-[#111] leading-[0.9] tracking-[-0.04em]">
                                    Marketing
                                </h1>
                                <motion.div 
                                    className="w-12 h-6 sm:w-20 sm:h-10 lg:w-28 lg:h-14 bg-[#F05E23] rounded-full p-1 flex items-center shadow-lg"
                                >
                                    <motion.div 
                                        animate={{ x: ["0%", "100%", "0%"] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-4 h-4 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-white rounded-full shadow-md"
                                        style={{ marginLeft: '2%' }}
                                    />
                                </motion.div>
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
                            <div className="flex items-center justify-center relative mt-[-4px] sm:mt-0">
                                <motion.h1 
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-[11vw] sm:text-[8.5vw] md:text-[6.5rem] lg:text-[7.5rem] xl:text-[8.5rem] font-bold text-[#F05E23] leading-[0.9] tracking-[-0.04em] whitespace-nowrap"
                                >
                                    effortless
                                </motion.h1>
                                
                                <motion.div 
                                    className="absolute -bottom-6 -right-6 sm:-bottom-12 sm:right-[2%] z-50 drop-shadow-2xl pointer-events-none"
                                    animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                >
                                    <MousePointer2 className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 fill-black stroke-white stroke-[2px]" />
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
                            className="mt-6 sm:mt-8 w-full flex justify-center px-6 relative z-50"
                        >
                            <Magnetic>
                                <a 
                                    href="https://wa.me/919161391566?text=I'd like to start scaling my business with Synchronous Build Digital." 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative group overflow-hidden bg-[#F05E23] px-10 sm:px-14 py-5 sm:py-6 rounded-2xl shadow-[0_20px_40px_-12px_rgba(240,94,35,0.4)] transition-all active:scale-95 text-center flex items-center justify-center"
                                >
                                    <span className="text-white font-black text-base sm:text-lg tracking-tight relative z-10 flex items-center justify-center gap-2">
                                        Start Scaling Now
                                        <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </span>
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-[#111] mask-triangle z-20 opacity-90 group-hover:scale-110 transition-transform"></div>
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                </a>
                            </Magnetic>
                        </motion.div>
                    </div>

                    {/* Right Floating Elements - Repositioned to prevent overlap */}
                    <div className="absolute top-1/2 right-0 lg:right-[2%] xl:right-[5%] -translate-y-1/2 z-20 opacity-30 lg:opacity-100 scale-[0.5] sm:scale-[0.7] lg:scale-100 pointer-events-none lg:pointer-events-auto">
                        <motion.div style={{ y: y3, x: useTransform(springX, x => x * 1.2), rotate: useTransform(springX, x => x * 0.1) }} className="space-y-8 flex flex-col items-end">
                            <FloatingCard delay={0.8} className="w-16 h-16 sm:w-20 sm:h-20 bg-[#111] rounded-2xl shadow-xl flex items-center justify-center rotate-12">
                                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 fill-yellow-400" />
                            </FloatingCard>
                            <FloatingCard delay={1.0} className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center rotate-[-8deg] border border-white/30 relative mr-8 sm:mr-12">
                                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-slate-900" />
                            </FloatingCard>
                            <FloatingCard delay={1.2} className="w-24 h-16 sm:w-28 sm:h-20 bg-[#3B82F6] rounded-2xl shadow-2xl flex items-center justify-center rotate-6 border-b-4 border-blue-600">
                                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                            </FloatingCard>
                        </motion.div>
                    </div>

                </div>

            </div>

            {/* Ambient Background Glows */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 20, 0],
                    y: [0, -20, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-indigo-500/10 rounded-full blur-[100px] -z-10" 
            />
            <motion.div 
                 animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                    x: [0, -30, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] -z-10" 
            />
        </section>
    );
}
