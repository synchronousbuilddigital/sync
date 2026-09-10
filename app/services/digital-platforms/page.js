"use client";

import { motion } from "framer-motion";
import { Layout, ArrowRight, CheckCircle2, Cpu, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useTheme } from "../../../components/ThemeContext";

export default function DigitalPlatformsPage() {
    const { isDark } = useTheme();

    return (
        <div className={`flex flex-col items-center w-full min-h-screen relative overflow-hidden transition-colors duration-500 selection:bg-orange-500/20 ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-[#FAFAF8] text-[#111]'}`}>
            {/* Ambient background glows */}
            <div className="absolute top-[5%] right-[-10%] w-[800px] h-[800px] rounded-full pointer-events-none z-0 opacity-10"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(150px)' }}
            ></div>

            {/* Hero Section */}
            <section className="w-full max-w-7xl mx-auto px-6 pt-4 sm:pt-6 pb-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7 flex flex-col items-start">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#111] shadow-lg shadow-orange-500/10 rounded-full mb-4"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#F05E23] animate-pulse"></span>
                            <span className="text-[0.65rem] font-extrabold text-white tracking-[0.3em] uppercase">Ecosystem Engineering</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-5 ${isDark ? 'text-white' : 'text-[#111]'}`}
                        >
                            Digital <span className="text-[#F05E23]">Platforms.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className={`text-base sm:text-lg font-normal max-w-2xl leading-relaxed border-l-4 border-[#F05E23] pl-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                        >
                            Architecting high-performance digital infrastructure where aesthetic precision meets high-velocity conversion. We build platforms for enterprise scale.
                        </motion.p>
                    </div>

                    {/* Right Action Hero Box */}
                    <div className="lg:col-span-5 flex flex-col gap-4 p-6 sm:p-8 rounded-3xl border bg-white/5 backdrop-blur-md border-neutral-500/15 shadow-xl">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-5 h-5 text-[#F05E23]" />
                            <span className="text-xs font-black uppercase tracking-widest text-[#F05E23]">Engineering Velocity</span>
                        </div>
                        <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Enterprise web infrastructure, headless e-commerce, and responsive mobile-first SaaS applications.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-between px-6 py-3.5 rounded-2xl bg-[#F05E23] text-white font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#F05E23]/20 mt-2"
                        >
                            <span>Start Your Platform Build</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Detailed Breakdown */}
            <section className="w-full max-w-7xl mx-auto px-6 py-10 sm:py-14 relative z-10">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3 ${isDark ? 'text-white' : 'text-[#111]'}`}>The Engine of Your Scale.</h2>
                            <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Our digital platforms are engineered for high-growth environments where security, speed, and conversion are the primary benchmarks of success.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {[
                                { title: "Enterprise Web Systems", desc: "High-performance architecture built for mission-critical operations." },
                                { title: "Headless E-commerce", desc: "Omni-channel retail ecosystems that drive conversion across all touchpoints." },
                                { title: "Interactive SaaS Interfaces", desc: "Ultra-low-latency user experiences designed for software-centric brands." },
                                { title: "Scalable Data Dashboards", desc: "Real-time visualization and analytics engineered into the core UI." }
                            ].map((item, i) => (
                                <div key={i} className={`flex gap-5 p-6 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:border-[#F05E23]/30' : 'bg-white border-slate-200 shadow-sm hover:border-[#F05E23]/30'}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-white/10 text-[#F05E23]' : 'bg-slate-100 text-[#F05E23]'}`}>
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-[#111]'}`}>{item.title}</h4>
                                        <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-24 rounded-3xl bg-[#111] p-8 sm:p-10 overflow-hidden flex flex-col justify-between shadow-2xl text-white min-h-[380px]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05E23]/20 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3"></div>

                            <div className="relative z-10 space-y-6">
                                <Layout className="w-12 h-12 text-[#F05E23]" />
                                <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                                    Delivering High- <br />
                                    <span className="text-[#F05E23] italic font-light">Performance ROI.</span>
                                </h3>
                                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                                    Our platform architecture is designed to eliminate technical debt while maximizing conversion velocity.
                                </p>
                            </div>

                            <Link href="/contact" className="relative z-10 flex items-center gap-3 text-white font-black uppercase tracking-[0.3em] text-[0.7rem] hover:text-[#F05E23] transition-colors mt-8">
                                Start Your Build
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
