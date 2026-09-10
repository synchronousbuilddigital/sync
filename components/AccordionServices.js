"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles, Cpu, TrendingUp, Zap, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeContext";

const services = [
    {
        id: "01",
        num: "01",
        title: "WE BUILD YOUR BRAND.",
        shortTitle: "Brand Systems",
        subtitle: "Brand Identity & Strategy",
        category: "Strategy & Branding",
        desc: "We build unforgettable visual identities and strategic brand frameworks that build deep customer trust and accelerate enterprise valuation.",
        image: "/ChatGPT Image Apr 3, 2026, 11_35_08 AM.png",
        icon: Sparkles,
        metrics: [
            { label: "Growth Lift", val: "+42%" },
            { label: "Turnaround", val: "Fast" },
            { label: "Impact", val: "High" }
        ],
        features: [
            "Logo & Visual Identity",
            "Business Strategy",
            "Brand Voice & Style",
            "Design Guidelines",
            "Customer Connection",
            "Clean Look & Feel"
        ],
        link: "/services/brand-systems"
    },
    {
        id: "02",
        num: "02",
        title: "DIGITAL SHOP & APPS.",
        shortTitle: "Digital Platforms",
        subtitle: "Websites & Mobile Engineering",
        category: "Engineering & Web",
        desc: "High-velocity web applications, modern mobile software, and e-commerce platforms engineered for sub-second page loads and maximum conversion.",
        image: "/ChatGPT Image Apr 3, 2026, 11_36_48 AM.png",
        icon: Cpu,
        metrics: [
            { label: "Conversion", val: "+58%" },
            { label: "Speed", val: "< 0.8s" },
            { label: "Standard", val: "Premium" }
        ],
        features: [
            "Modern Online Stores",
            "Mobile-Friendly Apps",
            "Easy Management",
            "Fast Page Loading",
            "Secure & Reliable",
            "Custom Dashboard"
        ],
        link: "/services/digital-platforms"
    },
    {
        id: "03",
        num: "03",
        title: "GROW YOUR SALES.",
        shortTitle: "Growth Engine",
        subtitle: "Performance Marketing & Ads",
        category: "Growth & Ads",
        desc: "Surgical ad campaigns and multi-channel acquisition funnels designed to acquire high-value customers at scalable, predictable ROI.",
        image: "/ChatGPT Image Apr 3, 2026, 11_39_48 AM.png",
        icon: TrendingUp,
        metrics: [
            { label: "ROAS Boost", val: "+71%" },
            { label: "Pacing", val: "Steady" },
            { label: "Efficiency", val: "3.4x" }
        ],
        features: [
            "Smart Ad Campaigns",
            "Social Media Growth",
            "Sales Funnels",
            "Creative Ad Testing",
            "Budget Optimization",
            "Customer Retention"
        ],
        link: "/services/growth-engine"
    },
    {
        id: "04",
        num: "04",
        title: "SMART AI TOOLS.",
        shortTitle: "AI & Automation",
        subtitle: "Enterprise AI & Workflows",
        category: "Enterprise AI",
        desc: "Custom intelligent AI assistants, automated internal tools, and machine learning pipelines that replace repetitive manual tasks.",
        image: "/ChatGPT Image Apr 3, 2026, 11_39_44 AM.png",
        icon: Zap,
        metrics: [
            { label: "Hours Saved", val: "40+/wk" },
            { label: "Response", val: "Instant" },
            { label: "Workflow", val: "Auto" }
        ],
        features: [
            "Custom AI Assistants",
            "Task Automation",
            "Smart Business Help",
            "Workplace Efficiency",
            "Process Bots",
            "AI Insights"
        ],
        link: "/services/ai-automation"
    }
];

