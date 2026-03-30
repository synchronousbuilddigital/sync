"use client";

import { motion, useAnimationControls, useMotionValue, animate } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

const testimonials = [
    {
        quote: "Synchronized our vision with clinical digital precision. The AI tools they built for BOXFOX didn't just improve UX; they created a new revenue stream entirely.",
        author: "Sarah Jenkins",
        role: "VP of Growth, BOXFOX",
        rating: 5
    },
    {
        quote: "Relentless execution. The energy management ecosystem we architected together is now the benchmark for high-end data visualization in our sector.",
        author: "Marcus Thorne",
        role: "CTO, RYM Grenergy",
        rating: 5
    },
    {
        quote: "Their growth engineering is surgical. We saw a 3x increase in conversion rates within the first quarter of launching our unified dashboard.",
        author: "David Chen",
        role: "Founder, BWORTH",
        rating: 5
    },
    {
        quote: "The price prediction engine for our agri-tech platform is a game changer. It's rare to find a team that understands both complex AI and local markets.",
        author: "Priya Sharma",
        role: "Director, VEGA VRUDDHI",
        rating: 5
    },
    {
        quote: "The virtual try-on tech is flawless. Our return rates dropped by 25% while engagement spiked. Synchronous is our most valuable tech partner.",
        author: "Elena Rossi",
        role: "Head of Product, CLOSETRUSH",
        rating: 5
    },
    {
        quote: "Transformed our traditional brand into a digital-first experience. The transition was seamless, and the results have been incredible.",
        author: "Arjun Mehta",
        role: "Owner, KULLHAD COFFEE",
        rating: 5
    },
    {
        quote: "A rare bridge between high-end software development and high-converting marketing. They don't just build; they strategize for scale.",
        author: "Liam O'Brien",
        role: "Tech Lead, SYNC",
        rating: 5
    },
    {
        quote: "Their attention to detail in brand architecture is unmatched. They built us a visual identity that commands authority in a crowded market.",
        author: "Sofia Rodriguez",
        role: "Marketing Manager, VEGA",
        rating: 5
    },
    {
        quote: "The data-driven strategy we implemented was backed by rigorous research. No guesswork, just documented growth.",
        author: "Michael Scott",
        role: "Growth Lead, BWORTH",
        rating: 5
    },
    {
        quote: "Highly responsive and technically proficient. They handled our complex data migration with ease and delivered ahead of schedule.",
        author: "Anaya Khan",
        role: "Energy Strategist, RYM",
        rating: 5
    },
    {
        quote: "Professional, innovative, and deeply committed to our success. They feel like an extension of our own team.",
        author: "Tom Wilson",
        role: "Ops Manager, BOXFOX",
        rating: 5
    },
    {
        quote: "Every pixel and every line of code is optimized for performance. Their design quality is truly world-class.",
        author: "Olivia Gao",
        role: "Creative Director, CLOSETRUSH",
        rating: 5
    }
];

// Double pack for infinite loop (enough for typical screen sizes)
const displayTestimonials = [...testimonials, ...testimonials];

