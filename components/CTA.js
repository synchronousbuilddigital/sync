"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Rocket, ArrowRight } from "lucide-react";
import { useTheme } from './ThemeContext';

export default function CTA() {
    const { isDark } = useTheme();
    const pathname = usePathname();
    const [subValue, setSubValue] = useState("");

    const isDashboardRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/intern');

    if (isDashboardRoute) return null;

    return (
        <section className={`w-full relative py-20 sm:py-32 overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
            {/* Background Texture & Glows */}
            <div className={`absolute inset-0 z-0 pointer-events-none opacity-[0.05] transition-colors duration-700`}
                style={{ backgroundImage: `radial-gradient(${isDark ? '#fff' : '#000'} 1.2px, transparent 1.2px)`, backgroundSize: '32px 32px' }}></div>

            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[800px] h-[300px] sm:h-[800px] bg-[#F05E23] opacity-[0.08] blur-[80px] sm:blur-[150px] -z-10 animate-ambient`}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                {/* Wrapped CTA Card for High Contrast in both modes */}
                <div className={`relative flex flex-col items-center p-8 sm:p-16 md:p-20 rounded-[2.5rem] sm:rounded-[4rem] transition-all duration-700 border ${isDark ? 'bg-[#111] border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)]' : 'bg-[#111] border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.2)]'}`}>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 border border-white/10 rounded-full mb-6 sm:mb-8 backdrop-blur-md shadow-xl"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                        <span className="text-[0.6rem] sm:text-[0.65rem] font-bold text-[#F05E23] tracking-[0.3em] sm:tracking-[0.4em] uppercase">Limited Availability</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[clamp(2.2rem,11vw,7.2rem)] font-black tracking-tighter text-white leading-[0.95] mb-6 sm:mb-8"
                    >
                        Let's Build Your <br />
                        <span className="text-[#F05E23]">Brand Together.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-base sm:text-lg md:text-2xl font-medium text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-12 uppercase tracking-wide px-4"
                    >
                        Join dozens of high-growth companies thriving with Synchronous Build Digital.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                    >
                        <a
                            href="https://wa.me/919161391566?text=I'd like to book a consultation for my project."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group w-full sm:w-auto bg-[#F05E23] px-8 sm:px-12 py-6 sm:py-8 rounded-2xl shadow-2xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 text-white font-black uppercase tracking-[0.2em] text-[0.7rem] sm:text-[0.75rem] flex items-center justify-center gap-4"
                        >
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                            Book Consultation
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                        </a>

                        <a
                            href="https://wa.me/919161391566?text=I'm interested in starting a new project with Synchronous Build Digital."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-full sm:w-auto bg-white/5 px-8 sm:px-12 py-6 sm:py-8 rounded-2xl border border-white/10 backdrop-blur-md text-white font-black uppercase tracking-[0.2em] text-[0.7rem] sm:text-[0.75rem] hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-4 group"
                        >
                            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-[#F05E23] group-hover:scale-110 transition-transform" />
                            Start Your Project
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.4 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 }}
                        className="mt-10 sm:mt-12 text-[0.55rem] sm:text-[0.6rem] font-bold text-slate-500 tracking-[0.3em] sm:tracking-[0.4em] uppercase px-4"
                    >
                        No commitment required • Surgical Precision Guaranteed
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

