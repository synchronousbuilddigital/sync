"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
    return (
        <div className="flex flex-col items-center w-full min-h-screen relative overflow-hidden selection:bg-orange-500/20" style={{ backgroundColor: '#FAFAF8' }}>
            <div className="absolute top-[5%] right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 opacity-10"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(150px)' }}
            ></div>

            <section className="w-full max-w-7xl mx-auto px-6 pt-32 pb-16 relative z-10">
                <div className="flex flex-col items-start max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-4 py-2 bg-[#111] shadow-xl shadow-orange-500/10 rounded-full mb-10"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                        <span className="text-[0.65rem] font-black text-white tracking-[0.4em] uppercase">Terms of Scalability</span>
                    </motion.div>

                    <h1 className="text-[3.5rem] md:text-[5.5rem] lg:text-[7.5rem] font-bold tracking-tight leading-[0.85] text-[#111] mb-12">
                        Terms of <br />
                        <span className="italic font-light text-slate-400">Service.</span>
                    </h1>
                </div>
            </section>

            <section className="w-full max-w-4xl mx-auto px-6 py-20 relative z-10">
                <div className="space-y-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="md:col-span-1">
                            <p className="text-[0.65rem] font-black text-[#F05E23] uppercase tracking-[0.4em]">01 Acceptance</p>
                        </div>
                        <div className="md:col-span-3 space-y-6">
                            <h2 className="text-3xl font-bold text-[#111] tracking-tight">The Digital Contract</h2>
                            <p className="text-[1.15rem] text-slate-600 leading-relaxed font-medium">
                                By accessing the Synchronous Build Digital ecosystem, you engage in a binding agreement to adhere to these Terms of Service. These protocols ensure the preservation of architectural excellence and mutual operational success.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="md:col-span-1">
                            <p className="text-[0.65rem] font-black text-[#F05E23] uppercase tracking-[0.4em]">02 Scope of Work</p>
                        </div>
                        <div className="md:col-span-3 space-y-6">
                            <h2 className="text-3xl font-bold text-[#111] tracking-tight">Architectural Consultancy</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Sync provides high-end digital engineering and strategic growth consultancy. All deliverables are built to individual Master Service Agreement (MSA) specifications, optimized for institutional-grade scalability.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="md:col-span-1">
                            <p className="text-[0.65rem] font-black text-[#F05E23] uppercase tracking-[0.4em]">03 Payment Nodes</p>
                        </div>
                        <div className="md:col-span-3 space-y-6">
                            <h2 className="text-3xl font-bold text-[#111] tracking-tight">Capital Deployment</h2>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Project capital is deployed according to milestone-based schedules defined in your statement of work. Delinquent payment cycles may result in temporary suspension of technical infrastructure or strategic support.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="md:col-span-1">
                            <p className="text-[0.65rem] font-black text-[#F05E23] uppercase tracking-[0.4em]">04 Property Rights</p>
                        </div>
                        <div className="md:col-span-3 space-y-6">
                            <h2 className="text-3xl font-bold text-[#111] tracking-tight">Technical Equity</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Upon full financial settlement, all custom project assets, codebases, and creative nodes are transferred to the client. Synchronous retains ownership of its proprietary "Surgical" frameworks and foundational core engine libraries.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="md:col-span-1">
                            <p className="text-[0.65rem] font-black text-[#F05E23] uppercase tracking-[0.4em]">05 Continuity</p>
                        </div>
                        <div className="md:col-span-3 space-y-6">
                            <h2 className="text-3xl font-bold text-[#111] tracking-tight">System Integrity</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Clients are solely responsible for the post-handover maintenance of their digital ecosystems. Synchronous does not accept liability for architectural degradation caused by third-party modifications outside of our sanctioned support plans.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="md:col-span-1">
                            <p className="text-[0.65rem] font-black text-[#F05E23] uppercase tracking-[0.4em]">06 Governing Law</p>
                        </div>
                        <div className="md:col-span-3 space-y-6">
                            <h2 className="text-3xl font-bold text-[#111] tracking-tight">Legal Jurisdiction</h2>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                These terms are governed by the laws of the jurisdiction in which Synchronous is registered. Any disputes arising from these terms will be resolved through institutional arbitration before escalating to civil litigation.
                            </p>
                        </div>
                    </div>

                    <div className="pt-20 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <p className="text-[0.65rem] font-black text-[#111] uppercase tracking-[0.4em]">Synchronous Build Digital &copy; {new Date().getFullYear()}</p>
                        <p className="text-[0.65rem] font-bold text-slate-400 tracking-[0.2em]">Revision 1.8 | Effective Date: March 30, 2026</p>
                    </div>
                </div>
            </section>


        </div>
    );
}
