"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export default function InteractiveEye({ className = "" }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

    const pupilX = useTransform(springX, [-0.5, 0.5], [-8, 8]);
    const pupilY = useTransform(springY, [-0.5, 0.5], [-8, 8]);

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
        <div className={`relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center ${className}`}>
            {/* Eye Sclera */}
            <div className="w-full h-full bg-white rounded-full shadow-inner border border-slate-200 overflow-hidden relative">
                
                {/* Iris */}
                <motion.div 
                    style={{ x: pupilX, y: pupilY }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-[#F05E23] to-orange-400 rounded-full flex items-center justify-center border-2 border-orange-700/20"
                >
                    {/* Pupil */}
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-slate-900 rounded-full relative">
                        {/* Highlights */}
                        <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-60" />
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white rounded-full opacity-40" />
                    </div>
                </motion.div>

                {/* Eyelids/Shadow */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)]" />
            </div>

            {/* Glowing Rings (like in original but around the eye) */}
            <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-[-10px] border border-orange-500/20 rounded-full"
            />
            <motion.div 
                 animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.2, 0.05] }}
                 transition={{ duration: 6, repeat: Infinity }}
                 className="absolute inset-[-20px] border border-orange-500/10 rounded-full"
            />
        </div>
    );
}
