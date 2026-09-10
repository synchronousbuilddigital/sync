"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  FileCheck,
  Tag,
  Boxes,
  Clock,
  Sparkles,
  Check,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Award,
  Rocket,
  Shield,
  Layers,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "../../../components/ThemeContext";
import { useChat } from "../../../components/ChatContext";

const impactStats = [
  { value: "500+", label: "Brands Onboarded", sub: "Across major marketplaces" },
  { value: "99.8%", label: "First-Pass Approval", sub: "Zero document rejection rate" },
  { value: "3-5 Days", label: "Fast-Track Launch", sub: "From audit to live store" },
  { value: "100%", label: "IP Protection", sub: "Brand Registry assistance" },
];

const marketplaces = [
  {
    name: "Amazon India",
    timeframe: "3 Days Launch",
    badge: "Primary Hub",
    logo: "/brand-logos/amazon.svg",
    bg: "#FF9900",
    highlights: ["IP Accelerator Brand Registry", "A+ Content & EBC Setup", "FBA Inventory & Easy Ship", "GTIN / Barcode Exemption"],
    fee: "Instant Verification",
  },
  {
    name: "Flipkart Seller",
    timeframe: "2 Days Launch",
    badge: "High Volume",
    logo: "/brand-logos/flipkart.svg",
    bg: "#2874F0",
    highlights: ["Flipkart Smart & FBF Readiness", "Tier-1 Express Onboarding", "Single & Variation Cataloging", "Listing Quality Index 90+"],
    fee: "Fast Approval",
  },
  {
    name: "Meesho Supplier",
    timeframe: "24 Hours Launch",
    badge: "Fast Growth",
    logo: "/brand-logos/meesho.svg",
    bg: "#F43397",
    highlights: ["0% Commission Cataloging", "Bulk Upload & Price Calibrator", "GST Invoicing Compliance", "PAN & Tax Profile Locking"],
    fee: "Zero Commission Setup",
  },
  {
    name: "Myntra Partner",
    timeframe: "5 Days Approval",
    badge: "Fashion & Beauty",
    logo: "/brand-logos/myntra.svg",
    bg: "#FF3E6C",
    highlights: ["Brand Authorization Dossier", "High-Fashion Image Audit", "Omnichannel ERP Integration", "Curated Category Approval"],
    fee: "Brand Authorization",
  },
];

const deliverables = [
  {
    title: "GST & Brand Registry",
    desc: "Complete documentation audit, trademark verification, and IP Accelerator brand registry for maximum buy-box protection.",
    icon: ShieldCheck,
    badge: "Zero Rejections",
    points: [
      "GST, PAN, & Trademark Document Audit",
      "Brand Registry & IP Accelerator Clearance",
      "Anti-Counterfeiting & Buy-Box Guard",
      "Category Approval & Brand Gate Unlock"
    ]
  },
  {
    title: "Product Cataloging & SEO",
    desc: "High-converting A+ content, keyword-rich bullet points, bulletproof listing optimization, and backend search terms.",
    icon: FileCheck,
    badge: "Conversion Engine",
    points: [
      "High-Res Gallery & Image Guideline Audit",
      "SEO Keyword-Optimized Titles & Bullets",
      "A+ Enhanced Brand Content (EBC)",
      "Backend Search Indexing & Meta Tags"
    ]
  },
  {
    title: "GTIN / FNSKU Exemption",
    desc: "Seamless barcode exemption processing, custom SKU structuring, and FBA inventory labeling readiness.",
    icon: Tag,
    badge: "No Barcode Needed",
    points: [
      "GTIN Barcode Exemption Application",
      "Custom SKU Mapping & Tax Coding",
      "FNSKU Label Generation for FBA/FBF",
      "Multi-Pack & Variation Structuring"
    ]
  },
  {
    title: "Payment & Logistics Setup",
    desc: "Bank account integration, automated shipping tier configuration (Easy Ship, Self Ship, FBA/FBF), and return management.",
    icon: Boxes,
    badge: "Fulfillment Ready",
    points: [
      "Bank Verification & Payout Automation",
      "Easy Ship / Self Ship Serviceability Test",
      "Warehouse Location & Return Address Lock",
      "Courier Tier & Shipping Fee Matrix Setup"
    ]
  },
];

