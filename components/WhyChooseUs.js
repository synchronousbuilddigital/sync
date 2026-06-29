"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, Shield, Zap, Target, TrendingUp, Activity, ArrowUpRight, HeartPulse, CheckCircle2 } from "lucide-react";
import { useTheme } from './ThemeContext';

const advantages = [
    {
        id: "01",
        title: "AI-Powered",
        shortTitle: "AI-Powered",
        desc: "Automating growth with cutting-edge artificial intelligence, smart algorithms, and custom process bots.",
        icon: Sparkles,
        color: "#F05E23",
        gradient: "from-[#F05E23] to-[#FF8C38]",
        glow: "rgba(240, 94, 35, 0.4)",
        bgLight: "bg-orange-500/10 border-orange-500/30 text-orange-500"
    },
    {
        id: "02",
        title: "Complete Branding",
        shortTitle: "Branding",
        desc: "We build your entire online brand identity, visual voice, and custom design systems completely from scratch.",
        icon: Shield,
        color: "#3B82F6",
        gradient: "from-[#3B82F6] to-[#60A5FA]",
        glow: "rgba(59, 130, 246, 0.4)",
        bgLight: "bg-blue-500/10 border-blue-500/30 text-blue-500"
    },
    {
        id: "03",
        title: "Tech & Sales",
        shortTitle: "Tech & Sales",
        desc: "We combine high-performance code with high-converting sales funnels designed for maximum business revenue.",
        icon: Zap,
        color: "#EAB308",
        gradient: "from-[#EAB308] to-[#FACC15]",
        glow: "rgba(234, 179, 8, 0.4)",
        bgLight: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500"
    },
    {
        id: "04",
        title: "Data-Driven",
        shortTitle: "Data-Driven",
        desc: "Strategic execution backed by real-time predictive analytics, precision metrics, and growth tracking.",
        icon: Target,
        color: "#8B5CF6",
        gradient: "from-[#8B5CF6] to-[#A78BFA]",
        glow: "rgba(139, 92, 246, 0.4)",
        bgLight: "bg-purple-500/10 border-purple-500/30 text-purple-500"
    },
    {
        id: "05",
        title: "Easy to Grow",
        shortTitle: "Easy to Grow",
        desc: "Scalable architecture built to effortlessly support thousands of customers as your enterprise expands.",
        icon: TrendingUp,
        color: "#10B981",
        gradient: "from-[#10B981] to-[#34D399]",
        glow: "rgba(16, 185, 129, 0.4)",
        bgLight: "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
    }
];

const metrics = [
    { label: "Projects", value: "50+", desc: "Executed work" },
    { label: "Retention", value: "98%", desc: "Long-term partners" },
    { label: "Growth", value: "3.2x", desc: "Avg client ROI" },
    { label: "Response", value: "<2h", desc: "Rapid support" },
];

