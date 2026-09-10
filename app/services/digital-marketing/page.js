"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Megaphone, 
  Target, 
  Search, 
  Zap, 
  ArrowUpRight, 
  Share2, 
  MousePointerClick,
  Sparkles,
  CheckCircle2,
  Video,
  Activity,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "../../../components/ThemeContext";
import { useChat } from "../../../components/ChatContext";

// Interactive Strategy Tabs Data
const strategyTabs = [
  {
    id: "paid-ads",
    label: "Paid Acquisition",
    sub: "Meta & Google Ads",
    icon: Target,
    title: "Precision Paid Ad Engineering",
    tagline: "High-ROAS Meta (IG/FB) & Google PMax Campaigns",
    metrics: { roas: "4.2x Avg ROAS", ctr: "3.4% Click Rate", cac: "-32% Lower CAC" },
    deliverables: [
      "AI Lookalike & Interest Audience Mining",
      "Short-Form Video Reels & Dynamic Ad Creatives",
      "Google Search, Shopping & Performance Max",
      "Real-Time Hourly Bid & Dayparting Automation"
    ],
    mockup: {
      headline: "Scalable E-Commerce Acquisition",
      badge: "Active Campaign",
      stat1: "₹4.20 Return per ₹1 Spent",
      stat2: "14.2k High-Intent Clicks"
    }
  },
  {
    id: "seo-rank",
    label: "Search & SEO",
    sub: "Programmatic Traffic",
    icon: Search,
    title: "Programmatic SEO & Schema Architecture",
    tagline: "Dominating Organic Search Keywords with Zero-CAC Traffic",
    metrics: { roas: "#1 Page Rank", ctr: "125k Organic Visits", cac: "Zero Ad Spend" },
    deliverables: [
      "Technical Core Web Vitals Audit & Schema Injection",
      "Programmatic Keyword Clustering & Topic Silos",
      "High-Authority Backlink & PR Outreach Engine",
      "Google Merchant Center Product Feed Indexing"
    ],
    mockup: {
      headline: "Organic Rank #1 Acceleration",
      badge: "Google Rank #1",
      stat1: "8,500+ Keywords Indexed",
      stat2: "+140% YoY Organic Traffic"
    }
  },
  {
    id: "reels-ugc",
    label: "Content & Reels",
    sub: "Viral Brand Media",
    icon: Video,
    title: "Viral Short-Form Reels & UGC Lab",
    tagline: "High-Production Reels & Creator UGC Content Engine",
    metrics: { roas: "12M+ Views", ctr: "8.9% Engagement", cac: "High Viral Lift" },
    deliverables: [
      "Short-Form Reel Scripting, Editing & Motion FX",
      "Creator UGC Sourcing & Licensing Strategy",
      "Brand Narrative & Grid Aesthetic Management",
      "Omnichannel Distribution Across Reels, Shorts & TikTok"
    ],
    mockup: {
      headline: "Viral Brand Content Engine",
      badge: "12M+ Impressions",
      stat1: "35+ Monthly Reel Assets",
      stat2: "4.8% Engagement Rate"
    }
  },
  {
    id: "cro-funnel",
    label: "CRO & Retention",
    sub: "LTV Optimization",
    icon: MousePointerClick,
    title: "Conversion Rate Optimization & Klaviyo Funnels",
    tagline: "Turning Cold Site Visitors into High-LTV Repeat Buyers",
    metrics: { roas: "+38% Conv. Lift", ctr: "42% Email Open Rate", cac: "+65% Higher LTV" },
    deliverables: [
      "Landing Page Heatmap & Friction Point Analysis",
      "Checkout A/B Testing & Frictionless Payment Flow",
      "Automated Klaviyo Abandoned Cart & Welcome Series",
      "VIP Loyalty & Repeat Purchase SMS Workflows"
    ],
    mockup: {
      headline: "Full-Funnel Conversion Lift",
      badge: "38% Lift",
      stat1: "₹1.4L Recovered / Week",
      stat2: "4.2% E-Commerce Conv. Rate"
    }
  }
];