const workflowSteps = [
  {
    num: "01",
    day: "Day 1",
    title: "Document Audit & Verification",
    text: "We verify GST, PAN, Bank, Brand Auth & trademark certificate.",
    badge: "Audit Pass"
  },
  {
    num: "02",
    day: "Day 2",
    title: "Account Initialization",
    text: "Creating seller profiles with tax & warehouse configurations.",
    badge: "Account Live"
  },
  {
    num: "03",
    day: "Day 3-4",
    title: "Catalog Engineering & SEO",
    text: "HD gallery, compliant listings, A+ content & GTIN exemption.",
    badge: "Catalog Ready"
  },
  {
    num: "04",
    day: "Day 5",
    title: "Go-Live & Soft Launch",
    text: "Fulfillment testing, price calibration & credentials handover.",
    badge: "Store Live"
  },
];

const comparisonData = [
  { feature: "Account Setup Speed", diy: "2 to 4 Weeks", synchronous: "3 to 5 Days" },
  { feature: "Rejection Risk", diy: "High (Document Mismatch)", synchronous: "0% (Pre-Audited Dossier)" },
  { feature: "Brand Registry & IP Guard", diy: "Self-Managed / Complex", synchronous: "Done-For-You IP Accelerator" },
  { feature: "Cataloging & SEO Quality", diy: "Generic Bullet Points", synchronous: "High-Converting A+ EBC & SEO" },
  { feature: "Post-Launch Handover", diy: "No Guidance", synchronous: "SOP Manual & Dedicated Manager" },
];

const faqs = [
  {
    q: "What documents are required to onboard as a seller on Amazon and Flipkart?",
    a: "You need a valid GST Certificate, PAN Card, active Bank Account with cancelled cheque, Email ID, Phone Number, and Brand Authorization Letter or Trademark Certificate (if selling registered brand products)."
  },
  {
    q: "Can I onboard my brand if I don't have a registered trademark yet?",
    a: "Yes! We can apply for GTIN Exemption and Brand Approval so you can sell under your brand name immediately without requiring an existing trademark."
  },
  {
    q: "How fast will my seller store go live?",
    a: "Our standard turnaround time is 3 to 5 business days from receiving your verified document dossier. Accounts on Meesho can even be activated within 24-48 hours."
  },
  {
    q: "Do you handle Amazon FBA and Flipkart FBF warehouse setup?",
    a: "Yes. We configure warehouse addresses, generate FNSKU barcode labels, create FBA inbound shipments, and ensure full compliance with marketplace fulfillment standards."
  },
  {
    q: "What happens after my store goes live?",
    a: "We perform soft-launch order testing, calibrate pricing/promotions, handover secure credentials, and provide a 30-day post-launch support buffer or seamless transition to our Key Account Management service."
  }
];

