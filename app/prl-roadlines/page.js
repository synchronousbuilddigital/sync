"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
    Truck, 
    ShieldCheck, 
    MapPin, 
    TrendingUp, 
    Clock, 
    ArrowRight, 
    ChevronRight, 
    Plus, 
    Minus, 
    Car, 
    Home, 
    Search,
    MessageSquare,
    Headphones,
    Mail,
    Phone,
    CornerDownRight,
    Zap,
    CheckCircle2,
    Calendar,
    Globe,
    Lock
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "../../components/ThemeContext";

const DEEP_NAVY = "#0A1628";
const HARVEST_GOLD = "#E3B15A";
const INDUSTRIAL_GRAY = "#1E293B";

export default function PRLRoadlinesPage() {
    const { isDark } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [quoteCategory, setQuoteCategory] = useState("Vehicle");
    const [distance, setDistance] = useState(500);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const stats = [
        { label: "Fleet Capacity", value: "5,000+", subtext: "Inter-state carrier network", icon: Truck },
        { label: "Cities Linked", value: "500+", subtext: "Pan-India operational nodes", icon: Globe },
        { label: "Service Index", value: "4.9/5", subtext: "Verified customer satisfaction", icon: CheckCircle2 },
        { label: "Response Time", value: "<15m", subtext: "Average quote generation", icon: Zap }
    ];

    const expertise = [
        {
            id: "01",
            title: "Car Carrier Service",
            subtitle: "Luxury Vehicle Logistics",
            desc: "We provide specialized enclosed carriers for luxury, sports, and vintage automobile relocation. Our hydraulic tail-lifts and soft-tie systems ensure your prized possession travels in a controlled, damage-free environment from pickup to final delivery.",
            features: ["Hydraulic Enclosed Carriers", "Soft-Tie Security System", "Luxury SUV & Sedan Experts", "Full Transit Insurance Coverage"]
        },
        {
            id: "02",
            title: "Household Shifting",
            subtitle: "Premium Residential Relocation",
            desc: "End-to-end relocation services for high-value residential assets. Our team employs systematic multi-layer packing and heavy-duty logistics to ensure safe transit of your legacy household items across the nation.",
            features: ["Multi-Layer Defensive Packing", "Anti-Static Wrapping", "Fragile Asset Specialists", "Inventory Tracking System"]
        }
    ];

    const pipeline = [
        { phase: "01", title: "Secure Booking Protocols", label: "PHASE 01", sub: "Verified & Insured", desc: "Easy and verified booking process with complete transparency. Submit your car details, pickup & drop location, and get started within minutes.", points: ["Verified transporter network", "Fully insured shipments", "Hassle-free documentation"] },
        { phase: "02", title: "Instant Pricing Protocols", label: "PHASE 02", sub: "Instant Quotes", desc: "Get real-time price estimates and compare the best transport options instantly with no hidden charges.", points: ["Instant quote generation", "Competitive pricing", "No hidden fees"] },
        { phase: "03", title: "Smart Transport Protocols", label: "PHASE 03", sub: "Optimized Routing", desc: "Advanced logistics planning ensures safe handling and optimized routes for faster and secure delivery.", points: ["Route optimization", "Real-time tracking", "Safe loading & unloading"] },
        { phase: "04", title: "Nationwide Protocols", label: "PHASE 04", sub: "Pan-India Delivery", desc: "Door-to-door car transport across multiple cities with reliable support throughout your journey.", points: ["Pan-India coverage", "On-time delivery", "24/7 customer support"] }
    ];

    const gallery = [
        { title: "Phogat Roadlines Car Transport", location: "Mumbai Protocol", status: "DELIVERED", img: "/website ss/boxfox.png" },
        { title: "Live Loading Operations", location: "Delhi Protocol", status: "DELIVERED", img: "/website ss/RYM.png" },
        { title: "Highway Express Transit", location: "Bangalore Protocol", status: "DELIVERED", img: "/website ss/vega.png" },
        { title: "Premium Sedan Delivery", location: "Pune Protocol", status: "DELIVERED", img: "/website ss/bworth.png" }
    ];

    return (
        <main className={`min-h-screen selection:bg-[#E3B15A]/30 overflow-x-hidden transition-colors duration-700 ${isDark ? 'bg-[#050B14]' : 'bg-[#F8FAFC]'}`}>
            {/* Minimalist Tech Grid */}
            <div className={`fixed inset-0 z-0 pointer-events-none ${isDark ? 'opacity-[0.05]' : 'opacity-[0.03]'}`}
                style={{ 
                    backgroundImage: `linear-gradient(${isDark ? '#E3B15A' : '#0A1628'} 0.5px, transparent 0.5px), linear-gradient(90deg, ${isDark ? '#E3B15A' : '#0A1628'} 0.5px, transparent 0.5px)`,
                    backgroundSize: '40px 40px' 
                }}></div>

            {/* Navigation Registry */}
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${scrolled ? 'bg-[#0A1628]/90 backdrop-blur-xl py-4 border-white/5' : 'bg-transparent py-8 border-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#E3B15A] rounded-lg flex items-center justify-center font-black text-[#0A1628] text-xl">PRL</div>
                        <div className="flex flex-col -gap-1">
                            <span className="text-xl font-black text-white tracking-widest leading-none">ROADLINES</span>
                            <span className="text-[0.6rem] font-bold text-[#E3B15A] tracking-[0.4em] uppercase opacity-80">Heavy Logistics</span>
                        </div>
                    </div>
                    
                    <div className="hidden lg:flex items-center gap-12">
                        {['Services', 'Process', 'Gallery', 'Pricing', 'About'].map((item) => (
                            <Link key={item} href={`#${item.toLowerCase()}`} className="text-[0.7rem] font-bold text-white/60 hover:text-[#E3B15A] uppercase tracking-[0.3em] transition-colors">{item}</Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-[0.6rem] font-black text-[#E3B15A] uppercase tracking-widest">Protocol Support</span>
                            <span className="text-sm font-bold text-white">+91 80533 63400</span>
                        </div>
                        <button className="px-6 py-3 bg-[#E3B15A] text-[#0A1628] font-black text-[0.7rem] uppercase tracking-widest rounded-md hover:bg-white transition-colors">Get Quote</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section - The Ledger Entry */}
            <header className="relative w-full pt-44 pb-24 md:pt-60 md:pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#E3B15A]/10 border border-[#E3B15A]/20 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-[#E3B15A] animate-pulse"></span>
                            <span className="text-[0.65rem] font-black text-[#E3B15A] tracking-[0.45em] uppercase">Enterprise Logistics Layer</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">
                            Car & <br /> <span className="text-[#E3B15A]">Household</span> <br /> Transport.
                        </h1>
                        <p className="text-lg text-white/40 font-medium leading-relaxed max-w-lg border-l-2 border-[#E3B15A]/30 pl-8">
                            High-velocity relocation protocols engineered for precision and sovereign security across the Pan-India logistics landscape.
                        </p>
                    </motion.div>

                    {/* Quote Form - Glassmorphic Ledger */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="bg-[#0D1B2D]/80 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 shadow-2xl relative"
                    >
                        <div className="mb-8 space-y-1">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Get Instant Quote</h3>
                            <p className="text-[0.65rem] font-bold text-[#E3B15A] uppercase tracking-[0.2em] opacity-60">Verified matching protocol</p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setQuoteCategory("Vehicle")}
                                    className={`py-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${quoteCategory === "Vehicle" ? 'bg-[#E3B15A] border-[#E3B15A] text-[#0A1628]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                                >
                                    <Car className="w-6 h-6" />
                                    <span className="text-[0.65rem] font-black uppercase tracking-widest">Vehicle</span>
                                </button>
                                <button 
                                    onClick={() => setQuoteCategory("Household")}
                                    className={`py-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${quoteCategory === "Household" ? 'bg-[#E3B15A] border-[#E3B15A] text-[#0A1628]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                                >
                                    <Home className="w-6 h-6" />
                                    <span className="text-[0.65rem] font-black uppercase tracking-widest">Household</span>
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[0.6rem] font-bold text-white/30 uppercase tracking-widest pl-2">Pickup City *</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#E3B15A] transition-colors" placeholder="Source Node" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[0.6rem] font-bold text-white/30 uppercase tracking-widest pl-2">Drop City *</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#E3B15A] transition-colors" placeholder="Destination Node" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[0.6rem] font-bold text-white/30 uppercase tracking-widest pl-2">Full Name *</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#E3B15A] transition-colors" placeholder="Asset Overseer" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[0.6rem] font-bold text-white/30 uppercase tracking-widest pl-2">Phone Number *</label>
                                <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#E3B15A] transition-colors" placeholder="+91 Command Link" />
                            </div>

                            <button className="w-full py-5 bg-[#E3B15A] text-[#0A1628] font-black uppercase tracking-[0.3em] text-[0.75rem] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#E3B15A]/20">
                                Get Instant Quote
                            </button>

                            <div className="flex items-center justify-center gap-3 opacity-40">
                                <Lock className="w-3 h-3 text-[#E3B15A]" />
                                <span className="text-[0.5rem] font-bold text-white uppercase tracking-[0.2em]">Secure & Verified Quote Matching</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Industrial Stats Bar */}
                <div className="mt-24 border-t border-b border-white text-white/10">
                    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="space-y-2"
                            >
                                <div className="flex items-center gap-3">
                                    <stat.icon className="w-5 h-5 text-[#E3B15A]" />
                                    <span className="text-3xl font-black text-white">{stat.value}</span>
                                </div>
                                <div className="space-y-1 pl-8">
                                    <p className="text-[0.6rem] font-black text-[#E3B15A] uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-[0.6rem] font-medium text-white/30 uppercase">{stat.subtext}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-[#E3B15A]/5 rounded-full blur-[150px] -z-10 animate-pulse"></div>
            </header>

            {/* Expertise Section */}
            <section id="services" className="py-24 md:py-44 px-6 bg-[#0A1628]/40 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-24 space-y-4">
                        <div className="text-[0.7rem] font-black text-[#E3B15A] tracking-[0.5em] uppercase flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-[#E3B15A]/30"></span>
                            Our Expertise
                        </div>
                        <h2 className="text-[3.5rem] md:text-[6rem] font-black text-white tracking-tighter leading-[0.9] uppercase">
                            What We <br /> <span className="text-[#E3B15A] italic">Cater To.</span>
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-20">
                        {expertise.map((exp, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="group"
                            >
                                <div className="relative mb-12 rounded-[2rem] overflow-hidden aspect-video border border-white/5 bg-white/5">
                                    <Image src={i === 0 ? "/website ss/boxfox.png" : "/website ss/vega.png"} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-[2s] opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent"></div>
                                    <div className="absolute bottom-8 left-8">
                                        <span className="text-[0.8rem] font-black text-[#E3B15A] tracking-[0.4em] uppercase">{exp.id}</span>
                                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase mt-2">{exp.title}</h3>
                                    </div>
                                </div>
                                <div className="space-y-8 pl-4">
                                    <div className="text-[0.7rem] font-bold text-[#E3B15A] uppercase tracking-[0.3em]">{exp.subtitle}</div>
                                    <p className="text-lg text-white/40 font-medium leading-relaxed italic border-l-2 border-[#E3B15A]/20 pl-8">
                                        "{exp.desc}"
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {exp.features.map((f, fi) => (
                                            <div key={fi} className="flex items-center gap-3 group/feat">
                                                <div className="w-6 h-6 rounded-lg bg-[#E3B15A]/10 border border-[#E3B15A]/20 flex items-center justify-center transition-colors group-hover/feat:bg-[#E3B15A]">
                                                    <CheckCircle2 className="w-3 h-3 text-[#E3B15A] group-hover/feat:text-[#0A1628]" />
                                                </div>
                                                <span className="text-[0.65rem] font-black text-white/60 uppercase tracking-widest group-hover/feat:text-white transition-colors">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="flex items-center gap-3 text-[0.7rem] font-black text-[#E3B15A] tracking-[0.4em] uppercase group-hover:translate-x-3 transition-transform pt-6">
                                        Enquire Now <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section - Technical Pipeline */}
            <section id="process" className="py-24 md:py-44 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-32">
                        <div className="max-w-2xl">
                            <div className="text-[0.7rem] font-black text-[#E3B15A] tracking-[0.5em] uppercase mb-8">Process Pipelined.</div>
                            <h2 className="text-[3.5rem] md:text-[6rem] font-black text-white tracking-tighter leading-[0.9] uppercase">
                                Scoping to <br /> <span className="text-[#E3B15A] italic">Success.</span>
                            </h2>
                        </div>
                        <p className="text-xl text-white/30 font-medium leading-relaxed max-w-xs border-l-2 border-[#E3B15A] pl-10">
                            The algorithmic roadmap of how PRL Roadlines shifts your primary assets across India.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1">
                        {pipeline.map((p, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-10 bg-white/5 border border-white/5 hover:border-[#E3B15A]/20 transition-all duration-500 hover:bg-[#0A1628]"
                            >
                                <div className="text-[0.8rem] font-black text-[#E3B15A] tracking-[0.3em] uppercase mb-12 opacity-40">{p.label}</div>
                                <h4 className="text-xl font-black text-white tracking-tight uppercase mb-6 group-hover:text-[#E3B15A] transition-colors">{p.title}</h4>
                                <p className="text-sm text-white/40 font-medium leading-relaxed mb-8">{p.desc}</p>
                                <div className="space-y-3 mb-10">
                                    {p.points.map((pt, pti) => (
                                        <div key={pti} className="flex items-center gap-3 text-[0.6rem] font-bold text-white/30 uppercase tracking-widest">
                                            <CornerDownRight className="w-3 h-3 text-[#E3B15A]/50" />
                                            {pt}
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[0.6rem] font-black text-[#E3B15A]/60 uppercase tracking-widest">{p.sub}</span>
                                    <div className="text-4xl font-black text-white opacity-5 tracking-tighter">{p.phase}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery - Proof of Delivery */}
            <section id="gallery" className="py-24 md:py-44 px-6 bg-black relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center text-center mb-32 space-y-6">
                        <div className="text-[0.7rem] font-black text-[#E3B15A] tracking-[0.5em] uppercase">Proof of Delivery</div>
                        <h2 className="text-[3.5rem] md:text-[6.5rem] font-black text-white tracking-tighter leading-[0.9] uppercase">
                            Precision <br /> <span className="text-[#E3B15A]">Execution.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {gallery.map((item, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -10 }}
                                className="relative aspect-[3/4] rounded-3xl overflow-hidden group border border-white/5"
                            >
                                <Image src={item.img} alt={item.title} fill className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent opacity-80"></div>
                                
                                <div className="absolute top-6 left-6 px-4 py-2 bg-[#E3B15A] text-[#0A1628] text-[0.55rem] font-black uppercase tracking-widest rounded-full shadow-2xl">
                                    {item.status}
                                </div>

                                <div className="absolute bottom-8 left-8 right-8">
                                    <p className="text-[0.6rem] font-black text-[#E3B15A] uppercase tracking-[0.3em] mb-2">{item.location}</p>
                                    <h4 className="text-lg font-black text-white leading-tight uppercase tracking-tight">{item.title}</h4>
                                    <div className="h-0 group-hover:h-8 transition-all overflow-hidden flex items-center gap-2 mt-4 text-[0.6rem] font-bold text-white/40 uppercase tracking-widest">
                                        Verified Delivery Protocol <CheckCircle2 className="w-3 h-3 text-[#E3B15A]" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 flex justify-center">
                        <button className="px-12 py-6 border border-white/10 rounded-full text-[0.7rem] font-black text-white uppercase tracking-[0.5em] hover:bg-[#E3B15A] hover:text-[#0A1628] hover:border-[#E3B15A] transition-all">
                            View All Nodes
                        </button>
                    </div>
                </div>
            </section>

            {/* Transit Calculator - Standard Protocol */}
            <section id="pricing" className="py-24 md:py-44 px-6 relative">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="text-[0.7rem] font-black text-[#E3B15A] tracking-[0.5em] uppercase">Standard Protocol</div>
                            <h2 className="text-[3.5rem] md:text-[6rem] font-black text-white tracking-tighter leading-[0.9] uppercase">
                                Transparent <br /> <span className="text-[#E3B15A] italic">Rates.</span>
                            </h2>
                        </div>
                        <p className="text-xl text-white/30 font-medium leading-relaxed border-l-2 border-[#E3B15A]/30 pl-10">
                            Get an instant estimate for your relocation based on our primary transit protocols.
                        </p>
                        
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[0.7rem] font-black text-white/40 uppercase tracking-[0.3em]">Calculated Transit Distance</span>
                                    <span className="text-4xl font-black text-white">{distance} <span className="text-xl text-[#E3B15A]">KM</span></span>
                                </div>
                                <input 
                                    type="range" 
                                    min="100" 
                                    max="3000" 
                                    step="50" 
                                    value={distance} 
                                    onChange={(e) => setDistance(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#E3B15A]" 
                                />
                            </div>

                            <div className="p-8 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between">
                                <div>
                                    <span className="text-[0.6rem] font-bold text-white/30 uppercase tracking-[0.4em] block mb-2">Estimated Investment</span>
                                    <span className="text-4xl font-black text-white">₹{(distance * 5.5).toLocaleString()} <span className="text-lg opacity-20">—</span> ₹{(distance * 6.2).toLocaleString()}</span>
                                </div>
                                <button className="w-16 h-16 rounded-2xl bg-[#E3B15A] flex items-center justify-center text-[#0A1628] hover:scale-110 transition-transform">
                                    <ArrowRight className="w-8 h-8" />
                                </button>
                            </div>
                        </div>

                        <p className="text-[0.6rem] font-bold text-white/20 uppercase tracking-[0.2em] pt-4 flex items-center gap-3">
                            <TrendingUp className="w-3 h-3" /> Calculations based on 5.5/km standard primary transit protocols.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="bg-[#0D1B2D] border border-white/5 rounded-[3rem] p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E3B15A]/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                            
                            <div className="relative z-10 space-y-12">
                                <div className="text-[0.7rem] font-black text-[#E3B15A] tracking-[0.3em] uppercase">The PRL Roadlines Thesis</div>
                                <h3 className="text-5xl font-black text-white tracking-widest uppercase italic">India's Premier <br /> Mobility Hub.</h3>
                                <p className="text-lg text-white/40 leading-relaxed font-medium">
                                    PRL Roadlines is more than just a transport service; it's a commitment to excellence in mobility. We have redefined the paradigm of how logistics traverse the landscape of India.
                                </p>
                                <div className="pt-10 border-t border-white/5 flex gap-12">
                                    <div>
                                        <div className="text-[0.6rem] font-black text-white/20 uppercase tracking-widest mb-2">Our Standard</div>
                                        <div className="text-sm font-bold text-[#E3B15A] uppercase tracking-widest">Elite Reliability</div>
                                    </div>
                                    <div>
                                        <div className="text-[0.6rem] font-black text-white/20 uppercase tracking-widest mb-2">Network Nodes</div>
                                        <div className="text-sm font-bold text-white uppercase tracking-widest">500+ Cities</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Control - Footer */}
            <footer className="bg-[#02060D] pt-32 pb-12 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-24 pb-24 border-b border-white/5">
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <div className="text-[0.7rem] font-black text-[#E3B15A] tracking-[0.5em] uppercase">Mission Control</div>
                                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                                    Logistics <br /> <span className="text-[#E3B15A]">Command Center</span>
                                </h2>
                            </div>
                            <p className="text-lg text-white/30 font-medium max-w-sm">
                                Connect with our logistics command center for real-time asset tracking and strategic relocation advisory.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/contact" className="px-8 py-5 bg-white text-[#0A1628] font-black text-[0.7rem] uppercase tracking-widest rounded-xl hover:bg-[#E3B15A] transition-colors">Start Relocation</Link>
                                <button className="px-8 py-5 border border-white/10 text-white font-black text-[0.7rem] uppercase tracking-widest rounded-xl hover:border-[#E3B15A] transition-colors">Interface Portal</button>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <span className="text-[0.6rem] font-black text-white/20 uppercase tracking-widest">Interface Email</span>
                                    <p className="text-xl font-bold text-white group cursor-pointer hover:text-[#E3B15A] transition-colors">anil63633@gmail.com</p>
                                </div>
                                <div className="space-y-3">
                                    <span className="text-[0.6rem] font-black text-white/20 uppercase tracking-widest">Direct Comms</span>
                                    <div className="space-y-2">
                                        <p className="text-xl font-bold text-white">+91 80533 63400</p>
                                        <p className="text-xl font-bold text-white">+91 8199-853385</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <span className="text-[0.6rem] font-black text-white/20 uppercase tracking-widest">Response Time</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <p className="text-xl font-bold text-white">~15 Minutes</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <span className="text-[0.6rem] font-black text-white/20 uppercase tracking-widest">Availability</span>
                                    <p className="text-xl font-bold text-white uppercase tracking-widest">24/7 Support</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-[#E3B15A] rounded-md flex items-center justify-center font-black text-[#0A1628] text-sm">PRL</div>
                            <span className="text-[0.6rem] font-black text-white/20 uppercase tracking-[0.5em]">© 2026 PRL ROADLINES MOBILITY.</span>
                        </div>
                        <div className="flex gap-10">
                            {['Privacy', 'Terms', 'Security'].map(item => (
                                <Link key={item} href={`/${item.toLowerCase()}`} className="text-[0.6rem] font-black text-white/20 uppercase tracking-widest hover:text-[#E3B15A] transition-colors">{item}</Link>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-[0.6rem] font-black text-white/30 uppercase tracking-widest">Secure Node Online</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Quick Action - WhatsApp Protocol */}
            <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                className="fixed bottom-8 right-8 z-[100]"
            >
                <Link 
                    href="https://wa.me/918053363400" 
                    className="w-16 h-16 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-[#25D366]/40 group relative"
                >
                    <MessageSquare strokeWidth={3} className="w-8 h-8" />
                    <span className="absolute right-full mr-4 px-4 py-2 bg-[#0A1628] text-[#E3B15A] text-[0.6rem] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/5 backdrop-blur-xl">
                        WhatsApp Protocol
                    </span>
                </Link>
            </motion.div>
        </main>
    );
}