// Interactive Funnel Stages
const funnelStages = [
  {
    stage: "01. TOFU (Top of Funnel)",
    title: "Awareness & Pattern Interrupt",
    desc: "Capturing user attention with viral short-form reels, Meta video ads, and broad keyword search intent.",
    channels: ["Instagram Reels", "Meta Video Hooks", "Google Search Ads"],
    metric: "Reach & CPM Control"
  },
  {
    stage: "02. MOFU (Middle of Funnel)",
    title: "Intent Building & Social Proof",
    desc: "Nurturing interested prospects with customer reviews, press mentions, A+ product comparison tables, and retargeting ads.",
    channels: ["Dynamic Carousel Ads", "SEO Comparison Guides", "User Testimonials"],
    metric: "High Click-Through Rate"
  },
  {
    stage: "03. BOFU (Bottom of Funnel)",
    title: "Conversion & Instant Offer",
    desc: "Triggering checkout actions via limited-time incentives, simplified payment flows, and high-converting landing pages.",
    channels: ["Google Shopping PMax", "Dynamic Retargeting DPA", "1-Click Checkout"],
    metric: "Maximum ROAS & Sales"
  },
  {
    stage: "04. Retention & LTV",
    title: "Repeat Orders & Loyalty Engine",
    desc: "Maximizing Customer Lifetime Value with automated Klaviyo flows, post-purchase SMS upsells, and brand loyalty rewards.",
    channels: ["Klaviyo Email Flows", "WhatsApp Order Alerts", "VIP Repeat Offers"],
    metric: "+65% Repeat Revenue"
  }
];

const marketingServices = [
  {
    title: "Search Engine Marketing (SEM) - Online Brand Awareness (Display / Video)",
    image: "/digital-marketing-services/sem-marketing.png",
    desc: "Target high-intent audiences with rich display & video campaigns across Google Merchant & YouTube networks."
  },
  {
    title: "Search Engine Optimization (SEO) & Technical Schema",
    image: "/digital-marketing-services/seo-optimization.png",
    desc: "Optimize site elements, technical schema, and programmatic content to dominate page 1 search engine rankings."
  },
  {
    title: "Social Media & High-ROAS Performance Marketing",
    image: "/digital-marketing-services/smm-marketing.png",
    desc: "Driven by high-converting content strategy, video reels, dynamic retargeting, and interest audience mining."
  },
  {
    title: "Local SEO & Hyper-Targeted Business Visibility",
    image: "/digital-marketing-services/local-seo.png",
    desc: "Capture local high-intent customers near your business locations without requiring heavy upfront ad spend."
  }
];

