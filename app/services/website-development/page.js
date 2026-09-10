"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ShoppingBag,
  TrendingUp,
  Activity,
  Truck,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Code,
  Layers,
  ShieldCheck,
  Terminal,
  Cpu,
  Rocket,
  Sparkles,
  Server,
  Database,
  Lock,
  Layout,
  Gauge
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "../../../components/ThemeContext";
import { useChat } from "../../../components/ChatContext";

// MERN Stack Interactive Tech Explorer Data
const mernStack = [
  {
    id: "mongo",
    letter: "M",
    shortName: "MongoDB",
    name: "MongoDB & Mongoose",
    role: "Database & Schemas",
    accentColor: "#13AA52",
    desc: "Scalable NoSQL document architecture with automated indexing and sub-5ms query performance.",
    benchmarks: { speed: "< 3.2ms", throughput: "50k ops/s", security: "TLS 1.3" },
    highlights: ["Mongoose Schemas", "Atlas Clusters", "Real-Time Streams"],
    codeSnippet: `// MongoDB Mongoose Schema
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, default: "Active" },
  performance: { type: Number, default: 99 },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);`
  },
  {
    id: "express",
    letter: "E",
    shortName: "Express",
    name: "Express.js & Node APIs",
    role: "Async Backend Engine",
    accentColor: "#F59E0B",
    desc: "Non-blocking RESTful & GraphQL microservices with JWT security, rate limiting, and edge handlers.",
    benchmarks: { speed: "< 8.5ms", throughput: "12k req/s", security: "JWT + CSRF" },
    highlights: ["REST & GraphQL", "JWT Auth Pipeline", "Edge Execution"],
    codeSnippet: `// Express.js API Endpoint
import express from "express";
import { verifyJWT } from "./auth";

const app = express();
app.post("/api/v1/projects", verifyJWT, async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, project });
});`
  },
  {
    id: "react",
    letter: "R",
    shortName: "React 19",
    name: "React 19 & Next.js 16",
    role: "Frontend Architecture",
    accentColor: "#06B6D4",
    desc: "React 19 Server Components, App Router rendering, Framer Motion kinetics, and 99+ Core Web Vitals.",
    benchmarks: { speed: "99/100 Vitals", throughput: "60 FPS", security: "SSR Hybrid" },
    highlights: ["Server Components", "Next.js App Router", "Framer Kinetics"],
    codeSnippet: `// Next.js 16 Server Component (React 19)
import { dbConnect } from "@/lib/mongodb";

export default async function Page() {
  await dbConnect();
  const data = await fetchProjects();
  return <ClientShowcase data={data} />;
}`
  },
  {
    id: "node",
    letter: "N",
    shortName: "Node.js",
    name: "Node.js Ecosystem",
    role: "System Execution",
    accentColor: "#10B981",
    desc: "Event-driven runtime orchestrating WebPush notifications, video streaming, and async background tasks.",
    benchmarks: { speed: "Sub-10ms Async", throughput: "Event-Driven", security: "Memory Safe" },
    highlights: ["Event Loop Runtime", "Nodemailer Engine", "Cloudinary Streams"],
    codeSnippet: `// Node.js Event Driven Pipeline
import { EventEmitter } from "events";
const syncQueue = new EventEmitter();

syncQueue.on("deploy", async (payload) => {
  console.log("Synchronous Deployment:", payload.id);
});`
  }
];

