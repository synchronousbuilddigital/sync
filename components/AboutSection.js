"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, Cpu, BarChart3, Layers, TrendingUp, Sparkles, Rocket, MousePointer2 } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const highlights = [
    { 
        title: "Strategic Brand Architecture", 
        desc: "Engineering SEO-optimized visual foundations that define market legacies.",
        icon: Sparkles,
        color: "bg-orange-500"
    },
    { 
        title: "AI & System Integration", 
        desc: "Deploying custom AI automation agents for scaled business operations.",
        icon: Cpu,
        color: "bg-indigo-500"
    },
    { 
        title: "Data-Driven SEO & Logic", 
        desc: "Eliminating guesswork through rigorous search intent and audience intelligence.",
        icon: BarChart3,
        color: "bg-blue-500"
    },
    { 
        title: "Enterprise Web Ecosystems", 
        desc: "Architecting scalable infrastructure and apps for high-velocity conversion.",
        icon: Layers,
        color: "bg-emerald-500"
    },
    { 
        title: "Scalable Growth Strategy", 
        desc: "Strategic marketing alignment expanding in synchronization with your evolution.",
        icon: TrendingUp,
        color: "bg-rose-500"
    }
];

export default function AboutSection() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const yParallax = useTransform(scrollYProgress, [0, 1], [0, -40]);

    return (
        <section ref={sectionRef} className="w-full py-24 sm:py-32 bg-white relative overflow-hidden">
            {/* Background Texture - Matches Hero */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
                 style={{ backgroundImage: 'radial-gradient(#000 1.2px, transparent 1.2px)', backgroundSize: '32px 32px' }}></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                <div className="flex flex-col lg:flex-row gap-20 items-start">
                    
                    {/* Left Side: Editorial Content */}
                    <div className="lg:w-1/2 flex flex-col pt-4">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 mb-8"
                        >
                            <div className="w-10 h-px bg-[#F05E23]"></div>
                            <span className="text-[0.65rem] font-bold text-[#F05E23] tracking-[0.4em] uppercase">Who We Are</span>
                        </motion.div>

                        <motion.h2 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-[3.2rem] sm:text-[4.5rem] md:text-[5.5rem] font-bold tracking-[-0.04em] text-[#111] leading-[0.9] mb-10"
                        >
                            Elite <span className="text-[#F05E23]">digital growth</span> and SEO marketing agency.
                        </motion.h2>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-[1.1rem] md:text-[1.3rem] text-slate-500 leading-relaxed max-w-xl font-medium"
                        >
                            Synchronous is a high-performance digital partner for scaling brands. We architect sustainable, high-velocity growth by fusing AI-driven automation, strategic enterprise branding, and precise, data-backed performance marketing.
                        </motion.p>

                        {/* Interactive Tags/Pills Area */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap gap-4 mt-12"
                        >
                            {["Digital Innovation", "AI Art", "Neural Architecture"].map((tag) => (
                                <div key={tag} className="px-5 py-2.5 bg-[#F9F9F9] border border-black/5 rounded-full shadow-sm text-[0.6rem] font-bold uppercase tracking-widest text-slate-600 hover:bg-white hover:border-[#F05E23] hover:text-[#F05E23] transition-all cursor-default">
                                    {tag}
                                </div>
                            ))}
                        </motion.div>

                        {/* Style Match Image: Neural Architecture */}
                        <motion.div 
                            style={{ y: yParallax }}
                            className="mt-20 relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden group shadow-2xl border border-black/5"
                        >
                            <Image 
                                src="/neural-marketing.png" 
                                alt="Marketing Intelligence" 
                                fill
                                className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <div className="absolute top-8 right-8 w-16 h-16 bg-[#F05E23] rounded-2xl flex items-center justify-center rotate-6 shadow-xl">
                                <Rocket className="w-8 h-8 text-white" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Key Highlights Matrix */}
                    <div className="lg:w-1/2 w-full">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-12"
                        >
                            <h3 className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.5em] whitespace-nowrap">Key Highlights</h3>
                            <div className="h-px w-full bg-black/5"></div>
                        </motion.div>

                        <div className="grid grid-cols-1 gap-6">
                            {highlights.map((item, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ x: 10 }}
                                    className="group relative flex items-start gap-6 p-8 rounded-[2rem] bg-[#F9F9F9] border border-black/5 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
                                >
                                    {/* Accent Background Glow */}
                                    <div className={`absolute -top-10 -right-10 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${item.color}`}></div>
                                    
                                    <div className="relative z-10 w-14 h-14 shrink-0 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-800 border border-black/5 group-hover:bg-[#111] group-hover:text-white group-hover:scale-110 transition-all duration-500">
                                        <item.icon className="w-7 h-7" />
                                    </div>

                                    <div className="relative z-10">
                                        <h4 className="text-xl font-bold text-[#111] mb-2 tracking-tight flex items-center gap-2">
                                            {item.title}
                                            <MousePointer2 className="w-4 h-4 text-[#F05E23] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h4>
                                        <p className="text-slate-500 text-[1.1rem] leading-relaxed font-medium">
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* Number Index Backdrop */}
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-8xl font-black text-black/[0.02] pointer-events-none select-none italic group-hover:text-black/[0.05] transition-colors">
                                        0{i + 1}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Style Match: AI Boost Banner */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="mt-12 p-8 rounded-[2rem] bg-[#111] text-white overflow-hidden relative group"
                        >
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-[#F05E23]">Synchronize Your Growth</div>
                                    <h4 className="text-2xl font-black tracking-tight">Ready to integrate AI systems?</h4>
                                </div>
                                <Link href="/contact" className="w-14 h-14 rounded-2xl bg-[#F05E23] flex items-center justify-center hover:scale-110 transition-transform">
                                    <Zap className="w-7 h-7 text-white fill-white" />
                                </Link>
                            </div>
                            {/* Abstract Neural Style Mesh */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none transition-transform group-hover:scale-110 duration-[2000ms]"
                                 style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                        </motion.div>
                    </div>

                </div>

            </div>
        </section>
    );
}
