"use client";

import { motion } from "framer-motion";
import {
    Search,
    Compass,
    Cpu,
    Activity,
    ArrowUpRight,
    CheckCircle2,
    Zap,
    Shield,
    Users2,
    Target,
    ZapOff
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useChat } from "../../components/ChatContext";

const steps = [
    {
        id: "01",
        protocol: "PROTOCOL 01",
        subtitle: "Audience Intelligence",
        title: "Deep Discovery",
        desc: "We begin by dissecting your current market positioning and identifying the unique surgical advantages of your brand. We don't guess; we leverage data-backed audience intelligence to define your ideal path.",
        image: "/services/brand-architecture.png",
        accent: "#F05E23",
        tags: ["Market Analysis", "Competitor Research", "ICP Definition"]
    },
    {
        id: "02",
        protocol: "PROTOCOL 02",
        subtitle: "Architectural Blueprinting",
        title: "Growth Strategy",
        desc: "Precision engineering starts with a robust plan. We design a custom digital framework that integrates AI automation, brand narrative, and performance logic into a single cohesive growth engine.",
        image: "/services/ai-automation.png",
        accent: "#111",
        tags: ["Funnel Mapping", "AI Integration Plan", "Brand Alignment"]
    },
    {
        id: "03",
        protocol: "PROTOCOL 03",
        subtitle: "Building the Ecosystem",
        title: "High-Velocity Execution",
        desc: "Our technical arm deploys your digital ecosystem at scale. From high-performance interfaces to custom AI agents, we architect every component for maximum speed and conversion authority.",
        image: "/services/digital-ecosystems.png",
        accent: "#F05E23",
        tags: ["Full-Stack Dev", "UI/UX Orchestration", "Systems Integration"]
    },
    {
        id: "04",
        protocol: "PROTOCOL 04",
        subtitle: "Performance Scaling",
        title: "Continuous Pulse",
        desc: "Launch is just the beginning. We maintain a zero-waste policy, continuously split-testing variables and scaling only the high-performers to ensure your growth is compounding and verified.",
        image: "/services/growth-engineering.png",
        accent: "#111",
        tags: ["Data Analytics", "Performance Marketing", "ROI Optimization"]
    }
];

