"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeContext";

const services = [
    {
        num: "01 //",
        title: "BRAND ARCHITECTURES.",
        desc: "Surgical brand positioning and visual systems engineered for category dominance and high-equity compounding.",
        features: [
            "Identity & Visual Systems",
            "Category Positioning",
            "Market Archetyping",
            "Comprehensive Brand Guidelines"
        ],
        link: "/services/brand-systems"
    },
    {
        num: "02 //",
        title: "ECOSYSTEM ENGINEERING.",
        desc: "Performance-obsessed digital platforms built on headless architectures with sub-100ms latency and 4x conversion lift.",
        features: [
            "Headless Commerce & CMS",
            "Progressive Web Apps (PWA)",
            "System API Microservices",
            "Conversion Rate Optimization"
        ],
        link: "/services/digital-platforms"
    },
    {
        num: "03 //",
        title: "ACQUISITION FRAMEWORKS.",
        desc: "Multi-channel growth engines powered by predictive models and surgical arbitrage to maximize ROAS and scale equity.",
        features: [
            "Predictive LTV Modeling",
            "Omnichannel Paid Media",
            "Automated Funnel Optimization",
            "High-Frequency Creative Testing"
        ],
        link: "/services/growth-engine"
    },
    {
        num: "04 //",
        title: "NEURAL INTEGRATION.",
        desc: "Deploying custom LLM agents and agentic workflows into core operations to automate human-level cognitive tasks at scale.",
        features: [
            "Custom LLM Agent Training",
            "Agentic Workflow Automation",
            "Predictive Operations",
            "Cognitive Task Replacement"
        ],
        link: "/services/ai-automation"
    }
];

export default function AccordionServices() {
    const [openIndex, setOpenIndex] = useState(0);
    const { isDark } = useTheme();

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <section
            className={`relative w-full py-24 lg:py-32 transition-colors duration-500 overflow-hidden ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-[#FAFAF8] text-[#0F1729]'}`}
            onMouseMove={handleMouseMove}
        >
            {/* Grid Background */}
            <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-700`}>
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(to right, rgba(255, 107, 53, ${isDark ? '0.08' : '0.05'}) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 107, 53, ${isDark ? '0.08' : '0.05'}) 1px, transparent 1px)`,
                    backgroundSize: '100px 100px',
                    maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
                }}></div>
                {/* Random Animated Orange Squares */}
                <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                    className="absolute top-[200px] left-[300px] w-[100px] h-[100px] bg-[#F05E23]/20 dark:bg-[#F05E23]/30"
                />
                <motion.div
                    animate={{ opacity: [0, 0.8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="absolute top-[500px] right-[200px] w-[100px] h-[100px] bg-[#F05E23]/20 dark:bg-[#F05E23]/30"
                />
                <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                    className="absolute bottom-[300px] left-[200px] w-[100px] h-[100px] bg-[#F05E23]/20 dark:bg-[#F05E23]/30"
                />
                <motion.div
                    animate={{ opacity: [0, 0.9, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[100px] right-[500px] w-[100px] h-[100px] bg-[#F05E23]/20 dark:bg-[#F05E23]/30"
                />
            </div>

            {/* Ambient Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] lg:w-[40%] lg:h-[40%] rounded-full bg-[#F05E23] opacity-[0.06] dark:opacity-[0.04] blur-[100px] lg:blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] lg:w-[30%] lg:h-[40%] rounded-full bg-[#F05E23] opacity-[0.05] dark:opacity-[0.03] blur-[100px] lg:blur-[120px]"></div>
            </div>

            <motion.div
                className="pointer-events-none absolute -inset-px transition duration-300 z-0"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            600px circle at ${mouseX}px ${mouseY}px,
                            rgba(240, 94, 35, 0.08),
                            transparent 80%
                        )
                    `
                }}
            />

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#F05E23]">Capabilities</span>
                </div>

                <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-tight ${isDark ? 'text-white' : 'text-[#0F1729]'}`}>
                    Visualizing <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F05E23] to-orange-400">Solutions.</span>
                </h2>

                <p className={`mt-6 text-sm sm:text-base font-light max-w-sm xl:max-w-xl ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    Engineered ecosystems designed for exponential scale and uncompromising performance.
                    Click to explore our surgical methodologies.
                </p>
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 h-[600px] lg:h-[500px] flex flex-col lg:flex-row gap-4">
                {services.map((service, index) => {
                    const isOpen = openIndex === index;

                    return (
                        <motion.div
                            key={index}
                            className={`group border rounded-3xl overflow-hidden cursor-pointer relative flex flex-col lg:flex-row ${isDark ? 'border-neutral-800 bg-[#121212]' : 'border-neutral-200 bg-white shadow-xl shadow-black/5'} ${isOpen ? 'lg:flex-[4] flex-[4]' : 'lg:flex-[1] flex-[1] hover:bg-black/5 dark:hover:bg-white/5'}`}
                            onClick={() => setOpenIndex(index)}
                            animate={{
                                flexGrow: isOpen ? 6 : 1,
                            }}
                            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                        >
                            {/* Vertical Book Spine Tab (Visible mostly when closed on desktop, or top bar on mobile) */}
                            <div className={`flex lg:flex-col items-center lg:items-center justify-between lg:justify-start p-6 lg:p-8 h-16 lg:h-full lg:w-24 shrink-0 transition-opacity duration-300 ${isOpen ? (isDark ? 'border-r border-neutral-800' : 'border-r border-neutral-100') : ''}`}>
                                <div className="flex lg:flex-col items-center gap-3">
                                    <span className={`text-sm lg:text-base font-bold tracking-widest ${isOpen ? (isDark ? 'text-white' : 'text-black') : 'text-neutral-500'}`}>{service.num}</span>
                                </div>

                                {/* Vertical title for desktop when closed */}
                                {!isOpen && (
                                    <div className="hidden lg:flex flex-1 items-center justify-center -rotate-180" style={{ writingMode: 'vertical-rl' }}>
                                        <h3 className="text-xl font-black tracking-widest whitespace-nowrap text-neutral-400 group-hover:text-[#F05E23] transition-colors">
                                            {service.title}
                                        </h3>
                                    </div>
                                )}
                            </div>

                            {/* Expandable Content Area */}
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                        className="flex-1 p-6 lg:p-12 flex flex-col justify-between overflow-hidden relative"
                                    >
                                        <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                                            {service.num.split(" ")[0]}
                                        </div>

                                        <div>
                                            <h3 className={`text-2xl sm:text-3xl lg:text-5xl font-black tracking-tighter mb-4 lg:mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
                                                {service.title}
                                            </h3>
                                            <p className={`text-sm lg:text-base xl:text-lg font-light max-w-2xl leading-relaxed mb-6 ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                                {service.desc}
                                            </p>

                                            <ul className="space-y-3">
                                                {service.features.map((feature, i) => (
                                                    <motion.li
                                                        key={i}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.3 + (i * 0.1), duration: 0.4 }}
                                                        className={`flex items-center gap-3 text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23]" />
                                                        {feature}
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="mt-8 lg:mt-0">
                                            <Link
                                                href={service.link}
                                                className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 ${isDark ? 'bg-white text-black hover:bg-[#F05E23] hover:text-white' : 'bg-black text-white hover:bg-[#F05E23]'}`}
                                            >
                                                Learn More
                                                <ArrowUpRight strokeWidth={2.5} className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}