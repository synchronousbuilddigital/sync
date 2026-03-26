"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Zap } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Process', href: '/process' },
  { name: 'Work', href: '/work' },
  { name: 'Insights', href: '/insights' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 py-6 sm:py-8 pointer-events-none">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`pointer-events-auto relative flex items-center justify-between w-full max-w-7xl h-16 sm:h-20 px-6 sm:px-10 rounded-2xl sm:rounded-3xl border transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-2xl border-white/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]' 
            : 'bg-[#F9F9F9]/50 backdrop-blur-lg border-black/5'
        }`}
      >
        {/* Logo Section */}
        <Link href="/" className="relative z-10 flex items-center group">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 bg-white rounded-xl shadow-sm border border-black/5 flex items-center justify-center transition-transform group-hover:scale-110">
            <Image
              src="/logo.png"
              alt="Sync Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-tighter text-[#111] leading-none uppercase">Synchronous</span>
            <span className="text-[0.6rem] font-bold tracking-[0.3em] text-[#F05E23] leading-none uppercase mt-1">Digital Marketing</span>
          </div>
        </Link>

        {/* Desktop Navigation Link Pill */}
        <div className="hidden md:flex items-center gap-2 bg-black/5 p-1.5 rounded-2xl border border-black/5">
          {navLinks.map((link) => (
            <NavLink key={link.name} href={link.href} active={pathname === link.href}>
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Action Button Section Area */}
        <div className="hidden md:flex items-center gap-6">
           <a 
              href="https://wa.me/919161391566?text=I'd like to start growing my business with Synchronous Build Digital." 
              target="_blank"
              rel="noopener noreferrer"
              className="relative group overflow-hidden bg-[#111] px-8 py-3.5 rounded-xl shadow-lg transition-all hover:scale-[1.03] active:scale-95"
           >
                <span className="text-white text-xs font-bold uppercase tracking-widest relative z-10">Start Growing</span>
                {/* Style Match: Hero Accent Triangle */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-[#F05E23] mask-triangle z-20"></div>
           </a>
        </div>

        {/* Mobile Menu Toggle Area */}
        <button
          className="md:hidden relative z-10 p-2 text-[#111] transition-transform active:scale-90"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay - Matches High Fidelity Style */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col p-8 sm:p-12 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-16">
               <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tighter text-[#111] leading-none uppercase">Synchronous</span>
                  <span className="text-[0.7rem] font-bold tracking-[0.3em] text-[#F05E23] leading-none uppercase mt-2">Digital</span>
               </div>
               <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-12 h-12 bg-[#F9F9F9] rounded-2xl flex items-center justify-center border border-black/5"
               >
                  <X className="w-6 h-6" />
               </button>
            </div>

            <div className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-6xl font-black tracking-[-0.05em] leading-[0.85] transition-colors ${
                      pathname === link.href ? 'text-[#F05E23]' : 'text-[#111] hover:text-[#F05E23]'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="mt-auto pt-16 flex flex-col gap-6"
            >
               <div className="w-full h-px bg-black/5" />
               <div className="flex items-center justify-between text-[#111]">
                  <span className="font-bold uppercase tracking-widest text-[0.6rem]">Ready to Scale?</span>
                  <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
               </div>
               <Link 
                  href="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-[#111] py-8 rounded-3xl flex items-center justify-center gap-4 text-white hover:bg-[#F05E23] transition-colors group"
               >
                  <span className="text-xl font-bold uppercase tracking-widest">Start Growing</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
               </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, children, active }) {
  return (
    <Link
      href={href}
      className={`relative px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-widest transition-colors duration-300 ${
        active ? 'text-white' : 'text-slate-500 hover:text-slate-900'
      }`}
    >
      <span className="relative z-10">{children}</span>
      {active && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-[#111] rounded-xl shadow-lg border border-white/10"
          transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
        />
      )}
    </Link>
  );
}
