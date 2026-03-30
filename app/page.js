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

// Enhanced Soft Divider for seamless transitions
const SoftDivider = () => (
  <div className="w-full h-32 sm:h-48 pointer-events-none relative z-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-white to-[#F9F9F9] opacity-100" />
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.15 }}
      viewport={{ once: true }}
      className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#F05E23] to-transparent"
    />
  </div>
);

export default function Home() {
  return (
    <div className="flex flex-col items-center selection:bg-orange-500/20 overflow-hidden" style={{ backgroundColor: '#F9F9F9' }}>

      {/* Hero Section with Seamless Transition */}
      <section className="w-full relative bg-[#F9F9F9] overflow-visible">
        <Hero />
      </section>

      {/* About Section - Seamless Staggered Entrance */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative z-10"
      >
        <AboutSection />
      </motion.section>

      {/* Process Section - Seamless Connection */}
      <motion.section
        className="w-full relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <Process />
      </motion.section>

      {/* Work Showcase Section */}
      <WorkShowcase />
      
      {/* Seamless Transition to Why Choose Us */}
      <WhyChooseUs dark={false} />

      {/* Testimonials */}
      <motion.section
        className="w-full relative bg-[#F9F9F9] py-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Testimonials />
      </motion.section>

    </div>
  );
}
