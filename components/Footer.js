"use client";

import Link from "next/link";
import { Mail, Linkedin, Twitter, Instagram, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";

function CleanInput({ placeholder }) {
    const [value, setValue] = useState("");

    return (
        <form className="relative w-full" onSubmit={(e) => e.preventDefault()}>
            <input
                type="email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 text-[0.95rem] font-medium text-[#111] caret-[#F05E23] focus:outline-none focus:border-[#F05E23] focus:ring-4 focus:ring-[#F05E23]/5 transition-all focus:bg-white pr-36 lg:pr-40 placeholder:text-slate-400"
                placeholder={placeholder}
            />
            <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-8 bg-[#111] text-white rounded-xl transition-all duration-300 flex items-center justify-center font-black text-[0.65rem] uppercase tracking-[0.2em] group hover:bg-[#F05E23] active:scale-95"
            >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
            </button>
        </form>
    );
}

export default function Footer() {
    return (
        <footer className="relative py-24 md:py-32 mt-auto z-10 w-full border-t border-slate-100 overflow-hidden bg-[#FAFAF8]">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
                
                {/* Newsletter Section */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pb-24 mb-24 border-b border-slate-200/50">
                    <div className="max-w-xl text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 border border-orange-100 rounded-full mb-6">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#F05E23]" />
                            <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#F05E23]">Synchronized Feed</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-[#111] tracking-tight mb-3">Join our growth newsletter</h3>
                        <p className="text-[1.1rem] text-slate-500 font-medium leading-relaxed">High-performance insights delivered weekly to your inbox. No spam, just pure strategy.</p>
                    </div>
                    <div className="w-full lg:max-w-lg">
                        <CleanInput placeholder="Enter your work email" />
                        <p className="text-[0.65rem] text-slate-400 font-bold uppercase tracking-[0.3em] mt-6 ml-4">
                            Stay ahead with deep technical digital insights.
                        </p>
                    </div>
                </div>

                {/* Main Link Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 mb-32">
                    {/* Brand Meta Column */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1 border-b lg:border-none pb-12 lg:pb-0">
                        <Link href="/" className="flex items-center gap-3 mb-10 group">
                            <img src="/logo.png" alt="Sync" className="h-10 w-auto opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="flex flex-col">
                                <span className="text-[0.8rem] font-black uppercase tracking-[0.3em] text-[#111]">Synchronous.</span>
                                <span className="text-[0.55rem] font-bold uppercase tracking-[0.3em] text-[#F05E23] -mt-1">Build Digital</span>
                            </div>
                        </Link>
                        <p className="text-[0.95rem] leading-relaxed text-slate-500 font-medium max-w-[280px]">
                            Architecting sustainable, high-velocity digital ecosystems for high-growth elite brands.
                        </p>
                    </div>

                    {/* Navigation Columns */}
                    {[
                        {
                            title: "Organization",
                            links: [
                                { name: "Our Work", href: "/work" },
                                { name: "Our Process", href: "/process" },
                                { name: "About Us", href: "/about" },
                                { name: "Contact", href: "/contact" }
                            ]
                        },
                        {
                            title: "Resources",
                            links: [
                                { name: "Insights", href: "/insights" },
                                { name: "Case Studies", href: "/work" },
                                { name: "Security Protocols", href: "/security" },
                                { name: "Privacy Policy", href: "/privacy" }
                            ]
                        }
                    ].map((col, i) => (
                        <div key={i} className="flex flex-col">
                            <h4 className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-[#111] mb-10 opacity-40">{col.title}</h4>
                            <ul className="flex flex-col gap-5">
                                {col.links.map((link, j) => (
                                    <li key={j}>
                                        <Link href={link.href} className="text-[0.85rem] font-bold text-slate-500 hover:text-[#F05E23] transition-all duration-300 hover:translate-x-1 inline-block uppercase tracking-widest leading-none">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Footer Bottom Bar */}
                <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-slate-400">
                            &copy; 2026 Synchronous Build Digital. All rights reserved.
                        </p>
                        <div className="flex gap-10">
                            <Link href="/privacy" className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-[#F05E23] transition-colors">Privacy</Link>
                            <Link href="/terms" className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-[#F05E23] transition-colors">Terms</Link>
                        </div>
                    </div>

                    {/* Socials Matrix */}
                    <div className="flex items-center gap-5">
                        {[
                            { icon: Linkedin, href: "#" },
                            { icon: Twitter, href: "#" },
                            { icon: Instagram, href: "#" },
                            { icon: Mail, href: "mailto:biz@synchronousbuilddigital.com" }
                        ].map((social, i) => (
                            <a key={i} href={social.href} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#F05E23] hover:border-[#F05E23] transition-all duration-500 shadow-sm group">
                                <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Accent Gradient Line */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#F05E23]/30 to-transparent"></div>
        </footer>
    );
}
