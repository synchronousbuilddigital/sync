"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
    ShoppingBag,
    TrendingUp,
    Code2,
    Megaphone,
    Building2,
    CheckCircle2,
    ArrowUpRight,
    Zap,
    Sparkles,
    Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "../../components/ThemeContext";
import { useChat } from "../../components/ChatContext";
import { useAuth } from "../../components/AuthContext";

const bannerImages = [
    "/services_banner_1.png",
    "/services_banner_2.png"
];

const serviceCategories = [
    {
        id: "01",
        title: "Seller Onboarding",
        icon: ShoppingBag,
        desc: "End-to-end setup across Amazon, Flipkart, Meesho, and Myntra. We handle document verification, GST compliance, catalog creation, and fulfillment.",
        services: ["Amazon & Flipkart Verification", "GTIN & Trademark Exemption", "A+ Product Cataloging", "Logistics & Easy Ship Setup"],
        image: "/ChatGPT Image Apr 3, 2026, 11_35_08 AM.png",
        href: "/services/seller-onboarding"
    },
    {
        id: "02",
        title: "Key Account Management",
        icon: TrendingUp,
        desc: "Dedicated marketplace strategists optimizing PPC ads, inventory forecasting, Buy Box defense, and SKU profitability.",
        services: ["Surgical PPC & ACOS Control", "24/7 Buy Box Protection", "Inventory & FBA Forecasting", "Executive KPI Reporting"],
        image: "/ChatGPT Image Apr 3, 2026, 11_39_48 AM.png",
        href: "/services/key-account-management"
    },
    {
        id: "03",
        title: "Website Development",
        icon: Code2,
        desc: "High-performance React 19 / Next.js 16 web applications, custom e-commerce stores, PWAs, and sub-500ms lightning page speeds.",
        services: ["Custom E-Commerce Stores", "Next.js & React Applications", "Mobile-First PWAs", "Google 99+ Core Web Vitals"],
        image: "/ChatGPT Image Apr 3, 2026, 11_36_48 AM.png",
        href: "/services/website-development"
    },
    {
        id: "04",
        title: "Digital Marketing",
        icon: Megaphone,
        desc: "High-ROAS Meta and Google ad campaigns, technical SEO, content architecture, and conversion rate optimization.",
        services: ["Meta & Google Ad Engineering", "Technical SEO Architecture", "High-Impact Visual Content", "Conversion Rate Optimization"],
        image: "/ChatGPT Image Apr 3, 2026, 11_39_48 AM.png",
        href: "/services/digital-marketing"
    },
    {
        id: "05",
        title: "Business Solution",
        icon: Building2,
        desc: "Custom ERPs, CRMs, AI workflow automation, live Google Sheets synchronization, and automated GST billing systems.",
        services: ["Custom ERP & Command HQ", "AI Autonomous Agents", "Google Sheets & DB Sync", "Automated GST Invoicing"],
        image: "/ChatGPT Image Apr 3, 2026, 11_39_44 AM.png",
        href: "/services/business-solution"
    }
];

