"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
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
                        <span className="text-[0.65rem] font-black text-white tracking-[0.4em] uppercase">Data Sovereignty</span>
                    </motion.div>

                    <h1 className="text-[3.5rem] md:text-[5.5rem] lg:text-[7.5rem] font-bold tracking-tight leading-[0.85] text-[#111] mb-12">
                        Privacy <br />
                        <span className="italic font-light text-slate-400">Governance.</span>
                    </h1>
                </div>
            </section>

            <section className="w-full max-w-4xl mx-auto px-6 py-20 relative z-10">
                <div className="space-y-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="md:col-span-1">
                            <p className="text-[0.65rem] font-black text-[#F05E23] uppercase tracking-[0.4em]">01 Introduction</p>
                        </div>
                        <div className="md:col-span-3 space-y-6">
                            <h2 className="text-3xl font-bold text-[#111] tracking-tight">Systemic Integrity</h2>
                            <p className="text-[1.15rem] text-slate-600 leading-relaxed font-medium">
                                At Synchronous Build Digital ("Sync"), we architect digital products with privacy as a primary structural pillar. Your data is your property. This policy dictates our strict protocols for data acquisition, processing, and absolute protection.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="md:col-span-1">
                            <p className="text-[0.65rem] font-black text-[#F05E23] uppercase tracking-[0.4em]">02 Data Spectrum</p>
                        </div>
                        <div className="md:col-span-3 space-y-8">
                            <h2 className="text-3xl font-bold text-[#111] tracking-tight">Intelligence Collection</h2>
                            <div className="space-y-6">
                                <h4 className="text-lg font-bold text-[#111]">Workplace Data</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    We collect professional identifiers (name, work email, organization) when you engage our consultancy or subscribe to our market intelligence feed.
                                </p>

                                <h4 className="text-lg font-bold text-[#111]">Technical Telemetry</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    To optimize platform performance, we track localized technical metrics including load sequences, viewport distributions, and engagement intervals.
                                </p>

                                <h4 className="text-lg font-bold text-[#111]">Surgical Behavioral Data</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    We use anonymized interaction nodes to understand how users navigate our frameworks, allowing for iterative precision in our UI/UX deployments.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="md:col-span-1">
                            <p className="text-[0.65rem] font-black text-[#F05E23] uppercase tracking-[0.4em]">03 Data Processing</p>
                        </div>
                        <div className="md:col-span-3 space-y-6">
                            <h2 className="text-3xl font-bold text-[#111] tracking-tight">How We Orchestrate</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Information collected is used exclusively for:
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600 font-medium">
                                <li className="flex items-center gap-3"><span className="w-1 h-1 bg-[#F05E23] rounded-full"></span> Service Personalization</li>
                                <li className="flex items-center gap-3"><span className="w-1 h-1 bg-[#F05E23] rounded-full"></span> Performance Monitoring</li>
                                <li className="flex items-center gap-3"><span className="w-1 h-1 bg-[#F05E23] rounded-full"></span> Strategic Communication</li>
                                <li className="flex items-center gap-3"><span className="w-1 h-1 bg-[#F05E23] rounded-full"></span> Architectural Auditing</li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="md:col-span-1">
                            <p className="text-[0.65rem] font-black text-[#F05E23] uppercase tracking-[0.4em]">04 Security Protocol</p>
                        </div>
                        <div className="md:col-span-3 space-y-6">
                            <h2 className="text-3xl font-bold text-[#111] tracking-tight">Encryption & Storage</h2>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Sync employs institutional-grade AES-256 encryption for both data-at-rest and data-in-transit. We utilize segregated storage nodes and strictly monitor all access vectors via multi-factor biometric authentication.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="md:col-span-1">
                            <p className="text-[0.65rem] font-black text-[#F05E23] uppercase tracking-[0.4em]">05 Cookie Matrix</p>
                        </div>
                        <div className="md:col-span-3 space-y-6">
                            <h2 className="text-3xl font-bold text-[#111] tracking-tight">Persistent States</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Our platform utilizes surgical cookies to maintain session state and preferences. These are categorized as Essential (functional architecture) and Diagnostic (performance optimization). You may recalibrate your cookie settings through your browser terminal at any time.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="md:col-span-1">
                            <p className="text-[0.65rem] font-black text-[#F05E23] uppercase tracking-[0.4em]">06 User Autonomy</p>
                        </div>
                        <div className="md:col-span-3 space-y-6">
                            <h2 className="text-3xl font-bold text-[#111] tracking-tight">The Right to Erase</h2>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                In accordance with global privacy frameworks, you maintain the absolute right to access, rectify, or purge your data from our ecosystem. Requests for final data deletion are executed with zero-latency priority within 48 hours.
                            </p>
                        </div>
                    </div>

                    <div className="pt-20 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <p className="text-[0.65rem] font-black text-[#111] uppercase tracking-[0.4em]">Synchronous Build Digital &copy; {new Date().getFullYear()}</p>
                        <p className="text-[0.65rem] font-bold text-slate-400 tracking-[0.2em]">Revision 2.1 | Last Modified: March 30, 2026</p>
                    </div>
                </div>
            </section>


        </div>
    );
}
