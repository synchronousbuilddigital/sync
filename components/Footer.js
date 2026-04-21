"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Globe, Clock, ArrowUpRight, Linkedin, Twitter, Instagram, Mail } from "lucide-react";
import { useTheme } from './ThemeContext';

export default function Footer() {
    const { isDark } = useTheme();
    const pathname = usePathname();
    const currentYear = new Date().getFullYear();

    const isDashboardRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/intern');

    if (isDashboardRoute) return null;

    return (
        <footer className={`relative pt-16 pb-8 mt-auto z-10 w-full overflow-hidden border-t transition-colors duration-700 ${isDark ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-slate-100'}`}>
            {/* Background Texture */ }
            <div className={`absolute inset-0 z-0 opacity-[0.015] pointer-events-none transition-colors duration-700`} style={{ backgroundImage: `radial-gradient(${isDark ? '#FFF' : '#000'} 1.5px, transparent 1.5px)`, backgroundSize: '48px 48px' }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Top Section: Extended Brand Message */}
                {!isDashboardRoute && (
                    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 mb-12 border-b transition-colors duration-500 ${isDark ? 'border-white/5' : 'border-slate-100/80'}`}>
                        <div className="lg:col-span-12 items-center text-center flex flex-col pt-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-[#F05E23]/5 border border-[#F05E23]/10 rounded-full mb-6"
                            >
                                <ShieldCheck className="w-3.5 h-3.5 text-[#F05E23]" />
                                <span className="text-[0.55rem] font-black uppercase tracking-[0.3em] text-[#F05E23]">Synchronous Intelligence</span>
                            </motion.div>
                            <h2 className={`text-4xl md:text-6xl font-bold tracking-[-0.04em] leading-[0.95] mb-6 transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}>
                                Empowering high-growth <br /> <span className="text-[#F05E23]">elite brands.</span>
                            </h2>
                            <p className={`text-lg sm:text-xl font-medium max-w-2xl leading-relaxed transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                                Architecting sustainable, high-velocity digital ecosystems for high-growth elite brands.
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Navigation Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 lg:gap-8 mb-16">
                    {/* Brand Info */}
                    <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-2">
                        <div className="mb-8">
                            <div className="flex items-center gap-4 mb-6 group cursor-pointer inline-flex">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[15deg] shadow-xl relative overflow-hidden ${isDark ? 'bg-[#111] border border-white/10' : 'bg-[#111] text-white'}`}>
                                    <Image 
                                        src="/logo.png"
                                        alt="Synchronous Logo"
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-[1.2rem] font-black uppercase tracking-[0.35em] leading-none transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}>Synchronous</span>
                                    <span className="text-[0.6rem] font-black uppercase tracking-[0.4em] text-[#F05E23] mt-1.5">Build Digital</span>
                                </div>
                            </div>
                        </div>
                        <div className={`flex flex-col gap-4 font-black text-[0.65rem] tracking-[0.2em] uppercase transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-slate-600'}`}>
                            <div className="flex items-center gap-3">
                                <Globe className="w-4 h-4 text-[#F05E23]" />
                                <span>Global Operations / Remote First</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-[#F05E23]" />
                                <span>24/7 Digital Monitoring Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Organization Column */}
                    <div className="col-span-1 lg:col-start-4">
                        <h5 className={`text-[0.65rem] font-black uppercase tracking-[0.4em] mb-8 transition-colors duration-500 ${isDark ? 'text-white/60' : 'text-black'}`}>Organization</h5>
                        <ul className="flex flex-col gap-5">
                            {[
                                { name: "Our Work", href: "/work" },
                                { name: "Our Process", href: "/process" },
                                { name: "About Us", href: "/about" },
                                { name: "Contact", href: "/contact" }
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className={`text-[0.8rem] font-black transition-all duration-300 flex items-center gap-2 group/item overflow-hidden ${isDark ? 'text-white/40 hover:text-[#F05E23]' : 'text-slate-600 hover:text-[#F05E23]'}`}>
                                        <span className="tracking-tight hover:tracking-[0.1em] transition-all duration-300 uppercase">{link.name}</span>
                                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-y-0 group-hover/item:translate-x-0 transition-all duration-300 transform" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div className="col-span-1">
                        <h5 className={`text-[0.65rem] font-black uppercase tracking-[0.4em] mb-8 transition-colors duration-500 ${isDark ? 'text-white/60' : 'text-black'}`}>Resources</h5>
                        <ul className="flex flex-col gap-5">
                            {[
                                { name: "Case Studies", href: "/work" },
                                { name: "Security Protocols", href: "/security" },
                                { name: "Privacy Policy", href: "/privacy" }
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className={`text-[0.8rem] font-black transition-all duration-300 flex items-center gap-2 group/item overflow-hidden ${isDark ? 'text-white/40 hover:text-[#F05E23]' : 'text-slate-600 hover:text-[#F05E23]'}`}>
                                        <span className="tracking-tight hover:tracking-[0.1em] transition-all duration-300 uppercase">{link.name}</span>
                                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-y-0 group-hover/item:translate-x-0 transition-all duration-300 transform" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Socials Connection */}
                    <div className="col-span-1 sm:col-span-2 md:col-span-1 min-w-max">
                        <h5 className={`text-[0.65rem] font-black uppercase tracking-[0.4em] mb-8 transition-colors duration-500 ${isDark ? 'text-white/60' : 'text-black'}`}>Connect</h5>
                        <div className="flex flex-row items-center gap-4">
                            {[
                                { icon: Linkedin, href: "https://www.linkedin.com/in/devam-srivastava/" },
                                { icon: Instagram, href: "https://www.instagram.com/synchronous.build.digital/" },
                                { icon: Mail, href: "mailto:synchronous.build.digital@gmail.com" }
                            ].map((social, i) => (
                                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-500 shadow-sm group ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white hover:text-[#111]' : 'bg-white border-slate-200 text-slate-600 hover:text-white hover:bg-black hover:border-black'}`}>
                                    <social.icon className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Compact Bottom Bar */}
                <div className={`pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-colors duration-500 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <p className={`text-[0.65rem] font-black uppercase tracking-widest text-center md:text-left ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                        &copy; {currentYear} Synchronous Build Digital. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                        <Link href="/privacy" className={`text-[0.65rem] font-black hover:text-[#F05E23] transition-colors uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Privacy Policy</Link>
                        <Link href="/terms" className={`text-[0.65rem] font-black hover:text-[#F05E23] transition-colors uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Terms of Service</Link>
                    </div>
                </div>
            </div>

            {/* Top Accent Gradient */}
            <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r transition-all duration-700 ${isDark ? 'from-transparent via-white/10 to-transparent' : 'from-transparent via-slate-200 to-transparent'}`}></div>
        </footer>
    );
}
