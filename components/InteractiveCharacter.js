"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function InteractiveCharacter({ isOpen }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

    const pupilX = useTransform(springX, [-0.5, 0.5], [-4, 4]);
    const pupilY = useTransform(springY, [-0.5, 0.5], [-4, 4]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            mouseX.set(clientX / innerWidth - 0.5);
            mouseY.set(clientY / innerHeight - 0.5);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
            {/* Mascot Image */}
            <motion.img 
                src="/mascot.png" 
                alt="AI Mascot"
                className="w-full h-full object-contain drop-shadow-2xl"
                animate={isOpen ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
            />

            {/* Interactive Eyes Overlaid on the mascot (if the mascot.png is centered) */}
            {/* Since I generated the mascot, I can place small "Interactive Eye" SVGs near where eyes usually are.
                Or I can just add a floating eye next to it as a "proper svg show eye". */}
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Visual "Eye" SVGs for tracking */}
                {[0, 1].map((i) => (
                    <div key={i} className="w-4 h-4 bg-white rounded-full border border-slate-200 overflow-hidden relative shadow-sm">
                        <motion.div 
                            style={{ x: pupilX, y: pupilY }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-600 rounded-full"
                        />
                    </div>
                ))}
            </div>

            {/* Floating Indicator */}
            {!isOpen && (
                <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg"
                >
                    Hi!
                </motion.div>
            )}
        </div>
    );
}
