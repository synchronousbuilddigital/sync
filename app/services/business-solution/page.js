"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Bot, 
  Database, 
  Lock, 
  Zap, 
  ArrowUpRight, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  ShieldCheck,
  FileCheck,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  Award,
  Layers,
  ArrowRight,
  Workflow,
  Cpu,
  FileSpreadsheet,
  Check,
  Sliders,
  Terminal,
  Server,
  Play,
  RefreshCw,
  Activity,
  AlertTriangle,
  Send,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "../../../components/ThemeContext";
import { useChat } from "../../../components/ChatContext";

// Neural Automation Pipeline Nodes Data
const pipelineNodes = [
  {
    id: "ingestion",
    step: "01",
    title: "Omnichannel Data Ingestion",
    subtitle: "Real-time Multi-Source Webhooks",
    icon: Workflow,
    color: "#3B82F6",
    badge: "12ms Latency",
    desc: "Captures instant triggers from Razorpay/Stripe, WhatsApp incoming messages, Shopify/Amazon webhooks, and legacy POS databases.",
    payloadSample: {
      event: "PAYMENT_COMPLETED",
      source: "Razorpay_Webhook",
      amount: "₹14,999.00",
      customer: "Enterprise Client #409",
      timestamp: "10:42:01.044"
    },
    demoLog: "⚡ [INGESTION] Received webhook payload #PAY-9921 from Razorpay. Verified HMAC signature."
  },
  {
    id: "ai-brain",
    step: "02",
    title: "Autonomous AI Logic Core",
    subtitle: "LLM Document & Intent Parsing",
    icon: Bot,
    color: "#F05E23",
    badge: "LLM Agent v4",
    desc: "Autonomous AI agents parse PDF invoices, extract GST numbers, score lead intent, and auto-route tasks to specialized department channels.",
    payloadSample: {
      ai_agent: "GST_Parser_Bot",
      confidence: "99.8%",
      extractedGST: "07AAAAA0000A1Z5",
      decision: "GENERATE_OFFICIAL_INVOICE",
      status: "APPROVED"
    },
    demoLog: "🤖 [AI AGENT] Extracted GST identity & parsed line items. Generated Tax Invoice draft in 0.4s."
  },
  {
    id: "erp-db",
    step: "03",
    title: "Central ERP & Database Ledger",
    subtitle: "Bidirectional Realtime Sync",
    icon: Building2,
    color: "#10B981",
    badge: "MongoDB + Sheets",
    desc: "Locks inventory across all warehouses, registers staff task SLAs, updates central MongoDB ledger, and pushes live updates to Google Sheets.",
    payloadSample: {
      database: "MongoDB_Atlas",
      syncEngine: "Google_Sheets_Bridge",
      inventoryUpdated: "-1 Unit (Hub Alpha)",
      staffSLAAssigned: "Operations Lead B",
      lockStatus: "SECURE"
    },
    demoLog: "📦 [ERP CORE] Updated MongoDB stock ledger. Pushed bidirectional row update to Google Sheets."
  },
  {
    id: "dispatch",
    step: "04",
    title: "Instant Action & Alerts Dispatch",
    subtitle: "Autonomous WhatsApp & PDF Generation",
    icon: Zap,
    color: "#8B5CF6",
    badge: "WhatsApp API",
    desc: "Delivers instant PDF invoices via WhatsApp, alerts field technicians, triggers fulfillment webhooks, and posts daily executive briefs.",
    payloadSample: {
      action: "WHATSAPP_PDF_DISPATCH",
      recipient: "+91 9161391566",
      status: "DELIVERED_READ",
      warehouseAlertSent: true,
      timeElapsed: "1.2s Total"
    },
    demoLog: "🚀 [DISPATCH] PDF Invoice dispatched to client WhatsApp. Warehouse dispatch signal queued!"
  }
];

