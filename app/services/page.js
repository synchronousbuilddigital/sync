"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
    Fingerprint,
    Layout,
    BarChart3,
    Cpu,
    CheckCircle2,
    ArrowUpRight,
    Database,
    ShieldCheck,
    Zap,
    MousePointer2,
    Activity
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useTheme } from "../../components/ThemeContext";

const serviceCategories = [
    {
        id: "01",
        title: "Brand Architecture",
        icon: Fingerprint,
        desc: "We don't just design logos; we engineer visual and verbal identities that command market authority. Establish a premium presence that builds long-term brand equity.",
        services: ["Visual Identity System", "Strategic Brand Positioning", "Verbal Identity & Messaging", "Premium Packaging Design"],
        image: "/ChatGPT Image Apr 3, 2026, 11_35_08 AM.png",
        accent: "from-[#F05E23]/10",
        href: "/services/brand-systems"
    },
    {
        id: "02",
        title: "Digital Ecosystems",
        icon: Layout,
        desc: "Architecting high-performance digital infrastructure. We build scalable platforms where supreme aesthetic precision meets rigorous, high-conversion engineering.",
        services: ["Enterprise Web Platforms", "High-Conversion E-commerce", "Interactive Web Applications", "Custom SaaS Interfaces"],
        image: "/ChatGPT Image Apr 3, 2026, 11_36_48 AM.png",
        accent: "from-blue-500/10",
        href: "/services/digital-platforms"
    },
    {
        id: "03",
        title: "Growth Engineering",
        icon: BarChart3,
        desc: "Transforming attention into revenue. We execute data-backed, precision-targeted campaigns designed to drive exponential growth and measurable ROI.",
        services: ["Performance Advertising", "SEO & Search Dominance", "Strategic Content Architecture", "Growth Analytics & Audits"],
        image: "/ChatGPT Image Apr 3, 2026, 11_39_48 AM.png",
        accent: "from-green-500/10",
        href: "/services/growth-engine"
    },
    {
        id: "04",
        title: "AI & Automation",
        icon: Cpu,
        desc: "Integrating autonomous intelligence into your operations. Deploy custom AI agents and workflows that revolutionize efficiency and user engagement.",
        services: ["Custom AI Chatbots", "Generative AI Systems", "Intelligent Process Automation", "Neural Search Integration"],
        image: "/ChatGPT Image Apr 3, 2026, 11_39_44 AM.png",
        accent: "from-purple-500/10",
        href: "/services/ai-automation"
    }
];

