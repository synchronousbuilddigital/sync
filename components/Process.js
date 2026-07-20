"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { Search, Compass, Cpu, Rocket, TrendingUp, ArrowRight } from "lucide-react";
import { useTheme } from './ThemeContext';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const steps = [
    {
        id: "01",
        label: "REVIEW",
        title: "Expert Review",
        desc: "We look at your business and find the best ways for you to grow online.",
        icon: <Search className="w-6 h-6 md:w-8 md:h-8" />,
        color: "#F05E23",
        tag: "Track 01"
    },
    {
        id: "02",
        label: "PLANNING",
        title: "Strategy",
        desc: "We create a custom plan to help you get more customers and build long-term value.",
        icon: <Compass className="w-6 h-6 md:w-8 md:h-8" />,
        color: "#F05E23",
        tag: "Track 02"
    },
    {
        id: "03",
        label: "BUILD",
        title: "Build",
        desc: "We build fast, high-quality websites and apps that match your brand perfectly.",
        icon: <Cpu className="w-6 h-6 md:w-8 md:h-8" />,
        color: "#F05E23",
        tag: "Track 03"
    },
    {
        id: "04",
        label: "MARKETING",
        title: "Growth",
        desc: "We start smart marketing plans to find new customers and keep them coming back.",
        icon: <Rocket className="w-6 h-6 md:w-8 md:h-8" />,
        color: "#F05E23",
        tag: "Track 04"
    },
    {
        id: "05",
        label: "SUPPORT",
        title: "Scaling",
        desc: "We keep improving your systems to help your business stay ahead and grow automatically.",
        icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />,
        color: "#F05E23",
        tag: "Track 05"
    }
];

