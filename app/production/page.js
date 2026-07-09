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

  const banners = [
    {
      image: "/production_banner_1.png",
      title: "Futuristic Studio",
      subtitle: "State-of-the-Art Creation",
    },
    {
      image: "/production_banner_2.png",
      title: "Cinematic Showcase",
      subtitle: "High-Authority Narratives",
    },
    {
      image: "/production_banner_3.png",
      title: "Creative Visualization",
      subtitle: "Crafted for Impact",
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  const [filterType, setFilterType] = useState("all");
  const [lightboxItem, setLightboxItem] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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

      {/* Hero Header Banner */}
      <header className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center pt-32 pb-24 px-6 overflow-hidden">
        {/* Widescreen Interactive Slideshow Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                index === activeSlide 
                  ? "opacity-75 scale-100" 
                  : "opacity-0 scale-105 pointer-events-none"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover filter brightness-[0.65] contrast-[1.05]"
              />
            </div>
          ))}
          {/* Ambient Overlay Gradients for Dynamic Dual Theme readability */}
          <div className={`absolute inset-0 z-10 transition-colors duration-700 ${
            isDark 
              ? 'bg-gradient-to-r from-black/85 via-black/50 to-black/10' 
              : 'bg-gradient-to-r from-white/85 via-white/50 to-white/10'
          }`} />
          {/* Bottom vignette gradient */}
          <div className={`absolute inset-x-0 bottom-0 h-32 z-10 transition-colors duration-700 ${
            isDark 
              ? 'bg-gradient-to-t from-[#0A0A0A] to-transparent' 
              : 'bg-gradient-to-t from-[#FDFDFD] to-transparent'
          }`} />
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col items-start relative z-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`inline-flex items-center gap-3 px-5 py-2.5 border rounded-full mb-10 shadow-sm backdrop-blur-md transition-colors duration-500 ${
              isDark ? 'bg-white/5 border-white/10 text-[#F05E23]' : 'bg-white/40 border-slate-200/50 text-[#F05E23]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#F05E23] animate-pulse"></span>
            <span className="text-[0.7rem] font-bold tracking-[0.45em] uppercase border-none">Our Creations</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 w-full">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className={`text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold tracking-[-0.05em] leading-[0.85] transition-colors duration-500 drop-shadow-sm ${
                isDark ? 'text-white' : 'text-[#111]'
              }`}
            >
              Woven for Tomorrow. <br />
              <span className="text-[#F05E23]">Crafted for Life.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`max-w-xs border-l-2 border-[#F05E23] pl-8 pb-4 font-medium leading-relaxed italic transition-colors duration-500 ${
                isDark ? 'text-white/60' : 'text-slate-700'
              }`}
            >
              Capturing high-authority visual narratives to drive brand alignment and massive audience conversions.
            </motion.div>
          </div>
        </div>

        {/* Banner Navigation & Sliders Indicators */}
        <div className="absolute bottom-8 left-6 right-6 z-20 flex justify-between items-center max-w-7xl mx-auto w-[calc(100%-3rem)]">
          <div className="flex gap-2.5">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === activeSlide 
                    ? "w-10 bg-[#F05E23]" 
                    : `w-2 ${isDark ? 'bg-white/20 hover:bg-white/40' : 'bg-black/20 hover:bg-black/40'}`
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
            0{activeSlide + 1} / 0{banners.length}
          </span>
        </div>
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
                className={`group rounded-[2.5rem] border overflow-hidden transition-all duration-500 flex flex-col justify-between ${isDark ? 'bg-white/5 border-white/5 hover:border-[#F05E23]/30 hover:bg-white/10' : 'bg-white border-slate-100 hover:border-[#F05E23]/30 hover:shadow-2xl hover:shadow-[#F05E23]/5'
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
                      {cat.description || `Explore our premium visuals for ${cat.name.toLowerCase()} campaigns.`}
                    </p>
                  </div>

                  <Link
                    href={`/production/${encodeURIComponent(cat.name)}`}
                    className={`w-full py-4.5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-[#F05E23] hover:text-white hover:border-[#F05E23]' : 'bg-[#111] border-[#111] text-white hover:bg-[#F05E23] hover:border-[#F05E23]'
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

      {/* Showcase Gallery Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 relative z-10 border-t border-black/5 dark:border-white/10 mt-16">
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
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  filterType === tab.id
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredGalleryItems.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                onClick={() => setLightboxItem(item)}
                className={`group cursor-pointer rounded-3xl overflow-hidden border transition-all duration-500 relative aspect-square flex items-center justify-center ${
                  isDark ? 'bg-white/5 border-white/5 hover:border-[#F05E23]/30 hover:bg-white/10' : 'bg-white border-slate-100 hover:border-[#F05E23]/30 hover:shadow-2xl hover:shadow-[#F05E23]/5'
                }`}
              >
                {item.type === "photo" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.mediaUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                ) : (
                  <video
                    src={item.mediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
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