// Interactive Modular System Modules
const systemModules = [
  { id: "erp-hq", category: "ERP & CRM", name: "Custom ERP Command HQ", estDays: 4, desc: "Staff attendance, task delegation, stock tracking & SLA alerts." },
  { id: "ai-support", category: "AI Agents", name: "24/7 AI WhatsApp Support Bot", estDays: 2, desc: "Autonomous order status, catalog queries & instant FAQ resolution." },
  { id: "sheets-sync", category: "Finance & Sync", name: "Google Sheets & DB 2-Way Sync", estDays: 1, desc: "Real-time zero-delay sync between MongoDB & Google Sheets." },
  { id: "gst-invoicing", category: "Finance & Sync", name: "Automated GST Invoicing Engine", estDays: 2, desc: "Instant B2B/B2C PDF tax invoices post-payment execution." },
  { id: "razorpay-webhooks", category: "Finance & Sync", name: "Razorpay & Stripe Webhook Hub", estDays: 1, desc: "Auto payout reconciliation & transaction audit logging." },
  { id: "warehouse-sync", category: "ERP & CRM", name: "Multi-Warehouse Stock Rebalancer", estDays: 3, desc: "Overselling protection across Amazon, Flipkart, & D2C." },
  { id: "crm-portal", category: "ERP & CRM", name: "Client Self-Service Portal", estDays: 3, desc: "Branded client portal for order tracking, invoices, & support tickets." },
  { id: "ai-lead-scoring", category: "AI Agents", name: "AI Lead Qualification Engine", estDays: 2, desc: "Auto-qualifies incoming web leads and schedules calendar appointments." }
];