export default function Process() {
    const { isDark } = useTheme();
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);
    const trackRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) return;

        gsap.registerPlugin(ScrollTrigger);

        let ctx = gsap.context(() => {
            const tracks = trackRef.current;
            if (!tracks) return;
            // Increased distance for "mandatory" feel
            const scrollWidth = tracks.scrollWidth - window.innerWidth;
            const totalScrollDistance = scrollWidth + (window.innerHeight * 0.4);

            gsap.to(tracks, {
                x: -scrollWidth,
                ease: "none",
                scrollTrigger: {
                    trigger: triggerRef.current,
                    pin: true,
                    scrub: 1.5, // Slightly heavier feel
                    start: "top top",
                    end: () => `+=${totalScrollDistance}`,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    snap: {
                        snapTo: 1 / (steps.length), // Including the CTA as a snap point
                        duration: { min: 0.3, max: 0.7 },
                        delay: 0.05,
                        ease: "power2.inOut"
                    },
                    onUpdate: (self) => {
                        // We can use this to update some state if needed
                    }
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Framer Motion for some ambient UI and mobile vertical view
    const { scrollYProgress } = useScroll({
        target: triggerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
    const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

    return (
        <section
            ref={sectionRef}
            className={`w-full relative overflow-visible selection:bg-[#F05E23]/20 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}
        >
            <div ref={triggerRef} className="min-h-0 lg:h-screen w-full relative overflow-hidden pt-12 pb-2 sm:pb-12 lg:py-0">

                {/* Mandatory Progress Bar (Right Side) */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 h-[30vh] w-1 rounded-full bg-white/5 z-50 overflow-hidden hidden lg:block">
                    <motion.div
                        style={{ height: progressHeight }}
                        className="w-full bg-[#F05E23] origin-top shadow-[0_0_15px_#F05E23]"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between items-center py-2 text-[0.5rem] font-bold text-white/20">
                    </div>
                </div>

                {/* Background Grid & Lighting */}
                <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000">
                    <div className={`absolute inset-0 opacity-[0.03] ${isDark ? 'invert' : ''}`}
                        style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                    <motion.div
                        className="absolute inset-0 -z-10 opacity-[0.1] blur-[150px] pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle at 30% 50%, #F05E23, transparent 70%)',
                            x: useTransform(smoothProgress, [0, 1], [-200, 200])
                        }}
                    />
                </div>

                {/* MOBILE VIEW: Infinite Right-to-Left Scroll Layout */}
                <div className="block lg:hidden relative z-10 w-full px-6 flex flex-col justify-center">
                    <div className="max-w-xl mb-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className={`inline-flex items-center gap-3 px-4 py-2 border rounded-full mb-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}
                        >
                            <span className="w-2 h-2 rounded-full bg-[#F05E23] animate-pulse shadow-[0_0_8px_#F05E23]"></span>
                            <span className={`text-[0.6rem] font-bold tracking-[0.4em] uppercase ${isDark ? 'text-white/60' : 'text-black/60'}`}>Our Process</span>
                        </motion.div>
                        <h2 className={`text-4xl font-bold tracking-tighter leading-[0.95] ${isDark ? 'text-white' : 'text-black'}`}>
                            Growth <em className="not-italic text-[#F05E23]">Strategy</em>.
                        </h2>
                        <p className={`mt-4 text-sm font-light italic ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                            Find out how our simple steps help your business grow and reach more customers.
                        </p>
                    </div>

                    {/* Infinite Marquee Track Loop */}
                    <div className="w-full overflow-hidden py-4 -mx-6 px-6">
                        <motion.div
                            className="flex gap-5 w-max"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 45,
                                    ease: "linear",
                                },
                            }}
                        >
                            {[...steps, ...steps].map((step, index) => (
                                <div
                                    key={index}
                                    className={`w-[85vw] max-w-sm shrink-0 p-6 sm:p-8 rounded-[2.5rem] border transition-all ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/10 shadow-xl'}`}
                                >
                                    <div className="flex items-center gap-5 mb-6">
                                        <div className={`w-16 h-16 rounded-[1.8rem] border flex items-center justify-center text-[#F05E23] shrink-0 ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                                            <div className="scale-110">{step.icon}</div>
                                        </div>
                                        <div>
                                            <span className="text-[0.6rem] font-black text-[#F05E23] tracking-[0.3em] uppercase block mb-1">[{step.label}]</span>
                                            <h3 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                                                {step.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className={`p-6 rounded-[1.8rem] border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
                                        <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* DESKTOP VIEW: GSAP Interactive Pin & Scroll Layout */}
                <div className="hidden lg:flex h-full flex-col justify-center relative z-10">
                    {/* Persistent Header */}
                    <div className="absolute top-16 left-6 md:top-28 md:left-12 max-w-xl pr-6 z-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className={`inline-flex items-center gap-3 px-4 py-2 border rounded-full mb-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}
                        >
                            <span className="w-2 h-2 rounded-full bg-[#F05E23] animate-pulse shadow-[0_0_8px_#F05E23]"></span>
                            <span className={`text-[0.6rem] font-bold tracking-[0.4em] uppercase ${isDark ? 'text-white/60' : 'text-black/60'}`}>Our Process</span>
                        </motion.div>
                        <h2 className={`text-[2.5rem] md:text-[5rem] font-bold tracking-tighter leading-[0.9] ${isDark ? 'text-white' : 'text-black'}`}>
                            Growth <em className="not-italic text-[#F05E23]">Strategy</em>.
                        </h2>
                        <p className={`mt-10 text-[0.9rem] font-light italic max-w-sm ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                            Find out how our simple steps help your business grow and reach more customers.
                        </p>
                    </div>

                    {/* Horizontal Tracks Container */}
                    <div ref={trackRef} className="flex flex-nowrap h-full items-center pl-[5vw] lg:pl-[40vw] pt-24 md:pt-32">
                        {steps.map((step, index) => (
                            <div key={index} className="w-[90vw] lg:w-[60vw] shrink-0 px-[5vw] flex flex-col justify-center pt-24 md:pt-40 relative group">

                                {/* Track Connection Line (SVG) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 left-[calc(100%-8vw)] w-[16vw] h-px z-0">
                                        <svg width="100%" height="60" viewBox="0 0 100 60" preserveAspectRatio="none" className="overflow-visible">
                                            <path d="M 0 30 C 25 30, 25 10, 50 10 C 75 10, 75 50, 100 50" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="2" fill="none" />
                                            <motion.path
                                                d="M 0 30 C 25 30, 25 10, 50 10 C 75 10, 75 50, 100 50"
                                                stroke="#F05E23" strokeWidth="4" fill="none"
                                                initial={{ pathLength: 0 }}
                                                whileInView={{ pathLength: 1 }}
                                                transition={{ duration: 1.5, delay: 0.2 }}
                                                className="drop-shadow-[0_0_10px_#F05E23]"
                                            />
                                        </svg>
                                    </div>
                                )}

                                <div className="max-w-xl">
                                    <div className="flex items-start gap-8 mb-12">
                                        {/* Step ID & Indicator */}
                                        <div className="relative shrink-0">
                                            <div className={`w-20 h-20 md:w-28 md:h-28 rounded-[2.5rem] md:rounded-[3rem] border flex items-center justify-center text-[#F05E23] transition-all duration-700 bg-white/5 border-white/10 group-hover:bg-[#F05E23] group-hover:text-white group-hover:shadow-[0_0_50px_rgba(240,94,35,0.4)] ${!isDark && 'bg-white shadow-xl'}`}>
                                                <div className="scale-110">{step.icon}</div>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <span className="text-[0.6rem] font-black text-[#F05E23] tracking-[0.3em] uppercase block mb-3">[{step.label}]</span>
                                            <h3 className={`text-3xl md:text-5xl font-bold tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
                                                {step.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className={`p-8 rounded-[2.5rem] border transition-all duration-700 ${isDark ? 'bg-white/[0.02] border-white/5 group-hover:bg-white/[0.05] group-hover:border-white/10' : 'bg-black/[0.01] border-black/5 group-hover:bg-black/[0.03] group-hover:border-black/10'}`}>
                                        <p className={`text-[1rem] md:text-[1.15rem] font-light leading-relaxed ${isDark ? 'text-white/40 group-hover:text-white/60' : 'text-black/40 group-hover:text-black/60'}`}>
                                            {step.desc}
                                        </p>
                                    </div>

                                    <div className="mt-12 flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <div className="h-px flex-grow bg-gradient-to-r from-[#F05E23]/40 to-transparent" />
                                        <span className="text-[0.65rem] font-bold tracking-widest text-[#F05E23] uppercase">ACTIVE</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Final CTA Track */}
                        <div className="w-[90vw] lg:w-[60vw] shrink-0 px-[10vw] flex flex-col justify-center items-center pt-24 md:pt-40">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                className="text-center"
                            >
                                <h3 className={`text-3xl md:text-5xl font-bold mb-10 mt-10 ${isDark ? 'text-white' : 'text-black'}`}>Ready to build your <br /><em className="not-italic text-[#F05E23]">Growth Track.</em></h3>
                                <Link href="/process" className={`group flex items-center gap-8 px-12 py-5 border rounded-full text-[0.8rem] font-black uppercase tracking-[0.4em] transition-all duration-700 shadow-2xl ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-[#F05E23] hover:border-[#F05E23]' : 'bg-black/5 border-black/10 text-black hover:bg-black hover:text-white'}`}>
                                    Learn our full process
                                    <div className="w-8 h-8 rounded-full bg-[#F05E23] flex items-center justify-center group-hover:bg-white transition-all">
                                        <ArrowRight className="w-4 h-4 text-white group-hover:text-[#F05E23]" strokeWidth={3} />
                                    </div>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Buffer Space */}
                        <div className="w-[20vw] shrink-0" />
                    </div>
                </div>

                {/* Progress Strip */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                    {steps.map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                            <div className={`w-2 h-2 rounded-full transition-all duration-500`}
                                style={{ backgroundColor: '#F05E23', opacity: 0.2 }} />
                        </div>
                    ))}
                    {/* Active Indicator overlay would go here mapped to smoothProgress */}
                </div>

            </div>
        </section>
    );
}

