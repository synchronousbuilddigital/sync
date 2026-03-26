"use client";

import { motion } from "framer-motion";
import { 
    Search, 
    Compass, 
    Cpu, 
    Activity, 
    ArrowRight, 
    CheckCircle2, 
    Plus,
    Zap,
    Shield,
    Users2
} from "lucide-react";
import Link from "next/link";

const steps = [
    {
        id: "01",
        title: "Deep Discovery",
        subtitle: "Audience Intelligence",
        desc: "We begin by dissecting your current market positioning and identifying the unique surgical advantages of your brand. We don't guess; we leverage data-backed audience intelligence to define your ideal path.",
        icon: Search,
        accent: "#F05E23",
        tags: ["Market Analysis", "Competitor Research", "ICP Definition"]
    },
    {
        id: "02",
        title: "Growth Strategy",
        subtitle: "Architectural Blueprinting",
        desc: "Precision engineering starts with a robust plan. We design a custom digital framework that integrates AI automation, brand narrative, and performance logic into a single cohesive growth engine.",
        icon: Compass,
        accent: "#111",
        tags: ["Funnel Mapping", "AI Integration Plan", "Brand Alignment"]
    },
    {
        id: "03",
        title: "High-Velocity Execution",
        subtitle: "Building the Ecosystem",
        desc: "Our technical arm deploys your digital ecosystem at scale. From high-performance interfaces to custom AI agents, we architect every component for maximum speed and conversion authority.",
        icon: Cpu,
        accent: "#F05E23",
        tags: ["Full-Stack Dev", "UI/UX Orchestration", "Systems Integration"]
    },
    {
        id: "04",
        title: "Continuous Pulse",
        subtitle: "Performance Scaling",
        desc: "Launch is just the beginning. We maintain a zero-waste policy, continuously split-testing variables and scaling only the high-performers to ensure your growth is compounding and verified.",
        icon: Activity,
        accent: "#111",
        tags: ["Data Analytics", "Performance Marketing", "ROI Optimization"]
    }
];

