"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const partners = [
    { name: "Brand 1", logo: "/logos/logo1.png" },
    { name: "Brand 2", logo: "/logos/logo2.png" },
    { name: "Brand 3", logo: "/logos/logo3.png" },
    { name: "Brand 4", logo: "/logos/logo4.png" },
    { name: "Brand 5", logo: "/logos/logo5.png" },
    { name: "Brand 6", logo: "/logos/logo6.png" },
];

export default function VerifiedOutcomes() {
    return (
        <section className="w-full py-24 bg-[#F9F9F9] overflow-hidden border-t border-black/5">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black mb-6 text-[0.6rem] font-black uppercase tracking-[0.3em] text-white"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F05E23]"></div>
                        Verified Outcomes
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] font-bold tracking-tighter text-[#111] leading-[0.9] mb-8"
                    >
                        Success <br />
                        <span className="text-[#F05E23]">Synchronized.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-500 text-sm sm:text-lg font-medium max-w-xl mx-auto leading-relaxed"
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
                                <span className="text-xl md:text-2xl font-black text-slate-300 group-hover:text-slate-900 tracking-tighter uppercase whitespace-nowrap">
                                    {partner.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Gradient Shields for Marquee look if needed, but grid is cleaner for small sets */}
                </div>
            </div>
        </section>
    );
}
