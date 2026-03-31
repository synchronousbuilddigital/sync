"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Rocket, Leaf, Package, Cpu, Store } from "lucide-react";
import { useTheme } from './ThemeContext';

const industries = [
    { name: "E-commerce", icon: <ShoppingBag className="w-6 h-6" /> },
    { name: "Startups", icon: <Rocket className="w-6 h-6" /> },
    { name: "Sustainable brands", icon: <Leaf className="w-6 h-6" /> },
    { name: "Packaging businesses", icon: <Package className="w-6 h-6" /> },
    { name: "Technology companies", icon: <Cpu className="w-6 h-6" /> },
    { name: "Retail brands", icon: <Store className="w-6 h-6" /> }
];

export default function Industries() {
    const { isDark } = useTheme();

    return (
        <section className={`w-full py-40 overflow-hidden relative transition-colors duration-700 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
            {/* Architectural Background */}
            <div className={`absolute inset-0 bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] transition-opacity duration-700`}
                style={{ backgroundImage: `linear-gradient(to right, ${isDark ? '#fff' : '#000'}05 1px, transparent 1px), linear-gradient(to bottom, ${isDark ? '#fff' : '#000'}05 1px, transparent 1px)` }}
            ></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center mb-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full mb-8 transition-colors duration-500 ${isDark ? 'bg-blue-600/10 border-blue-600/20' : 'bg-blue-600/5 border-blue-600/10'}`}
                    >
                        <span className="text-[0.6rem] font-black uppercase tracking-[0.4em] text-blue-500">Versatility</span>
                    </motion.div>
                    
                    <h2 className={`text-[3.5rem] md:text-[5.5rem] font-bold tracking-tighter leading-none transition-colors duration-700 ${isDark ? 'text-white' : 'text-[#111]'}`}>
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
                            className={`group relative p-10 rounded-[3rem] border transition-all duration-700 flex flex-col items-center text-center overflow-hidden h-full ${isDark ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-blue-500/40' : 'bg-[#F9F9F9] border-black/[0.03] hover:bg-white hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/5'}`}
                        >
                            {/* Hover Glow */}
                            <div className="absolute -inset-10 bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-blue-500 mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 shadow-2xl border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-black/5'}`}>
                                    {industry.icon}
                                </div>
                                <h3 className={`text-lg font-black transition-colors uppercase tracking-[0.2em] group-hover:text-blue-400 ${isDark ? 'text-white' : 'text-[#111]'}`}>{industry.name}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

