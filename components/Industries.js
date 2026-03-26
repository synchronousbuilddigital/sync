"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Rocket, Leaf, Package, Cpu, Store } from "lucide-react";

const industries = [
    { name: "E-commerce", icon: <ShoppingBag className="w-6 h-6" /> },
    { name: "Startups", icon: <Rocket className="w-6 h-6" /> },
    { name: "Sustainable brands", icon: <Leaf className="w-6 h-6" /> },
    { name: "Packaging businesses", icon: <Package className="w-6 h-6" /> },
    { name: "Technology companies", icon: <Cpu className="w-6 h-6" /> },
    { name: "Retail brands", icon: <Store className="w-6 h-6" /> }
];

export default function Industries() {
    return (
        <section className="w-full py-40 bg-slate-950 overflow-hidden relative">
            {/* Architectural Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center mb-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full mb-8"
                    >
                        <span className="text-[0.6rem] font-black uppercase tracking-[0.4em] text-blue-500">Versatility</span>
                    </motion.div>
                    
                    <h2 className="text-[3.5rem] md:text-[5.5rem] font-bold tracking-tighter text-white leading-none">
                        Industries We <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Transform</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {industries.map((industry, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="group relative p-10 rounded-[3rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-blue-500/40 transition-all duration-700 flex flex-col items-center text-center overflow-hidden"
                        >
                            {/* Hover Glow */}
                            <div className="absolute -inset-10 bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="relative z-10">
                                <div className="w-20 h-20 rounded-2xl bg-white/[0.03] flex items-center justify-center text-blue-500 mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 shadow-2xl border border-white/5">
                                    {industry.icon}
                                </div>
                                <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-[0.2em]">{industry.name}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
