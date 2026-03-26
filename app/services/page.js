"use client";

import { Fingerprint, BarChart3, Cpu, Layout, ArrowRight, CheckCircle2, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const serviceCategories = [
    {
        id: "01",
        title: "Brand Architecture",
        icon: <Fingerprint className="w-8 h-8" />,
        desc: "We don't just design logos; we engineer visual and verbal identities that command market authority. Establish a premium presence that builds long-term brand equity.",
        services: ["Visual Identity System", "Strategic Brand Positioning", "Verbal Identity & Messaging", "Premium Packaging Design"],
        image: "/services/brand-architecture.png",
        accent: "from-orange-500/20",
        href: "/services/brand-systems"
    },
    {
        id: "02",
        title: "Digital Ecosystems",
        icon: <Layout className="w-8 h-8" />,
        desc: "Architecting high-performance digital infrastructure. We build scalable platforms where supreme aesthetic precision meets rigorous, high-conversion engineering.",
        services: ["Enterprise Web Platforms", "High-Conversion E-commerce", "Interactive Web Applications", "Custom SaaS Interfaces"],
        image: "/services/digital-ecosystems.png",
        accent: "from-orange-600/20",
        href: "/services/digital-platforms"
    },
    {
        id: "03",
        title: "Growth Engineering",
        icon: <BarChart3 className="w-8 h-8" />,
        desc: "Transforming attention into revenue. We execute data-backed, precision-targeted campaigns designed to drive exponential growth and measurable ROI.",
        services: ["Performance Advertising", "SEO & Search Dominance", "Strategic Content Architecture", "Growth Analytics & Audits"],
        image: "/services/growth-engineering.png",
        accent: "from-orange-700/20",
        href: "/services/growth-engine"
    },
    {
        id: "04",
        title: "AI & Automation",
        icon: <Cpu className="w-8 h-8" />,
        desc: "Integrating autonomous intelligence into your operations. Deploy custom AI agents and workflows that revolutionize efficiency and user engagement.",
        services: ["Custom AI Chatbots", "Generative AI Systems", "Intelligent Process Automation", "Neural Search Integration"],
        image: "/services/ai-automation.png",
        accent: "from-orange-500/30",
        href: "/services/ai-automation"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
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

export default function ServicesPage() {
    return (
        <div className="flex flex-col items-center selection:bg-orange-500/20 w-full relative overflow-hidden" style={{ backgroundColor: '#FAFAF8' }}>
            {/* Ambient Backgrounds */}
            <div className="absolute top-0 right-0 w-[1000px] h-[1000px] rounded-full -z-10 -translate-y-1/2 translate-x-1/2 opacity-20"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(120px)' }}
            ></div>
            <div className="absolute top-[40%] left-[-20%] w-[800px] h-[800px] rounded-full -z-10 opacity-10"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(100px)' }}
            ></div>

            {/* Hero Section */}
            <section className="w-full max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row items-end justify-between gap-12"
                >
                    <div className="max-w-4xl flex flex-col items-start">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#111] shadow-xl shadow-orange-500/10 rounded-full mb-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23]"></span>
                            <span className="text-[0.65rem] font-black text-white tracking-[0.4em] uppercase">Architecture</span>
                        </div>

                        <h1 className="text-[3.5rem] sm:text-[4.5rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold tracking-tight leading-[0.9] text-[#111]">
                            What We <span className="text-[#F05E23]">Build.</span> <br />
                            <span className="italic font-light text-slate-400">Synchronized.</span>
                        </h1>
                    </div>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-sm border-l-4 border-[#F05E23] pl-8 pb-4">
                        We engineer elite digital infrastructure where aesthetic precision meets relentless technical engineering.
                    </p>
                </motion.div>
            </section>

            {/* Detailed Services Content */}
            <section className="w-full max-w-[1400px] mx-auto px-6 py-14 mb-32 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 gap-20 lg:gap-32"
                >
                    {serviceCategories.map((cat, i) => (
                        <Link
                            key={cat.id}
                            href={cat.href}
                            className="block"
                        >
                            <motion.div
                                variants={itemVariants}
                                className={`group relative flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-stretch bg-white rounded-[3rem] md:rounded-[4rem] border border-[rgba(0,0,0,0.04)] shadow-[0_4px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_100px_-20px_rgba(240,94,35,0.1)] hover:border-[#F05E23]/20 transition-all duration-700 overflow-hidden`}
                            >
                                {/* Visual Side */}
                                <div className="w-full lg:w-[48%] relative aspect-[4/3] lg:aspect-auto overflow-hidden bg-slate-50">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.accent} to-transparent opacity-30 mix-blend-multiply z-10 group-hover:opacity-50 transition-opacity duration-700`}></div>
                                    <Image
                                        src={cat.image}
                                        alt={cat.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>

                                    {/* Float ID */}
                                    <div className="absolute top-10 left-10 z-20">
                                        <span className="text-[0.7rem] font-black tracking-[0.4em] px-5 py-2.5 bg-white/90 backdrop-blur-xl rounded-2xl text-[#111] shadow-xl border border-white">
                                            PHASE {cat.id}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="relative z-10 flex flex-col flex-1 p-10 sm:p-14 lg:p-24 justify-center">
                                    <div className="w-20 h-20 rounded-[2.5rem] bg-[#FAFAF8] border border-[rgba(0,0,0,0.04)] flex items-center justify-center text-slate-400 mb-12 shadow-sm group-hover:bg-[#111] group-hover:text-[#F05E23] group-hover:scale-110 transition-all duration-500 shrink-0">
                                        {cat.icon}
                                    </div>

                                    <h3 className="text-[3rem] lg:text-[4.5rem] font-bold text-[#111] tracking-tight leading-[0.95] mb-8 group-hover:text-[#F05E23] transition-colors duration-500">
                                        {cat.title}.
                                    </h3>

                                    <p className="text-[1.15rem] md:text-[1.25rem] text-slate-500 font-light leading-relaxed max-w-2xl mb-12">
                                        {cat.desc}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16 flex-grow max-w-2xl">
                                        {cat.services.map((s, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-5 rounded-3xl bg-[#FAFAF8] border border-transparent group-hover:bg-orange-50/30 group-hover:border-orange-500/10 transition-all duration-500">
                                                <CheckCircle2 className="w-5 h-5 text-[#F05E23]/40 group-hover:text-[#F05E23]" />
                                                <span className="text-[1rem] font-bold text-[#111]/80 group-hover:text-[#111]">
                                                    {s}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-10 border-t border-[rgba(0,0,0,0.05)] flex items-center justify-between">
                                        <div className="flex items-center gap-3 font-black uppercase text-[0.65rem] tracking-[0.4em] text-slate-300 group-hover:text-[#F05E23] transition-colors duration-500">
                                            Synchronous Operations
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-slate-50 border border-[rgba(0,0,0,0.05)] flex items-center justify-center group-hover:bg-[#111] group-hover:border-[#111] transition-all duration-500">
                                            <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>
            </section>


        </div>
    );
}
