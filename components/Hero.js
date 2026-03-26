"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from "react";
import { Sparkles, Zap, Target, Search, MousePointer2, BarChart3, Globe2, Rocket } from 'lucide-react';

export default function Hero() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Parallax values - subtle for a premium feel
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

    return (
        <section ref={containerRef} className="relative w-full min-h-[110vh] sm:min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center pt-32 sm:pt-40 pb-20 sm:pb-24 overflow-hidden">
            {/* Background Texture - Grid & Dots */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
                 style={{ backgroundImage: 'radial-gradient(#000 1.2px, transparent 1.2px)', backgroundSize: '32px 32px' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full flex flex-col items-center">
                
                <div className="relative w-full flex flex-col items-center">
                    
                    {/* Floating Marketing Cards - Scaled & Positioned for better responsiveness */}
                    <div className="absolute -top-32 sm:-top-24 left-0 lg:left-[2%] xl:left-[5%] z-20 opacity-40 lg:opacity-100 scale-[0.5] sm:scale-[0.7] lg:scale-100 pointer-events-none lg:pointer-events-auto">
                        <motion.div style={{ y: y1 }} className="relative">
                            <div className="w-52 h-36 bg-[#FFD700] rounded-2xl shadow-xl -rotate-12 absolute left-0 top-0 border-2 border-yellow-300">
                                <div className="p-5 flex flex-col h-full justify-between">
                                    <Rocket className="w-8 h-8 text-yellow-900" />
                                    <div className="text-yellow-900 font-black text-xl leading-none">Growth</div>
                                </div>
                            </div>
                            <div className="w-52 h-36 bg-[#1A1A1A] rounded-2xl shadow-2xl -rotate-6 absolute left-8 top-4 border border-slate-800">
                                <div className="p-5 flex flex-col h-full justify-between">
                                    <BarChart3 className="w-8 h-8 text-indigo-400" />
                                    <div className="text-white font-black text-xl leading-none tracking-tight">AI Insights</div>
                                </div>
                            </div>
                            <div className="w-52 h-36 bg-[#3B82F6] rounded-2xl shadow-2xl rotate-3 relative border border-blue-400">
                                <div className="p-5 flex flex-col h-full justify-between">
                                    <Globe2 className="w-8 h-8 text-white" />
                                    <div className="text-white font-black text-xl leading-none">Global</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* AI Boost Badge - Requested Addition - Responsive scale */}
                    <div className="absolute -top-36 sm:-top-20 right-0 sm:right-4 lg:right-5 z-40">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-indigo-600 rounded-full shadow-xl text-white border border-indigo-400/30"
                        >
                            <Sparkles className="w-4 h-4 text-indigo-100" />
                            <span className="font-bold text-[10px] sm:text-xs uppercase tracking-widest whitespace-nowrap">AI Boost</span>
                        </motion.button>
                    </div>

                    {/* Main Headline Body - Corrected scaling for Desktop & Phone */}
                    <div className="relative z-30 flex flex-col items-center w-full">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full flex flex-col items-center select-none"
                        >
                            {/* Line 1: Marketing + Toggle */}
                            <div className="flex items-center justify-center gap-3 sm:gap-6 mb-2 sm:mb-4 w-full">
                                <h1 className="text-[11vw] sm:text-[8vw] md:text-[6.5rem] lg:text-[7.5rem] xl:text-[8.5rem] font-bold text-[#111] leading-[0.9] tracking-[-0.04em]">
                                    Marketing
                                </h1>
                                <motion.div 
                                    className="w-12 h-6 sm:w-20 sm:h-10 lg:w-28 lg:h-14 bg-[#34C759] rounded-full p-1 flex items-center shadow-lg"
                                >
                                    <motion.div 
                                        animate={{ x: ["0%", "100%", "0%"] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-4 h-4 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-white rounded-full shadow-md"
                                        style={{ marginLeft: '2%' }}
                                    />
                                </motion.div>
                            </div>

                            {/* Line 2: that feels */}
                            <h2 className="text-[11vw] sm:text-[8vw] md:text-[6.5rem] lg:text-[7.5rem] xl:text-[8.5rem] font-bold text-[#111] leading-[0.9] tracking-[-0.04em]">
                                that feels
                            </h2>

                            {/* Line 3: effortless + Cursor */}
                            <div className="flex items-center justify-center relative mt-4 sm:mt-6">
                                <h1 className="text-[12vw] sm:text-[9.5vw] md:text-[7.5rem] lg:text-[8.5rem] xl:text-[9.5rem] font-bold text-[#F05E23] leading-[0.9] tracking-[-0.04em] whitespace-nowrap">
                                    effortless
                                </h1>
                                
                                <motion.div 
                                    className="absolute -bottom-6 -right-6 sm:-bottom-12 sm:right-[2%] z-50 drop-shadow-2xl"
                                    animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                >
                                    <MousePointer2 className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 fill-black stroke-white stroke-[2px]" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Description - Optimized font sizes */}
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-12 sm:mt-20 text-slate-500 text-sm sm:text-lg md:text-xl font-medium max-w-[90%] sm:max-w-xl mx-auto leading-relaxed md:leading-normal text-center"
                        >
                            Designed for modern marketing experiences that feel seamless from the first click up to final conversion.
                        </motion.p>

                        {/* CTA Unit - Refined widths */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="mt-10 sm:mt-16 w-full flex justify-center px-6"
                        >
                            <a 
                                href="https://wa.me/919161391566?text=I'd like to start scaling my business with Synchronous Build Digital." 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative group w-full sm:w-auto bg-[#111] px-10 sm:px-16 py-5 sm:py-6 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 text-center"
                            >
                                <span className="text-white font-bold text-sm sm:text-base tracking-tight relative z-10">Start Scaling Now</span>
                                <div className="absolute top-0 right-0 w-8 h-8 bg-[#F05E23] mask-triangle z-20"></div>
                            </a>
                        </motion.div>
                    </div>

                    {/* Right Floating Elements - Repositioned to prevent overlap */}
                    <div className="absolute top-1/2 right-0 lg:right-[2%] xl:right-[5%] -translate-y-1/2 z-20 opacity-30 lg:opacity-100 scale-[0.5] sm:scale-[0.7] lg:scale-100 pointer-events-none lg:pointer-events-auto">
                        <motion.div style={{ y: y3 }} className="space-y-8 flex flex-col items-end">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#111] rounded-2xl shadow-xl flex items-center justify-center rotate-12">
                                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 fill-yellow-400" />
                            </div>
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center rotate-[-8deg] border border-white/30 relative mr-8 sm:mr-12">
                                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-slate-900" />
                            </div>
                            <div className="w-24 h-16 sm:w-28 sm:h-20 bg-[#3B82F6] rounded-2xl shadow-2xl flex items-center justify-center rotate-6 border-b-4 border-blue-600">
                                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                            </div>
                        </motion.div>
                    </div>

                </div>

            </div>

            {/* Ambient Background Glows */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-indigo-50/50 rounded-full blur-[100px] -z-10" />
            <div className="absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-orange-50/20 rounded-full blur-[100px] -z-10" />
        </section>
    );
}
