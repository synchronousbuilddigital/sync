import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import { ArrowUpRight, Star, Zap, TrendingUp, Cpu } from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeContext";

const services = [
    {
        num: "01",
        title: "WE BUILD YOUR BRAND.",
        desc: "We help you stand out with a professional brand look and a strategy that helps you grow for years to come.",
        metrics: { Growth: "+42%", Speed: "Fast", Value: "High" },
        features: [
            "Logo & Visual Design",
            "Business Strategy",
            "Brand Voice & Style",
            "Full Design Rules",
            "Customer Connection",
            "Clean Look & Feel"
        ],
        link: "/services/brand-systems"
    },
    {
        num: "02",
        title: "DIGITAL SHOP & APPS.",
        desc: "High-speed websites and mobile apps that work perfectly and help you turn more visitors into customers.",
        metrics: { Growth: "+58%", Speed: "Instant", Value: "Premium" },
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
        num: "03",
        title: "GROW YOUR SALES.",
        desc: "Smart marketing plans that find your best customers and help you get the most out of your budget.",
        metrics: { Growth: "+71%", Speed: "Steady", Value: "High ROAS" },
        features: [
            "Smart Ad Campaigns",
            "Social Media Growth",
            "Simple Sales Funnels",
            "Creative Ad Testing",
            "Budget Optimization",
            "Customer Retention"
        ],
        link: "/services/growth-engine"
    },
    {
        num: "04",
        title: "SMART AI TOOLS.",
        desc: "Use friendly AI assistants to handle everyday tasks so you and your team can focus on what matters most.",
        metrics: { Growth: "Large", Speed: "Instant", Value: "Auto" },
        features: [
            "Custom AI Assistants",
            "Task Automation",
            "Smart Business Help",
            "Workplace Efficiency",
            "Simple Process Bots",
            "Helpful AI Insights"
        ],
        link: "/services/ai-automation"
    }
];