export default function ProcessPage() {
    return (
        <div className="flex flex-col items-center w-full min-h-screen relative overflow-hidden selection:bg-orange-500/20" style={{ backgroundColor: '#FAFAF8' }}>
            {/* Ambient background glows */}
            <div className="absolute top-[5%] right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 opacity-10"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(150px)' }}
            ></div>
            
            {/* Hero Section */}
            <section className="w-full max-w-[1400px] mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="flex flex-col items-start max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-4 py-2 bg-[#111] shadow-xl shadow-orange-500/10 rounded-full mb-10"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                        <span className="text-[0.65rem] font-black text-white tracking-[0.4em] uppercase">The Framework</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[4rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold tracking-tight leading-[0.9] text-[#111] mb-12"
                    >
                        How We <br />
                        <span className="italic font-light text-slate-400">Synchronize.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[1.2rem] md:text-[1.5rem] text-slate-500 font-medium max-w-3xl leading-relaxed border-l-4 border-[#F05E23] pl-10"
                    >
                        Our mission is to replace market guesswork with architectural precision. We follow a rigorous four-stage protocol designed to extract maximum value from every digital interaction.
                    </motion.p>
                </div>
            </section>

            {/* Process Steps */}
            <section className="w-full max-w-[1400px] mx-auto px-6 py-20 relative z-10">
                <div className="space-y-32">
                    {steps.map((step, i) => (
                        <motion.div 
                            key={step.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-32`}
                        >
                            {/* Step Image/Visual */}
                            <div className="w-full lg:w-1/2 relative group">
                                <div 
                                    className="absolute inset-0 rounded-[3rem] opacity-5 -rotate-3 group-hover:rotate-0 transition-transform duration-700 -z-10"
                                    style={{ backgroundColor: step.accent }}
                                ></div>
                                <div className="aspect-[4/3] rounded-[3rem] bg-white border border-[rgba(0,0,0,0.04)] shadow-sm overflow-hidden flex items-center justify-center p-12 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-orange-500/5 group-hover:-translate-y-2">
                                    <div className="relative">
                                        <div className="absolute inset-x-0 h-40 bg-gradient-to-t from-white to-transparent bottom-0 z-10"></div>
                                        <step.icon className="w-40 h-40 text-[#F05E23]/10" />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                            <div className="text-[10rem] font-bold text-[#111]/5 leading-none">{step.id}</div>
                                            <div className="h-1 w-20 bg-[#F05E23] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-300"></div>
                                        </div>
                                    </div>

                                    {/* Abstract Grid Background inside the visual block */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                                        style={{ backgroundImage: 'radial-gradient(#111 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                                    </div>
                                </div>

                                {/* Floating Stats/Badge for Step */}
                                <div className={`absolute ${i % 2 === 0 ? '-right-8' : '-left-8'} -bottom-8 bg-[#111] p-8 rounded-3xl shadow-2xl z-20 hidden md:block`}>
                                    <div className="text-[0.6rem] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">PROTOCOL {step.id}</div>
                                    <div className="text-xl font-bold text-white tracking-tight">{step.subtitle}</div>
                                </div>
                            </div>

                            {/* Step Text Content */}
                            <div className="w-full lg:w-1/2 flex flex-col items-start">
                                <div className="text-[5rem] lg:text-[7rem] font-black text-[#F05E23]/5 leading-none mb-4">{step.id}</div>
                                <h3 className="text-3xl lg:text-5xl font-bold text-[#111] mb-6 tracking-tight group-hover:text-[#F05E23] transition-colors">{step.title}</h3>
                                <p className="text-[1.1rem] lg:text-[1.3rem] text-slate-500 font-medium leading-relaxed mb-10">
                                    {step.desc}
                                </p>
                                
                                <div className="flex flex-wrap gap-3">
                                    {step.tags.map(tag => (
                                        <span key={tag} className="px-5 py-2 rounded-full border border-[rgba(0,0,0,0.06)] text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest bg-white">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Verification Section */}
            <section className="w-full py-32 mt-20 relative bg-[#111] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(100px)' }}
                ></div>
                
                <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="flex flex-col items-start">
                            <h2 className="text-[3rem] lg:text-[5rem] font-bold text-white mb-10 tracking-tight leading-[0.9]">
                                Zero <span className="text-[#F05E23] italic font-light">Placeholders.</span> <br /> Pure Execution.
                            </h2>
                            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl mb-12">
                                Every step in our process is governed by a strict Verification Protocol. We don't ship "maybe" — we ship results that are architecturally sound and performance-guaranteed.
                            </p>
                            
                            <div className="space-y-6">
                                {[
                                    { icon: Zap, label: "High-Velocity Deployment Cycles" },
                                    { icon: Shield, label: "Automated Verification Gates" },
                                    { icon: Users2, label: "Direct Performance Analytics" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 group">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F05E23] group-hover:bg-[#F05E23] group-hover:text-white transition-all">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-white font-bold tracking-tight">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="rounded-[4rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-16 flex flex-col items-center text-center">
                                <div className="text-[0.6rem] font-black text-[#F05E23] uppercase tracking-[0.5em] mb-12">Current Efficiency Rating</div>
                                <div className="text-[7rem] md:text-[9rem] font-black text-white leading-none mb-4">98%</div>
                                <div className="text-slate-400 font-medium tracking-widest uppercase text-xs">Architectural Accuracy</div>
                                
                                <div className="w-full h-px bg-white/10 my-12"></div>
                                
                                <a 
                                    href="https://wa.me/919161391566?text=I'd like to start my build process with Synchronous Build Digital." 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-10 py-5 bg-[#F05E23] text-white rounded-full text-[0.8rem] font-black uppercase tracking-[0.3em] shadow-xl shadow-orange-500/20 hover:scale-105 transition-transform"
                                >
                                    Start Your Build
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Bottom Label */}
            <div className="w-full py-10 flex justify-center border-t border-[rgba(0,0,0,0.04)]">
                <span className="text-[0.6rem] font-black text-slate-300 uppercase tracking-[0.6em]">Synchronous Build Digital — Growth Architecture 2026</span>
            </div>
        </div>
    );
}
