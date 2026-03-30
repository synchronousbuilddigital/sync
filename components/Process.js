"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Search, Compass, Cpu, Rocket, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
    {
        id: "01",
        title: "Neural Audit",
        desc: "Mapping your business architecture and auditing algorithmic arbitrage vectors across the digital landscape.",
        icon: <Search className="w-5 h-5 md:w-6 md:h-6" />,
        color: "#F05E23",
        align: "middle"
    },
    {
        id: "02",
        title: "Architecture",
        desc: "Engineering a custom growth blueprint optimized for high-velocity conversion and long-term equity scaling.",
        icon: <Compass className="w-5 h-5 md:w-6 md:h-6" />,
        color: "#F05E23",
        align: "top"
    },
    {
        id: "03",
        title: "Deployment",
        desc: "Building high-performance ecosystems with surgical precision and vertically integrated brand identities.",
        icon: <Cpu className="w-5 h-5 md:w-6 md:h-6" />,
        color: "#F05E23",
        align: "middle"
    },
    {
        id: "04",
        title: "Acquisition",
        desc: "Activating growth frameworks via surgical media buying and performance-obsessed retention logic.",
        icon: <Rocket className="w-5 h-5 md:w-6 md:h-6" />,
        color: "#F05E23",
        align: "bottom"
    },
    {
        id: "05",
        title: "Compounding",
        desc: "Continuously optimizing neural conversion loops and market dominance via algorithmic process automation.",
        icon: <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />,
        color: "#F05E23",
        align: "middle"
    }
];

