"use client";

import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { useTheme } from './ThemeContext';

function AnimatedNumber({ value, prefix = "", suffix = "" }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const count = useMotionValue(0);

    const rounded = useTransform(count, (latest) => {
        const isFloat = value % 1 !== 0;
        return isFloat ? Math.max(0, latest).toFixed(1) : Math.round(Math.max(0, latest));
    });

    useEffect(() => {
        if (isInView) {
            animate(count, value, {
                duration: 2.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2
            });
        }
    }, [isInView, value, count]);

    return (
        <span ref={ref} className="inline-flex items-baseline font-[var(--font-chakra-petch)]">
            {prefix && <span className="text-[0.6em] font-medium mr-1 opacity-60">{prefix}</span>}
            <motion.span className="font-bold">{rounded}</motion.span>
            {suffix && <span className="text-[0.6em] font-medium ml-1 opacity-60">{suffix}</span>}
        </span>
    );
}

export default function Stats() {
    const { isDark } = useTheme();
    
    const statVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.15,
                duration: 1,
                ease: [0.16, 1, 0.3, 1]
            }
        })
    };

    const stats = [
        { num: 250, prefix: "", suffix: "+", label: "Brands Scaled" },
        { num: 4.8, prefix: "", suffix: "x", label: "Average ROI" },
        { num: 50, prefix: "$", suffix: "M+", label: "Revenue Generated" },
        { num: 98, prefix: "", suffix: "%", label: "Client Retention" }
    ];

    return (
        <section className="relative w-full max-w-[1500px] mx-auto px-6 lg:px-12 mt-16 mb-32 z-10 transition-colors duration-700">
            {/* Background Glow */}
            <div className={`absolute inset-x-0 -top-20 h-40 blur-[100px] pointer-events-none transition-colors duration-700 ${isDark ? 'bg-orange-500/5' : 'bg-blue-600/5'}`}></div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            >
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={statVariants}
                        custom={i}
                        className={`relative h-64 flex flex-col items-center justify-center border rounded-[3rem] p-10 group overflow-hidden transition-all duration-700 hover:-translate-y-2 ${isDark ? 'bg-white/5 border-white/5 hover:border-orange-500/30' : 'bg-slate-50 border-slate-100/50 hover:border-blue-600/20 hover:shadow-[0_45px_100px_-20px_rgba(0,0,0,0.08)]'}`}
                    >
                        {/* Interactive Radial Glow */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isDark ? 'bg-[radial-gradient(circle_at_center,rgba(240,94,35,0.05),transparent)]' : 'bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)]'}`}></div>

                        {/* Decorative subtle stripe */}
                        <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full transition-all duration-700 z-10 ${isDark ? 'bg-white/10 group-hover:bg-[#F05E23] group-hover:w-16' : 'bg-slate-200 group-hover:bg-blue-600 group-hover:w-16'}`}></div>

                        {/* Geometric "White/Emerald" Number Style */}
                        <div className={`relative z-10 font-[var(--font-chakra-petch)] text-[3rem] lg:text-[4rem] font-bold leading-none tracking-tighter mb-3 flex items-baseline transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900 group-hover:text-blue-500'}`}>
                            <AnimatedNumber value={stat.num} prefix={stat.prefix} suffix={stat.suffix} />
                        </div>

                        <p className={`relative z-10 text-[0.6rem] lg:text-[0.65rem] font-black uppercase tracking-[0.4em] mb-4 transition-colors duration-500 ${isDark ? 'text-white/30 group-hover:text-white/60' : 'text-slate-600 group-hover:text-slate-500'}`}>
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}

