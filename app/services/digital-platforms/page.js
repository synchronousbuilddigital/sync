"use client";

import { motion } from "framer-motion";
import { Layout, ArrowRight, CheckCircle2, Shield, Zap, Sparkles, Cpu } from "lucide-react";
import Link from "next/link";
import CTA from "@/components/CTA";

export default function DigitalPlatformsPage() {
    return (
        <div className="flex flex-col items-center w-full min-h-screen relative overflow-hidden selection:bg-orange-500/20" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="absolute top-[5%] right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 opacity-10"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(150px)' }}
            ></div>
            
            <section className="w-full max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="flex flex-col items-start max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-4 py-2 bg-[#111] shadow-xl shadow-orange-500/10 rounded-full mb-10"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                        <span className="text-[0.65rem] font-black text-white tracking-[0.4em] uppercase">Ecosystem Engineering</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[4rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold tracking-tight leading-[0.9] text-[#111] mb-12"
                    >
                        Digital <br />
                        <span className="italic font-light text-slate-400">Platforms.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[1.2rem] md:text-[1.5rem] text-slate-500 font-medium max-w-3xl leading-relaxed border-l-4 border-[#F05E23] pl-10"
                    >
                        Architecting high-performance digital infrastructure where aesthetic precision meets high-velocity conversion. We build platforms for enterprise scale.
                    </motion.p>
                </div>
            </section>

            <section className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20">
                    <div className="space-y-12">
                        <h2 className="text-4xl font-bold text-[#111] tracking-tight">The Engine of Your Scale.</h2>
                        <p className="text-xl text-slate-500 leading-relaxed">
                            Our digital platforms are engineered for high-growth environments where security, speed, and conversion are the primary benchmarks of success.
                        </p>
                        
                        <div className="grid gap-6">
                            {[
                                { title: "Enterprise Web Systems", desc: "High-performance architecture built for mission-critical operations." },
                                { title: "Headless E-commerce", desc: "Omni-channel retail ecosystems that drive conversion across all touchpoints." },
                                { title: "Interactive SaaS Interfaces", desc: "Ultra-low-latency user experiences designed for software-centric brands." },
                                { title: "Scalable Data Dashboards", desc: "Real-time visualization and analytics engineered into the core UI." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 p-8 rounded-[2.5rem] bg-white border border-[rgba(0,0,0,0.04)] shadow-sm group hover:border-[#F05E23]/20 transition-all">
                                    <div className="w-12 h-12 rounded-2xl bg-[#FAFAF8] flex items-center justify-center text-[#F05E23] group-hover:bg-[#111] transition-colors">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-[#111] mb-2">{item.title}</h4>
                                        <p className="text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="sticky top-10 rounded-[3.5rem] bg-[#111] p-16 overflow-hidden h-full min-h-[500px] flex flex-col justify-between group shadow-2xl">
                             <div className="absolute top-0 right-0 w-80 h-80 bg-[#F05E23]/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
                             
                             <div className="relative z-10">
                                <Layout className="w-20 h-20 text-[#F05E23] mb-12" />
                                <h3 className="text-4xl font-bold text-white mb-8 leading-tight">Delivering High- <br /> <span className="text-[#F05E23] italic font-light">Performance ROI.</span></h3>
                                <p className="text-slate-400 text-lg">
                                    Our platform architecture is designed to eliminate technical debt while maximizing conversion velocity.
                                </p>
                             </div>

                             <Link href="/contact" className="relative z-10 flex items-center gap-4 text-white font-black uppercase tracking-[0.3em] text-[0.7rem] group-hover:text-[#F05E23] transition-colors mt-20">
                                Start Your Build
                                <ArrowRight className="w-4 h-4" />
                             </Link>
                        </div>
                    </div>
                </div>
            </section>

            <CTA />
        </div>
    );
}