export default function SellerOnboardingPage() {
  const { isDark } = useTheme();
  const { sendMessage } = useChat();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeMarketplace, setActiveMarketplace] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMarketplace((prev) => (prev + 1) % marketplaces.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % workflowSteps.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const nextMarketplace = () => {
    setActiveMarketplace((prev) => (prev + 1) % marketplaces.length);
  };

  const prevMarketplace = () => {
    setActiveMarketplace((prev) => (prev - 1 + marketplaces.length) % marketplaces.length);
  };

  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % workflowSteps.length);
  };

  const prevStep = () => {
    setActiveStep((prev) => (prev - 1 + workflowSteps.length) % workflowSteps.length);
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <main className={`min-h-screen pt-4 sm:pt-20 pb-6 sm:pb-10 px-3 sm:px-6 overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-[#FDFDFD] text-[#111]'}`}>
      {/* Background Radial Glow */}
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
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F05E23]" />
            <span className="text-[0.6rem] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#F05E23]">E-Commerce Acceleration</span>
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
                Seller <span className="text-[#F05E23]">Onboarding</span> <br />
                & Marketplace Launch.
              </motion.h1>
              <p className={`text-xs sm:text-2xl font-light leading-relaxed max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Launch your brand across Amazon, Flipkart, Meesho, and Myntra with zero friction. We handle documentation, cataloging, brand registry, and fulfillment setup end-to-end.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-4">
              <a
                href="https://wa.me/919161391566?text=Hi!%20I%20want%20to%20onboard%20my%20brand%20on%20Amazon/Flipkart."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 sm:py-5 px-5 sm:px-8 rounded-xl sm:rounded-2xl bg-[#F05E23] text-white font-bold uppercase tracking-widest text-[0.7rem] sm:text-xs flex items-center justify-between hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F05E23]/25 group"
              >
                <span>Launch My Seller Account</span>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <button
                onClick={() => sendMessage("Tell me about your Seller Onboarding package and timeline for Amazon & Flipkart.")}
                className={`w-full py-3.5 sm:py-5 px-5 sm:px-8 rounded-xl sm:rounded-2xl border font-bold uppercase tracking-widest text-[0.7rem] sm:text-xs flex items-center justify-between transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
              >
                <span>Ask AI Assistant</span>
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F05E23]" />
              </button>
            </div>
          </div>
        </section>

        {/* High-Impact Performance Metrics Bar - Structured 2x2 Grid on Mobile */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {impactStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl border flex flex-col justify-between transition-all hover:scale-[1.02] ${isDark ? 'bg-white/5 border-white/10 hover:border-[#F05E23]/30' : 'bg-white border-slate-100 shadow-sm hover:border-[#F05E23]/30'}`}
            >
              <span className="text-2xl sm:text-5xl font-black tracking-tight text-[#F05E23]">{stat.value}</span>
              <div className="mt-2 sm:mt-4">
                <h3 className="text-[0.65rem] sm:text-sm font-black uppercase tracking-wider leading-tight">{stat.label}</h3>
                <p className={`text-[0.6rem] sm:text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Enriched Supported Platforms Grid */}
        <section className="space-y-3 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 sm:gap-4">
            <div>
              <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Supported Platforms & Ecosystems</span>
              <h2 className="text-xl sm:text-5xl font-black uppercase tracking-tight mt-0.5 sm:mt-2">Multi-Channel Dominance</h2>
            </div>
            <span className={`text-[0.55rem] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-1 sm:px-4 sm:py-2 rounded-full border w-fit ${isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
              ⚡ Done-For-You Integration
            </span>
          </div>

          {/* Desktop Grid (2x2) */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            {marketplaces.map((m, idx) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-8 rounded-3xl border-2 flex flex-col justify-between gap-6 transition-all hover:scale-[1.01] ${isDark ? 'bg-white/5 border-white/20 hover:border-[#F05E23]' : 'bg-white border-slate-300 shadow-md hover:border-[#F05E23]'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="h-12 w-32 rounded-2xl flex items-center justify-center p-2.5 border-2 shrink-0"
                      style={{ backgroundColor: `${m.bg}15`, borderColor: `${m.bg}60` }}
                    >
                      <img
                        src={m.logo}
                        alt={m.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">{m.name}</h3>
                      <span className="text-xs text-[#F05E23] font-bold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        {m.timeframe}
                      </span>
                    </div>
                  </div>
                  <span className="text-[0.65rem] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/30 shrink-0">
                    {m.badge}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-4 border-t-2 border-slate-200 dark:border-white/15">
                  {m.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#F05E23] shrink-0" />
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-slate-200 dark:border-white/15">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{m.fee}</span>
                  <a
                    href={`https://wa.me/919161391566?text=Hi!%20I%20want%20to%20onboard%20my%20store%20on%20${encodeURIComponent(m.name)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold uppercase tracking-widest text-[#F05E23] hover:underline flex items-center gap-1"
                  >
                    Start Onboarding →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Single Widget Circular Loop Carousel */}
          <div className="block md:hidden relative">
            <div className="relative overflow-hidden rounded-xl border-2">
              <AnimatePresence mode="wait">
                {(() => {
                  const m = marketplaces[activeMarketplace];
                  return (
                    <motion.div
                      key={m.name}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`p-3.5 flex flex-col justify-between gap-3 min-h-[210px] ${isDark ? 'bg-white/5 border-white/20' : 'bg-white border-slate-300 shadow-md'}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="h-8 w-16 rounded-lg flex items-center justify-center p-1 border shrink-0"
                            style={{ backgroundColor: `${m.bg}15`, borderColor: `${m.bg}60` }}
                          >
                            <img
                              src={m.logo}
                              alt={m.name}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex flex-col justify-center">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="text-xs font-black uppercase tracking-tight">{m.name}</h3>
                              <span className="text-[0.55rem] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/30 shrink-0">
                                {m.badge}
                              </span>
                            </div>
                            <span className="text-[0.6rem] text-[#F05E23] font-bold flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 shrink-0" />
                              <span>{m.timeframe}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t-2 border-slate-200 dark:border-white/15">
                        {m.highlights.map((h) => (
                          <div key={h} className="flex items-center gap-1.5 text-[0.65rem] font-semibold leading-tight">
                            <CheckCircle2 className="w-3 h-3 text-[#F05E23] shrink-0" />
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{h}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t-2 border-slate-200 dark:border-white/15">
                        <span className={`text-[0.6rem] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{m.fee}</span>
                        <a
                          href={`https://wa.me/919161391566?text=Hi!%20I%20want%20to%20onboard%20my%20store%20on%20${encodeURIComponent(m.name)}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[0.65rem] font-bold uppercase tracking-widest text-[#F05E23] hover:underline flex items-center gap-1"
                        >
                          Start Onboarding →
                        </a>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Mobile Carousel Controls & Circular Loop Indicators */}
            <div className="flex items-center justify-between mt-2.5 px-1">
              <button
                onClick={prevMarketplace}
                aria-label="Previous Platform"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {marketplaces.map((m, idx) => (
                  <button
                    key={m.name}
                    onClick={() => setActiveMarketplace(idx)}
                    aria-label={`Go to ${m.name}`}
                    className={`h-1.5 rounded-full transition-all ${activeMarketplace === idx ? 'w-5 bg-[#F05E23]' : `w-1.5 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`}`}
                  />
                ))}
              </div>

              <button
                onClick={nextMarketplace}
                aria-label="Next Platform"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Precision Setup Protocols (Deliverables) */}
        <section className="space-y-3 sm:space-y-10">
          <div>
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">What We Deliver</span>
            <h2 className="text-xl sm:text-5xl font-black uppercase tracking-tight mt-0.5 sm:mt-2">Precision Setup Protocols</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-6">
            {deliverables.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-3 sm:p-8 rounded-xl sm:rounded-3xl border flex flex-col justify-between gap-2.5 sm:gap-6 transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/[0.08]' : 'bg-white border-slate-100 shadow-sm hover:bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div className="p-2 sm:p-4 rounded-lg sm:rounded-2xl bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20 shrink-0">
                      <Icon className="w-4 h-4 sm:w-7 sm:h-7" />
                    </div>
                    <span className="text-[0.55rem] sm:text-[0.65rem] font-black uppercase tracking-widest px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-xs sm:text-xl font-bold uppercase tracking-wide">{item.title}</h3>
                    <p className={`text-[0.65rem] sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-2 sm:pt-4 border-t border-black/5 dark:border-white/5">
                    {item.points.map((p) => (
                      <div key={p} className="flex items-center gap-1.5 text-[0.65rem] sm:text-xs font-semibold leading-tight">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#F05E23] shrink-0" />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{p}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 4-Step SOP Roadmap */}
        <section className="space-y-4 sm:space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-3">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">SOP Roadmap</span>
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight">4-Step Onboarding Process</h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Streamlined execution pipeline designed to take your brand live in days.</p>
          </div>

          {/* Desktop View (4-column grid) */}
          <div className="hidden md:grid md:grid-cols-4 gap-6 relative">
            {workflowSteps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-8 rounded-3xl border flex flex-col justify-between gap-8 relative overflow-hidden group hover:border-[#F05E23]/40 transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-5xl font-black text-[#F05E23] tracking-tighter group-hover:scale-110 transition-transform">{step.num}</span>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                    {step.day}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold uppercase tracking-wide">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.text}</p>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[0.65rem] font-extrabold uppercase tracking-widest text-[#F05E23]">{step.badge}</span>
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
                  const step = workflowSteps[activeStep];
                  return (
                    <motion.div
                      key={step.num}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`p-4 flex flex-col justify-between gap-3 min-h-[170px] relative overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-4xl font-black text-[#F05E23] tracking-tighter">{step.num}</span>
                        <span className="text-[0.6rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                          {step.day}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xs font-bold uppercase tracking-wide leading-tight">{step.title}</h3>
                        <p className="text-[0.65rem] text-slate-400 leading-normal">{step.text}</p>
                      </div>

                      <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                        <span className="text-[0.6rem] font-extrabold uppercase tracking-widest text-[#F05E23]">{step.badge}</span>
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
                onClick={prevStep}
                aria-label="Previous Step"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {workflowSteps.map((s, idx) => (
                  <button
                    key={s.num}
                    onClick={() => setActiveStep(idx)}
                    aria-label={`Go to Step ${s.num}`}
                    className={`h-1.5 rounded-full transition-all ${activeStep === idx ? 'w-5 bg-[#F05E23]' : `w-1.5 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`}`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                aria-label="Next Step"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Comparison Matrix: DIY vs Synchronous Acceleration */}
        <section className="space-y-4 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-3">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Why Synchronous Onboarding?</span>
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight">DIY vs Professional Onboarding</h2>
          </div>

          <div className={`rounded-2xl sm:rounded-3xl border overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed min-w-[560px]">
                <thead>
                  <tr className={`border-b text-[0.65rem] sm:text-xs font-black uppercase tracking-widest ${isDark ? 'border-white/10 bg-white/5 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                    <th className="p-3.5 sm:p-6 w-[38%]">Execution Feature</th>
                    <th className="p-3.5 sm:p-6 text-slate-400 w-[31%]">DIY / Self-Onboarding</th>
                    <th className="p-3.5 sm:p-6 text-[#F05E23] bg-[#F05E23]/10 w-[31%]">Synchronous Acceleration</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs sm:text-sm font-medium ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                  {comparisonData.map((row) => (
                    <tr key={row.feature} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 sm:p-6 font-bold uppercase tracking-wider text-[0.7rem] sm:text-xs">{row.feature}</td>
                      <td className="p-3.5 sm:p-6 text-slate-400 text-[0.7rem] sm:text-xs">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 shrink-0" />
                          <span>{row.diy}</span>
                        </div>
                      </td>
                      <td className="p-3.5 sm:p-6 font-bold text-[#F05E23] bg-[#F05E23]/5 dark:bg-[#F05E23]/10 text-[0.7rem] sm:text-xs">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F05E23] shrink-0" />
                          <span>{row.synchronous}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="space-y-4 sm:space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-1.5 sm:space-y-3">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Got Questions?</span>
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight">Frequently Asked Questions</h2>
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
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Fast-Track Store Activation</span>
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight">Ready to Start Selling Online?</h2>
            <p className={`text-xs sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Get your store verified, cataloged, and listed in as little as 3 business days with zero rejections.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
            <a
              href="https://wa.me/919161391566?text=I'd%20like%20to%20schedule%20a%20Seller%20Onboarding%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-6 sm:py-6 sm:px-10 rounded-xl sm:rounded-2xl bg-[#F05E23] text-white font-black uppercase tracking-widest text-[0.7rem] sm:text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#F05E23]/30 text-center"
            >
              Schedule Consultation
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}