// Core Web Services Data Matrix
const webServices = [
  {
    title: "Full-Stack MERN Apps",
    desc: "Custom web applications built with MongoDB, Express, React 19, and Node.js for high scale and zero speed bottlenecks.",
    icon: Code,
    badge: "MERN Native",
    accent: "#F05E23",
    features: ["Sub-5ms Database Queries", "JWT Auth & Role Security", "Custom RESTful/GraphQL APIs", "Scalable Microservice Setup"]
  },
  {
    title: "Next.js 16 E-Commerce",
    desc: "High-converting online store platforms featuring sub-second page loads, custom cart/checkout, and payment gateway webhooks.",
    icon: ShoppingBag,
    badge: "High Conversion",
    accent: "#06B6D4",
    features: ["Next.js App Router SSR", "Razorpay / Stripe Gateway", "Automated Invoice PDF", "Instant Search & Filtering"]
  },
  {
    title: "SaaS & Enterprise Portals",
    desc: "Real-time administrative dashboards with user analytics, automated reporting, role permissions, and live WebSockets.",
    icon: Layout,
    badge: "Enterprise Grade",
    accent: "#8B5CF6",
    features: ["Real-Time WebSocket Sync", "Role-Based Access Control", "Interactive Charting UI", "Export PDF/Excel Reports"]
  },
  {
    title: "Headless CMS & PWAs",
    desc: "Mobile-first Progressive Web Apps and Headless CMS integrations enabling instant offline capabilities and push notifications.",
    icon: Terminal,
    badge: "Mobile First",
    accent: "#10B981",
    features: ["PWA Installable App", "Offline Caching Workers", "Headless CMS Connection", "WebPush Mobile Alerts"]
  },
  {
    title: "Core Web Vitals & SEO",
    desc: "Deep speed engineering delivering 99+ Google Lighthouse scores, instant sub-500ms TTFB, and rich JSON-LD schema markup.",
    icon: Gauge,
    badge: "99+ Lighthouse",
    accent: "#F59E0B",
    features: ["Sub-500ms Initial TTFB", "Image Compression & WebP", "Dynamic OpenGraph Meta", "Rich JSON-LD Schema"]
  },
  {
    title: "API & Cloud Microservices",
    desc: "Custom API development and cloud deployment on AWS/Vercel with automated CI/CD pipelines, SSL, and DDoS shielding.",
    icon: Server,
    badge: "Zero Downtime",
    accent: "#EC4899",
    features: ["AWS / Vercel Edge Hosting", "Automated CI/CD Pipelines", "SSL & Cloudflare DDoS Shield", "24/7 SLA Monitoring"]
  }
];

// 4-Step Web Development Workflow
const workflowSteps = [
  {
    num: "01",
    phase: "Phase 1",
    title: "Architecture & UI/UX Design",
    text: "We plan site maps, user journeys, wireframes, and modern visual designs using dark/light design tokens.",
    badge: "Design Ready",
    accent: "#F05E23"
  },
  {
    num: "02",
    phase: "Phase 2",
    title: "MERN Backend & Schemas",
    text: "Engineered MongoDB databases, Express controllers, and secure API endpoints with JWT authentication.",
    badge: "API Engine",
    accent: "#06B6D4"
  },
  {
    num: "03",
    phase: "Phase 3",
    title: "Frontend & Kinetics",
    text: "Developing React 19 / Next.js 16 components with smooth Framer Motion animations and crisp layout math.",
    badge: "Frontend Live",
    accent: "#8B5CF6"
  },
  {
    num: "04",
    phase: "Phase 4",
    title: "Cloud Launch & 99+ Speed",
    text: "Automated Vercel/AWS deployment, Lighthouse audits, custom domain integration, and SLA handover.",
    badge: "99+ Vitals",
    accent: "#10B981"
  }
];

