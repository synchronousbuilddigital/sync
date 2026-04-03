"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from "react";
import { Sparkles, Zap, Target, Search, MousePointer2, BarChart3, Globe2, Rocket, ArrowRight, Sun, Moon } from 'lucide-react';
import Magnetic from './Magnetic';
import { useTheme } from './ThemeContext';

// Advanced Floating Card Component with Sophisticated Animations
const FloatingCard = ({ children, className, card, delay = 0, isStackHovered, index, activeIdx, hoveredIdx, setActiveIdx, setHoveredIdx }) => {
    const { isDark } = useTheme();
    const isActive = activeIdx === index;
    const isHovered = hoveredIdx === index;
    const cardRef = useRef(null);

    // Advanced mouse tracking for parallax
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const rotXMouse = useMotionValue(0);
    const rotYMouse = useMotionValue(0);

    // Spring animations for smooth follow
    const springRotX = useSpring(rotXMouse, { stiffness: 100, damping: 25 });
    const springRotY = useSpring(rotYMouse, { stiffness: 100, damping: 25 });
    const springMouseX = useSpring(mouseX, { stiffness: 150, damping: 30 });
    const springMouseY = useSpring(mouseY, { stiffness: 150, damping: 30 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        // Advanced parallax rotation based on mouse position
        const rotX = (y - 0.5) * 15; // Increased rotation range
        const rotY = (x - 0.5) * -15;

        mouseX.set(x);
        mouseY.set(y);
        rotXMouse.set(rotX);
        rotYMouse.set(rotY);
    };

    const handleMouseLeave = () => {
        rotXMouse.set(0);
        rotYMouse.set(0);
    };

    if (!card) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
                className={className}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={cardRef}
            onClick={(e) => {
                e.stopPropagation();
                setActiveIdx(isActive ? -1 : index);
            }}
            onMouseEnter={() => setHoveredIdx(index)}
            onMouseLeave={() => {
                setHoveredIdx(-1);
                handleMouseLeave();
            }}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
                opacity: 1,
                scale: isActive ? 1.15 : (isHovered ? 1.08 : 1),
                y: isStackHovered ? (index * 50) : (index * 2),
                x: isStackHovered ? (index * -60 - 60) : (index * 14),
                rotateZ: isStackHovered
                    ? (index * 12 - 12)
                    : (index !== undefined ? [0, -12, -6, 3][index + 1] : 0),
                zIndex: isActive ? 500 : (isHovered ? 400 : (20 - index)),
                height: (isHovered || isActive) ? "152px" : "144px"
            }}
            style={{
                transformPerspective: 1200,
                rotateX: isHovered ? springRotX : 0,
                rotateY: isHovered ? springRotY : 0,
            }}
            transition={{
                duration: 0.6,
                delay: isStackHovered ? (index * 0.08) : delay,
                ease: [0.23, 1, 0.32, 1]
            }}
            className={`${className} cursor-pointer group/card overflow-visible transition-all duration-300 relative ${isActive ? 'shadow-[0_45px_100px_-15px_rgba(240,94,35,0.4)] border-[#F05E23]/40' : 'hover:shadow-[0_60px_120px_-20px_rgba(240,94,35,0.5)] border-white/10'}`}
        >
            {/* Advanced glow effect */}
            <motion.div
                className="absolute -inset-2 rounded-2xl opacity-0 group-hover/card:opacity-60 transition-opacity duration-500 -z-10 blur-xl pointer-events-none"
                animate={{
                    background: (isHovered || isActive)
                        ? `conic-gradient(from 0deg, rgba(240,94,35,0.8), rgba(99,102,241,0.6), rgba(240,94,35,0.8))`
                        : `conic-gradient(from 0deg, rgba(240,94,35,0), rgba(99,102,241,0), rgba(240,94,35,0))`
                }}
                transition={{ duration: 2, repeat: (isHovered || isActive) ? Infinity : 0 }}
            />

            {/* Connecting line between cards when fanned */}
            {isStackHovered && index > 0 && (
                <motion.svg
                    className="absolute -top-8 -left-4 w-20 h-16 pointer-events-none z-0"
                    viewBox="0 0 80 64"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                    <motion.line
                        x1="10"
                        y1="0"
                        x2="60"
                        y2="60"
                        stroke="rgba(240, 94, 35, 0.5)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                    />
                </motion.svg>
            )}

            {/* Advanced hover light effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-0 rounded-2xl"
                style={{
                    background: useTransform(
                        [springMouseX, springMouseY],
                        ([x, y]) => `radial-gradient(300px circle at ${x * 100}% ${y * 100}%, rgba(240,94,35,0.15), rgba(99,102,241,0.08), transparent 85%)`
                    )
                }}
                animate={{
                    opacity: isHovered ? 1 : 0
                }}
                transition={{ duration: 0.4 }}
            />

            <div className="absolute inset-0 p-5 flex flex-col justify-between z-10 bg-white/[0.02]">
                <div className="flex justify-between items-start">
                    <motion.div
                        animate={{
                            scale: isHovered ? 1.1 : 1,
                            filter: isHovered ? "drop-shadow(0 0 12px rgba(240, 94, 35, 0.6))" : "drop-shadow(none)"
                        }}
                        transition={{ duration: 0.4 }}
                    >
                        {card.icon}
                    </motion.div>
                    <motion.div
                        animate={{
                            rotate: (isStackHovered || isHovered || isActive) ? 180 : 0,
                            backgroundColor: (isStackHovered || isHovered || isActive) ? "rgba(240, 94, 35, 0.2)" : "transparent",
                            scale: (isStackHovered || isHovered || isActive) ? 1.2 : 1,
                            boxShadow: (isStackHovered || isHovered || isActive) ? "0 0 12px rgba(240, 94, 35, 0.4)" : "none"
                        }}
                        transition={{ duration: 0.4 }}
                        className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center"
                    >
                        <div className="w-1.5 h-[1.5px] bg-white/60" />
                    </motion.div>
                </div>
                <motion.div
                    animate={{
                        letterSpacing: isHovered ? "0.1em" : "0em",
                    }}
                    transition={{ duration: 0.4 }}
                    className={`${card.text} font-black text-2xl leading-none tracking-tight`}
                >
                    {card.title}
                </motion.div>
            </div>

            {/* Advanced drop-down content panel */}
            <motion.div
                initial={false}
                animate={{
                    opacity: (isHovered || isActive) ? 1 : 0,
                    backdropFilter: (isHovered || isActive) ? "blur(25px)" : "blur(0px)",
                    pointerEvents: (isHovered || isActive) ? "auto" : "none",
                    backgroundColor: (isHovered || isActive) ? "rgba(0, 0, 0, 0.95)" : "rgba(0, 0, 0, 0.90)",
                    scale: (isHovered || isActive) ? 1 : 0.95,
                    y: (isHovered || isActive) ? 0 : 10
                }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-0 bg-black/90 p-6 flex flex-col z-30 rounded-2xl border border-white/5"
            >
                {/* Animated top border */}
                <motion.div
                    className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F05E23] to-transparent rounded-t-2xl"
                    animate={{
                        opacity: (isStackHovered || isHovered || isActive) ? 1 : 0,
                        boxShadow: (isStackHovered || isHovered || isActive) ? "0 0 15px rgba(240, 94, 35, 0.6)" : "none"
                    }}
                    transition={{ duration: 0.4 }}
                />


                <div className="space-y-3 flex-1">
                    {card.services.map((service, i) => (
                        <motion.div
                            key={i}
                            animate={{ 
                                opacity: (isHovered || isActive) ? 1 : 0, 
                                x: (isHovered || isActive) ? 0 : -15, 
                                y: (isHovered || isActive) ? 0 : 10 
                            }}
                            transition={{
                                delay: (isHovered || isActive) ? (i * 0.08 + 0.15) : 0,
                                duration: 0.5,
                                ease: [0.34, 1.56, 0.64, 1] // cubic-bezier for bouncy feel
                            }}
                            whileHover={{ x: 6, color: "rgba(240, 94, 35, 1)" }}
                            className="flex items-center gap-4 group/service cursor-pointer"
                        >
                            <motion.div
                                className="w-1.5 h-1.5 rounded-full bg-[#F05E23]/40 group-hover/service:bg-[#F05E23]"
                                animate={{ scale: [1, 1.4, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                            />
                            <span className="text-white/90 font-bold text-[11px] uppercase tracking-widest font-mono transition-colors duration-300">
                                {service}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Animated progress bar with gradient */}
                <motion.div
                    className="mt-auto h-[1.5px] w-full bg-gradient-to-r from-transparent via-[#F05E23]/50 to-transparent rounded-full overflow-hidden"
                    animate={{ opacity: (isHovered || isActive) ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="h-full w-1/3 bg-[#F05E23]/40"
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default function Hero() {
    const { isDark, toggleTheme } = useTheme();
    const containerRef = useRef(null);
    const [stackHovered, setStackHovered] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);
    const [hoveredIdx, setHoveredIdx] = useState(-1);
    const [isEffortlessHovered, setIsEffortlessHovered] = useState(false);

    // Optimized interaction check
    const isInteracting = stackHovered || hoveredIdx !== -1 || activeIdx !== -1;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const cardData = [
        {
            title: "Design",
            icon: <Globe2 className="w-8 h-8 text-white" />,
            bg: "bg-[#3B82F6]",
            border: "border-blue-400",
            text: "text-white",
            services: ["UI/UX Surgery", "Headless Tech", "Premium Motion"]
        },
        {
            title: "Marketing",
            icon: <Zap className="w-8 h-8 text-indigo-400" />,
            bg: "bg-[#111]",
            border: "border-slate-800",
            text: "text-white",
            services: ["Growth Engines", "Precision Ads", "Social Scaling"]
        },
        {
            title: "Strategy",
            icon: <Target className="w-8 h-8 text-yellow-900" />,
            bg: "bg-[#FFD700]",
            border: "border-yellow-300",
            text: "text-yellow-900",
            services: ["Market Arbitrage", "ROAS Logic", "Equity Vectors"]
        }
    ];

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -250]);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const spotlightX = useMotionValue(0);
    const spotlightY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
    const spotX = useSpring(spotlightX, { stiffness: 50, damping: 20 });
    const spotY = useSpring(spotlightY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const x = (clientX / innerWidth - 0.5) * 40;
            const y = (clientY / innerHeight - 0.5) * 40;
            mouseX.set(x);
            mouseY.set(y);
            spotlightX.set(clientX);
            spotlightY.set(clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY, spotlightX, spotlightY]);

    return (
        <section
            ref={containerRef}
            onClick={() => setActiveIdx(-1)}
            className={`relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-24 sm:pt-32 pb-10 sm:pb-16 overflow-hidden group/hero transition-colors duration-500 ${!isDark ? 'bg-[#F9F9F9]' : 'bg-[#0A0A0A]'}`}
        >
            <motion.div
                className="pointer-events-none fixed inset-0 z-50 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-1000"
                style={{
                    background: useTransform(
                        [spotX, spotY],
                        ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, ${!isDark ? 'rgba(240, 94, 35, 0.05)' : 'rgba(240, 94, 35, 0.15)'}, transparent 80%)`
                    )
                }}
            />

            <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-700 ${!isDark ? 'opacity-[0.04]' : 'opacity-[0.1]'}`}
                style={{
                    backgroundImage: !isDark ? 'radial-gradient(#000 1.2px, transparent 1.2px)' : 'radial-gradient(#FFF 1.2px, transparent 1.2px)',
                    backgroundSize: '48px 48px'
                }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full flex flex-col items-center">
                <div className="relative w-full flex flex-col items-center">

                    <div
                        className="absolute -top-32 sm:-top-24 left-4 lg:left-12 xl:left-20 z-40 opacity-40 lg:opacity-100 scale-[0.5] sm:scale-[0.7] lg:scale-100"
                        onMouseEnter={() => setStackHovered(true)}
                        onMouseLeave={() => setStackHovered(false)}
                    >
                        <motion.div style={{ y: y1, x: useTransform(springX, x => x * -1.5) }} className="relative h-[200px] w-[350px]">
                            {cardData.map((card, index) => (
                                <FloatingCard
                                    key={card.title}
                                    index={index}
                                    isStackHovered={isInteracting}
                                    delay={0.2 + index * 0.2}
                                    card={card}
                                    activeIdx={activeIdx}
                                    hoveredIdx={hoveredIdx}
                                    setActiveIdx={setActiveIdx}
                                    setHoveredIdx={setHoveredIdx}
                                    className={`w-52 h-36 rounded-2xl shadow-2xl absolute border ${card.bg} ${card.border}`}
                                />
                            ))}
                        </motion.div>
                    </div>

                    <div className="absolute -top-36 sm:-top-20 right-0 sm:right-4 lg:right-5 z-40">
                        <Magnetic>
                            <motion.button
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1 }}
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -15px rgba(240, 94, 35, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 rounded-full shadow-2xl transition-all duration-500 border ${!isDark ? 'bg-[#F05E23] border-[#F05E23]/20' : 'bg-indigo-600 border-indigo-400/30'} text-white`}
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                >
                                    <Sparkles className="w-5 h-5 text-white" />
                                </motion.div>
                                <span className="font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] whitespace-nowrap">Acquisition Optimized</span>
                            </motion.button>
                        </Magnetic>
                    </div>

                    <div className="relative z-30 flex flex-col items-center w-full">
                        <div className="w-full flex flex-col items-center select-none">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="flex items-center justify-center gap-2 sm:gap-6 w-full"
                            >
                                <h1 className={`text-[10vw] sm:text-[7vw] md:text-[6rem] lg:text-[7.5rem] xl:text-[8.5rem] font-bold leading-[0.85] tracking-[-0.05em] transition-colors duration-500 ${!isDark ? 'text-[#111]' : 'text-white'}`}>
                                    Marketing
                                </h1>
                                <Magnetic>
                                    <motion.button
                                        onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
                                        className={`w-16 h-8 sm:w-24 sm:h-12 lg:w-36 lg:h-16 rounded-full p-2 flex items-center shadow-inner relative group transition-all duration-500 ${!isDark ? 'bg-white border-2 border-black/5' : 'bg-[#1A1A1A] border-2 border-white/10'}`}
                                    >
                                        <div className="absolute inset-x-0 w-full flex justify-between px-2 sm:px-4 pointer-events-none opacity-20">
                                            <Sun className={`w-3 h-3 sm:w-5 sm:h-5 ${!isDark ? 'text-black' : 'text-white'}`} strokeWidth={3} />
                                            <Moon className={`w-3 h-3 sm:w-5 sm:h-5 ${!isDark ? 'text-black' : 'text-white'}`} strokeWidth={3} />
                                        </div>

                                        <motion.div
                                            animate={{
                                                x: !isDark ? '0%' : '170%',
                                                rotate: !isDark ? 0 : 360
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            className="w-5 h-5 sm:w-9 sm:h-9 lg:w-12 lg:h-12 bg-[#F05E23] rounded-full shadow-lg flex items-center justify-center z-10"
                                        >
                                            <AnimatePresence mode="wait">
                                                {!isDark ? (
                                                    <motion.div
                                                        key="sun"
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Sun className="w-3 h-3 sm:w-5 sm:h-5 text-white fill-white" />
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="moon"
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Moon className="w-3 h-3 sm:w-5 sm:h-5 text-white fill-white" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    </motion.button>
                                </Magnetic>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className={`text-[10vw] sm:text-[7vw] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7.5rem] font-bold leading-[0.9] tracking-[-0.04em] transition-colors duration-500 ${!isDark ? 'text-[#111]' : 'text-white/90'}`}
                            >
                                that feels
                            </motion.h2>

                            <div className="flex items-center justify-center relative mt-[-2px] sm:mt-0">
                                <motion.h1
                                    onMouseEnter={() => setIsEffortlessHovered(true)}
                                    onMouseLeave={() => setIsEffortlessHovered(false)}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{
                                        letterSpacing: isEffortlessHovered ? "0.05em" : "-0.05em",
                                        scale: isEffortlessHovered ? 1.02 : 1,
                                        opacity: 1,
                                        y: 0
                                    }}
                                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-[11vw] sm:text-[9vw] md:text-[7rem] lg:text-[8.5rem] xl:text-[10rem] font-black text-[#F05E23] leading-[0.85] tracking-[-0.05em] whitespace-nowrap drop-shadow-[0_20px_50px_rgba(240,94,35,0.15)]"
                                >
                                    effortless
                                </motion.h1>

                                <motion.div
                                    className="absolute -bottom-8 -right-8 sm:-bottom-16 sm:-right-8 z-50 drop-shadow-2xl pointer-events-none"
                                    animate={{
                                        x: isEffortlessHovered ? [0, -40, 0] : [0, -20, 0],
                                        y: isEffortlessHovered ? [0, -20, 0] : [0, -10, 0],
                                        rotate: isEffortlessHovered ? [0, 45, 0] : 0
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <MousePointer2 className={`w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 fill-[#111] stroke-white stroke-[2px] ${!isDark ? 'opacity-100' : 'opacity-80'}`} />
                                </motion.div>
                            </div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className={`mt-8 sm:mt-12 text-sm sm:text-lg md:text-xl font-medium max-w-[90%] sm:max-w-xl mx-auto leading-relaxed md:leading-normal text-center transition-colors duration-500 ${!isDark ? 'text-slate-500' : 'text-white/50'}`}
                        >
                            Designed for modern marketing experiences that feel seamless from the first click up to final conversion.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="mt-12 sm:mt-20 w-full flex justify-center px-6 relative z-50"
                        >
                            <Magnetic>
                                <a
                                    href="https://wa.me/919161391566?text=I'd like to start scaling my business with Synchronous Build Digital."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`relative group overflow-hidden px-12 sm:px-16 py-6 sm:py-7 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all active:scale-95 text-center flex items-center justify-center border ${!isDark ? 'bg-[#111] border-white/10' : 'bg-white border-black/5'}`}
                                >
                                    <div className={`font-black text-base sm:text-lg tracking-[0.1em] uppercase relative z-10 flex items-center justify-center gap-4 transition-colors duration-500 ${!isDark ? 'text-white' : 'text-[#111]'}`}>
                                        Start Your Acquisition Cycle
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />
                                    </div>
                                    <div className="absolute inset-0 bg-[#F05E23] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16, 1, 0.3, 1]"></div>
                                    <div className={`absolute top-0 right-0 w-16 h-16 z-20 group-hover:scale-125 transition-transform duration-700 mask-triangle ${!isDark ? 'bg-white/10' : 'bg-black/5'}`}></div>
                                </a>
                            </Magnetic>
                        </motion.div>
                    </div>

                    <div className="absolute top-1/2 right-0 lg:right-[2%] xl:right-[5%] -translate-y-1/2 z-20 opacity-30 lg:opacity-100 scale-[0.5] sm:scale-[0.7] lg:scale-100 pointer-events-none lg:pointer-events-auto">
                        <motion.div style={{ y: y3, x: useTransform(springX, x => x * 1.2) }} className="space-y-10 flex flex-col items-end">
                            <Magnetic>
                                <FloatingCard isActive={activeIdx === 10} delay={0.8} className={`w-16 h-16 sm:w-24 sm:h-24 rounded-3xl shadow-2xl flex items-center justify-center rotate-12 border transition-all duration-500 ${!isDark ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-black/5'}`}>
                                    <Zap className={`w-8 h-8 sm:w-12 sm:h-12 fill-yellow-400 ${!isDark ? 'text-yellow-400' : 'text-slate-800'}`} />
                                </FloatingCard>
                            </Magnetic>
                            <Magnetic>
                                <FloatingCard isActive={activeIdx === 11} delay={1.0} className={`w-20 h-20 sm:w-28 sm:h-28 rounded-3xl shadow-2xl flex items-center justify-center rotate-[-8deg] border relative mr-12 sm:mr-16 transition-all duration-500 ${!isDark ? 'bg-white border-black/5' : 'bg-[#111] border-white/10'}`}>
                                    <Target className={`w-8 h-8 sm:w-12 sm:h-12 ${!isDark ? 'text-slate-800' : 'text-white'}`} />
                                    <div className={`absolute inset-0 border rounded-3xl animate-ping opacity-10 ${!isDark ? 'border-black' : 'border-white'}`}></div>
                                </FloatingCard>
                            </Magnetic>
                            <Magnetic>
                                <FloatingCard isActive={activeIdx === 12} delay={1.2} className={`w-24 h-16 sm:w-32 sm:h-24 bg-[#3B82F6] rounded-3xl shadow-2xl flex items-center justify-center rotate-6 border-b-8 border-blue-700 hover:translate-y-1 transition-transform`}>
                                    <Search className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                                </FloatingCard>
                            </Magnetic>
                        </motion.div>
                    </div>

                </div>
            </div>

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: !isDark ? [0.15, 0.25, 0.15] : [0.05, 0.1, 0.05],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                    backgroundColor: !isDark ? 'rgba(79, 70, 229, 0.1)' : 'rgba(240, 94, 35, 0.1)'
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] -z-10"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: !isDark ? [0.1, 0.2, 0.1] : [0.04, 0.08, 0.04],
                    x: [0, -60, 0],
                    y: [0, 40, 0],
                    backgroundColor: !isDark ? 'rgba(240, 94, 35, 0.1)' : 'rgba(79, 70, 229, 0.1)'
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-15%] w-[500px] h-[500px] rounded-full blur-[120px] -z-10"
            />

            <div className={`absolute inset-0 pointer-events-none z-0 opacity-10 mix-blend-overlay transition-opacity duration-700`}
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
            ></div>
        </section>
    );
}
