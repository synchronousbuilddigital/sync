"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Target, Zap, Shield, Rocket, Users2, Sparkles, Network, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useChat } from "../../components/ChatContext";

const highlights = [
    {
        title: "Brand Identity Architecture",
        desc: "We engineer market-defining identities that translate complex visions into commanding visual and verbal legacies.",
        accent: "#F05E23",
        bgHover: "rgba(240,94,35,0.05)"
    },
    {
        title: "Autonomous Systems Integration",
        desc: "Deploying custom AI agents and intelligent automation to future-proof your core digital operations.",
        accent: "#F05E23",
        bgHover: "rgba(240,94,35,0.05)"
    },
    {
        title: "Data-Backed Growth Logic",
        desc: "Eliminating market guesswork through rigorous audience intelligence and surgical performance tracking.",
        accent: "#F05E23",
        bgHover: "rgba(240,94,35,0.05)"
    },
    {
        title: "High-Performance Ecosystems",
        desc: "Architecting scalable digital infrastructure where aesthetic precision meets high-velocity conversion.",
        accent: "#F05E23",
        bgHover: "rgba(240,94,35,0.05)"
    },
    {
        title: "Strategic Partnerships",
        desc: "Operating as your technical and marketing arm, scaling in synchronization with your business evolution.",
        accent: "#F05E23",
        bgHover: "rgba(240,94,35,0.05)"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

export default function AboutPage() {
    const { sendMessage } = useChat();
    return (
        <div className="flex flex-col items-center w-full min-h-screen relative overflow-hidden pb-10 selection:bg-orange-500/20" style={{ backgroundColor: '#FAFAF8' }}>
            {/* Ambient background glows */}
            <div className="absolute top-[5%] right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 opacity-20"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(150px)' }}
            ></div>
            <div className="absolute top-[20%] left-[-15%] w-[800px] h-[800px] rounded-full pointer-events-none z-0 opacity-10"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(120px)' }}
            ></div>

            {/* Hero Section */}
            <section className="w-full max-w-[1400px] mx-auto px-6 pt-12 pb-20 relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between gap-12">
                    <div className="max-w-5xl flex flex-col items-start">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-[#111] shadow-xl shadow-orange-500/10 rounded-full mb-10"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                            <span className="text-[0.65rem] font-black text-white tracking-[0.4em] uppercase">The Vision</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[4rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold tracking-tight leading-[0.9] text-[#111] mb-12"
                        >
                            Synchronized <br />
                            <span className="italic font-light text-slate-400">Innovation.</span>
                        </motion.h1>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row gap-12 items-start justify-between border-l-4 border-[#F05E23] pl-10"
                >
                    <p className="text-[1.2rem] md:text-[1.5rem] text-slate-500 font-medium max-w-3xl leading-relaxed">
                        Synchronous is a high-performance digital partner for brands that demand precision. We architect identities from the ground up and scale them through a rigorous fusion of AI automation, strategic branding, and data-driven performance marketing.
                    </p>
                    <div className="flex items-center gap-4 text-[#F05E23] font-black uppercase text-[0.7rem] tracking-[0.5em] pt-4 md:whitespace-nowrap">
                        ESTABLISHED 2026
                        <div className="w-16 h-px bg-orange-100"></div>
                    </div>
                </motion.div>
            </section>

            {/* Premium Highlights Section */}
            <section className="w-full max-w-[1400px] mx-auto px-6 py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-20"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#111] rounded-full mb-8 shadow-lg shadow-orange-500/10">
                        <span className="text-[0.65rem] font-bold text-white tracking-[0.3em] uppercase">Core Pillars</span>
                    </div>
                    <h2 className="text-[3.5rem] lg:text-[5.5rem] font-bold text-[#111] tracking-tight leading-[1]">
                        Architectural <span className="italic font-light text-[#F05E23]">Growth.</span>
                    </h2>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-10 items-start">

                    {/* Methodology Cards (Left side) */}
                    <div className="lg:col-span-8 grid sm:grid-cols-2 gap-8 relative z-10">
                        {highlights.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="group relative p-10 lg:p-12 rounded-[3rem] bg-white border border-[rgba(0,0,0,0.04)] shadow-sm hover:shadow-[0_40px_100px_-20px_rgba(240,94,35,0.1)] transition-all duration-700 flex flex-col justify-between overflow-hidden hover:-translate-y-2 h-[24rem]"
                                style={{ gridColumn: i === 4 ? "sm:col-span-2" : "auto" }}
                            >
                                {/* Hover Light Effect */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"
                                    style={{ background: `radial-gradient(circle at top right, ${h.bgHover}, transparent 70%)` }}
                                ></div>

                                {/* Floating Number */}
                                <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#FAFAF8] border border-[rgba(0,0,0,0.04)] flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:bg-[#111] group-hover:text-[#F05E23] mb-10"
                                >
                                    <span className="font-bold text-slate-300 group-hover:text-[#F05E23] transition-colors">0{i + 1}</span>
                                </div>

                                <div className="relative z-10 flex-1 flex flex-col">
                                    <h4 
                                        onClick={() => sendMessage(`Explain the "${h.title}" core pillar and why it's important for my business.`)}
                                        className="text-[1.5rem] lg:text-[1.8rem] font-bold text-[#111] tracking-tight mb-4 group-hover:text-[#F05E23] transition-colors duration-500 cursor-pointer">
                                        {h.title}.
                                    </h4>
                                    <p className="text-[1.1rem] text-slate-500 font-normal leading-relaxed group-hover:text-slate-700 transition-colors duration-700">
                                        {h.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Framework Box */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="lg:col-span-4 sticky top-10"
                    >
                        <div className="relative aspect-square lg:aspect-[4/5] rounded-[4rem] bg-[#111] p-12 lg:p-16 overflow-hidden flex flex-col transition-all duration-700 shadow-[0_40px_100px_-20px_rgba(240,94,35,0.3)] z-10 border border-orange-500/20">

                            <div className="absolute top-0 right-0 w-80 h-80 bg-[#F05E23]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>

                            <h3 className="text-4xl font-bold text-white mb-12 relative z-10 leading-[1.1] tracking-tight">
                                Delivering <br /> The Unfair <br /> <span className="text-[#F05E23] italic font-light">Advantage.</span>
                            </h3>

                            <div className="grid grid-cols-2 gap-8 relative z-10 mt-auto">
                                {[
                                    { icon: Users2, label: "Identity", val: "Branding Core" },
                                    { icon: Sparkles, label: "Innovation", val: "AI Systems" },
                                    { icon: Network, label: "Execution", val: "Scale Logic" },
                                    { icon: Rocket, label: "Impact", val: "Growth ROI" }
                                ].map((stat, i) => (
                                    <div key={i}>
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#F05E23] mb-4 bg-white/5 border border-white/10 group-hover:bg-[#F05E23] group-hover:text-white transition-all duration-500">
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-[0.6rem] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">{stat.label}</div>
                                        <div className="text-[0.95rem] font-bold text-white tracking-tight">{stat.val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </section>
            {/* Founder Section */}
            <section className="w-full max-w-[1400px] mx-auto px-6 py-32 relative z-10 border-t border-[rgba(0,0,0,0.04)]">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 relative group"
                    >
                        <div className="absolute inset-0 bg-[#F05E23] rounded-[3rem] rotate-3 group-hover:rotate-0 transition-transform duration-700 -z-10 opacity-10"></div>
                        <div className="relative aspect-[4/5] rounded-[3rem] bg-slate-200 overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                            <Image 
                                src="/WhatsApp Image 2026-04-02 at 2.15.21 PM.jpeg"
                                alt="Devam Srivastava - Founder & CEO"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-8 -right-8 bg-white p-10 rounded-3xl shadow-xl border border-[rgba(0,0,0,0.04)] z-20">
                            <div className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">FOUNDER & CEO</div>
                            <div className="text-2xl font-bold text-[#111] tracking-tight">Devam Srivastava</div>
                        </div>
                    </motion.div>

                    <div className="lg:w-1/2 flex flex-col items-start">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-[#F05E23]/10 rounded-full mb-10"
                        >
                            <span className="text-[0.65rem] font-bold text-[#F05E23] tracking-[0.3em] uppercase">The Visionary Force</span>
                        </motion.div>

                        <motion.h3
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-[3rem] lg:text-[4.5rem] font-bold text-[#111] tracking-tight leading-[1] mb-12"
                        >
                            Defining the <br /> <span className="italic font-light text-[#F05E23]">Next Era</span> of Digital.
                        </motion.h3>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="space-y-8"
                        >
                            <p className="text-[1.2rem] text-slate-500 font-medium leading-relaxed max-w-xl">
                                "Synchronous was built on a singular vision: to bridge the gap between creative storytelling and technical precision. We don't just build websites; we architect growth ecosystems that operate with surgical accuracy."
                            </p>
                            <div className="w-16 h-1 bg-[#F05E23]"></div>
                            <p className="text-[1.1rem] text-slate-400 font-normal leading-relaxed max-w-xl">
                                Guided by Devam's leadership, our mission is to empower brands with the same high-velocity digital tools used by industry titans, democratizing deep-tech innovation through human-centric design.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="w-full py-32 relative overflow-hidden bg-white border-y border-[rgba(0,0,0,0.04)]">
                <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                    <div className="w-20 h-px mx-auto mb-16 bg-gradient-to-r from-transparent via-[#F05E23] to-transparent"></div>
                    <h2 className="text-[3rem] md:text-[5.5rem] lg:text-[7.5rem] font-bold text-[#111] mb-12 tracking-tighter leading-[0.9] italic font-light">
                        The Bridge Between <br />
                        <span className="not-italic text-[#F05E23] block mt-6">Aesthetic & Performance.</span>
                    </h2>
                    <Link href="/process">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-4 px-10 py-5 bg-[#111] text-white rounded-full text-[0.8rem] font-black uppercase tracking-[0.3em] shadow-2xl shadow-orange-500/20 cursor-pointer group"
                        >
                            Learn our process
                            <ArrowUpRight className="w-5 h-5 text-[#F05E23] group-hover:rotate-45 transition-transform" />
                        </motion.div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
