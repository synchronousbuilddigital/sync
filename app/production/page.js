"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "../../components/AuthContext";
import { useTheme } from "../../components/ThemeContext";
import { Play, ArrowRight, Video, Layers, Users, X, Image as ImageIcon, Film, Info, Sparkles, FolderOpen, Sliders, MonitorPlay, Plus, ShieldCheck } from "lucide-react";

export default function ProductionPage() {
  const { isDark } = useTheme();
  const { productionItems = [], partnerLogos = [], productionCategories = [], productionGalleryItems = [] } = useAuth();

  const [filterType, setFilterType] = useState("all");
  const [lightboxItem, setLightboxItem] = useState(null);

  const userBannerImages = [
    "/production_banner_user.png",
    "/production_banner_user_team.jpg",
    "/production_banner_user_marketing.jpg"
  ];

  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  const slideVariants = {
    enter: {
      x: "100%",
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 0.95,
    },
    exit: {
      x: "-100%",
      opacity: 0,
    },
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % userBannerImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleScrollToGallery = () => {
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  };

  function renderVideoPlayer(url) {
    if (!url) return null;

    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
    if (ytMatch) {
      const videoId = ytMatch[1];
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          className="w-full h-full border-none rounded-3xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
    if (vimeoMatch) {
      const videoId = vimeoMatch[1];
      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1`}
          className="w-full h-full border-none rounded-3xl"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (url.includes("instagram.com")) {
      const cleanUrl = url.split("?")[0];
      const embedUrl = cleanUrl.endsWith("/") ? `${cleanUrl}embed` : `${cleanUrl}/embed`;
      return (
        <iframe
          src={embedUrl}
          className="w-full h-full border-none rounded-3xl"
          allowFullScreen
        />
      );
    }

    if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || url.startsWith("/uploads/")) {
      return (
        <video
          src={url}
          controls
          autoPlay
          className="w-full h-full rounded-3xl object-contain bg-black"
        />
      );
    }

    return (
      <iframe
        src={url}
        className="w-full h-full border-none rounded-3xl"
        allowFullScreen
      />
    );
  }

  const repeatedLogos = partnerLogos.length > 0
    ? [...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos]
    : [];

  const categories = productionCategories.map(cat => {
    const count = productionItems.filter(item => item.category.toLowerCase() === cat.name.toLowerCase()).length;
    return {
      name: cat.name,
      count,
      thumbnail: cat.image,
      description: cat.description
    };
  });

  const filteredGalleryItems = (productionGalleryItems || []).filter(item => {
    if (filterType === "all") return true;
    return item.type === filterType;
  });

  return (
    <main className={`min-h-screen selection:bg-[#F05E23]/20 overflow-x-hidden transition-colors duration-700 ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#FDFDFD]'}`}>
      {/* Minimalist Grid Pattern */}
      <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.03]'}`}
        style={{ backgroundImage: `radial-gradient(${isDark ? '#FFF' : '#000'} 1.2px, transparent 1.2px)`, backgroundSize: '48px 48px' }}></div>

      {/* Hero Header Banner with Hardware-Accelerated Slideshow - Exact 1024x453 Aspect Ratio Fit */}
      <header className="relative w-full pt-0 pb-0 overflow-hidden select-none">

        {/* Background Slideshow - Exact Aspect Ratio on Mobile, Sleek Compact Max-Height on Desktop */}
        <div className="relative w-full aspect-[1024/453] max-h-[420px] sm:max-h-[480px] overflow-hidden">
          {userBannerImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`Production Banner Slide ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transform-gpu transition-opacity duration-700 ease-in-out pointer-events-none select-none ${
                activeBannerIdx === idx ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            />
          ))}
        </div>

        {/* View Gallery Overlay Button */}
        <div className="absolute bottom-3 left-4 sm:bottom-6 sm:left-10 z-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={handleScrollToGallery}
              className="px-5 py-2.5 sm:px-8 sm:py-4 border border-white hover:border-[#F05E23] hover:bg-[#F05E23] text-white text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full transition-all duration-300 active:scale-95 shadow-lg shadow-black/40 bg-black/40 backdrop-blur-sm"
            >
              View Gallery
            </button>
          </motion.div>
        </div>
      </header>

      {/* Infinite Logo Marquee Section */}
      <section className="w-full relative z-10 pt-0 pb-2 mb-4 overflow-hidden">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 relative z-10">

        {/* Background Ambient Glow Orbs */}
        <div className="absolute -top-10 -right-20 w-96 h-96 rounded-full bg-[#F05E23]/8 blur-[100px] pointer-events-none z-0" />
        <div className="absolute -bottom-10 -left-20 w-[30rem] h-[30rem] rounded-full bg-[#FF8C61]/5 blur-[120px] pointer-events-none z-0" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 text-[#F05E23] shadow-lg shadow-[#F05E23]/5' : 'bg-[#F05E23]/10 border-[#F05E23]/20 text-[#F05E23] shadow-md shadow-[#F05E23]/10'}`}>
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.25em] text-[#F05E23] mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-ping" />
                <span>Production Framework</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight italic">
                Operational <span className="text-[#F05E23] drop-shadow-sm">Categories</span>
              </h2>
            </div>
          </div>
          <p className={`text-xs font-semibold max-w-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Curated operational divisions for production management, active campaign reels, and studio media.
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
            {categories.map((cat, idx) => {
              const displayNum = String(idx + 1).padStart(2, '0');
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="group relative rounded-[2.5rem] border overflow-hidden transition-all duration-500 h-[420px] w-full flex flex-col justify-end cursor-pointer bg-slate-950 border-white/5 shadow-2xl hover:border-[#F05E23]/30"
                >
                  {/* Category Thumbnail Background */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950 z-0">
                    {cat.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cat.thumbnail}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-700 opacity-80 group-hover:scale-110 group-hover:opacity-60"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F05E23]/30 via-slate-950 to-[#FF8C61]/15 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:14px_24px]" />
                        <Video className="w-16 h-16 text-[#F05E23]/40 animate-pulse" />
                      </div>
                    )}

                    {/* Dark gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
                  </div>

                  {/* Top-Right Floating Reels Counter Badge */}
                  <div className="absolute top-6 right-6 z-20">
                    <span className="text-[0.6rem] font-black uppercase tracking-widest text-white bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.count > 0 ? 'bg-[#F05E23] animate-pulse' : 'bg-slate-500'}`} />
                      <span>{cat.count} {cat.count === 1 ? 'Reel' : 'Reels'}</span>
                    </span>
                  </div>

                  {/* Cinematic Content Reveal Panel */}
                  <div className="p-8 relative z-10 w-full flex flex-col justify-end transition-all duration-500 transform translate-y-[85px] group-hover:translate-y-0">
                    {/* Index & Divider */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black text-[#F05E23] tracking-widest uppercase">
                        {displayNum} / Category
                      </span>
                      <span className="h-[1px] w-8 bg-[#F05E23]/30" />
                    </div>

                    {/* Category Title */}
                    <h3 className="text-2.5xl font-black uppercase tracking-tighter italic text-white mb-3">
                      {cat.name}
                    </h3>

                    {/* Category Description */}
                    {cat.description && (
                      <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide leading-relaxed line-clamp-3 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                        {cat.description}
                      </p>
                    )}

                    {/* Enter Showcase Button */}
                    <Link
                      href={`/production/${encodeURIComponent(cat.name)}`}
                      className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] border border-[#F05E23] bg-[#F05E23] text-white hover:bg-white hover:text-slate-900 hover:border-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <span>Enter Showcase</span>
                      <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>

                  {/* Accent bottom neon line */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#F05E23] to-[#FF8C61] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Balanced Medium Studio Empty State Card */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`relative rounded-[2.2rem] p-8 sm:p-11 text-center border backdrop-blur-2xl transition-all duration-500 shadow-2xl overflow-hidden group z-10 ${
              isDark 
                ? 'bg-gradient-to-b from-[#12121A]/95 via-[#0C0C12]/90 to-[#08080C]/95 border-white/10 hover:border-[#F05E23]/35 shadow-black/50' 
                : 'bg-gradient-to-b from-white via-slate-50/95 to-slate-100/85 border-slate-200/90 shadow-slate-200/60 hover:border-[#F05E23]/35'
            }`}
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#F05E23]/12 blur-[90px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto">
              
              {/* Medium Glowing Badge Icon */}
              <div className="relative mb-5">
                <div className="w-18 h-18 rounded-[1.25rem] bg-gradient-to-tr from-[#F05E23]/25 via-[#F05E23]/10 to-transparent border border-[#F05E23]/35 flex items-center justify-center text-[#F05E23] shadow-xl shadow-[#F05E23]/20 group-hover:scale-105 transition-transform duration-300">
                  <Video className="w-8 h-8 transform -rotate-3 group-hover:rotate-0 transition-transform duration-300" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#F05E23] text-white flex items-center justify-center shadow border-2 border-slate-950">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </div>
              </div>

              {/* Medium Status Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-[0.25em] text-[#F05E23] bg-[#F05E23]/10 border border-[#F05E23]/25 mb-3 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Production Command HQ</span>
              </div>

              {/* Medium Title */}
              <h3 className={`text-xl sm:text-2xl font-black uppercase tracking-tight italic mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                No Production Campaigns Deployed Yet
              </h3>

              {/* Bottom Medium Indicator Line */}
              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10 w-full flex items-center justify-center gap-3 text-[0.6rem] font-black uppercase tracking-widest text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>SYSTEM READY</span>
                <span className="text-[#F05E23]">•</span>
                <span>0 CATEGORIES</span>
              </div>
            </div>

            {/* Accent Neon Bottom Border */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#F05E23] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 opacity-70" />
          </motion.div>
        )}
      </section>

      {/* Showcase Gallery Section */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-12 relative z-10 border-t border-black/5 dark:border-white/10 mt-3 sm:mt-8">
        
        {/* Section Header & Interactive Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-12 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 text-[#F05E23] shadow-lg shadow-[#F05E23]/5' : 'bg-[#F05E23]/10 border-[#F05E23]/20 text-[#F05E23] shadow-md shadow-[#F05E23]/10'}`}>
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.25em] text-[#F05E23] mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F05E23] animate-ping" />
                <span>Media Archive</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight italic">
                Showcase <span className="text-[#F05E23] drop-shadow-sm">Gallery</span>
              </h2>
            </div>
          </div>

          {/* Filter Tabs Bar */}
          <div className={`w-full md:w-auto max-w-full overflow-x-auto no-scrollbar flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-2xl border backdrop-blur-xl shrink-0 ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100/90 border-slate-200 shadow-inner'
          }`}>
            {[
              { id: "all", label: "Show All", icon: Sparkles },
              { id: "photo", label: "Captured Photos", icon: ImageIcon },
              { id: "video", label: "Video Reels", icon: MonitorPlay }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = filterType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 sm:gap-2 z-10 shrink-0 whitespace-nowrap flex-1 sm:flex-initial justify-center ${
                    isActive
                      ? "text-white shadow-lg shadow-[#F05E23]/25 bg-[#F05E23]"
                      : isDark
                      ? "text-slate-400 hover:text-white hover:bg-white/5"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <IconComp className={`w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0 ${isActive ? "text-white" : "text-[#F05E23]"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {filteredGalleryItems.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 [column-fill:_balance]">
            {filteredGalleryItems.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                onClick={() => setLightboxItem(item)}
                className={`group cursor-pointer rounded-3xl overflow-hidden border transition-all duration-500 relative flex flex-col justify-start break-inside-avoid mb-6 ${
                  isDark ? 'bg-white/5 border-white/5 hover:border-[#F05E23]/30 hover:bg-white/10' : 'bg-white border-slate-100 hover:border-[#F05E23]/30 hover:shadow-2xl hover:shadow-[#F05E23]/5'
                }`}
              >
                {item.type === "photo" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.mediaUrl} alt={item.title} className="w-full h-auto block group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                ) : (
                  <video
                    src={item.mediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-auto block filter brightness-90 group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                )}

                {/* Gradient Overlay & Details on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                  <span className="text-[0.5rem] font-black uppercase tracking-widest text-[#F05E23] mb-1.5">{item.type}</span>
                  <h4 className="text-sm font-black uppercase tracking-tight text-white leading-tight italic truncate">{item.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Balanced Medium Gallery Empty State Card */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`relative rounded-[2.2rem] p-8 sm:p-11 text-center border backdrop-blur-2xl transition-all duration-500 shadow-2xl overflow-hidden group z-10 ${
              isDark 
                ? 'bg-gradient-to-b from-[#12121A]/95 via-[#0C0C12]/90 to-[#08080C]/95 border-white/10 hover:border-[#F05E23]/35 shadow-black/50' 
                : 'bg-gradient-to-b from-white via-slate-50/95 to-slate-100/85 border-slate-200/90 shadow-slate-200/60 hover:border-[#F05E23]/35'
            }`}
          >
            {/* Ambient Background Glow */}
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#F05E23]/12 blur-[90px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto">
              
              {/* Medium Glowing Badge Icon */}
              <div className="relative mb-5">
                <div className="w-18 h-18 rounded-[1.25rem] bg-gradient-to-tr from-[#F05E23]/25 via-[#F05E23]/10 to-transparent border border-[#F05E23]/35 flex items-center justify-center text-[#F05E23] shadow-xl shadow-[#F05E23]/20 group-hover:scale-105 transition-transform duration-300">
                  {filterType === "photo" ? (
                    <ImageIcon className="w-8 h-8 transform rotate-3 group-hover:rotate-0 transition-transform duration-300" />
                  ) : filterType === "video" ? (
                    <Film className="w-8 h-8 transform -rotate-3 group-hover:rotate-0 transition-transform duration-300" />
                  ) : (
                    <Sparkles className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#F05E23] text-white flex items-center justify-center shadow border-2 border-slate-950">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </div>
              </div>

              {/* Medium Status Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-[0.25em] text-[#F05E23] bg-[#F05E23]/10 border border-[#F05E23]/25 mb-3 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Media Vault Archive</span>
              </div>

              {/* Medium Title & Description */}
              <h3 className={`text-xl sm:text-2xl font-black uppercase tracking-tight italic mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                No All Items In Gallery Yet
              </h3>

              <p className={`text-xs sm:text-sm font-medium leading-relaxed max-w-md ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Captured photos, brand stills, and high-definition video reels will automatically stream into this archive once published.
              </p>

              {/* Bottom Medium Indicator Line */}
              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10 w-full flex items-center justify-center gap-3 text-[0.6rem] font-black uppercase tracking-widest text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>VAULT READY</span>
                <span className="text-[#F05E23]">•</span>
                <span>0 ASSETS</span>
              </div>
            </div>

            {/* Accent Neon Bottom Border */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#F05E23] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 opacity-70" />
          </motion.div>
        )}
      </section>

      {/* Lightbox Gallery Viewer Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-black/90">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-5xl h-[70vh] bg-[#050505] rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-6 right-6 z-20 p-2.5 bg-black/80 hover:bg-black text-white hover:text-[#F05E23] border border-white/10 rounded-full shadow-lg transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Player/Viewer */}
            <div className="flex-1 h-full relative flex items-center justify-center bg-black">
              {lightboxItem.type === "photo" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={lightboxItem.mediaUrl} alt={lightboxItem.title} className="max-w-full max-h-full object-contain" />
              ) : (
                renderVideoPlayer(lightboxItem.mediaUrl)
              )}
            </div>

            {/* Sidebar Info */}
            <div className="w-full md:w-80 bg-black/40 border-t md:border-t-0 md:border-l border-white/10 p-8 flex flex-col justify-between overflow-y-auto shrink-0 select-none">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[0.6rem] font-black uppercase tracking-widest text-[#F05E23]">
                  <Info className="w-3.5 h-3.5" />
                  <span>Gallery Details</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white italic">{lightboxItem.title}</h3>
                  <span className="inline-block mt-2 text-[0.55rem] font-black uppercase tracking-widest text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">{lightboxItem.type}</span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 mt-8">
                <span className="block text-[0.55rem] font-black text-slate-500 uppercase tracking-widest">Sequence Index</span>
                <span className="text-2xl font-black text-white mt-1 block">#{lightboxItem.index || 0}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
