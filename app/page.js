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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "image": "https://synchronousbuilddigital.com/logo.png",
    "@id": "https://synchronousbuilddigital.com",
    "url": "https://synchronousbuilddigital.com",
    "name": "Synchronous Build Digital",
    "telephone": "+919161391566",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Remote First",
      "addressLocality": "Lucknow",
      "addressRegion": "UP",
      "postalCode": "226001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.8467,
      "longitude": 80.9462
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://www.linkedin.com/in/devam-srivastava/",
      "https://www.instagram.com/synchronous.build.digital/"
    ],
    "description": "High-velocity growth architecture for modern brands. Specialized in AI automation, surgical UX, and performance marketing."
  };

  return (
    <div className="flex flex-col items-center selection:bg-orange-500/20 overflow-hidden transition-colors duration-500" style={{ backgroundColor: isDark ? '#0A0A0A' : '#F9F9F9' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