// Creative Portfolio Showcase Data
const projects = [
  {
    id: "boxfox",
    title: "BOXFOX",
    category: "E-Commerce",
    subtitle: "Custom Packaging & Brand Portal",
    url: "https://boxfox.in/",
    image: "/website ss/boxfox.png",
    metrics: "425k+ Shipments | +120% Sales Growth",
    stack: ["React 19", "Next.js 16", "Node.js", "MongoDB", "Razorpay"],
    desc: "Architected a high-converting e-commerce web platform with instant 3D box customization, automated invoice generation, and seamless checkout workflow.",
    accent: "#F05E23",
    icon: ShoppingBag,
  },
  {
    id: "rym",
    title: "RYM Grenergy",
    category: "CleanTech",
    subtitle: "Investor-Ready Energy Ecosystem",
    url: "https://rymgrenergy.com/",
    image: "/website ss/RYM.png",
    metrics: "Clean-Tech Grants Secured | 99+ Speed Score",
    stack: ["Next.js", "Framer Motion", "Tailwind CSS", "Mongoose"],
    desc: "Designed and engineered an institutional-grade clean-tech corporate web portal featuring kinetic visual storytelling and investor documentation access.",
    accent: "#10B981",
    icon: Zap,
  },
  {
    id: "bworth",
    title: "BWorth",
    category: "FinTech",
    subtitle: "Financial Dashboard & Portfolio Portal",
    url: "https://bworth.co.in/",
    image: "/website ss/bworth.png",
    metrics: "+40% User Retention | Institutional Grade",
    stack: ["React 19", "Express.js", "Node.js", "WebSockets"],
    desc: "Engineered a secure financial analytics portal with real-time portfolio tracking, user asset visualizations, and encrypted data streams.",
    accent: "#3B82F6",
    icon: TrendingUp,
  },
  {
    id: "vega",
    title: "Vegavruddhi",
    category: "SaaS",
    subtitle: "Enterprise Workflow & SaaS Engine",
    url: "https://www.vegavruddhi.com/",
    image: "/website ss/vega.png",
    metrics: "+30% Conversion Rate | Automated Workflows",
    stack: ["Next.js 16", "MongoDB", "Tailwind CSS", "AI Engine"],
    desc: "Streamlined operational SaaS web platform providing real-time team workflow management, conversion auditing, and automated report generation.",
    accent: "#8B5CF6",
    icon: Activity,
  },
  {
    id: "fashquick",
    title: "Fashquick",
    category: "Marketplace",
    subtitle: "Mobile-First Fashion Marketplace App",
    url: "https://www.fashquick.in/",
    image: "/website ss/fashquick.png",
    metrics: "Editorial Mobile App | 50k+ Monthly Visits",
    stack: ["MERN Stack", "Next.js", "PWA", "Cloudinary"],
    desc: "Engineered an editorial-style, high-speed mobile-first web application for sustainable fashion with curated brand cataloging and instant search.",
    accent: "#EC4899",
    icon: Globe,
  },
  {
    id: "prl",
    title: "PRL Roadlines",
    category: "Logistics",
    subtitle: "Pan-India Fleet & Freight Command",
    url: "https://www.phogatroadlines.com/",
    image: "/website ss/prl.png",
    metrics: "Real-Time Fleet Tracking | Pan-India Reach",
    stack: ["Node.js", "Express", "MongoDB", "Google Maps API"],
    desc: "Developed a robust logistics fleet command platform with real-time shipment status, route calculation, and automated quote generation.",
    accent: "#F59E0B",
    icon: Truck,
  }
];

// Client Logos & Trust Badges
const clients = [
  { name: "BOXFOX", category: "E-Commerce Leader", stat: "425k+ Orders" },
  { name: "RYM Grenergy", category: "CleanTech Leader", stat: "Grant Verified" },
  { name: "BWorth", category: "FinTech Enterprise", stat: "40% Retention" },
  { name: "Vegavruddhi", category: "SaaS Platform", stat: "30% Conversions" },
  { name: "Fashquick", category: "Fashion App", stat: "50k+ Visitors" },
  { name: "PRL Roadlines", category: "Logistics Fleet", stat: "Pan-India Network" },
];

// Website Development FAQs
const faqs = [
  {
    q: "Why choose MERN Stack and Next.js 16 over traditional WordPress or Shopify templates?",
    a: "MERN (MongoDB, Express, React, Node) combined with Next.js 16 provides custom sub-500ms page load speeds, 99+ Core Web Vitals, enterprise-grade security, complete code ownership, and zero recurring plugin costs."
  },
  {
    q: "How long does it take to develop a custom web application?",
    a: "Custom landing pages and brand websites take 7–14 days. Full-stack MERN e-commerce platforms & SaaS web apps take 3–6 weeks depending on feature complexity and API integrations."
  },
  {
    q: "Are your websites optimized for mobile responsiveness and Google SEO?",
    a: "100%! Every web platform is built mobile-first with responsive breakpoints, dynamic SSR/SSG meta tags, schema markup, image optimization, and 99+ Lighthouse performance scores."
  },
  {
    q: "Do you provide backend API integration, payment gateways, and database setup?",
    a: "Yes, we design secure RESTful/GraphQL APIs in Express/Node.js, connect MongoDB Atlas database clusters, and integrate payment gateways (Razorpay, Stripe) with automated invoice webhooks."
  },
  {
    q: "What support and maintenance options do you offer post-launch?",
    a: "We offer 99.99% uptime monitoring, SSL certificates, automated database backups, code updates, and ongoing retainer support packages to keep your platform running smoothly."
  }
];

