"use client";

import { motion } from "framer-motion";
import CTA from "@/components/CTA";

export default function PrivacyPage() {
    return (
        <div className="flex flex-col items-center w-full min-h-screen relative overflow-hidden selection:bg-orange-500/20" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="absolute top-[5%] right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 opacity-10"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(150px)' }}
            ></div>
            
            <section className="w-full max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="flex flex-col items-start max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-4 py-2 bg-[#111] shadow-xl shadow-orange-500/10 rounded-full mb-10"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                        <span className="text-[0.65rem] font-black text-white tracking-[0.4em] uppercase">Legal Transparency</span>
                    </motion.div>

                    <h1 className="text-[3.5rem] md:text-[5.5rem] lg:text-[6.5rem] font-bold tracking-tight leading-[0.9] text-[#111] mb-12">
                        Privacy <br />
                        <span className="italic font-light text-slate-400">Policy.</span>
                    </h1>
                </div>
            </section>

            <section className="w-full max-w-4xl mx-auto px-6 py-20 relative z-10 prose prose-slate prose-lg">
                <div className="space-y-16">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-[#111] tracking-tight">Introduction</h2>
                        <p className="text-[1.15rem] text-slate-600 leading-relaxed font-medium">
                            At Synchronous Build Digital, your data sovereignty is our highest priority. This Privacy Policy outlines how we collect, process, and safeguard the information you share with our ecosystem.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-[#111] tracking-tight">Data Collection Logic</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We collect only the most essential technical and professional data points required to deliver a high-performance experience and strategic ROI. This includes:
                        </p>
                        <ul className="list-disc pl-8 space-y-4 text-slate-600">
                            <li>Professional identifiers for project orchestration.</li>
                            <li>Technical performance metrics for optimization of your digital ecosystem.</li>
                            <li>Behavioral intelligence for refining our growth strategies.</li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-[#111] tracking-tight">Security Safeguards</h2>
                        <p className="text-slate-600 leading-relaxed">
                            All data is processed using institutional-grade encryption (AES-256) and is never shared with third-party marketplaces for monetization purposes.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-[#111] tracking-tight">Your Rights</h2>
                        <p className="text-slate-600 leading-relaxed">
                            You maintain absolute control over your digital footprint within our system. Requests for data exports or deletion are processed with zero-latency priority.
                        </p>
                    </div>

                    <div className="pt-16 border-t border-[rgba(0,0,0,0.05)]">
                        <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-[0.3em]">Last Updated: March 2026</p>
                    </div>
                </div>
            </section>

            <CTA />
        </div>
    );
}
