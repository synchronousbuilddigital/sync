"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "../../components/AuthContext";
import { useTheme } from "../../components/ThemeContext";
import { Play, ArrowRight, Video, Layers, Users, X, Image as ImageIcon, Film, Info } from "lucide-react";

export default function ProductionPage() {
  const { isDark } = useTheme();
  const { productionItems = [], partnerLogos = [], productionCategories = [], productionGalleryItems = [] } = useAuth();

  const [filterType, setFilterType] = useState("all");
  const [lightboxItem, setLightboxItem] = useState(null);

  const heroMarqueeImages = [
    "/web_hero_1.png",
    "/web_hero_2.png",
    "/web_hero_3.png",
    "/web_hero_4.png",
    "/web_hero_5.png",
    "/web_hero_6.png",
  ];

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

      {/* Hero Header Banner with Scrolling Image Marquee Background */}
      <header className="relative w-full min-h-[60vh] md:min-h-[65vh] flex items-center pt-36 pb-16 px-6 overflow-hidden bg-black select-none">

        {/* Infinite Scrolling Image Background Marquee */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0A0A0A]">
          <div className="flex w-max h-full items-center gap-0 animate-marquee whitespace-nowrap opacity-40">
            {/* Set 1 */}
            <div className="flex shrink-0 h-full items-center gap-0">
              {heroMarqueeImages.map((src, idx) => (
                <div key={`hero-marquee-1-${idx}`} className="relative h-full w-[260px] sm:w-[300px] md:w-[340px] shrink-0 overflow-hidden border-r border-black/30">
                  <img src={src} alt="Creative Work" className="w-full h-full object-cover pointer-events-none" />
                </div>
              ))}
            </div>
            {/* Set 2 */}
            <div className="flex shrink-0 h-full items-center gap-0">
              {heroMarqueeImages.map((src, idx) => (
                <div key={`hero-marquee-2-${idx}`} className="relative h-full w-[260px] sm:w-[300px] md:w-[340px] shrink-0 overflow-hidden border-r border-black/30">
                  <img src={src} alt="Creative Work" className="w-full h-full object-cover pointer-events-none" />
                </div>
              ))}
            </div>
          </div>

          {/* Vignette Overlays for Contrast */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/45 to-transparent" />

          {/* Bottom vignette */}
          <div className={`absolute inset-x-0 bottom-0 h-28 z-10 transition-colors duration-700 ${isDark
            ? 'bg-gradient-to-t from-[#0A0A0A] to-transparent'
            : 'bg-gradient-to-t from-[#FDFDFD] to-transparent'
            }`} />
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col items-start relative z-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 sm:gap-16 w-full">
            <div className="space-y-6 max-w-4xl">
              {/* Redesigned Typography to match 'Prerak Production9' */}
              <motion.h1
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[3.2rem] sm:text-[4.6rem] md:text-[5.5rem] lg:text-[6.5rem] font-black tracking-tighter leading-[0.95] text-white drop-shadow-lg italic uppercase"
              >
                Synchronous <span className="text-[#F05E23]">Production</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="border-l-2 border-[#F05E23] pl-6 py-1 font-semibold leading-relaxed text-sm italic text-white/70 max-w-md"
              >
                Capturing high-authority visual narratives to drive brand alignment and massive audience conversions.
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4"
              >
                <button
                  onClick={handleScrollToGallery}
                  className="px-8 py-4 border border-white hover:border-[#F05E23] hover:bg-[#F05E23] text-white text-xs font-black uppercase tracking-widest rounded-full transition-all duration-300 active:scale-95 shadow-lg shadow-black/30 bg-black/20 backdrop-blur-sm"
                >
                  View Gallery
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Infinite Logo Marquee Section */}
      <section className="w-full relative z-10 pt-0 pb-2 mb-4 overflow-hidden">
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
      <section className="max-w-7xl mx-auto px-6 py-8 relative z-10">

        {/* Background Ambient Glow Orbs */}
        <div className="absolute -top-10 -right-20 w-80 h-80 rounded-full bg-[#F05E23]/5 blur-[80px] pointer-events-none z-0" />
        <div className="absolute -bottom-10 -left-20 w-96 h-96 rounded-full bg-[#FF8C61]/3 blur-[100px] pointer-events-none z-0" />

        <div className="flex items-center gap-3 mb-16 relative z-10">
          <Layers className="w-5 h-5 text-[#F05E23]" />
          <h2 className="text-2xl font-black uppercase tracking-widest italic">Operational <span className="text-[#F05E23]">Categories</span></h2>
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
                  className={`group rounded-[2.5rem] border overflow-hidden transition-all duration-500 flex flex-col justify-between relative ${isDark
                    ? 'bg-white/5 border-white/5 hover:border-[#F05E23]/30 hover:bg-white/10 hover:shadow-[0_20px_50px_rgba(240,94,35,0.06)]'
                    : 'bg-white border-slate-100 hover:border-[#F05E23]/30 hover:shadow-[0_20px_50px_rgba(240,94,35,0.08)]'
                    }`}
                >
                  {/* Thumbnail Image Container */}
                  <div className="relative h-64 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                    {cat.thumbnail ? (
                      <img
                        src={cat.thumbnail}
                        alt={cat.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-100"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F05E23]/30 via-slate-950 to-[#FF8C61]/15 flex items-center justify-center">
                        {/* Micro technical grid backdrop */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:14px_24px]" />
                        <Video className="w-16 h-16 text-[#F05E23]/40 animate-pulse relative z-10" />
                      </div>
                    )}

                    {/* Lighter bottom gradient overlay for badge readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Floating Counter Badge with active dot indicator */}
                    <span className="absolute bottom-6 left-6 text-[0.65rem] font-black uppercase tracking-widest text-white bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cat.count > 0 ? 'bg-[#F05E23] animate-pulse' : 'bg-slate-500'}`} />
                      <span>{cat.count} {cat.count === 1 ? 'Reel' : 'Reels'}</span>
                    </span>
                  </div>

                  {/* Details Body */}
                  <div className="p-8 flex flex-col justify-between flex-1">
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-[#F05E23] tracking-widest uppercase">
                          {displayNum} /
                        </span>
                        <span className="h-[1px] w-8 bg-[#F05E23]/30" />
                      </div>

                      <h3 className={`text-2.5xl font-black uppercase tracking-tighter italic transition-colors group-hover:text-[#F05E23] ${isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                        {cat.name}
                      </h3>
                    </div>

                    <Link
                      href={`/production/${encodeURIComponent(cat.name)}`}
                      className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] border transition-all ${isDark
                        ? 'bg-white/5 border-white/10 text-white hover:bg-[#F05E23] hover:text-white hover:border-[#F05E23]'
                        : 'bg-slate-900 border-slate-900 text-white hover:bg-[#F05E23] hover:border-[#F05E23]'
                        }`}
                    >
                      <span>Enter Showcase</span>
                      <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>

                  {/* Micro gradient line at the bottom on hover */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#F05E23] to-[#FF8C61] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] relative z-10">
            <Video className="w-12 h-12 mx-auto text-slate-300 dark:text-white/20 mb-4 animate-pulse" />
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">No production campaigns deployed yet.</p>
            <p className="text-xs text-slate-500 dark:text-white/40 mt-1 uppercase tracking-widest">Please seed or add categories in the admin dashboard</p>
          </div>
        )}
      </section>

      {/* Showcase Gallery Section */}
      <section id="gallery" className="max-w-7xl mx-auto px-6 py-8 relative z-10 border-t border-black/5 dark:border-white/10 mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-[#F05E23]" />
            <h2 className="text-2xl font-black uppercase tracking-widest italic">Showcase <span className="text-[#F05E23]">Gallery</span></h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 w-fit shrink-0">
            {[
              { id: "all", label: "Show All" },
              { id: "photo", label: "Captured Photos" },
              { id: "video", label: "Video Reels" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${filterType === tab.id
                  ? "bg-[#F05E23] text-white shadow-md shadow-[#F05E23]/10"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
              >
                {tab.label}
              </button>
            ))}
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
                className={`group cursor-pointer rounded-3xl overflow-hidden border transition-all duration-500 relative flex flex-col justify-start break-inside-avoid mb-6 ${isDark ? 'bg-white/5 border-white/5 hover:border-[#F05E23]/30 hover:bg-white/10' : 'bg-white border-slate-100 hover:border-[#F05E23]/30 hover:shadow-2xl hover:shadow-[#F05E23]/5'
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
          <div className="text-center py-16 border border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem]">
            {filterType === "photo" ? (
              <ImageIcon className="w-10 h-10 mx-auto text-slate-300 dark:text-white/20 mb-3" />
            ) : (
              <Film className="w-10 h-10 mx-auto text-slate-300 dark:text-white/20 mb-3" />
            )}
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">No {filterType} items in gallery yet.</p>
          </div>
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
