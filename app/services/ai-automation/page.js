"use client";

import { motion } from "framer-motion";
import { Cpu, ArrowRight, CheckCircle2, Shield, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import CTA from "@/components/CTA";

export default function AIAutomationPage() {
    return (
        <div className="flex flex-col items-center w-full min-h-screen relative overflow-hidden selection:bg-orange-500/20" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="absolute top-[5%] right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 opacity-10"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(150px)' }}
            ></div>
            
            <section className="w-full max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="flex flex-col items-start max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-4 py-2 bg-[#111] shadow-xl shadow-orange-500/10 rounded-full mb-10"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                        <span className="text-[0.65rem] font-black text-white tracking-[0.4em] uppercase">Intelligence Integration</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[4rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold tracking-tight leading-[0.9] text-[#111] mb-12"
                    >
                        AI & <br />
                        <span className="italic font-light text-slate-400">Automation.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[1.2rem] md:text-[1.5rem] text-slate-500 font-medium max-w-3xl leading-relaxed border-l-4 border-[#F05E23] pl-10"
                    >
                        Deploying custom AI agents and intelligent automation to future-proof your core digital operations. Integrate intelligence directly into your brand DNA.
                    </motion.p>
                </div>
            </section>

            <section className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20">
                    <div className="space-y-12">
                        <h2 className="text-4xl font-bold text-[#111] tracking-tight">The Future of Operational Velocity.</h2>
                        <p className="text-xl text-slate-500 leading-relaxed">
                            AI is no longer an option; it’s the differentiator. We build systems that automate the mundane and amplify the premium.
                        </p>
                        
                        <div className="grid gap-6">
                            {[
                                { title: "Custom AI Chatbots", desc: "Intelligent, brand-aligned agents for 24/7 engagement and support." },
                                { title: "Generative Workflows", desc: "Automated high-quality asset generation for marketing and ops." },
                                { title: "Neural Search Integration", desc: "Advanced semantic search systems for large-scale data discovery." },
                                { title: "Process Intelligence", desc: "Automation strategies that identify and eliminate operational friction." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 p-8 rounded-[2.5rem] bg-white border border-[rgba(0,0,0,0.04)] shadow-sm group hover:border-[#F05E23]/20 transition-all">
                                    <div className="w-12 h-12 rounded-2xl bg-[#FAFAF8] flex items-center justify-center text-[#F05E23] group-hover:bg-[#111] transition-colors">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-[#111] mb-2">{item.title}</h4>
                                        <p className="text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="sticky top-10 rounded-[3.5rem] bg-[#111] p-16 overflow-hidden h-full min-h-[500px] flex flex-col justify-between group shadow-2xl">
                             <div className="absolute top-0 right-0 w-80 h-80 bg-[#F05E23]/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
                             
                             <div className="relative z-10">
                                <Cpu className="w-20 h-20 text-[#F05E23] mb-12" />
                                <h3 className="text-4xl font-bold text-white mb-8 leading-tight">Mastering Neural <br /> <span className="text-[#F05E23] italic font-light">Architectures.</span></h3>
                                <p className="text-slate-400 text-lg">
                                    Our AI solutions are engineered to replace inefficiency with high-velocity intelligent operations.
                                </p>
                             </div>

                             <Link href="/contact" className="relative z-10 flex items-center gap-4 text-white font-black uppercase tracking-[0.3em] text-[0.7rem] group-hover:text-[#F05E23] transition-colors mt-20">
                                Deploy Intelligence
                                <ArrowRight className="w-4 h-4" />
                             </Link>
                        </div>
                    </div>
                </div>
            </section>

            <CTA />
        </div>
    );
}
