"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Clock, User, ChevronRight } from "lucide-react";
import Link from "next/link";

const posts = [
    {
        title: "The Architecture of Scale in 2026",
        desc: "Why high-velocity digital ecosystems are the only sustainable competitive advantage in the AI era.",
        category: "Strategy",
        date: "March 2026",
        author: "Innovation Lab",
        image: "/insights/scale.png"
    },
    {
        title: "Democratizing Deep-Tech Innovation",
        desc: "How Synchronous is bridging the gap between enterprise-grade AI and high-growth brands.",
        category: "Innovation",
        date: "February 2026",
        author: "Innovation Lab",
        image: "/insights/innovation.png"
    },
    {
        title: "Aesthetic Core vs. Performance Logic",
        desc: "The surgical balance required to build digital brands that both wow and convert.",
        category: "Design",
        date: "January 2026",
        author: "Innovation Lab",
        image: "/insights/design.png"
    }
];

export default function InsightsPage() {
    return (
        <div className="flex flex-col items-center w-full min-h-screen relative overflow-hidden selection:bg-orange-500/20" style={{ backgroundColor: '#FAFAF8' }}>
            {/* Ambient background glows */}
            <div className="absolute top-[5%] right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 opacity-10"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(150px)' }}
            ></div>
            <div className="absolute bottom-[10%] left-[-5%] w-[800px] h-[800px] rounded-full pointer-events-none z-0 opacity-5"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(120px)' }}
            ></div>

            {/* Hero Section */}
            <section className="w-full max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="flex flex-col items-start max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-4 py-2 bg-[#111] shadow-xl shadow-orange-500/10 rounded-full mb-10"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                        <span className="text-[0.65rem] font-black text-white tracking-[0.4em] uppercase">The Growth Hub</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[4rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold tracking-tight leading-[0.9] text-[#111] mb-12"
                    >
                        Surgical <br />
                        <span className="italic font-light text-slate-400">Insights.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[1.2rem] md:text-[1.5rem] text-slate-500 font-medium max-w-3xl leading-relaxed border-l-4 border-[#F05E23] pl-10"
                    >
                        Deep-tech intelligence, market strategy, and architectural design logic. Stay ahead with high-performance insights from the Synchronous innovation team.
                    </motion.p>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {posts.map((post, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="group flex flex-col bg-white rounded-[3.5rem] border border-[rgba(0,0,0,0.04)] shadow-sm hover:shadow-[0_40px_100px_-20px_rgba(240,94,35,0.08)] hover:border-[#F05E23]/20 transition-all duration-700 overflow-hidden cursor-pointer"
                        >
                            {/* Image Placeholder with Gradient */}
                            <div className="aspect-[16/10] bg-[#FAFAF8] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-50"></div>
                                <div className="absolute top-8 left-8 z-20">
                                    <span className="px-5 py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white text-[0.65rem] font-black uppercase tracking-widest text-[#111] shadow-lg">{post.category}</span>
                                </div>
                            </div>

                            <div className="p-10 sm:p-12 flex flex-col flex-1">
                                <div className="flex items-center gap-8 mb-8">
                                    <div className="flex items-center gap-2.5 text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">
                                        <Clock className="w-3.5 h-3.5" />
                                        {post.date}
                                    </div>
                                    <div className="flex items-center gap-2.5 text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">
                                        <User className="w-3.5 h-3.5 text-[#F05E23]/40" />
                                        {post.author}
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-[#111] mb-6 leading-[1.1] group-hover:text-[#F05E23] transition-colors duration-500">{post.title}</h3>
                                <p className="text-[1.05rem] text-slate-500 leading-relaxed line-clamp-3 mb-12 font-light">{post.desc}</p>

                                <div className="mt-auto pt-10 border-t border-[rgba(0,0,0,0.04)] flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-[0.7rem] font-black uppercase tracking-[0.4em] text-slate-300 group-hover:text-[#F05E23] transition-colors duration-500">
                                        Read Analysis
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-[rgba(0,0,0,0.05)] bg-[#FAFAF8] flex items-center justify-center group-hover:bg-[#111] transition-all duration-700 group-hover:rotate-45">
                                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>


        </div>
    );
}