export default function Testimonials() {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const x = useMotionValue(0);
    const [trackWidth, setTrackWidth] = useState(0);

    // Calculate layout dimensions
    useEffect(() => {
        const updateWidth = () => {
            if (trackRef.current) {
                setTrackWidth(trackRef.current.scrollWidth / 2);
            }
        };
        
        updateWidth();
        window.addEventListener('resize', updateWidth);
        const timeout = setTimeout(updateWidth, 500); // Wait for fonts/layout

        return () => {
            window.removeEventListener('resize', updateWidth);
            clearTimeout(timeout);
        };
    }, []);

    // Core Animation Engine - Continuous Scroll
    useEffect(() => {
        if (isPaused || isDragging || trackWidth === 0) return;

        let frameId;
        const speed = 1.0; // Pixels per frame

        const animateScroll = () => {
            const currentX = x.get();
            let newX = currentX - speed;

            // Loop reset: once we've scrolled one full set (trackWidth)
            if (newX <= -trackWidth) {
                newX += trackWidth;
            }

            x.set(newX);
            frameId = requestAnimationFrame(animateScroll);
        };

        frameId = requestAnimationFrame(animateScroll);
        return () => cancelAnimationFrame(frameId);
    }, [isPaused, isDragging, trackWidth, x]);

    // Manual Navigation Button Handlers
    const handleScroll = (direction) => {
        if (trackWidth === 0) return;
        
        setIsPaused(true);
        const cardWidth = trackRef.current.children[0].offsetWidth + (parseInt(getComputedStyle(trackRef.current).gap) || 40);
        const currentX = x.get();
        let targetX = direction === 'left' ? currentX + cardWidth : currentX - cardWidth;

        // Animate to target
        animate(x, targetX, {
            type: "spring",
            stiffness: 100,
            damping: 20,
            onUpdate: (latest) => {
                // Keep it in bounds for the loop
                if (latest <= -trackWidth) x.set(latest + trackWidth);
                if (latest > 0) x.set(latest - trackWidth);
            },
            onComplete: () => {
                // Resume auto-scroll after delay
                setTimeout(() => setIsPaused(false), 3000);
            }
        });
    };

    // Interaction Overrides
    const handleDragStart = () => {
        setIsDragging(true);
        setIsPaused(true);
    };

    const handleDragEnd = (_, info) => {
        setIsDragging(false);
        // Add momentum or just resume
        const currentX = x.get();
        if (currentX <= -trackWidth) x.set(currentX + trackWidth);
        if (currentX > 0) x.set(currentX - trackWidth);
        
        setTimeout(() => setIsPaused(false), 2000);
    };

    return (
        <section className="w-full py-12 relative overflow-hidden bg-transparent">
            {/* Background Texture */}
            <motion.div
                animate={{ opacity: [0.01, 0.02, 0.01] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-0 pointer-events-none"
                style={{ 
                    backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', 
                    backgroundSize: '64px 64px' 
                }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-30 mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-black/5 pb-12">
                    <div className="max-w-4xl">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-5 py-2 bg-[#F05E23]/5 border border-[#F05E23]/10 rounded-full mb-8"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                            <span className="text-[0.6rem] font-black text-[#F05E23] tracking-[0.45em] uppercase">Verified Outcomes</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[3.5rem] sm:text-[5rem] lg:text-[7rem] font-bold tracking-[-0.05em] text-[#111] leading-[0.8]"
                        >
                            Success <br /> <span className="text-[#F05E23]">Synchronized.</span>
                        </motion.h2>
                    </div>
                    
                    <div className="flex flex-col items-end gap-10">
                        <div className="flex gap-4 relative z-50">
                            <button 
                                onClick={() => handleScroll('left')}
                                className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center text-[#111] hover:bg-[#F05E23] hover:text-white hover:border-[#F05E23] transition-all duration-500 group shadow-md active:scale-90 cursor-pointer bg-white"
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
                            </button>
                            <button 
                                onClick={() => handleScroll('right')}
                                className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center text-[#111] hover:bg-[#F05E23] hover:text-white hover:border-[#F05E23] transition-all duration-500 group shadow-md active:scale-90 cursor-pointer bg-white"
                                aria-label="Next testimonial"
                            >
                                <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="hidden md:block md:max-w-[320px]"
                        >
                            <p className="text-[0.7rem] font-semibold text-slate-400 uppercase tracking-[.25em] leading-relaxed text-right">
                                Global industry leaders leveraging our surgical digital frameworks for market dominance.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Carousel Container */}
            <div 
                className="relative w-full cursor-grab active:cursor-grabbing overflow-visible z-10"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Visual Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-[#F9F9F9] to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-[#F9F9F9] to-transparent z-20 pointer-events-none" />

                <motion.div 
                    ref={trackRef}
                    drag="x"
                    style={{ x }}
                    dragConstraints={{ left: -trackWidth, right: 0 }}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    className="flex gap-8 px-[10vw]"
                >
                    {displayTestimonials.map((t, i) => (
                        <div
                            key={i}
                            className="w-[85vw] sm:w-[400px] md:w-[500px] shrink-0 group relative p-10 md:p-12 rounded-[3.5rem] bg-white border border-slate-100/50 hover:border-[#F05E23]/20 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.02)] hover:shadow-[0_60px_120px_-30px_rgba(240,94,35,0.12)] transition-all duration-1000 flex flex-col justify-between min-h-[420px] select-none"
                        >
                            {/* Abstract card texture */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#F05E23]/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex gap-1">
                                        {[...Array(t.rating)].map((_, s) => (
                                            <Star key={s} className="w-3 h-3 fill-[#F05E23] text-[#F05E23]" />
                                        ))}
                                    </div>
                                    <div className="text-[0.55rem] font-black text-slate-300 tracking-[0.4em] uppercase">Verified Partner</div>
                                </div>

                                <blockquote className="text-[1.4rem] md:text-[1.8rem] text-[#111] font-semibold leading-[1.1] mb-8 tracking-tight">
                                    <span className="text-[#F05E23]/30 mr-1 text-2xl">"</span>
                                    {t.quote.split('. ')[0]}.
                                    <span className="text-[#F05E23]/30 ml-1 text-2xl">"</span>
                                    <footer className="mt-4 text-[0.85rem] font-medium text-slate-400 leading-relaxed block italic opacity-80">
                                        {t.quote.split('. ').slice(1).join('. ')}
                                    </footer>
                                </blockquote>
                            </div>

                            <div className="flex items-center gap-5 pt-8 mt-auto border-t border-slate-50 relative z-10">
                                <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#F05E23]/30 transition-colors duration-500 shadow-inner">
                                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-300 text-sm tracking-tighter">
                                        {t.author.split(' ').map(n => n[0]).join('')}
                                    </div>
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="font-bold text-[#111] text-lg tracking-tight leading-none group-hover:text-[#F05E23] transition-colors">{t.author}</h4>
                                    <p className="text-[0.55rem] font-black text-slate-400 tracking-[0.4em] uppercase leading-none pt-1.5 flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-[#F05E23]/40"></span>
                                        {t.role.split(',')[0]}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
            
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .cursor-grab { cursor: grab; }
                .cursor-grabbing { cursor: grabbing; }
            `}</style>
        </section>
    );
}
