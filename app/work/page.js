"use client";

import { motion } from "framer-motion";
import { 
    CheckCircle2, 
    ArrowUpRight, 
    Zap, 
    Shield, 
    Activity, 
    Globe, 
    Layout, 
    BarChart3, 
    Cpu,
    Target
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const selectedWorks = [
    {
        title: "BOXFOX",
        category: "E-commerce & AI Customization",
        slug: "v4.1",
        problem: "The leading gifting brand needed to scale their 'Build a BOXFOX' platform to handle complex customization and high-volume corporate gifting demands.",
        solution: "We engineered a robust e-commerce ecosystem with AI-driven design tools and a streamlined multi-ship fulfillment architecture.",
        results: ["Optimized UX for 425k+ shipments", "AI-powered customization interface", "Scalable corporate gifting portal"],
        metric: "+120% Sales",
        image: "/website ss/boxfox.png",
        accent: "#F05E23"
    },
    {
        title: "RYM Grenergy",
        category: "CleanTech & Digital Identity",
        slug: "v3.8",
        problem: "A sustainable energy startup required a high-authority digital presence to communicate their IoT battery tech and secure strategic grants.",
        solution: "We architected an investor-ready platform with interactive product visualization and provided strategic pitch consultancy for funding rounds.",
        results: ["Secured multiple clean-tech grants", "IoT-integrated product dashboard", "Commanding brand authority"],
        metric: "Multi-Grant Win",
        image: "/website ss/RYM.png",
        accent: "#111"
    },
    {
        title: "Bworth",
        category: "FinTech & Wealth Management",
        slug: "v5.2",
        problem: "Bworth needed an institutional-grade platform to present complex wealth management data to high-net-worth clients without overwhelming them with dense analytics.",
        solution: "We designed a sophisticated, dark-mode native financial dashboard using advanced data visualization techniques and ultra-low-latency real-time state management.",
        results: ["40% increase in user retention", "Institutional-grade security compliance", "Flawless real-time data synchronization"],
        metric: "Award Winner",
        image: "/website ss/bworth.png",
        accent: "#F05E23"
    },
    {
        title: "FashQuick",
        category: "Sustainable Fashion Marketplace",
        slug: "v3.1",
        problem: "The sustainable fashion startup struggled to differentiate its marketplace from fast-fashion giants, suffering from a low conversion rate and high cart abandonment.",
        solution: "We engineered an elegant, editorial-style mobile-first application focused on hyper-personalized curation and a frictionless, one-click checkout flow.",
        results: ["Increased conversion rate by 3.2x", "Reduced cart abandonment by 45%", "Award-winning editorial UI design"],
        metric: "3.2x Conversion",
        image: "/website ss/fashquick.png",
        accent: "#111"
    },
    {
        title: "Vega Vruddhi",
        category: "Agri-tech & AI Logistics",
        slug: "v4.5",
        problem: "The Agri-tech sector faced fragmented reach and lacked a robust digital logistics infrastructure to connect farmers directly to markets.",
        solution: "We deployed a direct farmer-to-market platform integrated with AI-driven price forecasting and logistics optimization engines.",
        results: ["Direct farmer-to-market access", "AI-powered price prediction model", "25% Revenue Growth"],
        metric: "AI Growth",
        image: "/website ss/vega.png",
        accent: "#F05E23"
    }
];

const industries = [
    { title: "E-commerce & Retail", desc: "High-conversion storefronts, headless commerce, & complex inventory systems.", icon: Globe },
    { title: "SaaS & Startups", desc: "Scalable platform architectures & frictionless, low-churn onboarding flows.", icon: Zap },
    { title: "FinTech & Web3", desc: "Institutional-grade security protocols & real-time data visualization.", icon: Shield },
    { title: "Enterprise Solutions", desc: "Custom internal management tools & intelligent process automation.", icon: Cpu }
];

export default function WorkPage() {
    return (
        <main className="bg-[#FDFDFD] min-h-screen selection:bg-[#F05E23]/20 overflow-x-hidden">
            {/* Minimalist Grid Pattern */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: 'radial-gradient(#000 1.2px, transparent 1.2px)', backgroundSize: '48px 48px' }}></div>

            {/* Header / Hero */}
            <header className="relative w-full pt-44 pb-12 md:pt-60 md:pb-16 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col items-start relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-100 rounded-full mb-10 shadow-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#F05E23] animate-pulse"></span>
                        <span className="text-[0.7rem] font-bold text-[#F05E23] tracking-[0.45em] uppercase">Impact Report 2026</span>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 w-full">
                        <motion.h1 
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold tracking-[-0.05em] text-[#111] leading-[0.85]"
                        >
                            High Performance. <br />
                            <span className="text-[#F05E23]">Scale Engineered.</span>
                        </motion.h1>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="max-w-xs border-l-2 border-[#F05E23] pl-8 pb-4 text-slate-500 font-medium leading-relaxed italic"
                        >
                            Verifiably shifting market caps and operational efficiency through relentless engineering.
                        </motion.div>
                    </div>
                </div>

                <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-[#F05E23]/5 rounded-full blur-[150px] -z-10" />
            </header>

            {/* Impact Cards Section - Tight Grid */}
            <section className="w-full px-6 py-12 space-y-12 md:space-y-20 relative z-10">
                {selectedWorks.map((work, i) => (
                    <motion.div 
                        key={work.title}
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-5%" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-8 lg:gap-20 group"
                    >
                        {/* Visual / Badge Side */}
                        <div className={`lg:w-[48%] flex flex-col justify-start ${i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                            <div className="relative aspect-[16/10] w-full rounded-[3.5rem] overflow-hidden group shadow-2xl border border-slate-50 bg-slate-50">
                                <Image 
                                    src={work.image} 
                                    alt={work.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111]/40 to-transparent" />
                                
                                {/* Floating Metric Badge */}
                                <div className="absolute top-8 left-8 p-5 backdrop-blur-3xl bg-white/90 border border-white rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-1 group-hover:scale-110 transition-transform duration-700">
                                    <span className="text-[0.6rem] font-black text-[#F05E23] tracking-[0.4em] uppercase">Impact Metric</span>
                                    <span className="text-2xl md:text-3xl font-black text-[#111] tracking-tighter uppercase">{work.metric}</span>
                                </div>

                                <div className="absolute bottom-8 right-8 flex items-center gap-3">
                                    <div className="px-4 py-2 bg-[#111]/80 backdrop-blur-md rounded-full text-[0.6rem] font-bold text-white tracking-widest uppercase border border-white/10">
                                        Release {work.slug}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content / Outcomes Side */}
                        <div className={`lg:w-[52%] flex flex-col justify-center py-6 ${i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                            <div className="text-[0.6rem] font-black text-[#F05E23] tracking-[0.5em] uppercase mb-6 flex items-center gap-4">
                                <span className="w-10 h-[1px] bg-[#F05E23]/30"></span>
                                {work.category}
                            </div>
                            <h2 className="text-[3rem] md:text-[5rem] font-extrabold text-[#111] tracking-tighter leading-[0.9] mb-8 group-hover:text-[#F05E23] transition-colors duration-500">
                                {work.title}.
                            </h2>
                            
                            <div className="grid md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-4">
                                    <div className="text-[0.6rem] font-black text-slate-300 uppercase tracking-[0.3em]">Operational Problem</div>
                                    <p className="text-[0.95rem] text-slate-500 font-medium leading-relaxed italic pr-4">
                                        "{work.problem}"
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-[0.6rem] font-black text-[#F05E23]/40 uppercase tracking-[0.3em]">Surgical Solution</div>
                                    <p className="text-[0.95rem] text-slate-600 font-bold leading-relaxed">
                                        {work.solution}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#F05E23]/10 transition-all duration-500">
                                <div className="text-[0.6rem] font-black text-slate-300 uppercase tracking-[0.4em] mb-6">Verifiable Outcomes</div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {work.results.map((r, rid) => (
                                        <div key={rid} className="flex items-center gap-4 text-slate-600 group/row">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-[#111] transition-colors">
                                                <CheckCircle2 className="w-4 h-4 text-slate-300 group-hover:text-[#F05E23]" />
                                            </div>
                                            <span className="text-[0.9rem] font-bold group-hover:text-[#111] transition-colors">{r}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Industrial Verticals Section */}
            <section className="w-full bg-[#111] py-24 md:py-32 px-6 relative overflow-hidden mt-12">
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                     style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-20">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full mb-10">
                                <span className="w-2 h-2 rounded-full bg-[#F05E23]"></span>
                                <span className="text-[0.65rem] font-black text-[#F05E23] tracking-[0.45em] uppercase">Industry Penetration</span>
                            </div>
                            <h2 className="text-[3.5rem] md:text-[5.5rem] font-bold text-white tracking-tighter leading-[0.9]">
                                Strategic <br /> <span className="text-[#F05E23] italic font-light">Ecosystems.</span>
                            </h2>
                        </div>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xs border-l-2 border-[#F05E23] pl-10">
                            Engineering market dominance across global high-equity verticals.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {industries.map((ind, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-10 rounded-[3rem] bg-white/5 border border-white/5 hover:border-[#F05E23]/20 hover:bg-white/10 transition-all duration-500"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[#F05E23]/10 flex items-center justify-center text-[#F05E23] mb-8 group-hover:scale-110 transition-transform">
                                    <ind.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#F05E23] transition-colors">{ind.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8">{ind.desc}</p>
                                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[0.6rem] font-black text-slate-600 uppercase tracking-widest">Protocol Active</span>
                                    <ArrowUpRight className="w-4 h-4 text-[#F05E23] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="w-full py-24 md:py-44 px-6 flex flex-col items-center text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#F05E23]/5 border border-[#F05E23]/10 rounded-full mb-12"
                >
                    <Activity className="w-4 h-4 text-[#F05E23]" />
                    <span className="text-[0.65rem] font-black text-[#F05E23] tracking-[0.4em] uppercase">Direct Performance Loop</span>
                </motion.div>

                <h2 className="text-[3.5rem] md:text-[6rem] font-bold text-[#111] tracking-tighter leading-[0.9] mb-12">
                    Initialize Your <br /> <span className="text-[#F05E23]">Acquisition</span> Cycle.
                </h2>

                <Link 
                    href="/contact"
                    className="group relative px-14 py-8 rounded-[2.5rem] bg-[#111] text-white font-black uppercase text-[0.8rem] tracking-[0.4em] overflow-hidden hover:scale-105 active:scale-95 transition-all duration-500 shadow-2xl"
                >
                    <span className="relative z-10">Start Your Build</span>
                    <div className="absolute inset-0 bg-[#F05E23] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>
            </section>
        </main>
    );
}