// SVG Helper function to build 3D-feeling cake slice paths
function getSlicePath(index, total = 5, outerR = 175, innerR = 70, cx = 200, cy = 200) {
    const sliceAngle = 360 / total;
    const gap = 3; // degree gap between slices
    const startAngle = index * sliceAngle - 90 + gap / 2;
    const endAngle = (index + 1) * sliceAngle - 90 - gap / 2;

    const rad = Math.PI / 180;
    const x1 = cx + outerR * Math.cos(startAngle * rad);
    const y1 = cy + outerR * Math.sin(startAngle * rad);
    const x2 = cx + outerR * Math.cos(endAngle * rad);
    const y2 = cy + outerR * Math.sin(endAngle * rad);

    const x3 = cx + innerR * Math.cos(endAngle * rad);
    const y3 = cy + innerR * Math.sin(endAngle * rad);
    const x4 = cx + innerR * Math.cos(startAngle * rad);
    const y4 = cy + innerR * Math.sin(startAngle * rad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
}

// Helper to calculate slice icon center coordinates
function getSliceIconPos(index, total = 5, midR = 122, cx = 200, cy = 200) {
    const sliceAngle = 360 / total;
    const midAngle = (index + 0.5) * sliceAngle - 90;
    const rad = Math.PI / 180;
    return {
        x: cx + midR * Math.cos(midAngle * rad),
        y: cy + midR * Math.sin(midAngle * rad),
        angle: midAngle
    };
}

export default function WhyChooseUs() {
    const { isDark } = useTheme();
    const sectionRef = useRef(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const [autoRotate, setAutoRotate] = useState(true);

    // Auto rotate through slices every 4 seconds unless user interacts
    useEffect(() => {
        if (!autoRotate) return;
        const interval = setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % advantages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [autoRotate]);

    const activeAdv = advantages[activeIdx];
    const IconComponent = activeAdv.icon;

    return (
        <section ref={sectionRef} className={`w-full py-16 sm:py-32 relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#050508]' : 'bg-[#FAFAFD]'}`}>
            {/* Ambient Grid Background */}
            <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-[0.04]' : 'opacity-[0.02]'}`}
                 style={{ backgroundImage: `radial-gradient(${isDark ? '#FFF' : '#000'} 1.2px, transparent 1.2px)`, backgroundSize: '48px 48px' }}></div>
            
            {/* Glowing Background Orbs */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-15 pointer-events-none" style={{ background: activeAdv.color }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                
                {/* Section Title Header */}
                <div className="flex flex-col items-center text-center mb-12 sm:mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#F05E23]/10 border border-[#F05E23]/20 mb-4"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#F05E23] animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F05E23]">The Synchronous Advantage</span>
                    </motion.div>

                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`text-3xl sm:text-6xl lg:text-7xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-[#111]'}`}
                    >
                        Why Choose <span className="text-[#F05E23]">Synchronous.</span>
                    </motion.h2>
                    <p className={`mt-3 text-xs sm:text-base font-light max-w-lg ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                        Tap or hover on any slice of our core operational matrix to explore our strategic capabilities.
                    </p>
                </div>

                {/* Main Interactive Cake Wheel Container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    
                    {/* LEFT / TOP: The 3D Cake Wheel Structure */}
                    <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
                        
                        {/* Interactive SVG Cake Wheel */}
                        <div 
                            className="relative w-[340px] h-[340px] xs:w-[410px] xs:h-[410px] sm:w-[480px] sm:h-[480px] lg:w-[520px] lg:h-[520px] flex items-center justify-center select-none cursor-pointer"
                            onMouseEnter={() => setAutoRotate(false)}
                            onMouseLeave={() => setAutoRotate(true)}
                        >
                            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-visible">
                                <defs>
                                    {advantages.map((adv, i) => (
                                        <linearGradient key={i} id={`sliceGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor={adv.color} stopOpacity={activeIdx === i ? "0.95" : "0.65"} />
                                            <stop offset="100%" stopColor={adv.color} stopOpacity={activeIdx === i ? "0.75" : "0.35"} />
                                        </linearGradient>
                                    ))}
                                    <filter id="sliceGlow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="8" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>

                                {/* Outer Orbit Ring */}
                                <circle cx="200" cy="200" r="190" fill="none" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} strokeWidth="1.5" strokeDasharray="6 6" />

                                {/* Render 5 Cake Slices */}
                                {advantages.map((adv, i) => {
                                    const isActive = activeIdx === i;
                                    const slicePath = getSlicePath(i, 5, 184, 62, 200, 200);
                                    const pos = getSliceIconPos(i, 5, 124, 200, 200);
                                    const SliceIcon = adv.icon;

                                    // Calculate small translation offset outward for popped-out effect
                                    const sliceAngle = 360 / 5;
                                    const midRad = ((i + 0.5) * sliceAngle - 90) * (Math.PI / 180);
                                    const popX = isActive ? Math.cos(midRad) * 14 : 0;
                                    const popY = isActive ? Math.sin(midRad) * 14 : 0;

                                    return (
                                        <g 
                                            key={adv.id} 
                                            onClick={() => { setActiveIdx(i); setAutoRotate(false); }}
                                            onMouseEnter={() => { setActiveIdx(i); setAutoRotate(false); }}
                                            className="transition-transform duration-500 cursor-pointer group"
                                            style={{ transform: `translate(${popX}px, ${popY}px)` }}
                                        >
                                            {/* Slice Path */}
                                            <path
                                                d={slicePath}
                                                fill={`url(#sliceGrad-${i})`}
                                                stroke={isActive ? adv.color : (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)")}
                                                strokeWidth={isActive ? "3.5" : "1.5"}
                                                filter={isActive ? "url(#sliceGlow)" : undefined}
                                                className="transition-all duration-300 group-hover:opacity-100"
                                            />

                                            {/* Slice Content (Icon + Section Title directly on slice) */}
                                            <foreignObject x={pos.x - 45} y={pos.y - 28} width="90" height="56" className="pointer-events-none overflow-visible">
                                                <div className="w-full h-full flex flex-col items-center justify-center text-center">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 shadow-md transition-all duration-300 ${isActive ? 'scale-110' : ''}`} style={{ backgroundColor: isActive ? adv.color : (isDark ? '#14141F' : '#FFFFFF'), border: `2px solid ${adv.color}` }}>
                                                        <SliceIcon className={`w-4 h-4 ${isActive ? 'text-white' : (isDark ? 'text-white' : 'text-slate-900')}`} />
                                                    </div>
                                                    <span className={`text-[8.5px] font-black uppercase tracking-wider transition-colors duration-300 leading-none ${isActive ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : (isDark ? 'text-white/90' : 'text-slate-900')}`}>
                                                        {adv.shortTitle}
                                                    </span>
                                                </div>
                                            </foreignObject>
                                        </g>
                                    );
                                })}

                                {/* Center Website Logo Ring cutout */}
                                <circle cx="200" cy="200" r="60" fill={isDark ? "#0A0A0E" : "#FFFFFF"} stroke={activeAdv.color} strokeWidth="3.5" className="transition-colors duration-500 shadow-2xl" />
                            </svg>

                            {/* CENTER HUB: Website Logo Container */}
                            <div 
                                onClick={() => setAutoRotate(!autoRotate)}
                                className="absolute inset-0 flex items-center justify-center pointer-events-auto cursor-pointer group"
                            >
                                <motion.div 
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center p-2 relative shadow-2xl transition-all"
                                >
                                    {/* Logo Image */}
                                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 mb-0.5">
                                        <Image
                                            src="/logo.png"
                                            alt="Synchronous Logo"
                                            fill
                                            className="object-contain drop-shadow-md"
                                        />
                                    </div>
                                    <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] text-[#F05E23]">
                                        SYNCHRONOUS
                                    </span>
                                </motion.div>
                            </div>
                        </div>

                        {/* Quick Interactive Selector Pills for Mobile/Tablet */}
                        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-8 w-full max-w-md">
                            {advantages.map((adv, i) => (
                                <button
                                    key={adv.id}
                                    onClick={() => { setActiveIdx(i); setAutoRotate(false); }}
                                    className={`px-3 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 border ${activeIdx === i 
                                        ? 'bg-[#F05E23] border-[#F05E23] text-white shadow-md scale-105' 
                                        : (isDark ? 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10' : 'bg-black/5 border-black/5 text-slate-600 hover:bg-black/10')
                                    }`}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: adv.color }} />
                                    {adv.shortTitle}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT / BOTTOM: Active Slice Detailed Breakdown Panel */}
                    <div className="lg:col-span-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIdx}
                                initial={{ opacity: 0, x: 20, scale: 0.98 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 0.98 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className={`p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border relative overflow-hidden transition-all duration-500 ${isDark ? 'bg-[#0D0D14]/90 border-white/10 shadow-2xl' : 'bg-white border-black/5 shadow-2xl shadow-black/5'}`}
                            >
                                {/* Active Slice Header */}
                                <div className="flex items-center justify-between mb-6 sm:mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${activeAdv.gradient}`}>
                                            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F05E23]">
                                                PART 0{activeIdx + 1} OF 05
                                            </span>
                                            <h3 className={`text-2xl sm:text-4xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                                                {activeAdv.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${activeAdv.bgLight}`}>
                                        ACTIVE SLICE
                                    </div>
                                </div>

                                {/* Active Slice Description */}
                                <p className={`text-base sm:text-xl font-medium leading-relaxed mb-8 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                                    {activeAdv.desc}
                                </p>

                                {/* Performance Metrics Grid */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 pt-6 border-t border-white/10">
                                    {metrics.map((m, i) => (
                                        <div key={i} className={`p-3.5 sm:p-4 rounded-2xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                            <div className="text-xl sm:text-2xl font-black text-[#F05E23] tracking-tight">{m.value}</div>
                                            <div className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{m.label}</div>
                                            <div className={`text-[9px] font-medium opacity-40 uppercase truncate ${isDark ? 'text-white' : 'text-slate-400'}`}>{m.desc}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Quality Guarantee */}
                                <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-[#F05E23]/10 border-[#F05E23]/20 text-white' : 'bg-[#F05E23]/5 border-[#F05E23]/10 text-slate-800'}`}>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#F05E23] shrink-0" />
                                        <span className="text-xs font-bold uppercase tracking-wide">100% Verified Operational Excellence</span>
                                    </div>
                                    <Activity className="w-4 h-4 text-[#F05E23] animate-pulse shrink-0" />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
}
