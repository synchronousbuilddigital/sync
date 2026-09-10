"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Target, 
  ShieldAlert, 
  Zap, 
  ArrowUpRight, 
  CheckCircle2, 
  RefreshCw,
  PieChart,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Rocket,
  Shield,
  Sliders,
  DollarSign,
  BarChart3,
  Award,
  Globe,
  ShoppingBag,
  Boxes,
  Truck,
  Headphones,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "../../../components/ThemeContext";
import { useChat } from "../../../components/ChatContext";

const growthMetrics = [
  { label: "Average Sales Growth", value: "+140%", desc: "Within first 90 days of management", badge: "Revenue Velocity" },
  { label: "Target ACOS Reduction", value: "-28%", desc: "Eliminating ad waste & non-performing terms", badge: "ROAS Efficiency" },
  { label: "Active SKU Management", value: "2,500+", desc: "Maintained with precision pricing", badge: "Catalog Scale" },
  { label: "Account Health Rating", value: "100%", desc: "Zero policy violation record", badge: "Buy-Box Shield" },
];

const accountServices = [
  {
    title: "PORTAL MANAGEMENT",
    image: "/account-services/portal-management.png",
    desc: "We deal with your online entry and offers start to finish arrangements like item posting, portrayal, advertisements, online advancements, stock administration, under eCommerce account management."
  },
  {
    title: "ORDER MANAGEMENT",
    image: "/account-services/order-management.png",
    desc: "We effectively oversee and track your deals and requests by our eCommerce account specialists. We keep a history of the total cycle from when a client submits a request to fulfillment."
  },
  {
    title: "INVENTORY MANAGEMENT",
    image: "/account-services/inventory-management.png",
    desc: "We specialize in E-Commerce stock administration. We efficiently administer the progression of products from makers to stockrooms and to retail locations."
  },
  {
    title: "SHIPPING & LOGISTICS",
    image: "/account-services/shipping-logistics.png",
    desc: "Automated courier partner assignment, Easy Ship/Self Ship SLA monitoring, warehouse storage optimization, and FBA/FBF inbound shipment management."
  },
  {
    title: "TICKET OPERATION",
    image: "/account-services/ticket-operation.png",
    desc: "Fast resolution of seller support tickets, listings suppression unlock, brand gating disputes, and direct policy compliance handling with platform leads."
  },
  {
    title: "RETURN MANAGEMENT",
    image: "/account-services/return-management.png",
    desc: "Comprehensive return reconciliation, customer defect audits, claim filings for damaged/lost inventory, and proactive customer feedback protection."
  }
];

const growthRoadmap = [
  { 
    month: "Month 1", 
    phase: "Audit & Restructure", 
    text: "Deep audit of ad spend, negative keyword harvesting, listing indexing fixes, and securing Buy Box integrity.",
    tag: "Foundation"
  },
  { 
    month: "Month 2", 
    phase: "PPC & Catalog Expansion", 
    text: "Scaling high-intent keyword bids, launching Sponsored Brand/Video campaigns, and refining A+ Content conversions.",
    tag: "Ad Scaling"
  },
  { 
    month: "Month 3", 
    phase: "Market Share Domination", 
    text: "Aggressive organic rank push for top 10 head terms, inventory automation, and multi-channel expansion.",
    tag: "Rank Push"
  },
  { 
    month: "Month 4+", 
    phase: "Profit & Velocity Lock", 
    text: "Maximizing net margins, TACOS stabilization, launch of new product variants, and international marketplace scaling.",
    tag: "Margin Max"
  },
];

const supportedChannels = [
  { name: "Amazon India & Global", type: "Seller & Vendor Central", color: "#FF9900" },
  { name: "Flipkart & Shopsy", type: "Tier-1 Gold Seller Setup", color: "#2874F0" },
  { name: "Meesho Marketplace", type: "High-Volume Supplier", color: "#F43397" },
  { name: "Myntra & Nykaa", type: "Fashion & Beauty Portal", color: "#FF3E6C" },
  { name: "Quick Commerce", type: "Blinkit, Zepto & Instamart", color: "#10B981" },
];