export default function AccordionServices() {
    const [openIndex, setOpenIndex] = useState(null);
    const { isDark } = useTheme();
    const sectionRef = useRef(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <section
            ref={sectionRef}
            className={`relative w-full py-24 lg:py-32 transition-colors duration-500 overflow-hidden ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-[#FAFAF8] text-[#0F1729]'}`}
            onMouseMove={handleMouseMove}
        >
            {/* Simple Grid Background */}
            <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-700`}>
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(to right, rgba(240, 94, 35, ${isDark ? '0.08' : '0.05'}) 1px, transparent 1px), linear-gradient(to bottom, rgba(240, 94, 35, ${isDark ? '0.08' : '0.05'}) 1px, transparent 1px)`,
                    backgroundSize: '100px 100px',
                    maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
                }}></div>
            </div>

            {/* Ambient Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] lg:w-[40%] lg:h-[40%] rounded-full bg-[#F05E23] opacity-[0.06] dark:opacity-[0.04] blur-[100px] lg:blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] lg:w-[30%] lg:h-[40%] rounded-full bg-[#F05E23] opacity-[0.05] dark:opacity-[0.03] blur-[100px] lg:blur-[120px]"></div>
            </div>

            <motion.div
                className="pointer-events-none absolute -inset-px z-0"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            450px circle at ${mouseX}px ${mouseY}px,
                            rgba(240, 94, 35, 0.06),
                            transparent 80%
                        )
                    `
                }}
            />

            <div className="relative z-10 max-w-[1500px] mx-auto px-6 md:px-12 w-full flex flex-col flex-1 overflow-hidden">
                
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-12 sm:mb-20 shrink-0"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F05E23]/10 border border-[#F05E23]/20 mb-4 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                        <span className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#F05E23]">What we do</span>
                    </div>

                    <h2 className={`text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] ${isDark ? 'text-white' : 'text-[#0F1729]'}`}>
                        Simple <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F05E23] to-orange-400">Expert Solutions.</span>
                    </h2>

                    <p className={`mt-6 text-sm sm:text-base font-light max-w-sm xl:max-w-xl leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        We create friendly, high-speed digital systems to help your business grow easily. 
                        Explore our expert services.
                    </p>
                </motion.div>

                {/* Cards Container */}
                <div 
                    className="relative flex flex-col lg:flex-row gap-4 mb-4 lg:mb-10 lg:h-[700px] min-h-[500px]"
                    onMouseLeave={() => setOpenIndex(null)}
                >
                    {services.map((service, index) => {
                        const isOpen = openIndex === index;
                        const isSomethingHovered = openIndex !== null;

                        return (
                            <motion.div
                                key={index}
                                layout
                                className={`group border rounded-3xl overflow-hidden cursor-pointer relative flex flex-col lg:flex-row transition-all duration-300 ${isDark ? 'border-neutral-800 bg-[#0A0A0A]' : 'border-neutral-200 bg-white shadow-xl shadow-black/5'} ${isOpen ? 'grayscale-0 opacity-100 ring-1 ring-blue-500/20' : (isSomethingHovered ? 'grayscale opacity-20' : 'grayscale-0 opacity-100')}`}
                                onMouseEnter={() => setOpenIndex(index)}
                                animate={{
                                    flex: !isSomethingHovered ? "1 1 0%" : (isOpen ? "1 1 auto" : "0 0 100px"),
                                }}
                                transition={{ 
                                    duration: 0.5, 
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                style={{ 
                                    willChange: "flex, opacity",
                                }}
                            >
                                {/* Spine / Tab */}
                                <div className={`flex lg:flex-col items-center lg:items-center justify-between lg:justify-start p-4 lg:p-10 h-16 lg:h-full lg:w-24 shrink-0 transition-all duration-300 ${isOpen ? (isDark ? 'border-r border-neutral-800' : 'border-r border-neutral-100') : ''} ${!isOpen && isSomethingHovered ? 'flex' : 'hidden'}`}>
                                    <div className="flex lg:flex-col items-center gap-3">
                                        <span className={`text-base lg:text-xl font-black ${isOpen ? 'text-[#F05E23]' : (isDark ? 'text-neutral-700' : 'text-neutral-400')}`}>{service.num} .</span>
                                    </div>

                                    {!isOpen && isSomethingHovered && (
                                        <div className="hidden lg:flex flex-1 items-center justify-center -rotate-180" style={{ writingMode: 'vertical-rl' }}>
                                            <h3 className="text-xl font-black tracking-widest whitespace-nowrap text-neutral-500 uppercase">
                                                {service.title.split(' ')[0]}
                                            </h3>
                                        </div>
                                    )}
                                </div>

                                {/* Content area */}
                                <div className="flex-1 overflow-hidden relative h-full">
                                    <div className={`p-8 lg:p-12 xl:p-16 flex flex-col justify-between h-full w-full absolute inset-0 transition-opacity duration-300 ${!isOpen && isSomethingHovered ? 'opacity-0' : 'opacity-100'}`}>
                                        
                                        <div className="relative z-10 w-full lg:max-w-4xl">
                                            {/* Header Content */}
                                            <div className="mb-6 lg:mb-12">
                                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                                    <span className="text-[0.7rem] font-black text-[#F05E23] uppercase">Service {service.num}</span>
                                                    {!isSomethingHovered && (
                                                        <span className={`text-[0.6rem] font-bold uppercase px-2 py-0.5 rounded border ${isDark ? 'border-neutral-800 text-neutral-600' : 'border-neutral-200 text-neutral-400'}`}>Expert Help</span>
                                                    )}
                                                </div>
                                                
                                                <h3 className={`font-black tracking-tight leading-[1.02] transition-all duration-500 ${isDark ? 'text-white' : 'text-black'} ${isOpen ? 'text-3xl sm:text-5xl lg:text-7xl mb-8' : 'text-xl sm:text-2xl lg:text-3xl'}`}>
                                                    {service.title}
                                                </h3>

                                                {!isSomethingHovered && (
                                                    <motion.p 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className={`mt-6 text-sm lg:text-base font-light leading-relaxed transition-colors duration-300 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}
                                                    >
                                                        {service.desc}
                                                    </motion.p>
                                                )}
                                            </div>
                                            
                                            {/* Expanded Body Content */}
                                            <motion.div
                                                animate={{ 
                                                    opacity: isOpen ? 1 : 0,
                                                    y: isOpen ? 0 : 20
                                                }}
                                                transition={{ duration: 0.4 }}
                                                className={isOpen ? "block" : "hidden"}
                                            >
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20">
                                                    <div>
                                                        <p className={`text-sm lg:text-base xl:text-lg font-medium leading-relaxed mb-10 ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                                            {service.desc}
                                                        </p>

                                                        <div className="grid grid-cols-3 gap-6 p-6 rounded-2xl bg-[#F05E23]/[0.03] border border-[#F05E23]/10">
                                                            {Object.entries(service.metrics).map(([key, val]) => (
                                                                <div key={key} className="flex flex-col">
                                                                    <span className="text-[0.6rem] font-black text-[#F05E23] uppercase opacity-70 mb-1">{key}</span>
                                                                    <span className={`text-xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>{val}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-[0.7rem] font-black text-[#F05E23] uppercase mb-6 opacity-60">Key Features</h4>
                                                        <ul className="grid grid-cols-1 gap-y-4">
                                                            {service.features.map((feature, i) => (
                                                                <li
                                                                    key={i}
                                                                    className={`flex items-center gap-4 text-xs xl:text-sm font-bold tracking-tight transition-colors duration-300 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}
                                                                >
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#F05E23]" />
                                                                    {feature}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>

                                        <div className="mt-auto relative z-10 w-full border-t border-neutral-500/10 pt-6">
                                            {/* Open State Button */}
                                            <motion.div 
                                                animate={{ 
                                                    opacity: isOpen ? 1 : 0,
                                                    y: isOpen ? 0 : 20
                                                }}
                                                className={isOpen ? "block mt-4" : "hidden"}
                                            >
                                                <Link
                                                    href={service.link}
                                                    className={`group/btn inline-flex items-center justify-center gap-6 px-12 py-5 rounded-full font-black text-[0.7rem] tracking-widest uppercase transition-all duration-300 shadow-xl ${isDark ? 'bg-white text-black hover:bg-[#F05E23] hover:text-white' : 'bg-black text-white hover:bg-[#F05E23]'}`}
                                                >
                                                    Start Today
                                                    <ArrowUpRight strokeWidth={3} className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                                                </Link>
                                            </motion.div>

                                            {/* Idle State Footer */}
                                            {!isSomethingHovered && (
                                                <div className="flex items-center justify-between opacity-30">
                                                    <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase">See details</span>
                                                    <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase">Trusted Help</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}