export default function BusinessSolutionPage() {
  const { isDark } = useTheme();
  const { sendMessage } = useChat();

  const [activeNode, setActiveNode] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([
    "⚙️ [SYSTEM INIT] Enterprise Solution Engine online v4.2...",
    "READY: Listening for incoming webhooks & event streams."
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedModules, setSelectedModules] = useState(["erp-hq", "ai-support", "sheets-sync", "gst-invoicing"]);

  // Auto-loop for Mobile Pipeline Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % pipelineNodes.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const triggerDemoStream = (nodeIndex) => {
    setActiveNode(nodeIndex);
    const targetNode = pipelineNodes[nodeIndex];
    const newLog = `${new Date().toLocaleTimeString()} - ${targetNode.demoLog}`;
    setTerminalLogs((prev) => [newLog, ...prev.slice(0, 4)]);
  };

  const toggleModule = (id) => {
    if (selectedModules.includes(id)) {
      if (selectedModules.length > 1) {
        setSelectedModules(selectedModules.filter((m) => m !== id));
      }
    } else {
      setSelectedModules([...selectedModules, id]);
    }
  };

  const totalBuildDays = selectedModules.reduce((acc, currId) => {
    const mod = systemModules.find((m) => m.id === currId);
    return acc + (mod ? mod.estDays : 0);
  }, 2);

  const selectedNames = selectedModules
    .map((id) => systemModules.find((m) => m.id === id)?.name)
    .filter(Boolean);

  const filteredModules = selectedCategory === "All"
    ? systemModules
    : systemModules.filter((m) => m.category === selectedCategory);

  const currentNode = pipelineNodes[activeNode];

  return (
    <main className={`min-h-screen pt-4 sm:pt-20 pb-6 sm:pb-10 px-3 sm:px-6 overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#05050A] text-white' : 'bg-[#FAFAFC] text-[#111]'}`}>
      
      {/* Dynamic Background Mesh Grids & Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute top-10 right-[-5%] w-[650px] h-[650px] rounded-full blur-[150px] transition-opacity duration-700 ${isDark ? 'bg-[#F05E23]/15' : 'bg-[#F05E23]/10'}`} />
        <div className={`absolute top-[45%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[160px] transition-opacity duration-700 ${isDark ? 'bg-blue-600/10' : 'bg-blue-500/5'}`} />
        <div className={`absolute bottom-10 right-[10%] w-[500px] h-[500px] rounded-full blur-[140px] transition-opacity duration-700 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'}`} />
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]" 
          style={{ backgroundImage: `radial-gradient(${isDark ? '#FFF' : '#000'} 1.2px, transparent 1.2px)`, backgroundSize: '48px 48px' }} 
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6 sm:space-y-16">
        
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="flex flex-col gap-6 sm:gap-10 pt-2 sm:pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-center">
            
            <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`inline-flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 sm:px-5 sm:py-2.5 border rounded-full w-fit shadow-md backdrop-blur-xl ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              >
                <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F05E23] animate-pulse" />
                <span className="text-[0.6rem] sm:text-xs font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#F05E23]">
                  ENTERPRISE INFRASTRUCTURE & AI OS
                </span>
              </motion.div>

              <div className="space-y-2 sm:space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="text-3xl sm:text-6xl md:text-7xl font-black tracking-tight sm:tracking-tighter leading-[1.02] sm:leading-[0.93] uppercase"
                >
                  BUSINESS <span className="text-[#F05E23] drop-shadow-[0_10px_30px_rgba(240,94,35,0.3)]">SOLUTION</span> <br />
                  & PROCESS AUTOMATION.
                </motion.h1>

                <p className={`text-xs sm:text-xl font-light leading-relaxed max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Streamline operations with custom ERPs, CRMs, autonomous AI workflows, and zero-latency data synchronization engineered specifically for growing enterprises.
                </p>
              </div>

              {/* High-Impact Stat Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg pt-1">
                <div className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border flex flex-col justify-between backdrop-blur-md ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-base sm:text-2xl font-black text-[#F05E23]">100%</span>
                  <span className="text-[0.5rem] sm:text-[0.6rem] font-extrabold uppercase tracking-wider text-slate-400">Zero Error Rate</span>
                </div>
                <div className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border flex flex-col justify-between backdrop-blur-md ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-base sm:text-2xl font-black text-cyan-400">&lt;15ms</span>
                  <span className="text-[0.5rem] sm:text-[0.6rem] font-extrabold uppercase tracking-wider text-slate-400">Sync Speed</span>
                </div>
                <div className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border flex flex-col justify-between backdrop-blur-md ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-base sm:text-2xl font-black text-emerald-400">24/7</span>
                  <span className="text-[0.5rem] sm:text-[0.6rem] font-extrabold uppercase tracking-wider text-slate-400">Autonomous AI</span>
                </div>
              </div>

              {/* Call-To-Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 pt-1 sm:pt-2">
                <a
                  href="https://wa.me/919161391566?text=Hi!%20I'd%20like%20to%20discuss%20a%20Custom%20Business%20Solution%20/%20ERP%20system."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 sm:py-5 px-5 sm:px-8 rounded-xl sm:rounded-2xl bg-[#F05E23] text-white font-bold uppercase tracking-widest text-[0.7rem] sm:text-xs flex items-center justify-between sm:justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#F05E23]/30 group"
                >
                  <span>Deploy Business Solution</span>
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>

                <button
                  onClick={() => sendMessage("How can custom ERP, AI autonomous agents, and automated workflows optimize my enterprise operations?")}
                  className={`py-3.5 sm:py-5 px-5 sm:px-8 rounded-xl sm:rounded-2xl border font-bold uppercase tracking-widest text-[0.7rem] sm:text-xs flex items-center justify-between sm:justify-center gap-3 transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900 shadow-sm'}`}
                >
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F05E23]" />
                  <span>Ask AI Solutions Lead</span>
                </button>
              </div>
            </div>

            {/* Right Column: Live Terminal Event Inspector Dashboard */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl sm:rounded-[2.5rem] border overflow-hidden shadow-2xl bg-[#09090D] border-white/15 backdrop-blur-2xl p-4 sm:p-6 space-y-3 sm:space-y-5">
                
                {/* Terminal Header */}
                <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-[#F05E23]" />
                    <span className="text-[0.6rem] sm:text-xs font-mono font-bold uppercase text-white tracking-wider">REALTIME EVENT ENGINE</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[0.55rem] sm:text-[0.6rem] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    LIVE ENGINE
                  </div>
                </div>

                {/* Console Log Stream */}
                <div className="bg-black/90 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 font-mono text-[0.65rem] sm:text-[0.7rem] space-y-1.5 text-slate-300 min-h-[130px] sm:min-h-[160px] overflow-y-auto">
                  {terminalLogs.map((log, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="leading-relaxed border-l-2 border-[#F05E23] pl-2 py-0.5"
                    >
                      {log}
                    </motion.div>
                  ))}
                </div>

                {/* Live Trigger Action Buttons */}
                <div className="space-y-1.5">
                  <span className="text-[0.55rem] sm:text-[0.6rem] font-mono font-bold text-slate-400 uppercase tracking-widest block">Simulate Triggers:</span>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <button
                      onClick={() => triggerDemoStream(0)}
                      className="py-2 px-2.5 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-[0.6rem] font-mono text-white flex items-center justify-between transition-all"
                    >
                      <span>1. Ingest</span>
                      <Play className="w-3 h-3 text-blue-400" />
                    </button>
                    <button
                      onClick={() => triggerDemoStream(1)}
                      className="py-2 px-2.5 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-[0.6rem] font-mono text-white flex items-center justify-between transition-all"
                    >
                      <span>2. AI Parse</span>
                      <Bot className="w-3 h-3 text-[#F05E23]" />
                    </button>
                    <button
                      onClick={() => triggerDemoStream(2)}
                      className="py-2 px-2.5 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-[0.6rem] font-mono text-white flex items-center justify-between transition-all"
                    >
                      <span>3. Ledger</span>
                      <Database className="w-3 h-3 text-emerald-400" />
                    </button>
                    <button
                      onClick={() => triggerDemoStream(3)}
                      className="py-2 px-2.5 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-[0.6rem] font-mono text-white flex items-center justify-between transition-all"
                    >
                      <span>4. Dispatch</span>
                      <Zap className="w-3 h-3 text-purple-400" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE NEURAL AUTOMATION CANVAS */}
        {/* ========================================================================= */}
        <section className="space-y-3 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
            <div>
              <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Visual Neural Canvas</span>
              <h2 className="text-xl sm:text-5xl font-black uppercase tracking-tight mt-1">Interactive Automation Pipeline</h2>
            </div>
            <span className={`text-[0.65rem] sm:text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border w-fit ${isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
              ⚡ Select node to inspect payload architecture
            </span>
          </div>

          {/* Desktop Grid (4-column grid) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pipelineNodes.map((node, idx) => {
              const Icon = node.icon;
              const isActive = activeNode === idx;
              return (
                <button
                  key={node.id}
                  onClick={() => triggerDemoStream(idx)}
                  className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden flex flex-col justify-between gap-6 ${isActive 
                    ? 'bg-[#F05E23] text-white border-[#F05E23] shadow-xl shadow-[#F05E23]/30 scale-[1.02]' 
                    : (isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm')}`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl ${isActive ? 'bg-white/20 text-white' : 'bg-[#F05E23]/10 text-[#F05E23]'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[0.65rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#F05E23]/10 text-[#F05E23]'}`}>
                      {node.badge}
                    </span>
                  </div>

                  <div>
                    <span className={`text-[0.6rem] font-extrabold uppercase tracking-wider block ${isActive ? 'text-white/80' : 'text-slate-400'}`}>Node {node.step}</span>
                    <h3 className="text-base font-black uppercase tracking-tight mt-0.5">{node.title}</h3>
                  </div>

                  <div className="flex items-center justify-between text-[0.65rem] font-bold border-t border-black/5 dark:border-white/10 pt-3">
                    <span className={isActive ? 'text-white/90' : 'text-[#F05E23]'}>{isActive ? 'Node Active' : 'Inspect Node Payload'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile 1-Widget Circular Loop Carousel */}
          <div className="block md:hidden relative">
            <div className="relative overflow-hidden rounded-2xl border-2">
              <AnimatePresence mode="wait">
                {(() => {
                  const node = pipelineNodes[activeNode];
                  const Icon = node.icon;
                  return (
                    <motion.button
                      key={node.id}
                      onClick={() => triggerDemoStream(activeNode)}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`p-4 rounded-2xl border text-left w-full space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-xl bg-[#F05E23]/10 text-[#F05E23]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[0.55rem] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F05E23]/10 text-[#F05E23] border border-[#F05E23]/20">
                          {node.badge}
                        </span>
                      </div>

                      <div>
                        <span className="text-[0.55rem] font-extrabold uppercase tracking-wider text-[#F05E23] block">Node {node.step}</span>
                        <h3 className="text-base font-black uppercase tracking-tight">{node.title}</h3>
                        <p className={`text-[0.65rem] leading-relaxed mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{node.desc}</p>
                      </div>
                    </motion.button>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Mobile Carousel Controls */}
            <div className="flex items-center justify-between mt-2.5 px-1">
              <button
                onClick={() => setActiveNode((prev) => (prev - 1 + pipelineNodes.length) % pipelineNodes.length)}
                aria-label="Previous Pipeline Node"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {pipelineNodes.map((n, idx) => (
                  <button
                    key={n.id}
                    onClick={() => setActiveNode(idx)}
                    aria-label={`Go to node ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all ${activeNode === idx ? 'w-5 bg-[#F05E23]' : `w-1.5 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveNode((prev) => (prev + 1) % pipelineNodes.length)}
                aria-label="Next Pipeline Node"
                className={`p-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Node Live Payload Inspector */}
          <div className={`p-4 sm:p-12 rounded-2xl sm:rounded-[2.5rem] border transition-all ${isDark ? 'bg-gradient-to-br from-[#0D0D14] via-[#08080C] to-black border-white/10' : 'bg-gradient-to-br from-slate-900 via-slate-900 to-black text-white border-slate-800 shadow-xl'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              
              <div className="lg:col-span-6 space-y-3 sm:space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F05E23]/20 text-[#F05E23] text-[0.6rem] sm:text-xs font-bold uppercase tracking-wider border border-[#F05E23]/30">
                  <Terminal className="w-3.5 h-3.5 shrink-0" /> Node {currentNode.step}: {currentNode.title}
                </div>
                
                <h3 className="text-lg sm:text-4xl font-black uppercase tracking-tight text-white">{currentNode.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{currentNode.desc}</p>
                
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[0.55rem] sm:text-[0.6rem] font-bold text-[#F05E23] uppercase tracking-widest block">System Event Log Output:</span>
                  <p className="text-[0.65rem] sm:text-xs text-white font-mono font-semibold">{currentNode.demoLog}</p>
                </div>
              </div>

              {/* JSON Live Payload Terminal */}
              <div className="lg:col-span-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-black/90 border border-white/10 font-mono text-xs text-emerald-400 space-y-2 sm:space-y-3 shadow-inner">
                <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-white/10 text-[0.6rem] sm:text-[0.65rem] text-slate-400">
                  <span>ACTIVE PAYLOAD STRUCTURE</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    200 OK
                  </span>
                </div>
                <pre className="text-[0.65rem] sm:text-[0.7rem] text-cyan-300 overflow-x-auto leading-relaxed max-h-40">
                  <code>{JSON.stringify(currentNode.payloadSample, null, 2)}</code>
                </pre>
                <div className="text-[0.55rem] sm:text-[0.6rem] text-slate-400 pt-2 border-t border-white/10 flex justify-between">
                  <span>Protocol: HTTPS / Webhook</span>
                  <span>Encryption: AES-256</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MODULAR ENTERPRISE SYSTEM STACK BUILDER */}
        {/* ========================================================================= */}
        <section className={`p-3.5 sm:p-12 rounded-2xl sm:rounded-[2.5rem] border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl'}`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-6 mb-4 sm:mb-8">
            <div>
              <span className="text-[0.6rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Stack Configurator</span>
              <h2 className="text-lg sm:text-4xl font-black uppercase tracking-tight mt-0.5 sm:mt-1">Configure Your Enterprise Stack</h2>
            </div>
            
            {/* Category Filter Pills (Horizontal Scrollable Strip) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full lg:w-auto no-scrollbar">
              {["All", "ERP & CRM", "AI Agents", "Finance & Sync"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 sm:px-4 sm:py-2 rounded-full text-[0.55rem] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 border ${selectedCategory === cat 
                    ? 'bg-[#F05E23] text-white border-[#F05E23] shadow-md' 
                    : (isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700')}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-10">
            
            {/* Module Selection 2-Column Mobile Micro-Cards Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3.5">
              {filteredModules.map((mod) => {
                const isSelected = selectedModules.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    onClick={() => toggleModule(mod.id)}
                    className={`p-2.5 sm:p-5 rounded-xl sm:rounded-2xl border cursor-pointer text-left transition-all flex flex-col justify-between gap-1.5 sm:gap-3 ${isSelected 
                      ? 'bg-[#F05E23]/10 border-[#F05E23] ring-2 ring-[#F05E23]/30 shadow-md' 
                      : (isDark ? 'bg-black/30 border-white/10 hover:border-white/20' : 'bg-slate-50 border-slate-200 hover:bg-slate-100')}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[0.5rem] sm:text-[0.6rem] font-extrabold text-[#F05E23] uppercase tracking-wider truncate max-w-[80%]">{mod.category}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all ${isSelected ? 'bg-[#F05E23] text-white' : 'border border-slate-500/50'}`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[0.65rem] sm:text-xs font-black uppercase tracking-wide leading-tight line-clamp-2">{mod.name}</h4>
                      <p className={`text-[0.55rem] sm:text-[0.65rem] mt-1 line-clamp-2 hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{mod.desc}</p>
                    </div>

                    <div className="pt-1 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                      <span className="text-[0.5rem] sm:text-[0.6rem] font-mono font-bold uppercase text-[#F05E23]">+{mod.estDays} Days Build</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Stack Summary Card */}
            <div className={`lg:col-span-5 p-4 sm:p-8 rounded-xl sm:rounded-3xl border flex flex-col justify-between gap-4 sm:gap-6 ${isDark ? 'bg-gradient-to-br from-[#12121A] to-[#0A0A0A] border-white/10' : 'bg-gradient-to-br from-slate-100 to-white border-slate-200'}`}>
              <div>
                <div className="flex items-center justify-between pb-2.5 sm:pb-4 border-b border-black/5 dark:border-white/10">
                  <span className="text-[0.6rem] sm:text-xs font-black uppercase tracking-widest text-[#F05E23]">System Blueprint</span>
                  <span className="text-[0.55rem] sm:text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F05E23]/10 text-[#F05E23]">
                    {selectedModules.length} Active
                  </span>
                </div>

                <div className="space-y-2 sm:space-y-3 my-3 sm:my-6">
                  <div className="text-xl sm:text-3xl font-black text-[#F05E23] tracking-tight">{totalBuildDays} Business Days</div>
                  <span className="text-[0.55rem] sm:text-xs text-slate-400 font-bold uppercase tracking-wider block">Estimated Turnaround Time</span>

                  <div className="space-y-1 pt-2 sm:pt-4 border-t border-black/5 dark:border-white/10">
                    <span className="text-[0.55rem] sm:text-[0.65rem] font-black uppercase tracking-widest text-slate-400 block">Selected Components:</span>
                    {selectedNames.map((name) => (
                      <div key={name} className="flex items-center gap-1.5 text-[0.65rem] sm:text-xs font-bold text-slate-700 dark:text-slate-200">
                        <CheckCircle2 className="w-3 h-3 text-[#F05E23] shrink-0" />
                        <span className="truncate">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/919161391566?text=Hi!%20I'd%20like%20to%20build%20a%20custom%20system%20with%20these%20modules:%20${encodeURIComponent(selectedNames.join(', '))}.%20Estimated%20build%20time:%20${totalBuildDays}%20days.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-[#F05E23] text-white font-bold uppercase tracking-widest text-[0.65rem] sm:text-xs flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F05E23]/30 text-center"
              >
                <span>Deploy Architecture Stack</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* HIGH IMPACT DIRECT CONSULTATION & CTA */}
        {/* ========================================================================= */}
        <section className={`p-6 sm:p-16 rounded-2xl sm:rounded-[3rem] border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 ${isDark ? 'bg-gradient-to-r from-[#F05E23]/20 via-black to-black border-white/10' : 'bg-gradient-to-r from-[#F05E23]/10 to-slate-100 border-slate-200'}`}>
          <div className="space-y-2 sm:space-y-4 text-center md:text-left max-w-xl">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#F05E23]">Enterprise Systems Team</span>
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight">Need a Custom Enterprise Solution?</h2>
            <p className={`text-xs sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Eliminate manual tasks, centralize team workflows, and deploy autonomous AI agents across your business stack.
            </p>
          </div>
          <a
            href="https://wa.me/919161391566?text=Hi!%20I'd%20like%20to%20consult%20with%20the%20Infrastructure%20Team%20for%20a%20Custom%20Business%20Solution."
            target="_blank"
            rel="noopener noreferrer"
            className="py-4 px-6 sm:py-6 sm:px-10 rounded-xl sm:rounded-2xl bg-[#F05E23] text-white font-black uppercase tracking-widest text-[0.7rem] sm:text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#F05E23]/30 shrink-0 text-center"
          >
            Consult Infrastructure Team
          </a>
        </section>

      </div>
    </main>
  );
}

