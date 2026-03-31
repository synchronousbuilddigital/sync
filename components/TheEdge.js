"use client";

import { motion } from "framer-motion";
import { Target, BarChart3, Zap, ArrowUpRight } from "lucide-react";
import { useTheme } from './ThemeContext';

const features = [
    {
        title: "Hyper-Targeted Precision",
        desc: "We eliminate wasted ad spend by pinpointing your exact ideal customer profile with data-backed audience intelligence.",
        icon: <Target className="w-8 h-8" />,
        delay: 0.1
    },
    {
        title: "Data-Driven Growth",
        desc: "Every decision is backed by hard metrics. We continuously split-test, optimize, and scale what actually works.",
        icon: <BarChart3 className="w-8 h-8" />,
        delay: 0.2
    },
    {
        title: "Rapid Execution",
        desc: "Speed kills the competition. We launch, iterate, and generate ROI faster than traditional legacy agencies.",
        icon: <Zap className="w-8 h-8" />,
        delay: 0.3
    }
];

export default function TheEdge() {
    const { isDark } = useTheme();

    return (
        <section className={`w-full relative py-24 lg:py-48 overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
            {/* Background Architecture */}
            <div className={`absolute inset-0 opacity-[0.02] pointer-events-none transition-colors duration-700`}
                style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}
            ></div>

            {/* Ambient System Glows */}
            <div className={`absolute top-0 right-[-10%] w-[800px] h-[800px] blur-[150px] rounded-full pointer-events-none transition-colors duration-700 ${isDark ? 'bg-orange-600/[0.03]' : 'bg-blue-600/[0.03]'}`}></div>
            <div className={`absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none transition-colors duration-700 ${isDark ? 'bg-orange-600/[0.02]' : 'bg-blue-600/[0.02]'}`}></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`inline-flex items-center gap-3 px-5 py-2 border backdrop-blur-3xl rounded-full mb-8 transition-colors duration-500 ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-blue-600/[0.03] border-blue-600/10'}`}
                    >
                        <div className="flex gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-[#F05E23]' : 'bg-blue-600'}`}></span>
                            <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#F05E23]/30' : 'bg-blue-600/30'}`}></span>
                        </div>
                        <span className={`text-[0.7rem] font-black uppercase tracking-[0.4em] font-[var(--font-chakra-petch)] transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-slate-900/40'}`}>The Synchronous Edge</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className={`text-[2.8rem] md:text-6xl lg:text-[5.5rem] font-bold tracking-tight mb-10 leading-[1.1] transition-colors duration-700 ${isDark ? 'text-white' : 'text-slate-900'}`}
                    >
                        Why Brands <span className={`text-transparent bg-clip-text bg-gradient-to-br ${isDark ? 'from-[#F05E23] via-orange-200 to-white' : 'from-blue-500 via-emerald-200 to-slate-900'}`}>Choose Us</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className={`text-lg md:text-xl max-w-3xl font-light leading-relaxed text-center transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-slate-600'}`}
                    >
                        We don't just run campaigns; we build <span className={`font-medium ${isDark ? 'text-white/80' : 'text-slate-900/80'}`}>scalable digital ecosystems</span>. Here is what makes us different.
                    </motion.p>
                </div>

                {/* Performance Grid */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: feature.delay, duration: 0.8 }}
                            className={`group relative p-12 rounded-[3.5rem] border backdrop-blur-3xl overflow-hidden transition-all duration-700 ${isDark ? 'bg-white/[0.02] border-white/5 hover:border-[#F05E23]/30 hover:bg-white/[0.04]' : 'bg-slate-100/50 border-slate-200 hover:border-blue-600/20 hover:bg-slate-100/50 hover:shadow-2xl hover:shadow-blue-500/5'}`}
                        >
                            {/* Card Decorative Index */}
                            <div className={`absolute top-10 right-12 font-[var(--font-chakra-petch)] text-[1rem] font-bold transition-colors duration-700 ${isDark ? 'text-white/20' : 'text-zinc-800'}`}>
                                [ 0{i + 1} ]
                            </div>

                            {/* Digital Scanline Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%)] bg-[size:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                            {/* Inner Bevel Highlight */}
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"></div>

                            {/* Icon Architecture */}
                            <div className={`relative z-10 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-12 border transition-all duration-700 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] ${isDark ? 'bg-[#0A0A0B] border-white/5 group-hover:border-[#F05E23]/30' : 'bg-[#0A0A0B] border-white/5 group-hover:border-blue-600/30'}`}>
                                <div className={`transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 ${isDark ? 'text-[#F05E23]' : 'text-blue-500'}`}>
                                    {feature.icon}
                                </div>

                                {/* Pulse Ring */}
                                <div className={`absolute inset-[-6px] border border-transparent rounded-[2.2rem] transition-all duration-1000 ${isDark ? 'group-hover:border-[#F05E23]/10' : 'group-hover:border-blue-600/10'}`}></div>
                            </div>

                            {/* Narrative Content */}
                            <div className="relative z-10">
                                <h3 className={`text-2xl font-bold mb-6 tracking-tight flex items-center justify-between transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {feature.title}
                                    <ArrowUpRight className={`w-5 h-5 opacity-20 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ${isDark ? 'text-[#F05E23]' : 'text-blue-600'}`} />
                                </h3>
                                <p className={`text-[1.05rem] leading-relaxed font-light transition-colors duration-700 ${isDark ? 'text-white/40 group-hover:text-white/60' : 'text-slate-600 group-hover:text-slate-700'}`}>
                                    {feature.desc}
                                </p>
                            </div>

                            {/* Growth Indicator line */}
                            <div className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-1000 group-hover:w-full ${isDark ? 'bg-gradient-to-r from-transparent via-[#F05E23] to-transparent' : 'bg-gradient-to-r from-transparent via-blue-600 to-transparent'}`}></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

