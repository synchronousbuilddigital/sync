"use client";

import { motion } from "framer-motion";
import { useTheme } from './ThemeContext';

const partners = [
    { name: "BOXFOX", logo: "/logos/logo1.png" },
    { name: "RYM Grenergy", logo: "/logos/logo2.png" },
    { name: "Vegavruddhi", logo: "/logos/logo3.png" },
    { name: "BWorth", logo: "/logos/logo4.png" },
    { name: "Fashquick", logo: "/logos/logo5.png" },
    { name: "PRL Roadlines", logo: "/logos/logo6.png" },
];

export default function VerifiedOutcomes() {
    const { isDark } = useTheme();

    return (
        <section className={`w-full py-24 overflow-hidden border-t transition-colors duration-700 ${isDark ? 'bg-[#0A0A0A] border-white/5' : 'bg-[#F9F9F9] border-black/5'}`}>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[0.6rem] font-black uppercase tracking-[0.3em] transition-colors duration-500 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F05E23]"></div>
                        Verified Outcomes
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className={`text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] font-bold tracking-tighter leading-[0.9] mb-8 transition-colors duration-700 ${isDark ? 'text-white' : 'text-[#111]'}`}
                    >
                        Success <br />
                        <span className="text-[#F05E23]">Synchronized.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className={`text-sm sm:text-lg font-medium max-w-xl mx-auto leading-relaxed transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-slate-500'}`}
                    >
                        Global industry leaders leveraging our surgical digital frameworks for market dominance.
                    </motion.p>
                </div>

                {/* Infinite Logo Marquee or Grid */}
                <div className="relative mt-20 group">
                    <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-20 md:gap-32 opacity-40 hover:opacity-100 transition-opacity duration-1000">
                        {/* Placeholder for Logos - User can replace with real ones */}
                        {partners.map((partner, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, filter: "grayscale(100%)" }}
                                whileInView={{ opacity: 1 }}
                                whileHover={{ filter: "grayscale(0%)", scale: 1.1 }}
                                transition={{ delay: i * 0.1 }}
                                className="h-8 md:h-12 w-auto flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500"
                            >
                                <span className={`text-xl md:text-2xl font-black tracking-tighter uppercase whitespace-nowrap transition-colors duration-500 ${isDark ? 'text-white/20 group-hover:text-white' : 'text-slate-300 group-hover:text-slate-900'}`}>
                                    {partner.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

