"use client";

import { useState, useEffect } from "react";

export default function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Prevent scrolling while loading
        document.body.style.overflow = 'hidden';

        const fadeTimer = setTimeout(() => {
            setIsFading(true);
        }, 2200);

        const removeTimer = setTimeout(() => {
            document.body.style.overflow = 'unset';
            setIsVisible(false);
        }, 2900); // 700ms after fade starts

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!isVisible) return null;

    return (
        <>
            <style jsx>{`
                @keyframes blurFadeIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.9) translateY(10px);
                        filter: blur(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                        filter: blur(0px);
                    }
                }
                @keyframes floatIdle {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes progressBar {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(250%); }
                }
                .animate-blur-fade {
                    animation: blurFadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-float-idle {
                    animation: floatIdle 4s ease-in-out infinite;
                }
                .animate-progress {
                    animation: progressBar 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
                }
            `}</style>

            <div 
                className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isFading ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100'}`}
                style={{ backgroundColor: '#FAFAF8' }}
            >
                {/* Subtle Ambient Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] pointer-events-none mix-blend-multiply"
                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent 70%)' }}
                ></div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 max-w-lg animate-blur-fade">
                    
                    {/* Logo Element */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6 animate-float-idle flex items-center justify-center">
                        <div className="absolute inset-0 blur-2xl rounded-full scale-50 animate-pulse delay-300"
                            style={{ background: 'rgba(99,102,241,0.08)' }}
                        ></div>
                        <img 
                            src="/logo.png" 
                            alt="Synchronous Build Digital" 
                            className="w-full h-full object-contain mix-blend-darken relative z-10 drop-shadow-sm"
                        />
                    </div>

                    {/* Typography */}
                    <div className="flex flex-col items-center animate-float-idle" style={{ animationDelay: '0.1s' }}>
                        <h1 className="text-[#0F1729] font-black tracking-[0.2em] md:tracking-[0.3em] text-xl md:text-2xl uppercase">
                            Synchronous
                        </h1>
                        <p className="text-[0.55rem] md:text-[0.65rem] tracking-[0.6em] text-[#94A3B8] uppercase font-bold mt-2 ml-2">
                            Build Digital
                        </p>
                    </div>

                    {/* Loading Indicator Base */}
                    <div className="absolute fixed bottom-12 md:bottom-20 w-full flex flex-col items-center gap-4 left-0">
                        <div className="w-32 md:w-48 h-[2px] rounded-full overflow-hidden relative" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                            <div className="absolute top-0 left-0 h-full w-[40%] rounded-full animate-progress"
                                style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', boxShadow: '0 0 10px rgba(99,102,241,0.5)' }}
                            />
                        </div>
                        <p className="text-[0.55rem] md:text-[0.65rem] tracking-[0.4em] uppercase font-bold animate-pulse ml-1 text-center"
                            style={{ color: 'rgba(99,102,241,0.5)' }}
                        >
                            Initializing
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}