const faqs = [
  {
    q: "How does Key Account Management lower my ACOS and increase profit?",
    a: "We audit your advertising campaigns to harvest high-converting keywords, eliminate wasted spend on irrevelant search terms, optimize bids hourly, and drive organic rankings so your Total ACOS (TACOS) drops while overall revenue grows."
  },
  {
    q: "Will I have a dedicated Account Manager?",
    a: "Yes. Every account is assigned a Senior Marketplace Growth Lead who coordinates listing optimization, PPC strategy, inventory forecasting, and delivers weekly executive performance briefs."
  },
  {
    q: "How do you protect our brand listings from unauthorized sellers or hijackers?",
    a: "We deploy 24/7 automated monitoring tools that detect buy-box loss, unauthorized sellers, or rogue price suppressions instantly. We issue cease & desist notices and file Brand Registry IP infringement cases directly with marketplace legal teams."
  },
  {
    q: "What marketplaces do you manage?",
    a: "We manage Amazon (India, US, UAE, EU), Flipkart, Meesho, Myntra, Nykaa, and Quick-Commerce platforms like Blinkit, Zepto, and Instamart."
  }
];

export default function KeyAccountManagementPage() {
  const { isDark } = useTheme();
  const { sendMessage } = useChat();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeService, setActiveService] = useState(0);
  const [activeSprintStep, setActiveSprintStep] = useState(0);

  // Auto-loop for Services Carousel on Mobile
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveService((prev) => (prev + 1) % accountServices.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auto-loop for Growth Sprint Carousel on Mobile
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSprintStep((prev) => (prev + 1) % growthRoadmap.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const nextService = () => {
    setActiveService((prev) => (prev + 1) % accountServices.length);
  };

  const prevService = () => {
    setActiveService((prev) => (prev - 1 + accountServices.length) % accountServices.length);
  };

  const nextSprintStep = () => {
    setActiveSprintStep((prev) => (prev + 1) % growthRoadmap.length);
  };

  const prevSprintStep = () => {
    setActiveSprintStep((prev) => (prev - 1 + growthRoadmap.length) % growthRoadmap.length);
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <main className={`min-h-screen pt-4 sm:pt-20 pb-6 sm:pb-10 px-3 sm:px-6 overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-[#FDFDFD] text-[#111]'}`}>
      {/* Radial Background Glow */}
      <div 
        className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.03]'}`}
        style={{ backgroundImage: `radial-gradient(${isDark ? '#FFF' : '#000'} 1.2px, transparent 1.2px)`, backgroundSize: '48px 48px' }} 
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-6 sm:space-y-16">
        
        {/* Hero Section */}
        <section className="flex flex-col gap-4 sm:gap-8 pt-2 sm:pt-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`inline-flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 sm:px-5 sm:py-2.5 border rounded-full w-fit shadow-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}
          >
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F05E23]" />
            <span className="text-[0.6rem] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#F05E23]">Enterprise Revenue Scaling</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-ping" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-end">
            <div className="lg:col-span-8 flex flex-col gap-3 sm:gap-6">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl sm:text-6xl md:text-7xl font-black tracking-tight sm:tracking-tighter leading-[1.02] sm:leading-[0.95] uppercase"
              >
                Key Account <br />
                <span className="text-[#F05E23]">Management</span> & Growth.
              </motion.h1>
              <p className={`text-xs sm:text-2xl font-light leading-relaxed max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Dedicated account strategists driving product velocity, high-ROAS ad campaigns, inventory optimization, and full-funnel marketplace operations.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-4">
              <a
                href="https://wa.me/919161391566?text=Hi!%20I'd%20like%20a%20free%20marketplace%20account%20audit%20and%20growth%20proposal."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 sm:py-5 px-5 sm:px-8 rounded-xl sm:rounded-2xl bg-[#F05E23] text-white font-bold uppercase tracking-widest text-[0.7rem] sm:text-xs flex items-center justify-between hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F05E23]/25 group"
              >
                <span>Request Free Account Audit</span>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <button
                onClick={() => sendMessage("How does your Key Account Management service lower my Amazon advertising ACOS?")}
                className={`w-full py-3.5 sm:py-5 px-5 sm:px-8 rounded-xl sm:rounded-2xl border font-bold uppercase tracking-widest text-[0.7rem] sm:text-xs flex items-center justify-between transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
              >
                <span>Ask AI Strategist</span>
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F05E23]" />
              </button>
            </div>
          </div>
        </section>

        {/* Growth Metrics Bar - Structured 2x2 on Mobile */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {growthMetrics.map((m, idx) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl border flex flex-col justify-between gap-3 sm:gap-6 transition-all hover:scale-[1.02] ${isDark ? 'bg-white/5 border-white/10 hover:border-[#F05E23]/30' : 'bg-white border-slate-100 shadow-sm hover:border-[#F05E23]/30'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-5xl font-black text-[#F05E23] tracking-tight">{m.value}</span>
                <span className="text-[0.55rem] sm:text-[0.6rem] font-bold uppercase tracking-wider sm:tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                  {m.badge}
                </span>
              </div>
              <div>
                <h3 className="text-[0.65rem] sm:text-sm font-black uppercase tracking-wider leading-tight">{m.label}</h3>
                <p className={`text-[0.6rem] sm:text-xs mt-0.5 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Account Management Services Grid (6 Cards Section) */}
        <section className="space-y-3 sm:space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Operational Matrix</span>
            <h2 className="text-xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              TPF ACCOUNT MANAGEMENT <span className="text-[#F05E23]">SERVICES</span>
            </h2>
          </div>

          {/* Desktop View (3-column grid) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {accountServices.map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className={`p-6 sm:p-8 rounded-3xl border-2 flex flex-col items-center text-center justify-between gap-6 transition-all hover:scale-[1.02] shadow-md hover:border-[#F05E23] group ${
                  isDark ? 'bg-white/5 border-white/15' : 'bg-white border-slate-300'
                }`}
              >
                <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 p-2">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-3 flex-grow flex flex-col justify-start">
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Single Widget Circular Loop Carousel */}
          <div className="block md:hidden relative">
            <div className="relative overflow-hidden rounded-xl border-2">
              <AnimatePresence mode="wait">
                {(() => {
                  const service = accountServices[activeService];
                  return (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`p-3.5 flex flex-col items-center text-center gap-3 min-h-[260px] ${
                        isDark ? 'bg-white/5 border-white/15' : 'bg-white border-slate-300 shadow-md'
                      }`}
                    >
                      <div className="w-full aspect-[16/9] relative rounded-lg overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">
                          {service.title}
                        </h3>
                        <p className={`text-[0.65rem] leading-normal ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {service.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Mobile Carousel Controls & Circular Loop Indicators */}
            <div className="flex items-center justify-between mt-2.5 px-1">
              <button
                onClick={prevService}
                aria-label="Previous Service"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {accountServices.map((s, idx) => (
                  <button
                    key={s.title}
                    onClick={() => setActiveService(idx)}
                    aria-label={`Go to ${s.title}`}
                    className={`h-1.5 rounded-full transition-all ${activeService === idx ? 'w-5 bg-[#F05E23]' : `w-1.5 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`}`}
                  />
                ))}
              </div>

              <button
                onClick={nextService}
                aria-label="Next Service"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Growth Sprint Roadmap */}
        <section className="space-y-3 sm:space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-3">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Scaling Framework</span>
            <h2 className="text-xl sm:text-5xl font-black uppercase tracking-tight">4-Month Revenue Sprint</h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>A battle-tested milestone structure that turns stagnant catalog sales into compounding revenue engines.</p>
          </div>

          {/* Desktop View (4-column grid) */}
          <div className="hidden md:grid md:grid-cols-4 gap-6">
            {growthRoadmap.map((step, idx) => (
              <motion.div 
                key={step.month}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-8 rounded-3xl border flex flex-col justify-between gap-8 relative overflow-hidden group hover:border-[#F05E23]/40 transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#F05E23] tracking-tighter">{step.month}</span>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                    {step.tag}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold uppercase tracking-wide">{step.phase}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.text}</p>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[0.65rem] font-extrabold uppercase tracking-widest text-[#F05E23]">Sprint Phase</span>
                  <Rocket className="w-4 h-4 text-[#F05E23] opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Single Widget Circular Loop Carousel */}
          <div className="block md:hidden relative">
            <div className="relative overflow-hidden rounded-xl border">
              <AnimatePresence mode="wait">
                {(() => {
                  const step = growthRoadmap[activeSprintStep];
                  return (
                    <motion.div
                      key={step.month}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`p-4 flex flex-col justify-between gap-3 min-h-[170px] relative overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-black text-[#F05E23] tracking-tighter">{step.month}</span>
                        <span className="text-[0.6rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                          {step.tag}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xs font-bold uppercase tracking-wide leading-tight">{step.phase}</h3>
                        <p className="text-[0.65rem] text-slate-400 leading-normal">{step.text}</p>
                      </div>

                      <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                        <span className="text-[0.6rem] font-extrabold uppercase tracking-widest text-[#F05E23]">Sprint Phase</span>
                        <Rocket className="w-3.5 h-3.5 text-[#F05E23]" />
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Mobile Carousel Controls & Indicators */}
            <div className="flex items-center justify-between mt-2.5 px-1">
              <button
                onClick={prevSprintStep}
                aria-label="Previous Month"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {growthRoadmap.map((s, idx) => (
                  <button
                    key={s.month}
                    onClick={() => setActiveSprintStep(idx)}
                    aria-label={`Go to ${s.month}`}
                    className={`h-1.5 rounded-full transition-all ${activeSprintStep === idx ? 'w-5 bg-[#F05E23]' : `w-1.5 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSprintStep}
                aria-label="Next Month"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Supported Channels Coverage */}
        <section className="space-y-3 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 sm:gap-4">
            <div>
              <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Marketplace Coverage</span>
              <h2 className="text-xl sm:text-5xl font-black uppercase tracking-tight mt-0.5 sm:mt-2">Omnichannel Management</h2>
            </div>
            <span className={`text-[0.55rem] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-1 sm:px-4 sm:py-2 rounded-full border w-fit ${isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
              🚀 Full Multi-Channel Sync
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {supportedChannels.map((c) => (
              <div 
                key={c.name}
                className={`p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border flex flex-col justify-between gap-2 sm:gap-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}
              >
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: c.color }} />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-tight">{c.name}</h3>
                  <p className={`text-[0.6rem] sm:text-[0.65rem] mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{c.type}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs Section */}
        <section className="space-y-4 sm:space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-1.5 sm:space-y-3">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Got Questions?</span>
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight">Key Account FAQs</h2>
          </div>

          <div className="space-y-2.5 sm:space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={faq.q}
                className={`rounded-xl sm:rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-3.5 sm:p-6 text-left flex items-center justify-between gap-3 sm:gap-4 font-bold text-xs sm:text-base uppercase tracking-wide"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-[#F05E23] shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-3.5 pb-3.5 sm:px-6 sm:pb-6 text-xs sm:text-sm leading-relaxed border-t border-black/5 dark:border-white/5 pt-2.5 sm:pt-4 text-slate-400"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className={`p-6 sm:p-16 rounded-2xl sm:rounded-[3rem] border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 ${isDark ? 'bg-gradient-to-r from-[#F05E23]/20 to-black border-white/10' : 'bg-gradient-to-r from-[#F05E23]/10 to-slate-100 border-slate-200'}`}>
          <div className="space-y-2 sm:space-y-4 text-center md:text-left max-w-xl">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Accelerate Marketplace Sales</span>
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight">Scale Your Marketplace Revenue Today</h2>
            <p className={`text-xs sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Get a dedicated account manager, audit report, and customized ad scaling plan.</p>
          </div>
          <a
            href="https://wa.me/919161391566?text=I'm%20interested%20in%20Key%20Account%20Management%20for%20my%20brand."
            target="_blank"
            rel="noopener noreferrer"
            className="py-4 px-6 sm:py-6 sm:px-10 rounded-xl sm:rounded-2xl bg-[#F05E23] text-white font-black uppercase tracking-widest text-[0.7rem] sm:text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#F05E23]/30 shrink-0 text-center"
          >
            Connect With Account Director
          </a>
        </section>

      </div>
    </main>
  );
}
