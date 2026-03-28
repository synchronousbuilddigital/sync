"use client";

import { CheckCircle2, TrendingUp, Presentation, Rocket, Globe, Palette, ArrowUpRight, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const selectedWorks = [
    {
        title: "BOXFOX",
        category: "E-commerce & AI Customization",
        problem: "The leading gifting brand needed to scale their 'Build a BOXFOX' platform to handle complex customization and high-volume corporate gifting demands.",
        solution: "We engineered a robust e-commerce ecosystem with AI-driven design tools and a streamlined multi-ship fulfillment architecture.",
        results: ["Optimized UX for 425k+ shipments", "AI-powered customization interface", "Scalable corporate gifting portal"],
        stats: "+120% Sales",
        image: "/work/boxfox.png"
    },
    {
        title: "RYM Grenergy",
        category: "CleanTech & Digital Identity",
        problem: "A sustainable energy startup required a high-authority digital presence to communicate their IoT battery tech and secure strategic grants.",
        solution: "We architected an investor-ready platform with interactive product visualization and provided strategic pitch consultancy for funding rounds.",
        results: ["Secured multiple clean-tech grants", "IoT-integrated product dashboard", "Commanding brand authority"],
        stats: "Multi-Grant Win",
        image: "/work/rym.png"
    },
    {
        title: "Bworth",
        category: "FinTech & Wealth Management",
        problem: "Bworth needed an institutional-grade platform to present complex wealth management data to high-net-worth clients without overwhelming them with dense analytics.",
        solution: "We designed a sophisticated, dark-mode native financial dashboard using advanced data visualization techniques and ultra-low-latency real-time state management.",
        results: ["40% increase in user retention", "Institutional-grade security compliance", "Flawless real-time data synchronization"],
        stats: "Platform of the Year",
        image: "/work/bworth.png"
    },
    {
        title: "ClosetRush",
        category: "Sustainable Fashion Marketplace",
        problem: "The sustainable fashion startup struggled to differentiate its marketplace from fast-fashion giants, suffering from a low conversion rate and high cart abandonment.",
        solution: "We engineered an elegant, editorial-style mobile-first application focused on hyper-personalized curation and a frictionless, one-click checkout flow.",
        results: ["Increased conversion rate by 3.2x", "Reduced cart abandonment by 45%", "Award-winning editorial UI design"],
        stats: "3.2x Conversion Rate",
        image: "/work/closetrush.png"
    },
    {
        title: "Vega Vruddhi",
        category: "Agri-tech & AI Logistics",
        problem: "The Agri-tech sector faced fragmented reach and lacked a robust digital logistics infrastructure to connect farmers directly to markets.",
        solution: "We deployed a direct farmer-to-market platform integrated with AI-driven price forecasting and logistics optimization engines.",
        results: ["Direct farmer-to-market access", "AI-powered price prediction model", "25% Revenue Growth"],
        stats: "AI Forecasting Win",
        image: "/work/vega.png"
    }
];

const brands = ["Bworth", "Vega Vruddhi", "ClosetRush", "Kullhad Coffee Cafe"];

const industries = [
    {
        title: "E-commerce & Retail",
        icon: <Globe className="w-7 h-7" />,
        desc: "High-conversion storefronts, headless commerce, & complex inventory systems.",
        accent: "#F05E23",
        bgHover: "rgba(240,94,35,0.05)"
    },
    {
        title: "SaaS & Startups",
        icon: <Rocket className="w-7 h-7" />,
        desc: "Scalable platform architectures & frictionless, low-churn onboarding flows.",
        accent: "#F05E23",
        bgHover: "rgba(240,94,35,0.05)"
    },
    {
        title: "Sustainable Brands",
        icon: <Palette className="w-7 h-7" />,
        desc: "Immersive digital storytelling & commanding visual brand authority.",
        accent: "#F05E23",
        bgHover: "rgba(240,94,35,0.05)"
    },
    {
        title: "Packaging Businesses",
        icon: <Presentation className="w-7 h-7" />,
        desc: "B2B wholesale portals, custom 3D configurators, & tracking dashboards.",
        accent: "#F05E23",
        bgHover: "rgba(240,94,35,0.05)"
    },
    {
        title: "FinTech & Web3",
        icon: <TrendingUp className="w-7 h-7" />,
        desc: "Institutional-grade security protocols & real-time data visualization.",
        accent: "#F05E23",
        bgHover: "rgba(240,94,35,0.05)"
    },
    {
        title: "Enterprise Solutions",
        icon: <Cpu className="w-7 h-7" />,
        desc: "Custom internal management tools & intelligent process automation.",
        accent: "#F05E23",
        bgHover: "rgba(240,94,35,0.05)"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

export default function WorkPage() {
    return (
        <div className="flex flex-col items-center w-full min-h-screen selection:bg-orange-500/20" style={{ backgroundColor: '#FAFAF8' }}>
            {/* Ambient Backgrounds */}
            <div className="absolute top-[10%] left-[-10%] w-[800px] h-[800px] rounded-full -z-10 opacity-10"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(120px)' }}
            ></div>
            <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full -z-10 opacity-5"
                style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(100px)' }}
            ></div>

            <section className="w-full max-w-[1400px] mx-auto px-6 pt-32 pb-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl flex flex-col items-start gap-8 mb-12"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#111] shadow-xl shadow-orange-500/10 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-pulse"></span>
                        <span className="text-[0.65rem] font-black text-white tracking-[0.4em] uppercase">Impact Report</span>
                    </div>

                    <h1 className="text-[4rem] md:text-[6rem] lg:text-[7.5rem] font-bold tracking-tight leading-[0.9] text-[#111]">
                        High Performance. <br /> <span className="italic font-light text-slate-400">Scale Engineered.</span>
                    </h1>
                </motion.div>
            </section>

            {/* Selected Work Details */}
            <section className="w-full max-w-[1400px] mx-auto px-6 py-14 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid gap-24 lg:gap-40"
                >
                    {selectedWorks.map((work, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 lg:gap-24 items-center group`}
                        >
                            {/* Graphic / Image Side */}
                            <div className="lg:w-1/2 aspect-[4/3] rounded-[3rem] overflow-hidden border border-[rgba(0,0,0,0.05)] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] relative flex items-center justify-center transition-all duration-700 group-hover:shadow-[0_40px_100px_-20px_rgba(240,94,35,0.12)] group-hover:border-[#F05E23]/20 w-full bg-white"
                            >
                                <Image
                                    src={work.image}
                                    alt={work.title}
                                    fill
                                    className="object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111]/20 to-transparent"></div>

                                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 py-5 px-10 bg-white/95 backdrop-blur-xl rounded-full border border-white z-20 shadow-[0_15px_40px_rgba(0,0,0,0.1)] group-hover:-translate-y-3 transition-transform duration-700">
                                    <span className="text-xl md:text-2xl font-black text-[#F05E23] tracking-tighter uppercase">{work.stats}</span>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="lg:w-1/2 flex flex-col items-start w-full">
                                <div className="px-5 py-2 border rounded-2xl inline-flex items-center gap-2 mb-10 bg-[#FAFAF8] border-[#E2E8F0] group-hover:border-[#F05E23]/20 group-hover:bg-orange-50/30 transition-all duration-500"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23]"></span>
                                    <span className="text-[0.7rem] font-black tracking-widest uppercase text-slate-500 group-hover:text-[#F05E23]">{work.category}</span>
                                </div>
                                <h3 className="text-5xl lg:text-7xl font-bold text-[#111] mb-12 tracking-tight transition-colors duration-500 group-hover:text-[#F05E23]">{work.title}.</h3>

                                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 mb-12">
                                    <div className="space-y-4">
                                        <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-300">Phase 01: The Problem</p>
                                        <p className="text-slate-500 font-normal leading-relaxed text-[1.05rem]">{work.problem}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-[#F05E23]/40">Phase 02: Execution</p>
                                        <p className="text-slate-500 font-normal leading-relaxed text-[1.05rem]">{work.solution}</p>
                                    </div>
                                </div>

                                <div className="w-full p-10 rounded-[2.5rem] bg-white border border-[rgba(0,0,0,0.04)] shadow-sm group-hover:border-[#F05E23]/10 transition-all duration-500"
                                >
                                    <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Measurable Outcomes</p>
                                    <div className="grid gap-5">
                                        {work.results.map((r, idx) => (
                                            <div key={idx} className="flex items-center gap-5 text-slate-600 font-medium group/item">
                                                <div className="w-8 h-8 rounded-xl bg-[#FAFAF8] border border-[rgba(0,0,0,0.05)] flex items-center justify-center shrink-0 group-hover:bg-[#111] transition-colors duration-500">
                                                    <CheckCircle2 className="w-4 h-4 text-slate-300 group-hover:text-[#F05E23]" />
                                                </div>
                                                <span className="text-[1.05rem] group-hover:text-[#111] transition-colors">{r}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Other Brands Bar */}
            <section className="w-full py-20 border-y border-[rgba(0,0,0,0.04)] mt-12 bg-white flex flex-col items-center">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.5em] text-slate-300 mb-16">Establishing Market Dominance</p>
                <div className="flex flex-wrap justify-center gap-12 md:gap-24 w-full max-w-[1400px] px-6">
                    {brands.map(brand => (
                        <span key={brand} className="text-2xl md:text-3xl font-bold text-slate-200 hover:text-[#F05E23] transition-all duration-500 uppercase tracking-tighter cursor-default transform hover:scale-110">
                            {brand}
                        </span>
                    ))}
                </div>
            </section>

            {/* Industries Section */}
            <section className="w-full py-32 relative overflow-hidden bg-[#FAFAF8]">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-20">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#111] rounded-full mb-8 shadow-lg shadow-orange-500/10">
                                <span className="text-[0.65rem] font-bold text-white tracking-[0.3em] uppercase">Versatility</span>
                            </div>
                            <h2 className="text-[3.5rem] lg:text-[6rem] font-bold text-[#111] tracking-tight leading-[0.95]">
                                Strategic <br className="hidden md:block" />
                                <span className="text-[#F05E23] italic font-light">Ecosystems.</span>
                            </h2>
                        </div>
                        <p className="text-[1.2rem] text-slate-500 font-medium border-l-4 border-[#F05E23] pl-6 max-w-xs leading-relaxed">
                            Relentless engineering and growth infrastructure deployed across global verticals.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 w-full">
                        {industries.map((ind, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="group relative p-12 rounded-[3.5rem] bg-white border border-[rgba(0,0,0,0.04)] shadow-sm hover:shadow-[0_40px_100px_-20px_rgba(240,94,35,0.1)] transition-all duration-700 flex flex-col justify-between h-[25rem] lg:h-[28rem] overflow-hidden hover:-translate-y-2"
                            >
                                {/* Hover Light Effect */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"
                                    style={{ background: `radial-gradient(circle at top right, ${ind.bgHover}, transparent 70%)` }}
                                ></div>

                                {/* Floating Icon */}
                                <div className="relative z-10 w-16 h-16 rounded-3xl bg-[#FAFAF8] border border-[rgba(0,0,0,0.04)] flex items-center justify-center transition-all duration-700 group-hover:bg-[#111] group-hover:text-[#F05E23] group-hover:scale-110 mb-8"
                                >
                                    {ind.icon}
                                </div>

                                {/* Typography */}
                                <div className="relative z-10 flex-1 flex flex-col">
                                    <h3 className="text-[2.2rem] font-bold text-[#111] mb-4 group-hover:text-[#F05E23] transition-colors duration-700 leading-tight">
                                        {ind.title}.
                                    </h3>
                                    <p className="text-[1.1rem] text-slate-500 font-normal leading-relaxed group-hover:text-slate-700 transition-colors duration-700">
                                        {ind.desc}
                                    </p>
                                </div>

                                {/* Call to Action */}
                                <div className="relative z-10 flex items-center justify-between mt-auto pt-8 border-t border-[rgba(0,0,0,0.04)] group-hover:border-[#F05E23]/10 transition-colors duration-700">
                                    <div className="flex items-center gap-3 font-black uppercase text-[0.65rem] tracking-[0.4em] text-slate-300 group-hover:text-[#F05E23] transition-colors duration-500">
                                        Infrastructure
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-[rgba(0,0,0,0.05)] bg-[#FAFAF8] flex items-center justify-center group-hover:bg-[#111] transition-all duration-700 group-hover:shadow-lg">
                                        <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-white group-hover:rotate-45 transition-all duration-500" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

                        
        </div>
    );
}