export default function Process() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 80%", "end end"]
    });

    // Surgical precision mapping
    const pathLength = useTransform(scrollYProgress, [0.05, 0.98], [0, 1]);
    const dotOpacity = useTransform(scrollYProgress, [0.05, 0.1], [0, 1]);
    const endDotOpacity = useTransform(scrollYProgress, [0.9, 0.98], [0, 1]);

    // Perfectly aligned path for 5 columns in 1440 viewbox
    // Nodes at: 144, 432, 720, 1008, 1296
    const svgPath = "M 0 60 L 144 60 C 288 60, 288 20, 432 20 C 576 20, 576 60, 720 60 C 864 60, 864 100, 1008 100 C 1152 100, 1152 60, 1296 60 L 1440 60";

    return (
        <section ref={containerRef} className="w-full py-32 relative overflow-hidden bg-black selection:bg-[#F05E23]/20">

            {/* Background Architecture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]"
                style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '200px_200px' }}></div>

            {/* Ambient Lighting */}
            <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] rounded-full -z-10 opacity-[0.08] blur-[150px] pointer-events-none animate-pulse"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)' }}
            />
            <div className="absolute bottom-0 right-1/4 w-[1000px] h-[1000px] rounded-full -z-10 opacity-[0.06] blur-[150px] pointer-events-none animate-pulse"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)' }}
            />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 lg:mb-40">
                    <div className="max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 lg:mb-10"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse shadow-[0_0_8px_#F05E23]"></span>
                            <span className="text-[0.6rem] sm:text-[0.65rem] font-black text-white/60 tracking-[0.4em] uppercase">Methodology v4.0</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[2.8rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] font-bold tracking-tighter text-white leading-[0.9] flex flex-col"
                        >
                            <span className="whitespace-normal sm:whitespace-nowrap">Growth <em className="not-italic text-[#F05E23]">Architecture</em>.</span>
                        </motion.h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:mb-4 border-l-2 border-[#F05E23]/30 pl-8 max-w-sm"
                    >
                        <p className="text-[1rem] lg:text-[1.15rem] text-white/40 font-light leading-relaxed italic">
                            Discover the proprietary SEO and growth marketing frameworks engineered to accelerate your digital equity.
                        </p>
                    </motion.div>
                </div>

                {/* The Path Experience */}
                <div className="relative pt-10 sm:pt-20">

                    {/* SVG Progress Path (Desktop) */}
                    <div className="hidden lg:block absolute top-[60px] left-0 w-full h-[120px] z-0 pointer-events-none overflow-visible">
                        <svg width="100%" height="100%" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
                            <motion.path
                                d={svgPath}
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="2"
                                strokeDasharray="10 10"
                            />
                            <motion.path
                                d={svgPath}
                                stroke="#F05E23"
                                strokeWidth="4"
                                strokeLinecap="round"
                                style={{ pathLength }}
                                className="drop-shadow-[0_0_12px_rgba(240,94,35,0.8)]"
                            />
                            <motion.circle 
                                cx="0" cy="60" r="4" 
                                fill="#F05E23" 
                                style={{ opacity: dotOpacity }}
                                className="drop-shadow-[0_0_8px_#F05E23]"
                            />
                            <motion.circle 
                                cx="1440" cy="60" r="4" 
                                fill="#F05E23" 
                                style={{ opacity: endDotOpacity }}
                                className="drop-shadow-[0_0_8px_#F05E23]"
                            />
                        </svg>
                    </div>

                    {/* Vertical Connecting Line for Mobile/Tablet */}
                    <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-10 bottom-40 w-px bg-gradient-to-b from-[#F05E23]/0 via-[#F05E23]/20 to-[#F05E23]/0 z-0" />

                    {/* Step Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-20 sm:gap-y-32 lg:gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="relative group flex flex-col items-center"
                            >
                                {/* Vertical Node Marker (Desktop) */}
                                <div 
                                    className="hidden lg:block absolute left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent transition-all duration-700 group-hover:from-[#F05E23]/40"
                                    style={{ 
                                        top: step.align === 'top' ? '20px' : step.align === 'bottom' ? '100px' : '60px',
                                        height: step.align === 'top' ? '220px' : step.align === 'bottom' ? '140px' : '180px'
                                    }}
                                ></div>

                                {/* Step Bubble */}
                                <div 
                                    className={`relative mb-8 sm:mb-12 flex justify-center w-full transition-all duration-700
                                        ${step.align === 'top' ? 'lg:translate-y-[20px]' : 
                                          step.align === 'bottom' ? 'lg:translate-y-[100px]' : 
                                          'lg:translate-y-[60px]'} translate-y-0`}
                                >
                                    <div
                                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-[2.2rem] sm:rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-[#F05E23] transition-all duration-700 relative z-20 group-hover:bg-[#F05E23] group-hover:text-white group-hover:border-[#F05E23] group-hover:shadow-[0_0_40px_rgba(240,94,35,0.4)]"
                                    >
                                        <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#F05E23]/40 to-transparent group-hover:via-white/40"></div>
                                        <div className="scale-75 sm:scale-100">{step.icon}</div>

                                        {/* Step ID Label */}
                                        <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-[0.6rem] sm:text-[0.7rem] font-bold text-white group-hover:bg-white group-hover:text-[#F05E23] transition-all duration-700 shadow-xl group-hover:rotate-12">
                                            {step.id}
                                        </div>
                                    </div>

                                    {/* Pulse Ring */}
                                    <div className="absolute inset-x-0 top-0 mx-auto w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-[#F05E23]/20 animate-[ping_4s_linear_infinite] group-hover:opacity-100 opacity-20"></div>
                                </div>

                                {/* Content */}
                                <div className="text-center lg:mt-[180px] px-4 w-full">
                                    <div className="mb-3 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <span className="text-[0.55rem] sm:text-[0.6rem] font-black text-[#F05E23] tracking-widest uppercase">[{index === 0 ? "ANALYSIS" : index === 1 ? "ENGINEERING" : index === 2 ? "DEPLOY" : index === 3 ? "GROWTH" : "SCALE"}]</span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-5 tracking-tight group-hover:text-[#F05E23] transition-colors duration-500">
                                        {step.title}
                                    </h3>
                                    <p className="text-[0.85rem] sm:text-[0.95rem] md:text-[1rem] text-white/30 leading-relaxed font-medium group-hover:text-white/60 transition-all duration-500 max-w-[260px] mx-auto">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-48">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link href="/process" className="group flex items-center gap-8 px-12 py-6 bg-white/5 border border-white/10 rounded-full text-white text-[0.8rem] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-[#111] transition-all duration-700 shadow-2xl">
                                Learn our full process
                                <div className="w-10 h-10 rounded-full bg-[#F05E23] flex items-center justify-center group-hover:bg-[#111] transition-all">
                                    <ArrowRight className="w-5 h-5 text-white" strokeWidth={3} />
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>

            </div>
        </section>
    );
}
