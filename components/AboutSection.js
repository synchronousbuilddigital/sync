"use client";

import Link from 'next/link';
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const expertiseItems = [
    {
        id: "01",
        version: "v3.1",
        title: "BRAND ARCHITECTURES.",
        desc: "Surgical brand positioning and visual systems engineered for category dominance and high-equity compounding.",
        image: "/brand-arch.png",
        link: "/services/branding"
    },
    {
        id: "02",
        version: "v3.1",
        title: "ECOSYSTEM ENGINEERING.",
        desc: "Performance-obsessed digital platforms built on headless architectures with sub-100ms latency and 4x conversion lift.",
        image: "/digital-eco.png",
        link: "/services/ecosystems"
    },
    {
        id: "03",
        version: "v3.1",
        title: "ACQUISITION FRAMEWORKS.",
        desc: "Multi-channel growth engines powered by predictive models and surgical arbitrage to maximize ROAS and scale equity.",
        image: "/growth-eng.png",
        link: "/services/acquisition"
    },
    {
        id: "04",
        version: "v3.1",
        title: "NEURAL INTEGRATION.",
        desc: "Deploying custom LLM agents and agentic workflows into core operations to automate human-level cognitive tasks at scale.",
        image: "/neural-marketing.png",
        link: "/services/ai"
    }
];

export default function AboutSection() {
    const sectionRef = useRef(null);

    return (
        <section ref={sectionRef} className="w-full py-24 bg-white relative overflow-hidden font-sans">
            {/* Grid Background with vertical fade at top/bottom removed for hard cut */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(to right, rgba(255, 107, 53, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 107, 53, 0.05) 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-8 relative z-10">

                {/* Header Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black mb-8 text-[0.65rem] font-black uppercase tracking-[0.3em] text-white"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]"></div>
                    Expertise
                </motion.div>

                {/* Main Heading & Subtext */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[4rem] sm:text-[5rem] lg:text-[7rem] font-bold tracking-[-0.04em] text-[#111] leading-[0.85]"
                    >
                        Visualizing <span className="text-[#FF6B35]">Solutions.</span>
                    </motion.h2>

                    <div className="flex flex-col items-start md:items-end text-left md:text-right md:max-w-xs gap-4">
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-[0.75rem] font-medium text-slate-500 uppercase tracking-wider leading-relaxed"
                        >
                            Cutting-edge strategies powered by AI, data, and world-class design logic.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            <Link href="/directory" className="inline-flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-widest hover:text-[#FF6B35] transition-colors">
                                Explore Full Directory <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Expertise Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {expertiseItems.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: idx * 0.1, duration: 0.8 }}
                            className="group relative"
                        >
                            <div className="p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-white border border-black/5 hover:border-[#FF6B35]/20 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(255,107,53,0.08)] overflow-hidden flex flex-col min-h-[400px] sm:min-h-[550px] h-full">

                                {/* Card Header */}
                                <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-6">
                                    <div className="flex items-center gap-2 text-[0.5rem] sm:text-[0.6rem] font-black text-black/30 tracking-widest uppercase">
                                        {item.id} // <span className="opacity-50">{item.version}</span>
                                    </div>
                                    <h3 className="text-sm sm:text-lg lg:text-xl font-black text-[#111] tracking-tighter leading-tight group-hover:text-[#FF6B35] transition-colors">
                                        {item.title}
                                    </h3>
                                </div>

                                <p className="text-slate-500 text-[0.7rem] sm:text-[0.85rem] leading-relaxed font-medium mb-6 sm:mb-8 line-clamp-3 sm:line-clamp-none">
                                    {item.desc}
                                </p>

                                {/* Card Image Container */}
                                <div className="mt-auto relative w-full h-[120px] sm:h-[220px] rounded-[1rem] sm:rounded-[1.2rem] overflow-hidden bg-[#F9F9F9] border border-black/[0.03]">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                    />
                                    {/* Corner Accents */}
                                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <Link
                                    href={item.link}
                                    className="mt-4 sm:mt-6 inline-flex items-center gap-2 text-[0.5rem] sm:text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#111] hover:text-[#FF6B35] transition-colors"
                                >
                                    Learn More <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 h-3" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

