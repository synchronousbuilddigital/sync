"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../components/AuthContext";
import { useTheme } from "../../../components/ThemeContext";
import { ArrowLeft, Play, X, Film, Info } from "lucide-react";

export default function CategoryProductionPage() {
  const params = useParams();
  const router = useRouter();
  const { isDark } = useTheme();
  const { productionItems = [], productionCategories = [] } = useAuth();
  const [activeVideo, setActiveVideo] = useState(null);

  // Decode the category name from params
  const categoryName = params.category ? decodeURIComponent(params.category) : "";

  // Filter production items matching this category
  const reels = productionItems
    .filter((item) => item.category.toLowerCase() === categoryName.toLowerCase())
    .sort((a, b) => (a.index || 0) - (b.index || 0));

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

  return (
    <main className={`min-h-screen selection:bg-[#F05E23]/20 overflow-x-hidden transition-colors duration-700 pb-20 ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#FDFDFD]'}`}>
      {/* Grid Pattern */}
      <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.03]'}`}
           style={{ backgroundImage: `radial-gradient(${isDark ? '#FFF' : '#000'} 1.2px, transparent 1.2px)`, backgroundSize: '48px 48px' }}></div>

      {/* Header Bar */}
      <header className="relative max-w-7xl mx-auto px-6 pt-32 pb-12 z-10">
        <button
          onClick={() => router.push("/production")}
          className={`inline-flex items-center gap-2.5 px-5 py-3 border rounded-xl mb-12 shadow-sm font-black uppercase text-[0.65rem] tracking-widest transition-all hover:scale-105 active:scale-95 ${
            isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
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
                <span>{reels.length} Deployed Clips</span>
              </div>
            </div>
          );
        })()}
      </header>

      {/* Reels Grid */}
      <section className="max-w-7xl mx-auto px-6 relative z-10 mt-8">
        {reels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {reels.map((reel, idx) => (
              <motion.div
                key={reel._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className={`group rounded-[2rem] border overflow-hidden transition-all duration-500 ${
                  isDark ? 'bg-white/5 border-white/5 hover:border-[#F05E23]/30 hover:bg-white/10' : 'bg-white border-slate-100 hover:border-[#F05E23]/30 hover:shadow-2xl hover:shadow-[#F05E23]/5'
                }`}
              >
                {/* Media Container */}
                <div
                  onClick={() => setActiveVideo(reel)}
                  className="relative h-56 bg-slate-950 flex items-center justify-center cursor-pointer overflow-hidden group"
                >
                  {reel.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={reel.thumbnailUrl} alt={reel.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#1a121c] to-slate-950 flex flex-col items-center justify-center">
                      <Film className="w-12 h-12 text-[#F05E23]/40 mb-2 group-hover:scale-110 transition-transform duration-500" />
                      <span className="text-[0.55rem] font-black uppercase tracking-widest text-[#F05E23]/60">Click to Play</span>
                    </div>
                  )}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#F05E23] flex items-center justify-center text-white shadow-xl shadow-[#F05E23]/30 group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-8 space-y-4">
                  <span className="text-[0.6rem] font-black text-[#F05E23] uppercase tracking-[0.2em]">Index: {reel.index || 0}</span>
                  <h3 className={`text-xl font-black uppercase tracking-tight italic ${isDark ? 'text-white' : 'text-[#111]'}`}>{reel.title}</h3>
                  {reel.description && (
                    <p className="text-xs text-slate-500 dark:text-white/40 leading-relaxed font-semibold">
                      {reel.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem]">
            <Film className="w-12 h-12 mx-auto text-slate-300 dark:text-white/20 mb-4" />
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">No reels added to this showcase yet.</p>
          </div>
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
