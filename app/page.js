"use client";

import Hero from "../components/Hero";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import AccordionServices from "../components/AccordionServices";
import Process from "../components/Process";
import WorkShowcase from "../components/WorkShowcase";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import { useTheme } from "../components/ThemeContext";

// Enhanced Soft Divider for seamless transitions
const SoftDivider = () => {
  const { isDark } = useTheme();
  return (
    <div className="w-full h-32 sm:h-48 pointer-events-none relative z-0 overflow-hidden">
      <div className={`absolute inset-0 transition-all duration-500 ${isDark ? 'bg-gradient-to-b from-[#0A0A0A] to-[#111]' : 'bg-gradient-to-b from-white to-[#F9F9F9]'}`} />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.15 }}
        viewport={{ once: true }}
        className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#F05E23] to-transparent"
      />
    </div>
  );
};

export default function Home() {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-col items-center selection:bg-orange-500/20 overflow-hidden transition-colors duration-500" style={{ backgroundColor: isDark ? '#0A0A0A' : '#F9F9F9' }}>

      {/* Hero Section with Seamless Transition */}
      <section className={`w-full pt-8 pb-0 relative overflow-visible transition-colors duration-500 ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#F9F9F9]'}`}>
        <Hero />
      </section>

      {/* Accordion Services Section */}
      <AccordionServices />

      {/* Process Section - Seamless Connection */}
      <motion.section
        className={`w-full relative z-10 transition-colors duration-500 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}
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
      <WhyChooseUs dark={isDark} />

      {/* Testimonials */}
      <motion.section
        className={`w-full relative py-0 transition-colors duration-500 ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#F9F9F9]'}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Testimonials />
      </motion.section>

    </div>
  );
}
