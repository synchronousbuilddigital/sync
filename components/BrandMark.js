"use client";

import { motion } from "framer-motion";

export default function BrandMark({ className = "" }) {
    return (
        <div className={`relative ${className}`}>
            {/* Outer Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-blue-600/20"
            />
            
            {/* Inner Ring (Counter Rotating) */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-cyan-400/30 border-dashed"
            />

            {/* Core Stylized 'S' */}
            <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] text-blue-600 drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                    {/* Synchronous 'S' Mark */}
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d="M30 25C30 25 70 25 70 45C70 65 30 35 30 55C30 75 70 75 70 75"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                    
                    {/* Synchronized Dots */}
                    <motion.circle 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        cx="30" cy="25" r="4" fill="currentColor" 
                    />
                    <motion.circle 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        cx="70" cy="75" r="4" fill="currentColor" 
                    />
                </svg>
            </div>
            
            {/* Pulse Effect */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[-10%] rounded-full bg-blue-600/10 blur-2xl"
            />
        </div>
    );
}
