"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Target, Zap, Shield, Rocket, Users2, Sparkles, Network, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "../../components/ThemeContext";
import { useChat } from "../../components/ChatContext";

const highlights = [
    {
        title: "Professional Branding",
        desc: "We create clear, professional brand designs that help you stand out and build a lasting impression.",
        accent: "#F05E23",
        bgHover: "rgba(240,94,35,0.05)"
    },
    {
        title: "AI & Automation",
        desc: "Use friendly AI assistants to handle everyday tasks so you and your team can focus on what matters most.",
        accent: "#F05E23",
        bgHover: "rgba(240,94,35,0.05)"
    },
    {
        title: "Smart Growth Plans",
        desc: "We create marketing plans based on real results to find your best customers and help you grow easily.",
        accent: "#F05E23",
        bgHover: "rgba(240,94,35,0.05)"
    },
    {
        title: "Quality Websites",
        desc: "We build fast, high-quality websites that work perfectly and help you turn visitors into customers.",
        accent: "#F05E23",
        bgHover: "rgba(240,94,35,0.05)"
    },
    {
        title: "Close Support",
        desc: "We work closely with you to help your business grow and reach new goals.",
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
    const { isDark } = useTheme();
    const { sendMessage } = useChat();

    return (
        <div className={`flex flex-col items-center w-full min-h-screen relative overflow-hidden pb-10 selection:bg-orange-500/20 transition-colors duration-700 ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#FAFAF8]'}`}>
            {/* Ambient background glows */}
            <div className={`absolute top-[5%] right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 transition-opacity duration-700 ${isDark ? 'opacity-[0.05]' : 'opacity-20'}`}
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(150px)' }}
            ></div>
            <div className={`absolute top-[20%] left-[-15%] w-[800px] h-[800px] rounded-full pointer-events-none z-0 transition-opacity duration-700 ${isDark ? 'opacity-[0.05]' : 'opacity-10'}`}
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(120px)' }}
            ></div>

            {/* Hero Section */}
            <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-10 sm:pb-16 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 sm:gap-8">
                    <div className="max-w-4xl flex flex-col items-start">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`inline-flex items-center gap-3 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-8 shadow-xl ${isDark ? 'bg-white/5 border border-white/10 shadow-orange-500/5' : 'bg-[#111] shadow-orange-500/10'}`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                            <span className="text-[0.6rem] sm:text-[0.65rem] font-black text-white tracking-[0.35em] sm:tracking-[0.4em] uppercase">The Vision</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-4 sm:mb-6 transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}
                        >
                            Synchronized <br />
                            <span className={`italic font-light transition-colors duration-500 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>Innovation.</span>
                        </motion.h1>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start justify-between border-l-4 border-[#F05E23] pl-4 sm:pl-8"
                >
                    <p className={`text-sm sm:text-base md:text-lg font-medium max-w-xl leading-relaxed transition-colors duration-500 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                        Synchronous helps businesses grow with fast websites, smart marketing, and easy-to-use AI tools. We work with you to build a professional brand that lasts.
                    </p>
                    <div className="flex items-center gap-4 text-[#F05E23] font-black uppercase text-[0.65rem] sm:text-[0.7rem] tracking-[0.4em] sm:tracking-[0.5em] pt-1 sm:pt-2 md:whitespace-nowrap">
                        ESTABLISHED 2026
                        <div className="w-12 sm:w-16 h-px bg-orange-500/30"></div>
                    </div>
                </motion.div>
            </section>

            {/* Premium Highlights Section */}
            <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-8 sm:mb-14"
                >
                    <div className={`inline-flex items-center gap-3 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 shadow-lg ${isDark ? 'bg-white/5 border border-white/10 shadow-orange-500/5' : 'bg-[#111] shadow-orange-500/10'}`}>
                        <span className="text-[0.6rem] sm:text-[0.65rem] font-bold text-white tracking-[0.3em] uppercase">Core Pillars</span>
                    </div>
                    <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.15] transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}>
                        Quality <span className="italic font-light text-[#F05E23]">Standards.</span>
                    </h2>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 items-start">

                    {/* Methodology Cards (Left side) */}
                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 relative z-10">
                        {highlights.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className={`group relative p-6 sm:p-8 lg:p-10 rounded-3xl sm:rounded-[2.5rem] border shadow-sm hover:shadow-[0_40px_100px_-20px_rgba(240,94,35,0.1)] transition-all duration-700 flex flex-col justify-between overflow-hidden hover:-translate-y-1 sm:hover:-translate-y-2 min-h-[16rem] sm:h-[22rem] ${
                                    isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-[rgba(0,0,0,0.04)]'
                                }`}
                                style={{ gridColumn: i === 4 ? "sm:col-span-2" : "auto" }}
                            >
                                {/* Hover Light Effect */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"
                                    style={{ background: `radial-gradient(circle at top right, ${h.bgHover}, transparent 70%)` }}
                                ></div>

                                {/* Floating Number */}
                                <div className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:bg-[#111] group-hover:text-[#F05E23] mb-6 sm:mb-8 ${
                                    isDark ? 'bg-white/5 border-white/10' : 'bg-[#FAFAF8] border-[rgba(0,0,0,0.04)]'
                                }`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></div>
                                </div>

                                <div className="relative z-10 flex-1 flex flex-col">
                                    <h4 
                                        onClick={() => sendMessage(`Explain the "${h.title}" core pillar and why it's important for my business.`)}
                                        className={`text-lg sm:text-xl lg:text-2xl font-bold tracking-tight mb-2 sm:mb-3 group-hover:text-[#F05E23] transition-colors duration-500 cursor-pointer ${
                                            isDark ? 'text-white' : 'text-[#111]'
                                        }`}>
                                        {h.title}.
                                    </h4>
                                    <p className={`text-xs sm:text-sm lg:text-base font-normal leading-relaxed transition-colors duration-700 ${
                                        isDark ? 'text-white/50 group-hover:text-white/80' : 'text-slate-500 group-hover:text-slate-700'
                                    }`}>
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
                        <div className="relative rounded-3xl sm:rounded-[3rem] bg-[#111] p-6 sm:p-10 lg:p-12 overflow-hidden flex flex-col transition-all duration-700 shadow-[0_40px_100px_-20px_rgba(240,94,35,0.3)] z-10 border border-orange-500/20 min-h-[22rem] lg:aspect-[4/5]">

                            <div className="absolute top-0 right-0 w-80 h-80 bg-[#F05E23]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>

                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 relative z-10 leading-[1.15] tracking-tight">
                                Delivering <br /> Your Next <br /> <span className="text-[#F05E23] italic font-light">Success.</span>
                            </h3>

                            <div className="grid grid-cols-2 gap-4 sm:gap-6 relative z-10 mt-auto">
                                {[
                                    { icon: Users2, label: "Identity", val: "Expert Design" },
                                    { icon: Sparkles, label: "Innovation", val: "AI Tools" },
                                    { icon: Network, label: "Execution", val: "Smart Growth" },
                                    { icon: Rocket, label: "Impact", val: "Real Results" }
                                ].map((stat, i) => (
                                    <div key={i}>
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-[#F05E23] mb-2 sm:mb-3 bg-white/5 border border-white/10 group-hover:bg-[#F05E23] group-hover:text-white transition-all duration-500">
                                            <stat.icon className="w-4 h-4" />
                                        </div>
                                        <div className="text-[0.55rem] font-black text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-1">{stat.label}</div>
                                        <div className="text-xs font-bold text-white tracking-tight">{stat.val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* Founder Section */}
            <section className={`w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-24 relative z-10 border-t ${isDark ? 'border-white/10' : 'border-[rgba(0,0,0,0.04)]'}`}>
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full max-w-md lg:max-w-none lg:w-1/2 relative group"
                    >
                        <div className="absolute inset-0 bg-[#F05E23] rounded-3xl sm:rounded-[2.5rem] rotate-3 group-hover:rotate-0 transition-transform duration-700 -z-10 opacity-10"></div>
                        <div className="relative aspect-[4/5] rounded-3xl sm:rounded-[2.5rem] bg-slate-200 overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                            <Image 
                                src="/WhatsApp Image 2026-04-02 at 2.15.21 PM.jpeg"
                                alt="Devam Srivastava - Founder & CEO"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className={`absolute bottom-4 right-4 sm:-bottom-6 sm:-right-6 p-4 sm:p-8 rounded-2xl shadow-xl border z-20 backdrop-blur-md ${
                            isDark ? 'bg-[#111]/90 border-white/10' : 'bg-white border-[rgba(0,0,0,0.04)]'
                        }`}>
                            <div className="text-[0.55rem] sm:text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-1">FOUNDER & CEO</div>
                            <div className={`text-base sm:text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#111]'}`}>Devam Srivastava</div>
                        </div>
                    </motion.div>

                    <div className="w-full lg:w-1/2 flex flex-col items-start">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-[#F05E23]/10 rounded-full mb-4 sm:mb-8"
                        >
                            <span className="text-[0.6rem] sm:text-[0.65rem] font-bold text-[#F05E23] tracking-[0.3em] uppercase">Our Founder</span>
                        </motion.div>

                        <motion.h3
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.15] mb-4 sm:mb-6 transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}
                        >
                            Defining the <br /> <span className="italic font-light text-[#F05E23]">Next Era</span> of Digital.
                        </motion.h3>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4 sm:space-y-6"
                        >
                            <p className={`text-sm sm:text-lg font-medium leading-relaxed max-w-xl transition-colors duration-500 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                                 &quot;Synchronous was built to help businesses grow easily by combining great design with fast technology. We don&apos;t just build websites; we build systems that help you succeed.&quot;
                            </p>
                            <div className="w-12 h-1 bg-[#F05E23]"></div>
                            <p className={`text-xs sm:text-base font-normal leading-relaxed max-w-xl transition-colors duration-500 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                                Guided by Devam&apos;s leadership, our mission is to help brands of all sizes use the same high-quality tools as the world&apos;s biggest companies, with designs made for real people.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className={`w-full py-12 sm:py-24 relative overflow-hidden border-y transition-colors duration-500 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[rgba(0,0,0,0.04)]'
            }`}>
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center">
                    <div className="w-16 h-px mx-auto mb-6 sm:mb-12 bg-gradient-to-r from-transparent via-[#F05E23] to-transparent"></div>
                    <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 tracking-tight leading-[1.15] italic font-light transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}>
                        The Bridge Between <br />
                        <span className="not-italic text-[#F05E23] block mt-2 sm:mt-3">Aesthetic & Performance.</span>
                    </h2>
                    <Link href="/process">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#111] dark:bg-white dark:text-[#111] text-white rounded-full text-[0.65rem] sm:text-[0.75rem] font-black uppercase tracking-[0.25em] shadow-xl shadow-orange-500/20 cursor-pointer group"
                        >
                            Learn our process
                            <ArrowUpRight className="w-4 h-4 text-[#F05E23] group-hover:rotate-45 transition-transform" />
                        </motion.div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
