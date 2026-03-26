"use client";

import Hero from "../components/Hero";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import AboutSection from "../components/AboutSection";
import Process from "../components/Process";
import WorkShowcase from "../components/WorkShowcase";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";

const capabilities = [
  {
    id: "01",
    title: "Brand Systems",
    description: "Identities that command authority and build equity that compounds over time.",
    tags: ["Visual Identity", "Brand Positioning", "Packaging", "Messaging"],
    href: "/services/brand-systems",
    accent: "#F05E23",
    image: "/services/brand-architecture.png",
  },
  {
    id: "02",
    title: "Digital Platforms",
    description: "Performance-obsessed platforms built to convert — from enterprise web to headless commerce.",
    tags: ["Web Platforms", "E-commerce", "SaaS Interfaces", "Web Apps"],
    href: "/services/digital-platforms",
    accent: "#F05E23",
    image: "/services/digital-ecosystems.png",
  },
  {
    id: "03",
    title: "Growth Engine",
    description: "Surgically targeted campaigns that compound attention into exponential, measurable ROI.",
    tags: ["Performance Ads", "SEO", "Content Strategy", "Analytics"],
    href: "/services/growth-engine",
    accent: "#F05E23",
    image: "/services/growth-engineering.png",
  },
  {
    id: "04",
    title: "AI Automation",
    description: "Custom AI agents and intelligent workflows deployed into your core operations.",
    tags: ["AI Chatbots", "Generative AI", "Automation", "Neural Search"],
    href: "/services/ai-automation",
    accent: "#F05E23",
    image: "/services/ai-automation.png",
  },
];

const Divider = () => (
  <div className="w-full flex justify-center">
    <div className="w-full h-px max-w-5xl opacity-20" style={{ background: 'linear-gradient(90deg, transparent, #F05E23, transparent)' }} />
  </div>
);

export default function Home() {
  return (
    <div className="flex flex-col items-center selection:bg-orange-500/20 overflow-hidden" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="w-full bg-white">
        <Hero />
      </div>

      <Divider />
      <AboutSection />

      <Divider />

      {/* ── Expertise / What We Do ────────────────────────────────── */}
      <section className="w-full relative py-20 lg:py-32 overflow-hidden border-t border-[rgba(0,0,0,0.05)]" style={{ backgroundColor: '#F9F9F9' }}>
        {/* Background Texture - Grid & Dots */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(#000 1.2px, transparent 1.2px)', backgroundSize: '32px 32px' }}></div>

        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] rounded-full -z-10 opacity-[0.1] pointer-events-none animate-ambient"
          style={{ background: 'radial-gradient(circle, #F05E23, transparent 70%)', filter: 'blur(150px)', transform: 'translate(40%, -40%)' }}
        />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">

          {/* Header row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 mb-20"
          >
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#111] rounded-full mb-10 shadow-xl shadow-orange-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-dot-pulse"></span>
                <span className="text-[0.65rem] font-bold text-white tracking-[0.4em] uppercase">Expertise</span>
              </div>
              <h2 className="text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] font-bold tracking-[-0.04em] text-[#111] leading-[0.95] lg:leading-[0.9]">
                Visualizing <em className="not-italic text-[#F05E23]">Solutions.</em>
              </h2>
            </div>

            <div className="flex flex-col gap-8 lg:mb-2 lg:items-end max-w-md">
              <p className="text-[1.1rem] text-slate-500 font-medium border-l-4 border-[#F05E23] pl-6 leading-relaxed">
                Cutting-edge strategies powered by AI, data, and world-class design logic.
              </p>
              <Link href="/services" className="group relative inline-flex items-center gap-4 text-[0.8rem] font-black uppercase tracking-[0.2em] text-[#111] hover:text-[#F05E23] transition-colors duration-400">
                Explore Full Directory
                <span className="w-10 h-10 rounded-xl bg-white border border-[rgba(0,0,0,0.06)] flex items-center justify-center group-hover:bg-[#111] group-hover:border-[#111] transition-all duration-400 shadow-sm">
                  <ArrowUpRight strokeWidth={3} className="w-4 h-4 group-hover:text-white transition-colors duration-400" />
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Grid Layout — Enhanced Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                <Link
                  href={cap.href}
                  className="block h-full bg-white rounded-[2rem] p-8 lg:p-12 border border-[rgba(0,0,0,0.05)] hover:shadow-[0_40px_100px_-20px_rgba(240,94,35,0.12)] transition-all duration-700 ease-[0.16, 1, 0.3, 1] overflow-hidden group"
                >
                  <div className="flex flex-col h-full">
                    {/* Visual Container */}
                    <div className="relative mb-10 overflow-hidden rounded-3xl aspect-[16/9] bg-slate-100">
                      <img 
                        src={cap.image} 
                        alt={cap.title}
                        className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      
                      {/* ID tag inside visual */}
                      <span className="absolute top-6 left-6 text-[0.7rem] font-black tracking-[0.3em] px-4 py-2 bg-white/90 backdrop-blur-md rounded-lg text-[#111] border border-white/50">
                        {cap.id}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <h3 className="text-[2rem] lg:text-[2.5rem] font-bold text-[#111] tracking-[-0.03em] leading-tight mb-4 group-hover:text-[#F05E23] transition-colors duration-500">
                        {cap.title}.
                      </h3>
                      
                      <p className="text-[1.05rem] text-slate-500 font-normal leading-relaxed mb-10 group-hover:text-slate-700 transition-colors">
                        {cap.description}
                      </p>

                      <div className="flex flex-wrap gap-2.5 mt-auto">
                        {cap.tags.map((tag, idx) => (
                          <span key={idx} className="text-[0.65rem] font-bold px-4 py-2 rounded-xl bg-[#F8F8F8] border border-[rgba(0,0,0,0.04)] text-slate-400 group-hover:bg-[#F05E23]/5 group-hover:text-[#F05E23] group-hover:border-[#F05E23]/20 transition-all duration-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dramatic Hover Reveal */}
                  <div className="absolute top-8 right-8 w-14 h-14 rounded-full bg-[#111] flex items-center justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[0.16, 1, 0.3, 1]">
                    <ArrowUpRight className="w-6 h-6 text-white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
      {/* ── End What We Do ────────────────────────────────────────── */}

      <Divider />
      <Process />

      <WorkShowcase />

      <Divider />
      <WhyChooseUs dark={false} />

      <Divider />
      <Testimonials />



    </div>
  );
}
