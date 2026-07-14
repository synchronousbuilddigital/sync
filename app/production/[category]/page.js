"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../components/AuthContext";
import { useTheme } from "../../../components/ThemeContext";
import { ArrowLeft, Play, X, Film, Info, Image as ImageIcon } from "lucide-react";

export default function CategoryProductionPage() {
  const params = useParams();
  const router = useRouter();
  const { isDark } = useTheme();
  const { productionItems = [], productionCategories = [] } = useAuth();
  const [activeVideo, setActiveVideo] = useState(null);

  // Decode the category name from params
  const categoryName = params.category ? decodeURIComponent(params.category) : "";

  // Filter production items matching this category
  const categoryReels = productionItems
    .filter((item) => item.category.toLowerCase() === categoryName.toLowerCase())
    .sort((a, b) => (a.index || 0) - (b.index || 0));

  const featuredReels = categoryReels.filter((item) => item.isFeatured);
  const regularReels = categoryReels.filter((item) => !item.isFeatured);

  function renderVideoPlayer(url) {
    if (!url) return null;

    // Youtube URL parsing
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

    // Vimeo URL parsing
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

    // Instagram Reel URL parsing
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

    // Direct Video File link parsing
    if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) {
      return (
        <video
          src={url}
          controls
          autoPlay
          className="w-full h-full rounded-3xl object-contain bg-black"
        />
      );
    }

    // Default fallback
    return (
      <iframe
        src={url}
        className="w-full h-full border-none rounded-3xl"
        allowFullScreen
      />
    );
  }

  function renderCardVideo(url) {
    if (!url) return null;

    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
    if (ytMatch) {
      const videoId = ytMatch[1];
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1`}
          className="w-full aspect-[9/16] border-none pointer-events-none object-cover opacity-90 group-hover:opacity-100 transition-opacity block"
          allow="autoplay; encrypted-media"
        />
      );
    }

    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
    if (vimeoMatch) {
      const videoId = vimeoMatch[1];
      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1&controls=0`}
          className="w-full aspect-[9/16] border-none pointer-events-none object-cover opacity-90 group-hover:opacity-100 transition-opacity block"
          allow="autoplay; fullscreen"
        />
      );
    }

    if (url.includes("instagram.com")) {
      const cleanUrl = url.split("?")[0];
      const embedUrl = cleanUrl.endsWith("/") ? `${cleanUrl}embed` : `${cleanUrl}/embed`;
      return (
        <iframe
          src={embedUrl}
          className="w-full aspect-[9/16] border-none pointer-events-none opacity-90 block"
        />
      );
    }

    return (
      <video
        src={url}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-auto block filter brightness-90 group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
      />
    );
  }

  return (
    <main className={`min-h-screen selection:bg-[#F05E23]/20 overflow-x-hidden transition-colors duration-700 pb-20 ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#FDFDFD]'}`}>
      {/* Grid Pattern */}
      <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.03]'}`}
        style={{ backgroundImage: `radial-gradient(${isDark ? '#FFF' : '#000'} 1.2px, transparent 1.2px)`, backgroundSize: '48px 48px' }}></div>

      {/* Header Bar */}
      <header className="relative max-w-7xl mx-auto px-6 pt-40 pb-12 z-10">
        <button
          onClick={() => router.push("/production")}
          className={`inline-flex items-center gap-2.5 px-5 py-3 border rounded-xl mb-12 shadow-sm font-black uppercase text-[0.65rem] tracking-widest transition-all hover:scale-105 active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
            }`}
        >
          <ArrowLeft className="w-4 h-4 text-[#F05E23]" />
          <span>Back to Production</span>
        </button>

        {(() => {
          const currentCategory = productionCategories.find(
            (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
          );
          const categoryDescription = currentCategory?.description || `Explore our premium visuals for ${categoryName.toLowerCase()} campaigns.`;

          return (
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-3xl">
                <span className="text-[0.65rem] font-black uppercase tracking-[0.4em] text-[#F05E23] block mb-3">Showcase Directory</span>
                <h1 className={`text-4xl sm:text-6xl font-black uppercase tracking-tighter italic leading-none ${isDark ? 'text-white' : 'text-[#111]'}`}>
                  {categoryName} <span className="text-[#F05E23]">HQ</span>
                </h1>
                {categoryDescription && (
                  <p className={`text-xs sm:text-sm font-bold uppercase tracking-wider mt-4 leading-relaxed max-w-2xl ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                    {categoryDescription}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F05E23]/10 border border-[#F05E23]/20 text-[0.65rem] font-black uppercase tracking-widest text-[#F05E23] shrink-0">
                <Film className="w-3.5 h-3.5" />
                <span>{categoryReels.length} Deployed Clips</span>
              </div>
            </div>
          );
        })()}
      </header>

      {/* Featured Production Section */}
      {featuredReels.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 relative z-10 mt-8 mb-16">
          <div className="flex items-center gap-3 mb-8">
            <ImageIcon className="w-5 h-5 text-[#F05E23]" />
            <h2 className="text-2xl font-black uppercase tracking-widest italic">Featured <span className="text-[#F05E23]">Productions</span></h2>
          </div>

          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 [column-fill:_balance]">
            {featuredReels.map((reel, idx) => (
              <motion.div
                key={reel._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                onClick={() => setActiveVideo(reel)}
                className={`group cursor-pointer rounded-[2rem] overflow-hidden border transition-all duration-500 relative flex flex-col justify-start break-inside-avoid mb-6 ${
                  isDark 
                    ? 'bg-white/5 border-white/5 hover:border-[#F05E23]/30 hover:bg-white/10' 
                    : 'bg-white border-slate-100 hover:border-[#F05E23]/30 hover:shadow-2xl hover:shadow-[#F05E23]/5'
                }`}
              >
                {/* Video Preview Direct block */}
                {renderCardVideo(reel.videoUrl)}

                {/* Star Badge overlay in corner */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-amber-500 text-white font-black text-[0.55rem] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    ★ Featured
                  </span>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none bg-black/10 group-hover:bg-black/0 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#F05E23] flex items-center justify-center text-white shadow-xl shadow-[#F05E23]/30 group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Hover Gradient Overlay & Details */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/95 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                  <span className="text-[0.5rem] font-black uppercase tracking-widest text-[#F05E23] mb-1.5">Index: {reel.index || 0}</span>
                  <h4 className="text-sm font-black uppercase tracking-tight text-white leading-tight italic truncate mb-1">{reel.title}</h4>
                  {reel.description && (
                    <p className="text-[10px] font-semibold text-white/70 line-clamp-2 leading-relaxed">{reel.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Reels Grid */}
      <section className="max-w-7xl mx-auto px-6 relative z-10 mt-8">
        {featuredReels.length > 0 && regularReels.length > 0 && (
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-[1px] bg-slate-200 dark:bg-white/10"></span>
            <h2 className={`text-xs font-black uppercase tracking-[0.3em] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              More Showcase Items
            </h2>
          </div>
        )}

        {(featuredReels.length > 0 ? regularReels : categoryReels).length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 [column-fill:_balance]">
            {(featuredReels.length > 0 ? regularReels : categoryReels).map((reel, idx) => {
              return (
                <motion.div
                  key={reel._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  onClick={() => setActiveVideo(reel)}
                  className={`group cursor-pointer rounded-[2rem] overflow-hidden border transition-all duration-500 relative flex flex-col justify-start break-inside-avoid mb-6 ${
                    isDark 
                      ? 'bg-white/5 border-white/5 hover:border-[#F05E23]/30 hover:bg-white/10' 
                      : 'bg-white border-slate-100 hover:border-[#F05E23]/30 hover:shadow-2xl hover:shadow-[#F05E23]/5'
                  }`}
                >
                  {/* Video Preview Direct block */}
                  {renderCardVideo(reel.videoUrl)}

                  {/* Play Overlay (always visible but scales on hover) */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none bg-black/10 group-hover:bg-black/0 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#F05E23] flex items-center justify-center text-white shadow-xl shadow-[#F05E23]/30 group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Gradient Overlay & Details on hover */}
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                    <span className="text-[0.5rem] font-black uppercase tracking-widest text-[#F05E23] mb-1.5">Index: {reel.index || 0}</span>
                    <h4 className="text-base font-black uppercase tracking-tight text-white leading-tight italic truncate mb-1">{reel.title}</h4>
                    {reel.description && (
                      <p className="text-[10px] font-semibold text-white/70 line-clamp-2 leading-relaxed">{reel.description}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          featuredReels.length === 0 && (
            <div className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem]">
              <Film className="w-12 h-12 mx-auto text-slate-300 dark:text-white/20 mb-4" />
              <p className="text-sm font-black uppercase tracking-widest text-slate-400">No reels added to this showcase yet.</p>
            </div>
          )
        )}
      </section>

      {/* Lightbox Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-black/90">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl h-[70vh] bg-[#050505] rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col sm:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-6 right-6 z-20 p-2.5 bg-black/80 hover:bg-black text-white hover:text-[#F05E23] border border-white/10 rounded-full shadow-lg transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video Player */}
              <div className="flex-1 h-full relative">
                {renderVideoPlayer(activeVideo.videoUrl)}
              </div>

              {/* Sidebar Info */}
              <div className="w-full sm:w-80 bg-black/40 border-t sm:border-t-0 sm:border-l border-white/10 p-8 flex flex-col justify-between overflow-y-auto shrink-0 select-none">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[0.6rem] font-black uppercase tracking-widest text-[#F05E23]">
                    <Info className="w-3.5 h-3.5" />
                    <span>Reel Details</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white italic">{activeVideo.title}</h3>
                    <span className="inline-block mt-2 text-[0.55rem] font-black uppercase tracking-widest text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">{activeVideo.category}</span>
                  </div>
                  {activeVideo.description && (
                    <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                      {activeVideo.description}
                    </p>
                  )}
                </div>

                <div className="pt-8 border-t border-white/10 mt-8">
                  <span className="block text-[0.55rem] font-black text-slate-500 uppercase tracking-widest">Active Reel Index</span>
                  <span className="text-2xl font-black text-white mt-1 block">#{activeVideo.index || 0}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