export default function DigitalMarketingPage() {
  const { isDark } = useTheme();
  const { sendMessage } = useChat();

  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [activeFunnel, setActiveFunnel] = useState(0);
  const [blocker, setBlocker] = useState("roas");

  const currentTab = strategyTabs[activeTab];

  // Auto-loop for Mobile Services Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveServiceIndex((prev) => (prev + 1) % marketingServices.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auto-loop for Mobile Funnel Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFunnel((prev) => (prev + 1) % funnelStages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className={`min-h-screen pt-4 sm:pt-20 pb-6 sm:pb-10 px-3 sm:px-6 overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#0A0A0A] text-white' : 'bg-[#FDFDFD] text-[#111]'}`}>
      {/* Dynamic Background Pattern */}
      <div 
        className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.03]'}`}
        style={{ backgroundImage: `radial-gradient(${isDark ? '#FFF' : '#000'} 1.2px, transparent 1.2px)`, backgroundSize: '48px 48px' }} 
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-6 sm:space-y-16">
        
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="flex flex-col gap-4 sm:gap-8 pt-2 sm:pt-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`inline-flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 sm:px-5 sm:py-2.5 border rounded-full w-fit shadow-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}
          >
            <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F05E23]" />
            <span className="text-[0.6rem] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#F05E23]">Performance Growth Studio</span>
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
                Growth <span className="text-[#F05E23]">Engineering</span> <br />
                & ROAS Acceleration.
              </motion.h1>
              <p className={`text-xs sm:text-xl font-light leading-relaxed max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Move beyond static ad agencies. We combine live ROAS modeling, surgical Meta/Google targeting, short-form reel labs, and high-converting funnel architectures.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-4">
              <a
                href="https://wa.me/919161391566?text=Hi!%20I'd%20like%20to%20request%20a%20Performance%20Marketing%20Audit%20and%20ROAS%20Plan."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 sm:py-5 px-5 sm:px-8 rounded-xl sm:rounded-2xl bg-[#F05E23] text-white font-bold uppercase tracking-widest text-[0.7rem] sm:text-xs flex items-center justify-between hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F05E23]/25 group"
              >
                <span>Launch Campaign Studio</span>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <button
                onClick={() => sendMessage("How can Synchronous optimize my Meta & Google ad campaigns to achieve a 4x+ ROAS?")}
                className={`w-full py-3.5 sm:py-5 px-5 sm:px-8 rounded-xl sm:rounded-2xl border font-bold uppercase tracking-widest text-[0.7rem] sm:text-xs flex items-center justify-between transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900 shadow-sm'}`}
              >
                <span>Ask AI Growth Lead</span>
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F05E23]" />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* OUR SERVICES GRID / MOBILE CAROUSEL */}
        {/* ========================================================================= */}
        <section className="space-y-3 sm:space-y-10 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-1 sm:space-y-2">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Core Performance Capabilities</span>
            <h2 className="text-xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              OUR <span className="text-[#F05E23]">SERVICES</span>
            </h2>
          </div>

          {/* Desktop Grid (2x2 grid) */}
          <div className="hidden md:grid md:grid-cols-2 gap-6 sm:gap-8">
            {marketingServices.map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-5 sm:p-7 rounded-3xl border-2 flex flex-col items-center text-center justify-between gap-6 transition-all hover:scale-[1.015] shadow-md hover:border-[#F05E23] group ${
                  isDark ? 'bg-white/5 border-white/15' : 'bg-white border-slate-300'
                }`}
              >
                {/* Top Illustration Image Box */}
                <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Service Title & Description */}
                <div className="space-y-3 flex-grow flex flex-col justify-start">
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 dark:text-white px-2 leading-snug">
                    {service.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile 1-Widget Circular Loop Carousel */}
          <div className="block md:hidden relative">
            <div className="relative overflow-hidden rounded-2xl border-2">
              <AnimatePresence mode="wait">
                {(() => {
                  const service = marketingServices[activeServiceIndex];
                  return (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`p-4 flex flex-col items-center text-center space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'}`}
                    >
                      <div className="w-full aspect-[16/10] relative rounded-xl overflow-hidden bg-slate-900 border">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white leading-snug">
                          {service.title}
                        </h3>
                        <p className={`text-[0.65rem] leading-relaxed line-clamp-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {service.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Mobile Carousel Controls */}
            <div className="flex items-center justify-between mt-2.5 px-1">
              <button
                onClick={() => setActiveServiceIndex((prev) => (prev - 1 + marketingServices.length) % marketingServices.length)}
                aria-label="Previous Service"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {marketingServices.map((s, idx) => (
                  <button
                    key={s.title}
                    onClick={() => setActiveServiceIndex(idx)}
                    aria-label={`Go to ${s.title}`}
                    className={`h-1.5 rounded-full transition-all ${activeServiceIndex === idx ? 'w-5 bg-[#F05E23]' : `w-1.5 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveServiceIndex((prev) => (prev + 1) % marketingServices.length)}
                aria-label="Next Service"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE STRATEGY HUB TABS */}
        {/* ========================================================================= */}
        <section className="space-y-4 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
            <div>
              <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Growth Matrix</span>
              <h2 className="text-xl sm:text-5xl font-black uppercase tracking-tight mt-1">Interactive Strategy Hub</h2>
            </div>
            <p className={`text-xs sm:text-sm max-w-md ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Click through each pillar to see how our engineering team scales acquisition and conversion.</p>
          </div>

          {/* Strategy Tab Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {strategyTabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === idx;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(idx)}
                  className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 sm:gap-4 ${isActive ? 'bg-[#F05E23] text-white border-[#F05E23] shadow-lg shadow-[#F05E23]/30' : (isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm')}`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${isActive ? 'text-white' : 'text-[#F05E23]'}`} />
                    <span className={`text-[0.55rem] sm:text-[0.6rem] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#F05E23]/10 text-[#F05E23]'}`}>
                      0{idx + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider">{tab.label}</h3>
                    <p className={`text-[0.55rem] sm:text-[0.65rem] font-medium mt-0.5 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>{tab.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Strategy Details Showcase Panel */}
          <div className={`p-4 sm:p-12 rounded-2xl sm:rounded-[2.5rem] border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
              <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F05E23]/10 text-[#F05E23] text-[0.65rem] sm:text-xs font-bold uppercase tracking-wider border border-[#F05E23]/20">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{currentTab.tagline}</span>
                </div>
                <h3 className="text-lg sm:text-4xl font-black uppercase tracking-tight">{currentTab.title}</h3>

                {/* Key Deliverables List */}
                <div className="space-y-2.5 pt-1">
                  <h4 className="text-[0.65rem] sm:text-xs font-black uppercase tracking-widest text-[#F05E23]">Core Execution Deliverables:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {currentTab.deliverables.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F05E23] shrink-0 mt-0.5" />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Key Metrics Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-black/5 dark:border-white/5">
                  <span className="text-[0.6rem] sm:text-xs font-bold uppercase tracking-widest text-slate-400">Target Metrics:</span>
                  <span className="text-[0.6rem] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">{currentTab.metrics.roas}</span>
                  <span className="text-[0.6rem] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">{currentTab.metrics.ctr}</span>
                  <span className="text-[0.6rem] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">{currentTab.metrics.cac}</span>
                </div>
              </div>

              {/* Strategy Live Mockup Graphic Box */}
              <div className={`lg:col-span-5 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border flex flex-col justify-between gap-4 relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-[#12121A] to-[#0A0A0A] border-white/10' : 'bg-gradient-to-br from-slate-100 to-white border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[0.6rem] sm:text-xs font-black uppercase tracking-widest text-[#F05E23]">{currentTab.mockup.badge}</span>
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#F05E23] animate-pulse" />
                </div>

                <div className="space-y-3 my-2 sm:my-4">
                  <h4 className="text-base sm:text-xl font-black uppercase tracking-tight">{currentTab.mockup.headline}</h4>
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/20 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-1.5">
                    <div className="flex justify-between items-center text-[0.65rem] sm:text-xs font-bold">
                      <span className="text-slate-400">Metric 1</span>
                      <span className="text-[#F05E23]">{currentTab.mockup.stat1}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#F05E23] h-full w-[85%]" />
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/20 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-1.5">
                    <div className="flex justify-between items-center text-[0.65rem] sm:text-xs font-bold">
                      <span className="text-slate-400">Metric 2</span>
                      <span className="text-slate-900 dark:text-white">{currentTab.mockup.stat2}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[70%]" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => sendMessage(`Tell me more about your ${currentTab.title} strategy and deliverables.`)}
                  className="w-full py-3 rounded-xl bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/30 font-bold uppercase tracking-widest text-[0.65rem] sm:text-xs flex items-center justify-center gap-2 hover:bg-[#F05E23] hover:text-white transition-all"
                >
                  <span>Inquire Strategy</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FULL-FUNNEL GROWTH PIPELINE */}
        {/* ========================================================================= */}
        <section className="space-y-3 sm:space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-3">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Acquisition Architecture</span>
            <h2 className="text-xl sm:text-5xl font-black uppercase tracking-tight">Full-Funnel Growth Pipeline</h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Every stage of the customer lifecycle is optimized to maximize ROAS and customer LTV.</p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {funnelStages.map((stg, idx) => (
              <motion.div 
                key={stg.stage}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setActiveFunnel(idx)}
                className={`p-8 rounded-3xl border flex flex-col justify-between gap-6 cursor-pointer transition-all ${activeFunnel === idx ? 'border-[#F05E23] ring-2 ring-[#F05E23]/30 scale-[1.02]' : ''} ${isDark ? 'bg-white/5 border-white/10 hover:border-white/30' : 'bg-white border-slate-100 shadow-sm hover:border-slate-300'}`}
              >
                <div>
                  <span className="text-[0.65rem] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                    {stg.stage}
                  </span>
                  <h3 className="text-lg font-black uppercase tracking-wide mt-4">{stg.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{stg.desc}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
                  <span className="text-[0.6rem] font-extrabold uppercase tracking-widest text-[#F05E23] block">Active Channels:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {stg.channels.map((ch) => (
                      <span key={ch} className="text-[0.6rem] font-bold px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                        {ch}
                      </span>
                    ))}
                  </div>
                  <div className="text-[0.65rem] font-bold text-slate-400 pt-2 flex items-center justify-between">
                    <span>Key Metric:</span>
                    <span className="text-[#F05E23] font-black">{stg.metric}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile 1-Widget Circular Loop Carousel */}
          <div className="block md:hidden relative">
            <div className="relative overflow-hidden rounded-2xl border-2">
              <AnimatePresence mode="wait">
                {(() => {
                  const stg = funnelStages[activeFunnel];
                  return (
                    <motion.div
                      key={stg.stage}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`p-4 flex flex-col justify-between space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'}`}
                    >
                      <div>
                        <span className="text-[0.55rem] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                          {stg.stage}
                        </span>
                        <h3 className="text-base font-black uppercase tracking-tight mt-2">{stg.title}</h3>
                        <p className={`text-[0.65rem] leading-relaxed mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stg.desc}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <span className="text-[0.55rem] font-extrabold uppercase tracking-wider text-[#F05E23] block">Active Channels:</span>
                        <div className="flex flex-wrap gap-1">
                          {stg.channels.map((ch) => (
                            <span key={ch} className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-slate-300">
                              {ch}
                            </span>
                          ))}
                        </div>
                        <div className="text-[0.6rem] font-bold text-slate-400 pt-1 flex items-center justify-between">
                          <span>Key Metric:</span>
                          <span className="text-[#F05E23] font-black">{stg.metric}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Mobile Carousel Controls */}
            <div className="flex items-center justify-between mt-2.5 px-1">
              <button
                onClick={() => setActiveFunnel((prev) => (prev - 1 + funnelStages.length) % funnelStages.length)}
                aria-label="Previous Funnel Stage"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {funnelStages.map((s, idx) => (
                  <button
                    key={s.stage}
                    onClick={() => setActiveFunnel(idx)}
                    aria-label={`Go to stage ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all ${activeFunnel === idx ? 'w-5 bg-[#F05E23]' : `w-1.5 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveFunnel((prev) => (prev + 1) % funnelStages.length)}
                aria-label="Next Funnel Stage"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INSTANT GROWTH DIAGNOSTIC CARD */}
        {/* ========================================================================= */}
        <section className={`p-6 sm:p-14 rounded-2xl sm:rounded-[3rem] border relative overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-lg'}`}>
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 text-center">
            <div className="space-y-1.5 sm:space-y-3">
              <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Instant Audit Diagnostic</span>
              <h2 className="text-xl sm:text-5xl font-black uppercase tracking-tight">What's Your Biggest Marketing Blocker?</h2>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Select your main growth bottleneck to generate an immediate custom audit proposal.</p>
            </div>

            {/* Diagnostic Button Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              {[
                { id: "roas", label: "High CAC & Low Ad ROAS", desc: "Meta/Google ad spend isn't profitable" },
                { id: "cro", label: "Low Website Conversion Rate", desc: "Getting site traffic but low sales" },
                { id: "seo", label: "Zero Organic Search Traffic", desc: "Relying 100% on paid ads for revenue" },
                { id: "retention", label: "Low Customer Repeat Orders", desc: "No automated email/SMS retention flows" },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBlocker(b.id)}
                  className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border text-left transition-all ${blocker === b.id ? 'bg-[#F05E23] text-white border-[#F05E23] shadow-lg shadow-[#F05E23]/30 scale-[1.02]' : (isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100')}`}
                >
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide">{b.label}</h3>
                  <p className={`text-[0.65rem] sm:text-xs mt-0.5 font-medium ${blocker === b.id ? 'text-white/80' : 'text-slate-400'}`}>{b.desc}</p>
                </button>
              ))}
            </div>

            {/* Diagnostic Direct Action Button */}
            <div className="pt-2 sm:pt-4">
              <a
                href={`https://wa.me/919161391566?text=Hi!%20My%20biggest%20digital%20marketing%20blocker%20is%20${encodeURIComponent(blocker.toUpperCase())}.%20I'd%20like%20a%20custom%20audit%20and%20growth%20fix.`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 sm:py-5 px-6 sm:px-10 rounded-xl sm:rounded-2xl bg-[#F05E23] text-white font-black uppercase tracking-widest text-[0.7rem] sm:text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#F05E23]/30 inline-flex items-center justify-center gap-2 w-full sm:w-auto text-center"
              >
                <span>Request Custom Audit</span>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CTA BANNER */}
        {/* ========================================================================= */}
        <section className={`p-6 sm:p-16 rounded-2xl sm:rounded-[3rem] border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 ${isDark ? 'bg-gradient-to-r from-[#F05E23]/20 to-black border-white/10' : 'bg-gradient-to-r from-[#F05E23]/10 to-slate-100 border-slate-200'}`}>
          <div className="space-y-2 sm:space-y-4 text-center md:text-left max-w-xl">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Accelerate Brand Revenue</span>
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight">Ready to Scale Your Brand's ROI?</h2>
            <p className={`text-xs sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Book a growth strategy call with our performance marketing architects.</p>
          </div>
          <a
            href="https://wa.me/919161391566?text=I'd%20like%20to%20book%20a%20Digital%20Marketing%20growth%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            className="py-4 px-6 sm:py-6 sm:px-10 rounded-xl sm:rounded-2xl bg-[#F05E23] text-white font-black uppercase tracking-widest text-[0.7rem] sm:text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#F05E23]/30 shrink-0 text-center"
          >
            Schedule Strategy Call
          </a>
        </section>

      </div>
    </main>
  );
}


