"use client";

import { motion } from "framer-motion";
import CTA from "@/components/CTA";

export default function TermsPage() {
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
                        <span className="text-[0.65rem] font-black text-white tracking-[0.4em] uppercase">Terms of Scalability</span>
                    </motion.div>

                    <h1 className="text-[3.5rem] md:text-[5.5rem] lg:text-[6.5rem] font-bold tracking-tight leading-[0.9] text-[#111] mb-12">
                        Terms of <br />
                        <span className="italic font-light text-slate-400">Service.</span>
                    </h1>
                </div>
            </section>

            <section className="w-full max-w-4xl mx-auto px-6 py-20 relative z-10 prose prose-slate prose-lg">
                <div className="space-y-16">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-[#111] tracking-tight">Introduction</h2>
                        <p className="text-[1.15rem] text-slate-600 leading-relaxed font-medium">
                            By leveraging the Synchronous Build Digital ecosystem, you agree to these Terms of Service. These terms are designed to ensure mutual growth and architectural integrity.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-[#111] tracking-tight">Project Architecture</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Synchronous Build Digital provides elite consultancy and technical engineering services. All deliverables are architected for enterprise-grade performance and high-growth scalability.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-[#111] tracking-tight">Intellectual Property</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Upon full settlement of project commitments, all custom creative and technical assets are transferred to the client. Our core proprietary architectures remain protected by the Synchronous innovation label.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-[#111] tracking-tight">System Continuity</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Clients are responsible for maintaining the operational integrity of their digital platforms after project handover, unless a Synchronous pulse-maintenance plan is active.
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