export default function AccordionServices() {
    const [activeIdx, setActiveIdx] = useState(0);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const { isDark } = useTheme();

    return (
        <section className={`relative w-full pt-4 pb-2 sm:pt-6 sm:pb-8 lg:pt-8 lg:pb-8 transition-colors duration-500 overflow-hidden ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-[#FAFAF8] text-[#0F1729]'}`}>
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(to right, rgba(240, 94, 35, ${isDark ? '0.05' : '0.03'}) 1px, transparent 1px), linear-gradient(to bottom, rgba(240, 94, 35, ${isDark ? '0.05' : '0.03'}) 1px, transparent 1px)`,
                    backgroundSize: '80px 80px',
                    maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
                }}></div>
            </div>

            {/* Ambient Lighting Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-[#F05E23] opacity-[0.06] blur-[140px]" />
                <div className="absolute bottom-[5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#F05E23] opacity-[0.05] blur-[140px]" />
            </div>

            <div className="relative z-10 max-w-[1500px] mx-auto px-6 md:px-12 w-full">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#F05E23]/10 border border-[#F05E23]/20 mb-4 sm:mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#F05E23] animate-pulse"></span>
                            <span className="text-[0.65rem] sm:text-[0.7rem] font-extrabold uppercase tracking-[0.25em] text-[#F05E23]">What We Do</span>
                        </div>

                        <h2 className={`text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.08] ${isDark ? 'text-white' : 'text-[#0F1729]'}`}>
                            Simple <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F05E23] via-orange-400 to-amber-500">
                                Expert Solutions.
                            </span>
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className={`text-xs sm:text-base lg:text-lg font-light leading-relaxed max-w-md pb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}
                    >
                        <span className="hidden lg:inline">Hover over any card in the straight line to expand its full capability details and live studio graphics.</span>
                        <span className="lg:hidden">Swipe left or right (or use arrow controls) to explore capability details.</span>
                    </motion.p>
                </div>

                {/* MOBILE PHONE VIEW CAROUSEL (lg:hidden) */}
                <div className="block lg:hidden w-full space-y-2 pb-1 sm:pb-6">

                    {/* Mobile Single Active Card Display with Touch Swipe Support */}
                    <AnimatePresence mode="wait">
                        {(() => {
                            const current = services[activeIdx];
                            const CurrentIcon = current.icon;

                            return (
                                <motion.div
                                    key={`mobile-card-${current.id}`}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.2}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        if (offset.x < -40 || velocity.x < -300) {
                                            setActiveIdx((prev) => (prev + 1) % services.length);
                                        } else if (offset.x > 40 || velocity.x > 300) {
                                            setActiveIdx((prev) => (prev === 0 ? services.length - 1 : prev - 1));
                                        }
                                    }}
                                    whileTap={{ cursor: "grabbing" }}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.25 }}
                                    className={`relative rounded-3xl p-4 sm:p-6 border shadow-xl transition-colors duration-500 overflow-hidden flex flex-col justify-between cursor-grab active:cursor-grabbing touch-pan-y select-none ${
                                        isDark
                                            ? 'bg-neutral-900/95 border-[#F05E23]/60 shadow-black/60 ring-1 ring-[#F05E23]/40'
                                            : 'bg-white border-[#F05E23]/40 shadow-xl shadow-[#F05E23]/10 ring-1 ring-[#F05E23]/20'
                                    }`}
                                >
                                    {/* Top Accent Line */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F05E23] via-orange-400 to-[#F05E23] rounded-t-3xl" />

                                    {/* Card Header Row */}
                                    <div className="w-full pt-0.5">
                                        <div className="flex items-center justify-between gap-2 mb-2.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-black tracking-wider text-[#F05E23]">
                                                    {current.num}
                                                </span>
                                                <span className="inline-block text-[0.55rem] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/30">
                                                    {current.category}
                                                </span>
                                            </div>

                                            <div className="p-2 rounded-xl bg-[#F05E23] text-white shadow-md shadow-[#F05E23]/30 shrink-0">
                                                <CurrentIcon className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <h3 className={`text-lg font-black tracking-tight leading-tight mb-1 ${isDark ? 'text-white' : 'text-[#0F1729]'}`}>
                                            {current.title}
                                        </h3>

                                        <p className={`text-[0.7rem] font-light leading-relaxed mb-3 line-clamp-2 ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                            {current.desc}
                                        </p>
                                    </div>

                                    {/* Key Capabilities */}
                                    <div className="mb-3 pt-2.5 border-t border-neutral-500/10">
                                        <h4 className="text-[0.55rem] font-black text-[#F05E23] uppercase tracking-widest mb-1.5">
                                            Key Capabilities
                                        </h4>
                                        <div className="grid grid-cols-2 gap-1.5">
                                            {current.features.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-1.5 text-[0.65rem] font-semibold">
                                                    <CheckCircle2 className="w-3 h-3 text-[#F05E23] shrink-0" />
                                                    <span className={`truncate ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                                        {feature}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Visual Image Banner with Floating Side Arrows */}
                                    <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden border border-[#F05E23]/20 shadow-sm mb-3 group/banner">
                                        <img
                                            src={current.image}
                                            alt={current.title}
                                            className="w-full h-full object-cover pointer-events-none"
                                        />

                                        {/* Floating Side Arrow Controls */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveIdx((prev) => (prev === 0 ? services.length - 1 : prev - 1));
                                            }}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/75 border border-white/20 text-white font-bold text-base flex items-center justify-center hover:bg-[#F05E23] active:scale-95 transition-all backdrop-blur-md shadow-lg"
                                            aria-label="Previous Service"
                                        >
                                            ‹
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveIdx((prev) => (prev + 1) % services.length);
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/75 border border-white/20 text-white font-bold text-base flex items-center justify-center hover:bg-[#F05E23] active:scale-95 transition-all backdrop-blur-md shadow-lg"
                                            aria-label="Next Service"
                                        >
                                            ›
                                        </button>

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2.5">
                                            <div className="flex items-center justify-between w-full pl-8 pr-8">
                                                <span className="text-[0.6rem] text-white font-black uppercase tracking-wider truncate">
                                                    {current.shortTitle}
                                                </span>
                                                <span className="text-[0.5rem] px-2 py-0.5 rounded-full bg-[#F05E23] text-white font-bold uppercase tracking-wider shadow shrink-0">
                                                    Swipe Card
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Row & Circular Navigation Controls */}
                                    <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-neutral-500/10 w-full">
                                        <Link
                                            href={current.link}
                                            onClick={(e) => e.stopPropagation()}
                                            className={`inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl font-black text-[0.6rem] uppercase tracking-wider transition-all shadow-md min-w-0 truncate ${
                                                isDark
                                                    ? 'bg-white text-black hover:bg-[#F05E23] hover:text-white'
                                                    : 'bg-[#0F1729] text-white hover:bg-[#F05E23]'
                                            }`}
                                        >
                                            <span className="truncate">Explore {current.shortTitle}</span>
                                            <ArrowUpRight strokeWidth={3} className="w-3.5 h-3.5 shrink-0" />
                                        </Link>

                                        {/* Counter & Side Arrow Controls */}
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className={`text-[0.6rem] font-extrabold uppercase tracking-wider ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                                {activeIdx + 1}/{services.length}
                                            </span>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveIdx((prev) => (prev === 0 ? services.length - 1 : prev - 1));
                                                    }}
                                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs transition-all active:scale-95 shrink-0 ${
                                                        isDark
                                                            ? 'bg-neutral-800 border-neutral-700 text-white hover:bg-[#F05E23]'
                                                            : 'bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-[#F05E23] hover:text-white'
                                                    }`}
                                                    aria-label="Previous Service"
                                                >
                                                    ‹
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveIdx((prev) => (prev + 1) % services.length);
                                                    }}
                                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs transition-all active:scale-95 shrink-0 ${
                                                        isDark
                                                            ? 'bg-neutral-800 border-neutral-700 text-white hover:bg-[#F05E23]'
                                                            : 'bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-[#F05E23] hover:text-white'
                                                    }`}
                                                    aria-label="Next Service"
                                                >
                                                    ›
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })()}
                    </AnimatePresence>

                    {/* Swipe Navigation Dots */}
                    <div className="flex items-center justify-center gap-1.5 pt-1">
                        {services.map((_, i) => (
                            <button
                                key={`dot-${i}`}
                                onClick={() => setActiveIdx(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    activeIdx === i
                                        ? 'w-6 bg-[#F05E23]'
                                        : isDark
                                            ? 'w-2 bg-neutral-700 hover:bg-neutral-500'
                                            : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                                }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* DESKTOP STRAIGHT-LINE EXPANDING HORIZONTAL DECK (hidden on mobile, lg:flex) */}
                <div className="hidden lg:flex flex-row items-stretch gap-4 sm:gap-6 min-h-[580px] w-full">
                    {services.map((service, index) => {
                        const isExpanded = hoveredIdx !== null ? hoveredIdx === index : activeIdx === index;
                        const IconComp = service.icon;

                        return (
                            <motion.div
                                key={service.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    layout: { type: "spring", stiffness: 280, damping: 28 },
                                    opacity: { duration: 0.4 }
                                }}
                                onMouseEnter={() => setHoveredIdx(index)}
                                onMouseLeave={() => setHoveredIdx(null)}
                                onClick={() => setActiveIdx(index)}
                                className={`group relative rounded-3xl p-6 sm:p-8 cursor-pointer border transition-colors duration-500 overflow-hidden flex flex-col justify-between ${
                                    isExpanded
                                        ? 'lg:flex-[2.8] shrink-0'
                                        : 'lg:flex-1 shrink-0'
                                } ${
                                    isExpanded
                                        ? isDark
                                            ? 'bg-neutral-900/95 border-[#F05E23] shadow-2xl shadow-[#F05E23]/20 ring-1 ring-[#F05E23]'
                                            : 'bg-white border-[#F05E23] shadow-2xl shadow-[#F05E23]/15 ring-1 ring-[#F05E23]'
                                        : isDark
                                            ? 'bg-[#0E0E0E]/90 border-neutral-800/80 hover:border-[#F05E23]/50 hover:bg-neutral-900/50'
                                            : 'bg-white/90 border-neutral-200/90 hover:border-[#F05E23]/50 hover:shadow-lg'
                                }`}
                            >
                                {/* Top Accent Bar for Expanded Card */}
                                {isExpanded && (
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#F05E23] to-transparent rounded-t-3xl" />
                                )}

                                {/* Card Header Area */}
                                <div className="relative z-10 w-full">
                                    
                                    {/* Number & Icon Row */}
                                    <div className="flex items-center justify-between gap-3 mb-6">
                                        <span className="text-3xl sm:text-4xl font-black tracking-wider text-[#F05E23]">
                                            {service.num}
                                        </span>

                                        <div className={`p-3.5 rounded-2xl border transition-colors ${
                                            isExpanded
                                                ? 'bg-[#F05E23] text-white border-[#F05E23] shadow-lg shadow-[#F05E23]/30'
                                                : isDark
                                                    ? 'bg-neutral-900 border-neutral-800 text-neutral-400 group-hover:text-white'
                                                    : 'bg-neutral-100 border-neutral-200 text-neutral-500 group-hover:text-black'
                                        }`}>
                                            <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>
                                    </div>

                                    {/* Category Pill */}
                                    <span className={`inline-block text-[0.65rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 ${
                                        isExpanded
                                            ? 'bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/30'
                                            : isDark
                                                ? 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                                                : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                                    }`}>
                                        {service.category}
                                    </span>

                                    {/* Title */}
                                    <h3 className={`text-2xl sm:text-3xl font-black tracking-tight leading-snug mb-3 transition-colors ${
                                        isExpanded
                                            ? isDark ? 'text-white' : 'text-[#0F1729]'
                                            : isDark ? 'text-neutral-200 group-hover:text-white' : 'text-neutral-800 group-hover:text-black'
                                    }`}>
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className={`text-sm font-light leading-relaxed mb-6 transition-all ${
                                        isExpanded
                                            ? isDark ? 'text-neutral-300' : 'text-neutral-600'
                                            : isDark ? 'text-neutral-500 line-clamp-2' : 'text-neutral-500 line-clamp-2'
                                    }`}>
                                        {service.desc}
                                    </p>
                                </div>

                                {/* Dynamic Expanded Content */}
                                {isExpanded ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                        className="relative z-10 space-y-6 w-full pt-2"
                                    >
                                        {/* Deliverables Checklist */}
                                        <div>
                                            <h4 className="text-[0.65rem] font-black text-[#F05E23] uppercase tracking-widest mb-3">
                                                Key Capabilities
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2.5">
                                                {service.features.map((feature, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-xs font-semibold">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F05E23] shrink-0" />
                                                        <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>
                                                            {feature}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Visual Image Banner */}
                                        <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-[#F05E23]/20 shadow-xl group/img">
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="text-xs text-white font-black uppercase tracking-wider">
                                                        {service.shortTitle}
                                                    </span>
                                                    <span className="text-[0.6rem] px-2.5 py-1 rounded-full bg-[#F05E23] text-white font-bold uppercase tracking-wider shadow-md">
                                                        Expanded View
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Action Row */}
                                        <div className="flex items-center justify-between pt-2 border-t border-neutral-500/10">
                                            <Link
                                                href={service.link}
                                                className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
                                                    isDark
                                                        ? 'bg-white text-black hover:bg-[#F05E23] hover:text-white'
                                                        : 'bg-[#0F1729] text-white hover:bg-[#F05E23]'
                                                }`}
                                            >
                                                Explore {service.shortTitle}
                                                <ArrowUpRight strokeWidth={3} className="w-4 h-4" />
                                            </Link>

                                            <div className="flex items-center gap-3">
                                                {service.metrics.map((m, i) => (
                                                    <div key={i} className="hidden sm:flex flex-col text-right">
                                                        <span className="text-[0.55rem] font-bold text-[#F05E23] uppercase">{m.label}</span>
                                                        <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-black'}`}>{m.val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    /* Collapsed Card Footer Preview */
                                    <div className="relative z-10 w-full pt-4 border-t border-neutral-500/10">
                                        <div className="relative w-full h-28 rounded-2xl overflow-hidden mb-4 border border-neutral-500/10">
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                                                <span className="text-[0.6rem] text-white font-extrabold uppercase tracking-widest">
                                                    {service.shortTitle}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className={`text-[0.65rem] font-bold uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                                Hover to Expand
                                            </span>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                                isDark ? 'bg-neutral-800 text-neutral-400 group-hover:bg-[#F05E23] group-hover:text-white' : 'bg-neutral-100 text-neutral-600 group-hover:bg-[#F05E23] group-hover:text-white'
                                            }`}>
                                                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Matrix Footer */}
                <div className="flex items-center justify-between mt-4 sm:mt-6 opacity-50">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-[1px] ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
                        <span className={`text-[0.6rem] font-black uppercase tracking-[0.3em] ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                            Synchronous Expanding Deck Matrix
                        </span>
                    </div>

                    <div className={`text-[0.6rem] font-black uppercase tracking-[0.3em] ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                        04 Interactive Cards
                    </div>
                </div>

            </div>
        </section>
    );
}