export default function ServicesPage() {
    const { isDark } = useTheme();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <main className={`min-h-screen selection:bg-[#F05E23]/20 overflow-x-hidden transition-colors duration-700 ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#FDFDFD]'}`} ref={containerRef}>
            {/* Minimalist Grid Pattern */}
            <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.03]'}`}
                style={{ backgroundImage: `radial-gradient(${isDark ? '#FFF' : '#000'} 1.2px, transparent 1.2px)`, backgroundSize: '48px 48px' }}></div>

            {/* Header / Hero */}
            <header className="relative w-full pt-44 pb-20 md:pt-60 md:pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col items-start relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`inline-flex items-center gap-3 px-5 py-2.5 border rounded-full mb-12 shadow-sm transition-colors duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-[#F05E23] animate-pulse"></span>
                        <span className={`text-[0.7rem] font-bold tracking-[0.45em] uppercase border-none ${isDark ? 'text-[#F05E23]/80' : 'text-[#F05E23]'}`}>What We Build</span>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 w-full">
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className={`text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[8.5rem] font-bold tracking-[-0.05em] leading-[0.85] transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}
                        >
                            <span className={`block italic font-light mb-4 text-[0.4em] tracking-[0.2em] transform -translate-y-2 uppercase leading-none transition-colors duration-500 ${isDark ? 'text-white/20' : 'text-slate-300'}`}>Architecture</span>
                            What We <span className="text-[#F05E23]">Build.</span><br />
                            <span className={`${isDark ? 'text-white/10' : 'text-slate-200'} transition-colors duration-500`}>Synchronized.</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="max-w-sm border-l-2 border-[#F05E23] pl-10 pb-4"
                        >
                            <p className={`text-lg md:text-xl font-medium leading-relaxed italic transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                                "We engineer elite digital infrastructure where aesthetic precision meets relentless technical engineering."
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className={`absolute top-[20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[150px] -z-10 animate-ambient transition-colors duration-700 ${isDark ? 'bg-[#F05E23]/10' : 'bg-[#F05E23]/5'}`} />
            </header>

            {/* Phases Section */}
            <section className="w-full px-6 pb-24 space-y-12 md:space-y-24 relative z-10">
                {serviceCategories.map((phase, i) => (
                    <motion.div 
                        key={phase.id}
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-5%" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-8 lg:gap-20"
                    >
                        {/* Visual / Phase ID Side */}
                        <div className={`lg:w-[45%] flex flex-col justify-start ${i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                            <div className={`relative aspect-[4/3] w-full rounded-[3.5rem] overflow-hidden group shadow-2xl border transition-colors duration-500 ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-50'}`}>
                                <Image
                                    src={phase.image}
                                    alt={phase.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111]/40 to-transparent" />

                                {/* Floating Phase Badge */}
                                <div className={`absolute top-10 left-10 p-6 backdrop-blur-3xl border rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-1 group-hover:scale-110 transition-all duration-700 ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/80 border-white'}`}>
                                    <span className="text-[0.6rem] font-black text-[#F05E23] tracking-[0.4em] uppercase">Phase</span>
                                    <span className={`text-4xl font-bold leading-none transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}>{phase.id}</span>
                                </div>

                                {/* Floating Icon */}
                                <div className={`absolute bottom-10 right-10 w-20 h-20 rounded-full flex items-center justify-center border group-hover:bg-[#F05E23] transition-all duration-500 ${isDark ? 'bg-[#111] border-white/10 text-white' : 'bg-[#111] border-black/5 text-white'}`}>
                                    <phase.icon className="w-8 h-8" />
                                </div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className={`lg:w-[55%] flex flex-col justify-center py-10 ${i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                            <h2 className={`text-[3.5rem] md:text-[5.5rem] font-bold tracking-tighter leading-[0.9] mb-10 group-hover:text-[#F05E23] transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}>
                                {phase.title}.
                            </h2>
                            <p className={`text-[1.2rem] md:text-[1.4rem] font-light leading-relaxed mb-12 max-w-2xl transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                                {phase.desc}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                                {phase.services.map((service, sid) => (
                                    <motion.div
                                        key={sid}
                                        whileHover={{ x: 5 }}
                                        className={`flex items-center gap-4 p-5 rounded-3xl border hover:border-[#F05E23]/20 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] transition-all duration-500 cursor-default ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[#F05E23] shrink-0 transition-colors duration-500 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                            <CheckCircle2 className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <span className={`text-[0.95rem] font-bold leading-tight transition-colors duration-500 ${isDark ? 'text-white/80' : 'text-[#111]'}`}>{service}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <Link
                                href={phase.href}
                                className={`group/btn inline-flex items-center gap-6 self-start px-2 py-2 pr-10 rounded-full border hover:border-[#F05E23]/20 active:scale-95 transition-all duration-500 ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-white text-[#111] group-hover/btn:bg-[#F05E23] group-hover/btn:text-white' : 'bg-[#111] text-white group-hover/btn:bg-[#F05E23]'}`}>
                                    <ArrowUpRight className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-[0.55rem] font-black tracking-[0.4em] uppercase leading-none mb-1 transition-colors duration-500 ${isDark ? 'text-white/20' : 'text-slate-400'}`}>Synchronous Operations</span>
                                    <span className={`text-[1.1rem] font-bold tracking-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}>Explore {phase.title.split(' ')[0]} Framework</span>
                                </div>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Final CTA Section */}
            <section className={`w-full py-32 md:py-44 px-6 relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-[#111]'}`}>
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
                     style={{ backgroundImage: `radial-gradient(#FFF 1px, transparent 1px)`, backgroundSize: '64px 64px' }} />
                
                <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="w-24 h-24 rounded-full bg-[#F05E23] border-[6px] border-white/10 flex items-center justify-center text-white mb-16 shadow-2xl"
                    >
                        <Zap className="w-10 h-10 fill-white" />
                    </motion.div>

                    <h2 className="text-[3rem] md:text-[5.5rem] font-bold text-white tracking-tighter leading-[0.9] mb-12">
                        Ready to Begin Your <br /> <span className="text-[#F05E23]">Synchronous</span> Engineering.
                    </h2>

                    <Link 
                        href="/contact"
                        className="group relative px-14 py-8 rounded-[2.5rem] bg-white text-[#111] font-black uppercase text-[0.8rem] tracking-[0.4em] overflow-hidden hover:scale-105 active:scale-95 transition-all duration-500"
                    >
                        <span className="relative z-10 group-hover:text-white transition-colors duration-500">Initialize Acquisition</span>
                        <div className="absolute inset-0 bg-[#F05E23] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
