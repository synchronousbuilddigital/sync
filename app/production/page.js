"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "../../components/AuthContext";
import { useTheme } from "../../components/ThemeContext";
import { Play, ArrowRight, Video, Layers, Users } from "lucide-react";

export default function ProductionPage() {
  const { isDark } = useTheme();
  const { productionItems = [], partnerLogos = [], productionCategories = [] } = useAuth();

  const repeatedLogos = partnerLogos.length > 0
    ? [...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos]
    : [];

  const categories = productionCategories.map(cat => {
    const count = productionItems.filter(item => item.category.toLowerCase() === cat.name.toLowerCase()).length;
    return {
      name: cat.name,
      count,
      thumbnail: cat.image
    };
  });

  return (
    <main className={`min-h-screen selection:bg-[#F05E23]/20 overflow-x-hidden transition-colors duration-700 ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#FDFDFD]'}`}>
      {/* Minimalist Grid Pattern */}
      <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.03]'}`}
           style={{ backgroundImage: `radial-gradient(${isDark ? '#FFF' : '#000'} 1.2px, transparent 1.2px)`, backgroundSize: '48px 48px' }}></div>

      {/* Hero Header */}
      <header className="relative w-full pt-32 pb-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-start relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`inline-flex items-center gap-3 px-5 py-2.5 border rounded-full mb-10 shadow-sm transition-colors duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}
          >
            <span className="w-2 h-2 rounded-full bg-[#F05E23] animate-pulse"></span>
            <span className={`text-[0.7rem] font-bold tracking-[0.45em] uppercase border-none ${isDark ? 'text-[#F05E23]/80' : 'text-[#F05E23]'}`}>Our Creations</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 w-full">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className={`text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold tracking-[-0.05em] leading-[0.85] transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}
            >
              Masterful Craft. <br />
              <span className="text-[#F05E23]">Vision Engineered.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`max-w-xs border-l-2 border-[#F05E23] pl-8 pb-4 font-medium leading-relaxed italic transition-colors duration-500 ${isDark ? 'text-white/40' : 'text-slate-500'}`}
            >
              Capturing high-authority visual narratives to drive brand alignment and massive audience conversions.
            </motion.div>
          </div>
        </div>

        <div className={`absolute top-[20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[150px] -z-10 transition-colors duration-700 ${isDark ? 'bg-[#F05E23]/10' : 'bg-[#F05E23]/5'}`} />
      </header>

      {/* Infinite Logo Marquee Section */}
      <section className="w-full relative z-10 py-8 mb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center gap-3">
          <Users className="w-4 h-4 text-[#F05E23]" />
          <span className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-[#F05E23]">Brands Who Trust Synchronous</span>
        </div>

        <div className={`relative w-full overflow-hidden border-y transition-colors duration-500 ${isDark ? 'border-white/10 bg-white/3' : 'border-black/5 bg-slate-50'} py-12`}>
          <div className="flex w-max gap-8 items-center animate-marquee whitespace-nowrap">
            {/* First copy */}
            <div className="flex shrink-0 items-center gap-8">
              {repeatedLogos.length > 0 ? (
                repeatedLogos.map((logo, idx) => (
                  <div key={`logo-1-${logo._id}-${idx}`} className="flex flex-col items-center justify-center h-14 max-w-[120px] px-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo.logoUrl} alt={logo.name} className="h-full object-contain hover:scale-105 transition-all duration-300 pointer-events-none" />
                  </div>
                ))
              ) : (
                // Fallbacks if database is empty
                ["Google", "Nike", "Apple", "Mercedes", "Microsoft", "Intel", "Google", "Nike", "Apple", "Mercedes", "Microsoft", "Intel"].map((name, idx) => (
                  <span key={`fallback-1-${idx}`} className="text-xl sm:text-2xl font-black uppercase tracking-widest text-slate-300 dark:text-white/20 italic">{name}</span>
                ))
              )}
            </div>
            {/* Second copy */}
            <div className="flex shrink-0 items-center gap-8">
              {repeatedLogos.length > 0 ? (
                repeatedLogos.map((logo, idx) => (
                  <div key={`logo-2-${logo._id}-${idx}`} className="flex flex-col items-center justify-center h-14 max-w-[120px] px-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo.logoUrl} alt={logo.name} className="h-full object-contain hover:scale-105 transition-all duration-300 pointer-events-none" />
                  </div>
                ))
              ) : (
                // Fallbacks if database is empty
                ["Google", "Nike", "Apple", "Mercedes", "Microsoft", "Intel", "Google", "Nike", "Apple", "Mercedes", "Microsoft", "Intel"].map((name, idx) => (
                  <span key={`fallback-2-${idx}`} className="text-xl sm:text-2xl font-black uppercase tracking-widest text-slate-300 dark:text-white/20 italic">{name}</span>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Production Categories Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <Layers className="w-5 h-5 text-[#F05E23]" />
          <h2 className="text-2xl font-black uppercase tracking-widest italic">Operational <span className="text-[#F05E23]">Categories</span></h2>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className={`group rounded-[2.5rem] border overflow-hidden transition-all duration-500 flex flex-col justify-between ${
                  isDark ? 'bg-white/5 border-white/5 hover:border-[#F05E23]/30 hover:bg-white/10' : 'bg-white border-slate-100 hover:border-[#F05E23]/30 hover:shadow-2xl hover:shadow-[#F05E23]/5'
                }`}
              >
                <div className="relative h-60 w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                  {cat.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cat.thumbnail} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F05E23]/20 to-[#FF8C61]/20 flex items-center justify-center">
                      <Video className="w-16 h-16 text-[#F05E23]/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <span className="absolute bottom-6 left-6 text-[0.6rem] font-black uppercase tracking-widest text-[#F05E23] bg-[#F05E23]/10 border border-[#F05E23]/20 px-3 py-1 rounded-full">{cat.count} {cat.count === 1 ? 'Reel' : 'Reels'}</span>
                </div>

                <div className="p-8 flex flex-col justify-between flex-1">
                  <div className="space-y-3 mb-8">
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white group-hover:text-[#F05E23] transition-colors">{cat.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-white/40 leading-relaxed font-bold uppercase tracking-wider">
                      Explore our premium visuals for {cat.name.toLowerCase()} campaigns.
                    </p>
                  </div>

                  <Link
                    href={`/production/${encodeURIComponent(cat.name)}`}
                    className={`w-full py-4.5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs border transition-all ${
                      isDark ? 'bg-white/5 border-white/10 text-white hover:bg-[#F05E23] hover:text-white hover:border-[#F05E23]' : 'bg-[#111] border-[#111] text-white hover:bg-[#F05E23] hover:border-[#F05E23]'
                    }`}
                  >
                    <span>Enter Showcase</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem]">
            <Video className="w-12 h-12 mx-auto text-slate-300 dark:text-white/20 mb-4 animate-pulse" />
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">No production campaigns deployed yet.</p>
            <p className="text-xs text-slate-500 dark:text-white/40 mt-1 uppercase tracking-widest">Please seed or add categories in the admin dashboard</p>
          </div>
        )}
      </section>

      {/* CTA Footer Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center relative z-10 border-t border-black/5 dark:border-white/10 mt-12">
        <h2 className={`text-4xl sm:text-6xl font-bold tracking-tighter uppercase mb-6 ${isDark ? 'text-white' : 'text-[#111]'}`}>Ready to Deploy Visual Power?</h2>
        <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-10 max-w-xl mx-auto">Get in touch with Synchronous HQ today to outline your customized visual strategy.</p>
        <Link
          href="/contact"
          className="bg-[#F05E23] text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-[#F05E23]/20"
        >
          Initialize Mission
        </Link>
      </section>
    </main>
  );
}