export default function ProcessPage() {
    const { sendMessage } = useChat();

    return (
        <main className="bg-[#FDFDFD] min-h-screen selection:bg-[#F05E23]/20 overflow-x-hidden">
            {/* Minimalist Grid Pattern */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: 'radial-gradient(#000 1.2px, transparent 1.2px)', backgroundSize: '48px 48px' }}></div>

            {/* Hero Section */}
            <section className="relative w-full pt-12 pb-16 md:pt-16 md:pb-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col items-start relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-100 rounded-full mb-10 shadow-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#F05E23] animate-pulse"></span>
                        <span className="text-[0.7rem] font-bold text-[#F05E23] tracking-[0.45em] uppercase">The Framework</span>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 w-full">
                        <motion.h1 
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold tracking-[-0.05em] text-[#111] leading-[0.85]"
                        >
                            How We <br />
                            <span className="text-[#F05E23]">Synchronize.</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="max-w-xl border-l-2 border-[#F05E23] pl-10 pb-4 text-lg md:text-xl text-slate-500 font-medium leading-relaxed italic"
                        >
                            "Our mission is to replace market guesswork with architectural precision. We follow a rigorous four-stage protocol designed to extract maximum value from every digital interaction."
                        </motion.p>
                    </div>
                </div>

                <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-[#F05E23]/5 rounded-full blur-[150px] -z-10 animate-ambient" />
            </section>

            {/* Protocol Phases Section - Tightened Space */}
            <section className="w-full px-6 pb-24 space-y-12 md:space-y-20 relative z-10">
                {steps.map((step, i) => (
                    <motion.div 
                        key={step.id}
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-5%" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-8 lg:gap-24"
                    >
                        {/* Visual Side */}
                        <div className={`lg:w-[45%] flex flex-col justify-start ${i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                            <div className="relative aspect-[16/10] w-full rounded-[3rem] overflow-hidden group shadow-2xl border border-slate-50 bg-slate-50">
                                <Image 
                                    src={step.image} 
                                    alt={step.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111]/40 to-transparent" />
                                
                                {/* Floating Badge */}
                                <div className="absolute top-8 left-8 p-5 backdrop-blur-3xl bg-white/80 border border-white rounded-[2rem] shadow-2xl flex flex-col items-center gap-1 group-hover:scale-110 transition-transform duration-700">
                                    <span className="text-[0.55rem] font-black text-[#F05E23] tracking-[0.4em] uppercase">{step.protocol}</span>
                                    <span className="text-3xl font-bold text-[#111] leading-none">{step.id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className={`lg:w-[55%] flex flex-col justify-center py-6 ${i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                            <div className="text-[0.6rem] font-black text-[#F05E23] tracking-[0.5em] uppercase mb-6 flex items-center gap-4">
                                <span className="w-10 h-[1px] bg-[#F05E23]/30"></span>
                                {step.subtitle}
                            </div>
                            <h2 
                                onClick={() => sendMessage(`Explain what the "${step.title}" process phase is and how it brings value and usefulness to my business.`)}
                                className="text-[3rem] md:text-[4.5rem] font-bold text-[#111] tracking-tighter leading-[0.95] mb-8 cursor-pointer hover:text-[#F05E23] transition-colors duration-300 hover:-translate-y-1">
                                {step.title}.
                            </h2>
                            <p className="text-[1.1rem] md:text-[1.2rem] text-slate-500 font-light leading-relaxed mb-10 max-w-2xl">
                                {step.desc}
                            </p>

                            <div className="flex flex-wrap gap-3 mb-10">
                                {step.tags.map((tag, tid) => (
                                    <div 
                                        key={tid} 
                                        onClick={() => sendMessage(`Explain what "${tag}" is and how this specific strategy brings value and usefulness to my business.`)}
                                        className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-100 text-[0.75rem] font-bold text-slate-500 hover:border-[#F05E23]/20 hover:text-[#F05E23] transition-all duration-300 cursor-pointer hover:scale-105 shadow-sm">
                                        <CheckCircle2 className="w-3 h-3 opacity-30" />
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Verification / Pulse Section - Surgical Dashboard */}
            <section className="w-full bg-[#111] py-24 md:py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                     style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div className="flex flex-col items-start">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full mb-10"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#F05E23] animate-pulse"></span>
                            <span className="text-[0.65rem] font-black text-[#F05E23] tracking-[0.45em] uppercase">Verification Protocol</span>
                        </motion.div>

                        <h2 className="text-[3.5rem] md:text-[5.5rem] font-bold text-white tracking-tighter leading-[0.9] mb-10">
                            Zero <span className="text-[#F05E23] italic font-light">Placeholders.</span> <br /> Pure Execution.
                        </h2>

                        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl mb-12">
                            Every step in our process is governed by a strict Verification Protocol. We don't ship "maybe" — we ship results that are architecturally sound and performance-guaranteed.
                        </p>

                        <div className="space-y-6 w-full max-w-md">
                            {[
                                { label: "High-Velocity Deployment Cycles", icon: Zap },
                                { label: "Automated Verification Gates", icon: Shield },
                                { label: "Direct Performance Analytics", icon: Activity }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-6 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-500">
                                    <div className="w-12 h-12 rounded-2xl bg-[#F05E23]/10 flex items-center justify-center text-[#F05E23]">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[1rem] font-bold text-white/90">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="rounded-[4rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-12 md:p-20 flex flex-col items-center text-center backdrop-blur-xl">
                            <div className="text-[0.7rem] font-black text-[#F05E23] uppercase tracking-[0.5em] mb-12">Current Efficiency Rating</div>
                            <div className="text-[8rem] md:text-[10rem] font-black text-white leading-none mb-4 tracking-tighter">98%</div>
                            <div className="text-slate-400 font-medium tracking-widest uppercase text-[0.6rem]">Architectural Accuracy</div>
                            
                            <div className="w-full h-px bg-white/10 my-12"></div>
                            
                            <Link 
                                href="/contact"
                                className="group relative px-12 py-6 rounded-full bg-[#F05E23] text-white font-black uppercase text-[0.75rem] tracking-[0.3em] overflow-hidden hover:scale-105 active:scale-95 transition-all duration-500"
                            >
                                <span className="relative z-10">Start Your Build</span>
                                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing Section / Availability */}
            <section className="w-full py-24 md:py-32 px-6 flex flex-col items-center text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#F05E23]/5 border border-[#F05E23]/10 rounded-full mb-12"
                >
                    <ZapOff className="w-4 h-4 text-[#F05E23]" />
                    <span className="text-[0.65rem] font-black text-[#F05E23] tracking-[0.4em] uppercase">Limited Availability</span>
                </motion.div>

                <h2 className="text-[3.5rem] md:text-[6rem] font-bold text-[#111] tracking-tighter leading-[0.9] mb-8">
                    Let's Build Your <br /> Brand <span className="text-[#F05E23]">Together.</span>
                </h2>
                <p className="text-xl text-slate-400 font-medium mb-16 max-w-2xl">
                    Join dozens of high-growth companies thriving with Synchronous Build Digital.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 relative z-50">
                    <Link 
                        href="/contact"
                        className="px-14 py-8 rounded-[2.5rem] bg-[#111] text-white font-black uppercase text-[0.8rem] tracking-[0.4em] hover:bg-[#F05E23] transition-all duration-500 shadow-2xl"
                    >
                        Book Consultation
                    </Link>
                    <Link 
                        href="/work"
                        className="px-14 py-8 rounded-[2.5rem] bg-white border border-slate-100 text-[#111] font-black uppercase text-[0.8rem] tracking-[0.4em] hover:border-[#F05E23]/20 hover:bg-slate-50 transition-all duration-500"
                    >
                        Start Your Project
                    </Link>
                </div>
            </section>
        </main>
    );
}
