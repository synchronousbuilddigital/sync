"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
    {
        title: "Brand Architecture",
        description: "Visual identities that command authority and build long-term brand equity.",
        services: ["Visual Identity System", "Brand Positioning", "Verbal Messaging", "Packaging Design"],
        image: "/brand-architecture.png",
        gradient: "from-indigo-500/10",
    },
    {
        title: "Digital Ecosystems",
        description: "Scalable platforms where precision aesthetics meet high-conversion engineering.",
        services: ["Enterprise Web Platforms", "E-commerce", "Web Applications", "SaaS Interfaces"],
        image: "/digital-ecosystem.png",
        gradient: "from-violet-500/10",
    },
    {
        title: "Growth Engineering",
        description: "Data-backed campaigns that turn attention into measurable, compounding ROI.",
        services: ["Performance Ads", "SEO Dominance", "Content Strategy", "Growth Analytics"],
        image: "/growth-engineering.png",
        gradient: "from-purple-500/10",
    },
    {
        title: "AI & Automation",
        description: "Autonomous intelligence deployed into your core operations and user journeys.",
        services: ["AI Chatbots", "Generative AI", "Process Automation", "Neural Search"],
        image: "/ai-automation.png",
        gradient: "from-blue-500/10",
    }
];

function ServiceCard({ cat, i }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const isEven = i % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleMouseMove}
            className={`group relative flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} rounded-[3rem] bg-white border border-[rgba(0,0,0,0.05)] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.09)] hover:border-indigo-100 hover:-translate-y-1 transition-all duration-600 overflow-hidden`}
        >
            {/* Spotlight */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[3rem] opacity-0 group-hover:opacity-100 transition duration-500 z-20"
                style={{
                    background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(99,102,241,0.06), transparent 80%)`,
                }}
            />

            {/* Image */}
            <div className={`relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden bg-[#F5F5F2] ${isEven ? 'rounded-t-[3rem] md:rounded-t-[3rem] md:rounded-br-none md:rounded-l-[3rem]' : 'rounded-t-[3rem] md:rounded-t-[3rem] md:rounded-bl-none md:rounded-r-[3rem]'}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} to-transparent z-10 opacity-60`}></div>
                <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between flex-1 p-6 sm:p-10 md:p-12 lg:p-16">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/70 border border-indigo-100/60 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        <span className="text-[0.6rem] font-black uppercase tracking-[0.35em] text-indigo-600">Synchronous Infrastructure</span>
                    </div>

                    <h3 className="text-[1.8rem] sm:text-[2.2rem] lg:text-[2.8rem] font-bold text-[#0F1729] tracking-tighter leading-[1] mb-4 group-hover:text-indigo-600 transition-colors duration-500">
                        {cat.title}.
                    </h3>

                    <p className="text-[1.05rem] text-slate-500 font-light leading-relaxed mb-8 max-w-md">
                        {cat.description}
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {cat.services.map((s, idx) => (
                            <span
                                key={idx}
                                className="text-[0.8rem] font-medium px-4 py-2 rounded-xl bg-[#F5F5F2] border border-[rgba(0,0,0,0.04)] text-[#374151] group-hover:bg-white group-hover:border-indigo-100/60 group-hover:text-indigo-700 transition-all duration-400"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-10 pt-8 border-t border-[rgba(0,0,0,0.05)]">
                    <span className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-[#94A3B8] group-hover:text-indigo-400 transition-colors duration-500">
                        {cat.title}
                    </span>
                    <div className="w-10 h-10 rounded-full border border-[rgba(0,0,0,0.08)] flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-500 overflow-hidden">
                        <ArrowUpRight strokeWidth={2.5} className="w-4 h-4 text-[#d1d1d6] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function ServicesList() {
    return (
        <section className="w-full py-24 relative overflow-hidden" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/60 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3"></div>

            <div className="max-w-[1400px] mx-auto px-6">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col md:flex-row items-end justify-between gap-10 mb-16 md:mb-20"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[rgba(0,0,0,0.06)] rounded-full mb-8 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-dot-pulse"></span>
                            <span className="text-[0.65rem] font-black text-indigo-600 tracking-[0.35em] uppercase">Capabilities</span>
                        </div>
                        <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-bold text-[#0F1729] tracking-tighter leading-[1] lg:leading-[0.9]">
                            What We Build <br />
                            <span className="italic font-light text-indigo-500">& Scale.</span>
                        </h2>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-6 md:mb-2">
                        <p className="text-[1.1rem] text-slate-500 font-light max-w-xs border-l-2 border-indigo-500 pl-6 leading-relaxed">
                            Synchronizing your vision with relentless digital execution.
                        </p>
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#0F1729] text-white font-bold text-[0.8rem] tracking-wide hover:bg-indigo-600 transition-colors duration-300"
                        >
                            View All Services
                            <ArrowUpRight strokeWidth={2.5} className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-8 lg:gap-10">
                    {categories.map((cat, i) => (
                        <ServiceCard key={i} cat={cat} i={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
