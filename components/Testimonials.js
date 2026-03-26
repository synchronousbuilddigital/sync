"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

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

export default function Testimonials() {
    return (
        <section className="w-full py-24 md:py-40 relative overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-6 relative z-10 mb-20 md:mb-28 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-8">
                    <div className="max-w-3xl">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full mb-8 shadow-sm justify-center sm:justify-start"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                            <span className="text-[0.65rem] font-bold text-slate-500 tracking-[0.4em] uppercase">Social Proof</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[3.5rem] sm:text-[4.5rem] md:text-[6.5rem] font-bold tracking-tighter text-[#111] leading-[0.9]"
                        >
                            Success <span className="text-[#F05E23]">Synchronized.</span>
                        </motion.h2>
                    </div>
                </div>
            </div>

            {/* Scrolling Testimonials Marquee */}
            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
                <div className="flex w-max animate-marquee-slow hover:[animation-play-state:paused] gap-8 md:gap-12 px-8">
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div
                            key={i}
                            className="w-[85vw] sm:w-[500px] md:w-[600px] group relative p-12 md:p-16 rounded-[4rem] md:rounded-[5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-[0_40px_100px_-30px_rgba(240,94,35,0.12)] transition-all duration-700 shrink-0 flex flex-col justify-between h-[520px] sm:h-[480px]"
                        >
                            <Quote className="w-24 h-24 text-[#F05E23]/5 absolute top-12 right-12 group-hover:text-[#F05E23]/10 transition-all duration-1000" />
                            
                            <div className="relative z-10">
                                <div className="flex gap-1.5 mb-10">
                                    {[...Array(t.rating)].map((_, s) => (
                                        <Star key={s} className="w-5 h-5 fill-[#F05E23] text-[#F05E23]" strokeWidth={2.5} />
                                    ))}
                                </div>

                                <p className="text-[1.6rem] md:text-[2.2rem] text-[#111] font-light leading-[1.3] mb-8 tracking-tight italic">
                                    "{t.quote}"
                                </p>
                            </div>

                            <div className="flex items-center gap-6 pt-10 border-t border-slate-200/50 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                                    <div className="w-full h-full bg-slate-200 opacity-40"></div>
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="font-bold text-[#111] text-xl tracking-tight leading-none">{t.author}</h4>
                                    <p className="text-[0.6rem] font-black text-[#F05E23] tracking-[0.4em] uppercase leading-none pt-1">
                                        {t.role.replace(',', '.')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Decoration line */}
            <div className="w-full mt-32 border-t border-slate-100"></div>
        </section>
    );
}
