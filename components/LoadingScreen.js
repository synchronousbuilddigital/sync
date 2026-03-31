"use client";

import { useState, useEffect } from "react";
import { Sparkles, Zap, Target, Globe2 } from 'lucide-react';

export default function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [activeModule, setActiveModule] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const fullText = "Initializing Services";

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        // Smooth progress animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 88) return prev + Math.random() * 3;
                if (prev >= 60) return prev + Math.random() * 8;
                return prev + Math.random() * 15;
            });
        }, 250);

        // Smooth module rotation
        const moduleInterval = setInterval(() => {
            setActiveModule(prev => (prev + 1) % 3);
        }, 800);

        // Typewriter effect for status text
        let textIndex = 0;
        const textInterval = setInterval(() => {
            if (textIndex < fullText.length) {
                setDisplayText(fullText.slice(0, textIndex + 1));
                textIndex++;
            }
        }, 50);

        const fadeTimer = setTimeout(() => {
            setProgress(100);
            setIsFading(true);
        }, 2200);

        const removeTimer = setTimeout(() => {
            document.body.style.overflow = 'unset';
            setIsVisible(false);
        }, 2900);

        return () => {
            clearInterval(progressInterval);
            clearInterval(moduleInterval);
            clearInterval(textInterval);
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!isVisible) return null;

    const modules = [
        { name: "DESIGN", icon: Globe2, color: "#3B82F6", lightColor: "rgba(59, 130, 246, 0.1)", shadowColor: "rgba(59, 130, 246, 0.5)" },
        { name: "MARKETING", icon: Zap, color: "#F05E23", lightColor: "rgba(240, 94, 35, 0.1)", shadowColor: "rgba(240, 94, 35, 0.5)" },
        { name: "STRATEGY", icon: Target, color: "#FCD34D", lightColor: "rgba(252, 211, 77, 0.1)", shadowColor: "rgba(252, 211, 77, 0.5)" }
    ];

    return (
        <>
            <style jsx>{`
                @keyframes smoothGlow {
                    0%, 100% { 
                        box-shadow: 0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.05);
                        transform: scale(1);
                    }
                    50% { 
                        box-shadow: 0 0 40px rgba(255, 255, 255, 0.2), inset 0 0 30px rgba(255, 255, 255, 0.1);
                        transform: scale(1.02);
                    }
                }
                @keyframes floatInSmooth {
                    from { 
                        opacity: 0; 
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0);
                    }
                }
                @keyframes slideIn {
                    from { 
                        opacity: 0; 
                        transform: translateX(-20px);
                    }
                    to { 
                        opacity: 1; 
                        transform: translateX(0);
                    }
                }
                @keyframes slideInRight {
                    from { 
                        opacity: 0; 
                        transform: translateX(20px);
                    }
                    to { 
                        opacity: 1; 
                        transform: translateX(0);
                    }
                }
                @keyframes softPulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }
                @keyframes shimmerFlow {
                    0% { 
                        background-position: -1000px 0;
                    }
                    100% { 
                        background-position: 1000px 0;
                    }
                }
                @keyframes moduleSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeOutSmooth {
                    0% { 
                        opacity: 1; 
                        transform: translateY(0) scale(1);
                    }
                    100% { 
                        opacity: 0; 
                        transform: translateY(-30px) scale(0.95);
                    }
                }

                .smooth-glow { animation: smoothGlow 3s ease-in-out infinite; }
                .float-in { animation: floatInSmooth 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
                .slide-in { animation: slideIn 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
                .slide-in-right { animation: slideInRight 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
                .soft-pulse { animation: softPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                .module-slide { animation: moduleSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
                .fade-out { animation: fadeOutSmooth 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards; }

                /* Smooth scrolling background */
                .bg-gradient-animated {
                    background: linear-gradient(-45deg, #0F1729, #1a1f3a, #16213e, #0F1729);
                    background-size: 400% 400%;
                    animation: gradientShift 15s ease infinite;
                }

                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>

            <div 
                className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 bg-gradient-animated ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                {/* Premium Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)',
                    backgroundSize: '80px 80px'
                }}></div>

                {/* Smooth Animated Background Orbs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, #F05E23 0%, transparent 70%)', filter: 'blur(100px)' }}></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[150px] opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)', filter: 'blur(100px)' }}></div>

                {/* Main Content */}
                <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-6">
                    
                    {/* Logo/Brand Section */}
                    <div className="float-in flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="absolute -inset-6 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-2xl blur-2xl opacity-60"></div>
                            <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl px-8 py-4">
                                <h1 className="text-3xl md:text-5xl font-black text-white tracking-[0.12em] uppercase">
                                    SYNCHRONOUS
                                </h1>
                            </div>
                        </div>
                        <p className="text-xs md:text-sm tracking-[0.25em] text-orange-400/70 font-bold uppercase slide-in" style={{ animationDelay: '0.15s' }}>
                            BUILD DIGITAL
                        </p>
                    </div>

                    {/* Service Modules - Enhanced Grid */}
                    <div className="grid grid-cols-3 gap-3 md:gap-5 mb-6 w-full max-w-md">
                        {modules.map((module, index) => {
                            const Icon = module.icon;
                            const isActive = activeModule === index;
                            return (
                                <div
                                    key={module.name}
                                    className="module-slide w-full"
                                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                                >
                                    <div className="relative group h-full">
                                        {/* Glow Background */}
                                        <div 
                                            className={`absolute inset-0 rounded-xl transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                            style={{ 
                                                backgroundColor: module.lightColor,
                                                boxShadow: isActive ? `0 0 40px ${module.shadowColor}` : 'none'
                                            }}
                                        ></div>

                                        {/* Card */}
                                        <div 
                                            className="relative backdrop-blur-md bg-white/[0.08] border border-white/20 rounded-xl p-4 md:p-5 flex flex-col items-center justify-center h-full transition-all duration-500 hover:border-white/30"
                                            style={{
                                                boxShadow: isActive ? `0 0 30px ${module.shadowColor}, inset 0 0 20px rgba(255, 255, 255, 0.08)` : 'inset 0 0 20px rgba(255, 255, 255, 0.04)'
                                            }}
                                        >
                                            <Icon 
                                                className={`w-7 h-7 md:w-8 md:h-8 mb-2 transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}
                                                style={{ 
                                                    color: isActive ? module.color : 'rgba(255, 255, 255, 0.4)',
                                                    filter: isActive ? `drop-shadow(0 0 12px ${module.shadowColor})` : 'none'
                                                }}
                                            />
                                            <p className={`text-[0.6rem] md:text-xs tracking-[0.12em] font-bold transition-all duration-500 ${isActive ? 'text-white' : 'text-white/50'}`}>
                                                {module.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Advanced Progress Indicator */}
                    <div className="float-in flex flex-col items-center gap-8 w-full max-w-xs" style={{ animationDelay: '0.3s' }}>
                        {/* Circular Progress with Gradient */}
                        <div className="relative w-36 h-36">
                            <svg className="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 160 160">
                                {/* Outer glow circle */}
                                <circle 
                                    cx="80" 
                                    cy="80" 
                                    r="72" 
                                    fill="none" 
                                    stroke="rgba(255, 255, 255, 0.05)" 
                                    strokeWidth="1"
                                />
                                {/* Background circle */}
                                <circle 
                                    cx="80" 
                                    cy="80" 
                                    r="65" 
                                    fill="none" 
                                    stroke="rgba(255, 255, 255, 0.1)" 
                                    strokeWidth="2"
                                />
                                {/* Progress circle - smooth animation */}
                                <circle 
                                    cx="80" 
                                    cy="80" 
                                    r="65" 
                                    fill="none" 
                                    stroke="url(#progressGradient)" 
                                    strokeWidth="3"
                                    strokeDasharray={`${408.41}`}
                                    strokeDashoffset={`${408.41 - (408.41 * progress / 100)}`}
                                    strokeLinecap="round"
                                    style={{ 
                                        transition: 'stroke-dashoffset 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                        filter: `drop-shadow(0 0 ${Math.min(20, progress / 5)}px rgba(240, 94, 35, 0.5))`
                                    }}
                                />
                                <defs>
                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: '#F05E23', stopOpacity: 1 }} />
                                        <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                                        <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                                    </linearGradient>
                                </defs>
                            </svg>
                            {/* Center Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-white drop-shadow-lg">{Math.round(progress)}</span>
                                <span className="text-xs text-white/60 tracking-widest mt-1">%</span>
                            </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="flex flex-col items-center gap-4 w-full">
                            {/* Pulse Dots */}
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-orange-500 soft-pulse" style={{ boxShadow: 'rgba(240, 94, 35, 0.5) 0px 0px 10px' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-orange-500 soft-pulse" style={{ animationDelay: '0.2s', boxShadow: 'rgba(240, 94, 35, 0.5) 0px 0px 10px' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-orange-500 soft-pulse" style={{ animationDelay: '0.4s', boxShadow: 'rgba(240, 94, 35, 0.5) 0px 0px 10px' }}></div>
                                </div>
                            </div>

                            {/* Typewriter Status Text */}
                            <div className="h-6 flex items-center">
                                <p className="text-xs md:text-sm tracking-[0.15em] text-white/70 uppercase font-medium">
                                    {displayText}
                                    <span className="animate-pulse">_</span>
                                </p>
                            </div>

                            {/* Module Status */}
                            <p className="text-[0.65rem] text-white/40 tracking-[0.1em] uppercase transition-all duration-300">
                                Loading {modules[activeModule].name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Corner Accent - Subtle */}
                <div className="absolute top-8 left-8 w-24 h-24 border border-white/10 rounded-2xl pointer-events-none slide-in" style={{ animationDelay: '0.4s' }}></div>
                <div className="absolute bottom-8 right-8 w-20 h-20 border border-white/10 rounded-full pointer-events-none slide-in-right" style={{ animationDelay: '0.5s' }}></div>
            </div>
        </>
    );
}