export default function WebsiteDevelopmentPage() {
  const { isDark } = useTheme();
  const { sendMessage } = useChat();
  const [activeTechIndex, setActiveTechIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeClientIndex, setActiveClientIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const currentTech = mernStack[activeTechIndex];

  // Auto-loop for Services Carousel on Mobile
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveServiceIndex((prev) => (prev + 1) % webServices.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Auto-loop for Workflow Step Carousel on Mobile
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % workflowSteps.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Auto-loop for Project Showcase Carousel on Mobile
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveProjectIndex((prev) => (prev + 1) % projects.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auto-loop for Client Carousel on Mobile
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveClientIndex((prev) => (prev + 1) % clients.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentTech.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <main className={`min-h-screen pt-4 sm:pt-20 pb-6 sm:pb-10 px-3 sm:px-6 overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#050508] text-white' : 'bg-[#FDFDFD] text-[#111]'}`}>
      {/* Background Radial Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute top-20 right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] transition-opacity duration-700 ${isDark ? 'bg-[#F05E23]/15' : 'bg-[#F05E23]/10'}`} />
        <div className={`absolute top-[40%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] transition-opacity duration-700 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/5'}`} />
        <div className={`absolute inset-0 opacity-[0.04] dark:opacity-[0.07]`} style={{ backgroundImage: `radial-gradient(${isDark ? '#FFF' : '#000'} 1.2px, transparent 1.2px)`, backgroundSize: '48px 48px' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6 sm:space-y-16">

        {/* ========================================================================= */}
        {/* UNIFIED HERO + MERN STACK INTERACTIVE COMMAND CENTER */}
        {/* ========================================================================= */}
        <section className="space-y-4 sm:space-y-8 pt-2 sm:pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">

            {/* Left Column: Headline, Value Proposition & Spec Pills */}
            <div className="lg:col-span-6 flex flex-col gap-3 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`inline-flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 sm:px-5 sm:py-2.5 border rounded-full w-fit shadow-md backdrop-blur-xl ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'}`}
              >
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#F05E23] animate-ping" />
                <span className="text-[0.6rem] sm:text-xs font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#F05E23]">
                  FULL-STACK MERN & NEXT.JS 16
                </span>
              </motion.div>

              <div className="space-y-1.5 sm:space-y-3">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight sm:tracking-tighter leading-[1.02] sm:leading-[0.95] uppercase"
                >
                  WEBSITE <br />
                  <span className="text-[#F05E23] drop-shadow-[0_10px_30px_rgba(240,94,35,0.3)]">DEVELOPMENT</span> <br />
                  & MERN STACK.
                </motion.h1>

                <p className={`text-xs sm:text-base font-light leading-relaxed max-w-xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  We engineer high-speed, scalable web applications using MongoDB, Express, React 19, Node.js & Next.js 16. Built for sub-500ms latency and 99+ Core Web Vitals.
                </p>
              </div>

              {/* Performance Spec Badges */}
              <div className="grid grid-cols-3 gap-2 max-w-md">
                <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border flex flex-col items-start gap-0.5 backdrop-blur-md ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-base sm:text-lg font-black text-[#F05E23]">99+</span>
                  <span className="text-[0.5rem] sm:text-[0.55rem] font-extrabold uppercase tracking-wider text-slate-400">Lighthouse</span>
                </div>
                <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border flex flex-col items-start gap-0.5 backdrop-blur-md ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-base sm:text-lg font-black text-cyan-400">&lt;500ms</span>
                  <span className="text-[0.5rem] sm:text-[0.55rem] font-extrabold uppercase tracking-wider text-slate-400">Latency</span>
                </div>
                <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border flex flex-col items-start gap-0.5 backdrop-blur-md ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-base sm:text-lg font-black text-emerald-400">99.99%</span>
                  <span className="text-[0.5rem] sm:text-[0.55rem] font-extrabold uppercase tracking-wider text-slate-400">Uptime SLA</span>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                <a
                  href="https://wa.me/919161391566?text=Hi!%20I'd%20like%20to%20discuss%20a%20MERN/Next.js%20Website%20Development%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 sm:py-4 px-5 sm:px-7 rounded-xl sm:rounded-2xl bg-[#F05E23] text-white font-bold uppercase tracking-widest text-[0.7rem] sm:text-xs flex items-center justify-between sm:justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#F05E23]/30 group"
                >
                  <span>Build Full-Stack Platform</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                <button
                  onClick={() => sendMessage("Explain your MERN stack website development architecture and performance optimizations.")}
                  className={`py-3.5 sm:py-4 px-5 sm:px-7 rounded-xl sm:rounded-2xl border font-bold uppercase tracking-widest text-[0.7rem] sm:text-xs flex items-center justify-between sm:justify-center gap-2.5 transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900 shadow-sm'}`}
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F05E23]" />
                    <span>Ask AI Web Architect</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: Combined MERN Stack + Live Terminal IDE Card */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl sm:rounded-[2.5rem] border overflow-hidden shadow-2xl bg-[#09090D] border-white/15 relative z-10 backdrop-blur-2xl">

                {/* Top Bar: Clickable MERN Stack Tabs */}
                <div className="p-2 bg-black/80 border-b border-white/10 flex items-center justify-between gap-1 overflow-x-auto">
                  <div className="flex items-center gap-1.5 pl-2 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>

                  <div className="flex items-center gap-1">
                    {mernStack.map((tech, idx) => (
                      <button
                        key={tech.id}
                        onClick={() => setActiveTechIndex(idx)}
                        className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[0.6rem] sm:text-[0.65rem] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${activeTechIndex === idx
                          ? 'bg-[#F05E23] text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                      >
                        <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded flex items-center justify-center bg-black/30 text-[0.55rem] sm:text-[0.6rem]">{tech.letter}</span>
                        <span>{tech.shortName}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
                    title="Copy Code Snippet"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Tech Layer Header Info */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTech.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-3.5 sm:p-5 space-y-3 sm:space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5 sm:pb-3">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br flex items-center justify-center font-black text-lg sm:text-xl border border-white/10" style={{ color: currentTech.accentColor, backgroundColor: `${currentTech.accentColor}20` }}>
                          {currentTech.letter}
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-base font-black uppercase tracking-tight text-white">{currentTech.name}</h3>
                          <span className="text-[0.55rem] sm:text-[0.6rem] font-mono font-bold uppercase text-slate-400">{currentTech.role}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[0.6rem] sm:text-[0.65rem] font-mono">
                        <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border" style={{ color: currentTech.accentColor, borderColor: `${currentTech.accentColor}40`, backgroundColor: `${currentTech.accentColor}10` }}>
                          {currentTech.benchmarks.speed}
                        </span>
                      </div>
                    </div>

                    {/* Code Snippet Box */}
                    <div className="font-mono text-[0.65rem] sm:text-[0.7rem] leading-relaxed text-slate-300 bg-black/50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/5 overflow-x-auto max-h-36 sm:max-h-48">
                      <pre><code>{currentTech.codeSnippet}</code></pre>
                    </div>

                    {/* Highlights Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {currentTech.highlights.map((h) => (
                        <span key={h} className="text-[0.55rem] sm:text-[0.6rem] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#F05E23]" />
                          {h}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* IDE Footer Execution Status Bar */}
                <div className="px-3.5 sm:px-5 py-2 bg-black/90 border-t border-white/10 flex items-center justify-between text-[0.55rem] sm:text-[0.65rem] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                    <span>MERN ENGINE: ONLINE</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-cyan-400">VITALS: 99+</span>
                    <span className="text-[#F05E23]">HTTP 200</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: WEB ENGINEERING SERVICES & STACK SOLUTIONS */}
        {/* ========================================================================= */}
        <section className="space-y-3 sm:space-y-10">
          <div className="space-y-1 sm:space-y-2">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Core Capabilities</span>
            <h2 className="text-xl sm:text-5xl font-black uppercase tracking-tight">Web Engineering Services</h2>
            <p className={`text-xs sm:text-base max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              End-to-end full-stack web development engineered for conversion, speed, and reliability.
            </p>
          </div>

          {/* Desktop Grid (3-column grid) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between space-y-6 transition-all duration-500 hover:scale-[1.02] ${isDark ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-white border-slate-200 shadow-md'}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10" style={{ backgroundColor: `${service.accent}15`, color: service.accent }}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[0.6rem] font-black uppercase tracking-widest px-3 py-1 rounded-full border" style={{ backgroundColor: `${service.accent}10`, color: service.accent, borderColor: `${service.accent}30` }}>
                        {service.badge}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-black uppercase tracking-tight">{service.title}</h3>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {service.desc}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/10">
                      {service.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2 text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#F05E23] shrink-0" />
                          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Single Widget Circular Loop Carousel */}
          <div className="block md:hidden relative">
            <div className="relative overflow-hidden rounded-xl border-2">
              <AnimatePresence mode="wait">
                {(() => {
                  const service = webServices[activeServiceIndex];
                  const Icon = service.icon;
                  return (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`p-4 flex flex-col justify-between space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10" style={{ backgroundColor: `${service.accent}15`, color: service.accent }}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[0.55rem] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border" style={{ backgroundColor: `${service.accent}10`, color: service.accent, borderColor: `${service.accent}30` }}>
                          {service.badge}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-black uppercase tracking-tight">{service.title}</h3>
                        <p className={`text-[0.65rem] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {service.desc}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-white/10">
                        {service.features.map((feat) => (
                          <div key={feat} className="flex items-center gap-2 text-[0.65rem] font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-[#F05E23] shrink-0" />
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Mobile Carousel Controls & Indicators */}
            <div className="flex items-center justify-between mt-2.5 px-1">
              <button
                onClick={() => setActiveServiceIndex((prev) => (prev - 1 + webServices.length) % webServices.length)}
                aria-label="Previous Service"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {webServices.map((s, idx) => (
                  <button
                    key={s.title}
                    onClick={() => setActiveServiceIndex(idx)}
                    aria-label={`Go to ${s.title}`}
                    className={`h-1.5 rounded-full transition-all ${activeServiceIndex === idx ? 'w-5 bg-[#F05E23]' : `w-1.5 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveServiceIndex((prev) => (prev + 1) % webServices.length)}
                aria-label="Next Service"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: 4-STEP WEB ENGINEERING ROADMAP */}
        {/* ========================================================================= */}
        <section className="space-y-3 sm:space-y-10">
          <div className="space-y-1 sm:space-y-2">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Development Cycle</span>
            <h2 className="text-xl sm:text-5xl font-black uppercase tracking-tight">4-Step Engineering Process</h2>
            <p className={`text-xs sm:text-base max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              From architecture and wireframes to sub-500ms production release on Vercel/AWS.
            </p>
          </div>

          {/* Desktop Grid (4-column process grid) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 relative overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black font-mono text-[#F05E23]">{step.num}</span>
                  <span className="text-[0.6rem] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {step.phase}
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black uppercase tracking-tight">{step.title}</h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {step.text}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[0.6rem] font-black uppercase text-[#F05E23] tracking-widest">{step.badge}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Single Widget Circular Loop Carousel */}
          <div className="block md:hidden relative">
            <div className="relative overflow-hidden rounded-xl border-2">
              <AnimatePresence mode="wait">
                {(() => {
                  const step = workflowSteps[activeStepIndex];
                  return (
                    <motion.div
                      key={step.num}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`p-4 flex flex-col justify-between space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black font-mono text-[#F05E23]">{step.num}</span>
                        <span className="text-[0.55rem] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                          {step.phase}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-black uppercase tracking-tight">{step.title}</h4>
                        <p className={`text-[0.65rem] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {step.text}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[0.55rem] font-black uppercase text-[#F05E23] tracking-wider">{step.badge}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Mobile Carousel Controls & Indicators */}
            <div className="flex items-center justify-between mt-2.5 px-1">
              <button
                onClick={() => setActiveStepIndex((prev) => (prev - 1 + workflowSteps.length) % workflowSteps.length)}
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
                    onClick={() => setActiveStepIndex(idx)}
                    aria-label={`Go to step ${s.num}`}
                    className={`h-1.5 rounded-full transition-all ${activeStepIndex === idx ? 'w-5 bg-[#F05E23]' : `w-1.5 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveStepIndex((prev) => (prev + 1) % workflowSteps.length)}
                aria-label="Next Step"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: OUR WEBSITE SHOWCASE GRID */}
        {/* ========================================================================= */}
        <section className="space-y-3 sm:space-y-10">
          <div className="space-y-1 sm:space-y-2">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Portfolio</span>
            <h2 className="text-xl sm:text-5xl font-black uppercase tracking-tight">Our Website Showcase</h2>
            <p className={`text-xs sm:text-base max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Real-world platforms engineered for performance, conversion, and visual impact.
            </p>
          </div>

          {/* Desktop Grid (3-column grid) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className={`rounded-3xl border overflow-hidden transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between ${isDark ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-white border-slate-200 shadow-md'}`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[0.6rem] font-black uppercase text-[#F05E23] border border-white/10">
                      {project.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-black uppercase tracking-tight">{project.title}</h4>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-[#F05E23] text-white hover:scale-110 transition-transform"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {project.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((s) => (
                        <span key={s} className="text-[0.6rem] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">{s}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Creative Interactive Mobile Browser Showcase */}
          <div className="block md:hidden space-y-3">
            {/* Horizontal Scrollable Brand Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {projects.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProjectIndex(idx)}
                  className={`px-3 py-1.5 rounded-full text-[0.6rem] font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 border ${
                    activeProjectIndex === idx
                      ? 'bg-[#F05E23] text-white border-[#F05E23] shadow-md shadow-[#F05E23]/30'
                      : isDark
                      ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeProjectIndex === idx ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
                  <span>{p.title}</span>
                </button>
              ))}
            </div>

            {/* Simulated Mobile Device Browser Frame */}
            <div className={`rounded-2xl border overflow-hidden relative shadow-2xl ${isDark ? 'bg-[#09090E] border-white/15' : 'bg-slate-900 border-slate-800 text-white'}`}>
              
              {/* Browser Simulated Top Bar */}
              <div className="px-3 py-2 bg-black/80 border-b border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-500/80" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                  <div className="w-2 h-2 rounded-full bg-green-500/80" />
                </div>

                {/* Simulated URL Bar */}
                <div className="flex-1 max-w-[200px] px-2 py-0.5 rounded-md bg-white/10 border border-white/5 flex items-center justify-center gap-1 text-[0.55rem] font-mono text-slate-300 truncate">
                  <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{projects[activeProjectIndex].url.replace('https://', '').replace('/', '')}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[0.5rem] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">LIVE</span>
                </div>
              </div>

              {/* Project Image & Animated Content Deck */}
              <AnimatePresence mode="wait">
                {(() => {
                  const project = projects[activeProjectIndex];
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.96, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: -10 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="flex flex-col"
                    >
                      {/* Project Screenshot Container with Floating Metric Pill */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        
                        {/* Category Badge - Top Left */}
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[0.55rem] font-black uppercase text-[#F05E23] border border-white/15">
                          {project.category}
                        </div>

                        {/* Floating Performance Metric Badge - Bottom Left */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-between gap-2 shadow-lg">
                          <div className="flex items-center gap-1.5 truncate">
                            <Sparkles className="w-3.5 h-3.5 text-[#F05E23] shrink-0" />
                            <span className="text-[0.6rem] font-mono font-extrabold text-white truncate">{project.metrics}</span>
                          </div>
                          <span className="text-[0.5rem] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">99+ Vitals</span>
                        </div>
                      </div>

                      {/* Project Details Footer Inside Phone */}
                      <div className="p-3.5 space-y-3 bg-[#0B0B10] border-t border-white/10 text-white">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-base font-black uppercase tracking-tight text-white">{project.title}</h4>
                            <span className="text-[0.6rem] font-mono text-slate-400 font-bold">{project.subtitle}</span>
                          </div>
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-3 rounded-xl bg-[#F05E23] text-white font-bold uppercase tracking-wider text-[0.6rem] flex items-center gap-1 shadow-md shadow-[#F05E23]/30 shrink-0 hover:scale-105 active:scale-95 transition-transform"
                          >
                            <span>Visit Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <p className="text-[0.65rem] leading-relaxed text-slate-300 line-clamp-2">
                          {project.desc}
                        </p>

                        {/* Tech Stack Badges */}
                        <div className="flex flex-wrap gap-1 pt-1 border-t border-white/10">
                          {project.stack.map((s) => (
                            <span key={s} className="text-[0.55rem] font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/10">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Bottom Floating Mobile Controls */}
            <div className="flex items-center justify-between px-1 pt-1">
              <button
                onClick={() => setActiveProjectIndex((prev) => (prev - 1 + projects.length) % projects.length)}
                aria-label="Previous Showcase Project"
                className={`p-2 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[0.6rem] font-mono font-bold text-slate-400">
                  PROJ <span className="text-[#F05E23] font-black">{String(activeProjectIndex + 1).padStart(2, '0')}</span> / {String(projects.length).padStart(2, '0')}
                </span>
              </div>

              <button
                onClick={() => setActiveProjectIndex((prev) => (prev + 1) % projects.length)}
                aria-label="Next Showcase Project"
                className={`p-2 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: TRUSTED BY INDUSTRY LEADERS */}
        {/* ========================================================================= */}
        <section className="space-y-3 sm:space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-3">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Elite Partnerships</span>
            <h2 className="text-xl sm:text-5xl font-black uppercase tracking-tight">Trusted by Industry Leaders</h2>
            <p className={`text-xs sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              High-growth brands and enterprises relying on Synchronous for web architecture.
            </p>
          </div>

          {/* Desktop View (3-column grid) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((c, idx) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className={`p-8 rounded-3xl border flex flex-col justify-between gap-6 transition-all hover:scale-[1.02] ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black uppercase tracking-tight">{c.name}</span>
                  <span className="text-[0.6rem] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                    {c.stat}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{c.category}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile Single Widget Circular Loop Carousel */}
          <div className="block md:hidden relative">
            <div className="relative overflow-hidden rounded-xl border">
              <AnimatePresence mode="wait">
                {(() => {
                  const c = clients[activeClientIndex];
                  return (
                    <motion.div
                      key={c.name}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`p-4 flex flex-col justify-between gap-3 min-h-[110px] ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black uppercase tracking-tight">{c.name}</span>
                        <span className="text-[0.55rem] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                          {c.stat}
                        </span>
                      </div>
                      <p className="text-[0.65rem] text-slate-400 font-bold uppercase tracking-wider">{c.category}</p>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Mobile Carousel Controls & Indicators */}
            <div className="flex items-center justify-between mt-2.5 px-1">
              <button
                onClick={() => setActiveClientIndex((prev) => (prev - 1 + clients.length) % clients.length)}
                aria-label="Previous Client"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {clients.map((c, idx) => (
                  <button
                    key={c.name}
                    onClick={() => setActiveClientIndex(idx)}
                    aria-label={`Go to ${c.name}`}
                    className={`h-1.5 rounded-full transition-all ${activeClientIndex === idx ? 'w-5 bg-[#F05E23]' : `w-1.5 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveClientIndex((prev) => (prev + 1) % clients.length)}
                aria-label="Next Client"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: WEB DEVELOPMENT FAQS */}
        {/* ========================================================================= */}
        <section className="space-y-4 sm:space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-1 sm:space-y-2">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Clear Answers</span>
            <h2 className="text-xl sm:text-4xl font-black uppercase tracking-tight">Web Development FAQs</h2>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3"
                  >
                    <span className="text-xs sm:text-base font-bold tracking-tight">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#F05E23]' : 'text-slate-400'}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: HIGH-CONVERTING CTA & DIRECT CONSULTATION */}
        {/* ========================================================================= */}
        <section className={`p-6 sm:p-16 rounded-2xl sm:rounded-[3rem] border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 ${isDark ? 'bg-gradient-to-r from-[#F05E23]/20 via-black to-black border-white/10' : 'bg-gradient-to-r from-[#F05E23]/10 to-slate-100 border-slate-200'}`}>
          <div className="space-y-2 sm:space-y-4 text-center md:text-left max-w-xl">
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight">Ready to Build Your Custom Platform?</h2>
            <p className={`text-xs sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Let's engineer a high-speed, aesthetically perfect web platform tailored for your brand.
            </p>
          </div>
          <a
            href="https://wa.me/919161391566?text=Hi!%20I'd%20like%20to%20discuss%20building%20a%20custom%20MERN/Next.js%20website."
            target="_blank"
            rel="noopener noreferrer"
            className="py-4 px-6 sm:py-6 sm:px-10 rounded-xl sm:rounded-2xl bg-[#F05E23] text-white font-black uppercase tracking-widest text-[0.7rem] sm:text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#F05E23]/30 shrink-0 text-center"
          >
            Start Project Discussion
          </a>
        </section>

      </div>
    </main>
  );
}

