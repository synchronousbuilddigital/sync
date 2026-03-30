"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Rocket, Sparkles, Send } from "lucide-react";
import { useState } from "react";

export default function CTA() {
    const [subValue, setSubValue] = useState("");

    return (
        <section className="w-full relative py-16 md:py-20 overflow-hidden bg-[#111]">
            {/* Background Texture & Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]"
                style={{ backgroundImage: 'radial-gradient(#fff 1.2px, transparent 1.2px)', backgroundSize: '32px 32px' }}></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F05E23] opacity-[0.08] blur-[150px] -z-10 animate-ambient"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                {/* Main CTA Unit */}
                <div className="flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-md shadow-xl"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                        <span className="text-[0.65rem] font-bold text-[#F05E23] tracking-[0.4em] uppercase">Limited Availability</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[2.5rem] sm:text-[4.5rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold tracking-tighter text-white leading-[0.9] mb-6"
                    >
                        Let's Build Your <br />
                        <span className="text-[#F05E23]">Brand Together.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-2xl font-light text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
                    >
                        Join dozens of high-growth companies thriving with Synchronous Build Digital.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <a
                            href="https://wa.me/919161391566?text=I'd like to book a consultation for my project."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group w-full sm:w-auto bg-[#F05E23] px-10 py-6 rounded-2xl shadow-xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 text-white font-black uppercase tracking-[0.2em] text-[0.7rem] flex items-center justify-center gap-4"
                        >
                            <Calendar className="w-4 h-4" />
                            Book Consultation
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>

                        <a
                            href="https://wa.me/919161391566?text=I'm interested in starting a new project with Synchronous Build Digital."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-full sm:w-auto bg-white/10 px-10 py-6 rounded-2xl border border-white/10 backdrop-blur-md text-white font-black uppercase tracking-[0.2em] text-[0.7rem] hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-4 group"
                        >
                            <Rocket className="w-4 h-4 group-hover:text-[#F05E23]" />
                            Start Your Project
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.6 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 }}
                        className="mt-8 text-[0.6rem] font-bold text-slate-500 tracking-[0.4em] uppercase"
                    >
                        No commitment required
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
