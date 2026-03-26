"use client";

import React from 'react';
import { motion } from 'framer-motion';

const PrecisionGrid = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Primary Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Sub Grid (Finer) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:10px_10px]"></div>
      
      {/* Radiant Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0),rgba(255,255,255,1)_80%)]"></div>
      
      {/* Floating Coordinates (Decorative) */}
      <div className="absolute top-10 left-10 text-[0.5rem] font-mono text-slate-300 opacity-50 uppercase tracking-widest">
        00.SY.NC // ARCH.V1
      </div>
      <div className="absolute bottom-10 right-10 text-[0.5rem] font-mono text-slate-300 opacity-50 uppercase tracking-widest">
        PRECISION_LAYER // 100%
      </div>
    </div>
  );
};

export default PrecisionGrid;
