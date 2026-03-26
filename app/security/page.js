"use client";

import { motion } from "framer-motion";
import { Shield, ArrowRight, CheckCircle2, Zap, Sparkles, Cpu, Lock, Network } from "lucide-react";
import Link from "next/link";
import CTA from "@/components/CTA";

export default function SecurityPage() {
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
                        <Shield className="w-3 h-3 text-[#F05E23]" />
                        <span className="text-[0.65rem] font-black text-white tracking-[0.4em] uppercase">Institutional Grade</span>
                    </motion.div>

                    <h1 className="text-[4rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold tracking-tight leading-[0.9] text-[#111] mb-12">
                        Security <br />
                        <span className="italic font-light text-slate-400">Protocols.</span>
                    </h1>

                    <p className="text-[1.2rem] md:text-[1.5rem] text-slate-500 font-medium max-w-3xl leading-relaxed border-l-4 border-[#F05E23] pl-10">
                        Our zero-vulnerability policy is backed by institutional-grade encryption and automated verification gates. We architect trust at Every layer of the ecosystem.
                    </p>
                </div>
            </section>

            <section className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20">
                    <div className="space-y-12">
                        <h2 className="text-4xl font-bold text-[#111] tracking-tight">The Three Layers of Sync Security.</h2>
                        <div className="space-y-10">
                            {[
                                { icon: Lock, title: "Data Isolation", desc: "Advanced sandboxing for every client environment to ensure zero cross-data contamination." },
                                { icon: Cpu, title: "Automated Pentesting", desc: "Rigorous automated penetration testing workflows built into our CI/CD pipelines." },
                                { icon: Network, title: "Neural Threat Detection", desc: "24/7 AI-driven monitoring to identify, isolate, and eliminate anomalies before they scale." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-8 group">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-[rgba(0,0,0,0.04)] shadow-sm flex items-center justify-center text-[#F05E23] group-hover:bg-[#111] transition-all duration-500">
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-2xl font-bold text-[#111] mb-3">{item.title}</h4>
                                        <p className="text-slate-500 leading-relaxed text-lg">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-[#111] rounded-[4rem] p-16 overflow-hidden sticky top-10 shadow-2xl border border-white/5">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-[#F05E23]/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                            <h3 className="text-3xl font-bold text-white mb-8 tracking-tight">Vulnerability Report 2026</h3>
                            <div className="space-y-8">
                                {[
                                    { label: "Uptime Protocol", val: "99.98%" },
                                    { label: "Data Integrity Rating", val: "10/10" },
                                    { label: "Response Velocity", val: "< 1ms" }
                                ].map((stat, i) => (
                                    <div key={i} className="flex flex-col gap-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                                            <span className="text-2xl font-black text-[#F05E23] tracking-tighter">{stat.val}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="w-[90%] h-full bg-[#F05E23] opacity-60"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CTA />
        </div>
    );
}