export default function ServicesPage() {
    const { isDark } = useTheme();
    const { sendMessage } = useChat();
    const { partnerLogos = [] } = useAuth();
    const containerRef = useRef(null);

    const [activeBannerIdx, setActiveBannerIdx] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveBannerIdx((prev) => (prev + 1) % bannerImages.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const handleServiceClick = (serviceName) => {
        sendMessage(`Explain "${serviceName}" in detail and how it creates value for my business.`);
    };

    const handleScrollToServices = () => {
        document.getElementById("services-list")?.scrollIntoView({ behavior: "smooth" });
    };

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <main className={`min-h-screen selection:bg-[#F05E23]/20 overflow-x-hidden transition-colors duration-700 ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#FDFDFD]'}`} ref={containerRef}>
            {/* Minimalist Grid Pattern */}
            <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.03]'}`}
                style={{ backgroundImage: `radial-gradient(${isDark ? '#FFF' : '#000'} 1.2px, transparent 1.2px)`, backgroundSize: '48px 48px' }}></div>

            {/* Hero Header Banner with 3-Second Automatic Image Slideshow (Pure Banner Only) */}
            <header className="relative w-full pt-0 pb-0 overflow-hidden select-none">

                {/* Cinematic Background Slideshow - Exact Aspect Ratio on Mobile, Sleek Compact Max-Height on Desktop */}
                <div className="relative w-full aspect-[2048/768] max-h-[420px] sm:max-h-[480px] overflow-hidden">
                    {bannerImages.map((src, idx) => (
                        <img
                            key={src}
                            src={src}
                            alt={`Synchronous Services Banner Slide ${idx + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover sm:object-cover transform-gpu transition-opacity duration-700 ease-in-out pointer-events-none select-none ${
                                activeBannerIdx === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                        />
                    ))}
                </div>

                {/* Slide Indicators / Dots */}
                <div className="absolute bottom-2 right-3 sm:bottom-4 sm:right-10 z-20 flex items-center gap-2">
                    {bannerImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveBannerIdx(idx)}
                            className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                                activeBannerIdx === idx ? "w-6 sm:w-8 bg-[#F05E23]" : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/90"
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </header>

            {/* Marketplace Platforms Infinite Marquee Section (Left to Right) */}
            <section className="w-full relative z-10 py-5 overflow-hidden border-b transition-colors duration-500 border-black/5 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02]">
                <div className="flex w-max gap-12 sm:gap-20 items-center animate-marquee-reverse whitespace-nowrap">
                    {[1, 2, 3, 4].map((setIndex) => (
                        <div key={`set-${setIndex}`} className="flex shrink-0 items-center gap-12 sm:gap-20">
                            <div className="flex items-center h-10 px-2 opacity-85 hover:opacity-100 transition-opacity">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/brand-logos/amazon.svg" alt="Amazon" className="h-7 sm:h-8 w-auto object-contain dark:invert" />
                            </div>
                            <div className="flex items-center h-10 px-2 opacity-85 hover:opacity-100 transition-opacity">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/brand-logos/flipkart.svg" alt="Flipkart" className="h-7 sm:h-8 w-auto object-contain" />
                            </div>
                            <div className="flex items-center gap-3 h-10 px-2 opacity-85 hover:opacity-100 transition-opacity">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/brand-logos/myntra.svg" alt="Myntra" className="h-7 sm:h-8 w-auto object-contain" />
                                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Myntra</span>
                            </div>
                            <div className="flex items-center h-10 px-2 opacity-85 hover:opacity-100 transition-opacity">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/brand-logos/meesho.svg" alt="Meesho" className="h-7 sm:h-8 w-auto object-contain" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section Intro Title Block */}
            <section className="w-full px-6 pt-4 pb-2 sm:pt-8 sm:pb-4 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-6 pb-3 sm:pb-6 border-b border-black/5 dark:border-white/10">
                    <div className="space-y-1.5 sm:space-y-3">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`inline-flex items-center gap-2.5 px-3 py-1 sm:px-4 sm:py-2 border rounded-full shadow-sm transition-colors duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}
                        >
                            <span className="w-2 h-2 rounded-full bg-[#F05E23] animate-pulse"></span>
                            <span className="text-[0.6rem] sm:text-[0.65rem] font-bold tracking-[0.35em] sm:tracking-[0.45em] uppercase text-[#F05E23]">What We Build</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`text-xl sm:text-4xl md:text-5xl font-black tracking-tight italic uppercase transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}
                        >
                            Our Core <span className="text-[#F05E23]">Capabilities</span>
                        </motion.h2>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className={`text-xs sm:text-base font-medium italic max-w-md border-l-2 border-[#F05E23] pl-3 sm:pl-4 py-0.5 transition-colors duration-500 ${isDark ? 'text-white/50' : 'text-slate-500'}`}
                    >
                        "We create friendly, high-speed digital systems and growth architectures to scale your business effortlessly."
                    </motion.p>
                </div>
            </section>

            {/* Phases Section */}
            <section id="services-list" className="w-full px-6 pt-4 pb-4 sm:pt-6 sm:pb-8 space-y-6 sm:space-y-10 md:space-y-12 relative z-10">
                {serviceCategories.map((phase, i) => (
                    <motion.div
                        key={phase.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-5%" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6 lg:gap-10"
                    >
                        {/* Visual / Phase ID Side */}
                        <div className={`lg:w-[45%] flex flex-col justify-start ${i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                            <div className={`relative aspect-[2/1] sm:aspect-[16/11] w-full rounded-2xl sm:rounded-[2.5rem] overflow-hidden group shadow-xl border transition-colors duration-500 ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-50'}`}>
                                <Image
                                    src={phase.image}
                                    alt={phase.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111]/40 to-transparent" />

                                {/* Floating Phase Badge */}
                                <div className={`absolute top-3 left-3 sm:top-6 sm:left-6 p-2.5 sm:p-4 backdrop-blur-3xl border rounded-xl sm:rounded-2xl shadow-xl flex flex-col items-center gap-0.5 group-hover:scale-105 transition-all duration-700 ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/80 border-white'}`}>
                                    <span className={`text-xs sm:text-xl font-bold leading-none transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}>Step</span>
                                </div>

                                {/* Floating Icon */}
                                <div className={`absolute bottom-3 right-3 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border group-hover:bg-[#F05E23] transition-all duration-500 ${isDark ? 'bg-[#111] border-white/10 text-white' : 'bg-[#111] border-black/5 text-white'}`}>
                                    <phase.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                                </div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className={`lg:w-[55%] flex flex-col justify-center py-1 sm:py-2 md:py-4 ${i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                            <h2 
                                onClick={() => sendMessage(`Explain what "${phase.title}" is and how it brings value and usefulness to my business.`)}
                                className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[0.95] mb-2 sm:mb-4 group-hover:text-[#F05E23] transition-colors duration-500 cursor-pointer hover:scale-[1.01] transform origin-left ${isDark ? 'text-white' : 'text-[#111]'}`}>
                                {phase.title}.
                            </h2>
                            <p className={`text-xs sm:text-base md:text-lg font-light leading-relaxed mb-3 sm:mb-6 max-w-xl transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                                {phase.desc}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                                {phase.services.map((service, sid) => (
                                    <motion.div
                                        key={sid}
                                        whileHover={{ x: 3, scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleServiceClick(service)}
                                        className={`flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border hover:border-[#F05E23]/20 hover:shadow-sm transition-all duration-500 cursor-pointer group/item ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}
                                    >
                                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center text-[#F05E23] shrink-0 transition-colors duration-500 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-50 group-hover/item:opacity-100 group-hover/item:scale-110 transition-all" />
                                        </div>
                                        <span className={`text-xs md:text-sm font-bold leading-tight transition-colors duration-500 ${isDark ? 'text-white/80' : 'text-[#111]'}`}>{service}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <Link
                                href={phase.href}
                                className={`group/btn inline-flex items-center gap-3 sm:gap-4 self-start p-1.5 pr-4 sm:p-2 sm:pr-6 rounded-full border hover:border-[#F05E23]/20 active:scale-95 transition-all duration-500 ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                            >
                                <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-white text-[#111] group-hover/btn:bg-[#F05E23] group-hover/btn:text-white' : 'bg-[#111] text-white group-hover/btn:bg-[#F05E23]'}`}>
                                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-[0.45rem] sm:text-[0.5rem] font-black tracking-[0.3em] sm:tracking-[0.4em] uppercase leading-none mb-0.5 transition-colors duration-500 ${isDark ? 'text-white/20' : 'text-slate-400'}`}>Synchronous Operations</span>
                                    <span className={`text-xs sm:text-sm md:text-base font-bold tracking-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}>Explore {phase.title.split(' ')[0]} Framework</span>
                                </div>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Final CTA Section */}
            <section className={`w-full py-16 md:py-24 px-6 relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-[#111]'}`}>
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
                    style={{ backgroundImage: `radial-gradient(#FFF 1px, transparent 1px)`, backgroundSize: '64px 64px' }} />

                <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 rounded-full bg-[#F05E23] border-4 border-white/10 flex items-center justify-center text-white mb-8 shadow-xl"
                    >
                        <Zap className="w-8 h-8 fill-white" />
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter leading-[0.95] mb-6">
                        Ready to grow your <br /> <span className="text-[#F05E23]">Business</span> with us.
                    </h2>

                    <Link
                        href="/contact"
                        className="group relative px-8 py-4 rounded-2xl bg-white text-[#111] font-black uppercase text-[0.75rem] tracking-[0.3em] overflow-hidden hover:scale-105 active:scale-95 transition-all duration-500"
                    >
                        <span className="relative z-10 group-hover:text-white transition-colors duration-500">Start Growing Today</span>
                        <div className="absolute inset-0 bg-[#F05E23] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
