"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Zap } from "lucide-react";
import { useTheme } from './ThemeContext';
import { useAuth } from "./AuthContext";

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Process', href: '/process' },
  { name: 'Work', href: '/work' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
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
    <header className={`fixed left-0 right-0 z-[60] transition-all duration-500 flex justify-center w-full ${isScrolled
        ? 'top-4 px-4'
        : 'top-0 px-0'
      }`}>
      
      <div className={`transition-all duration-500 w-full ${isScrolled
        ? isDark 
            ? 'bg-[#0A0A0A]/85 backdrop-blur-md border border-white/10 rounded-full shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)] max-w-6xl py-2'
            : 'bg-white/85 backdrop-blur-md border border-black/10 rounded-full shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] max-w-6xl py-2'
        : isDark
            ? 'bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-transparent py-6 max-w-full rounded-none'
            : 'bg-[#F9F9F9]/90 backdrop-blur-xl border-b border-transparent py-6 max-w-full rounded-none'
      }`}>
      
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`w-full mx-auto flex items-center justify-between transition-all duration-500 ${isScrolled ? 'px-4 sm:px-6 h-12 sm:h-14' : 'px-6 sm:px-10 max-w-7xl h-16 sm:h-20'}`}
      >
        {/* Logo Section */}
        <Link href="/" className="relative z-10 flex items-center group">
          <div className={`relative ${isScrolled ? 'w-8 h-8 sm:w-10 sm:h-10 border-0 shadow-none' : 'w-10 h-10 sm:w-12 sm:h-12 border shadow-sm'} mr-3 rounded-full transition-all duration-500 group-hover:scale-105 flex items-center justify-center ${!isScrolled && (isDark ? 'bg-[#111] border-white/10' : 'bg-white border-black/5')} ${isScrolled && (isDark ? 'bg-transparent' : 'bg-transparent')}`}>
            <Image
              src="/logo.png"
              alt="Sync Logo"
              width={isScrolled ? 28 : 32}
              height={isScrolled ? 28 : 32}
              className="object-contain transition-all duration-500"
            />
          </div>
          <div className="flex flex-col">
            <span className={`${isScrolled ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'} font-black tracking-tighter leading-none uppercase transition-all duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}>Synchronous</span>
            {!isScrolled && <span className="text-[0.6rem] font-bold tracking-[0.3em] text-[#F05E23] leading-none uppercase mt-1 transition-all duration-500 opacity-100">Digital Marketing</span>}
            {isScrolled && <span className="text-[0.55rem] font-bold tracking-[0.2em] text-[#F05E23] leading-none uppercase mt-0.5 transition-all duration-500 opacity-80">Digital</span>}
          </div>
        </Link>

        {/* Desktop Navigation Link Pill */}
        <div className={`hidden lg:flex items-center gap-1 ${isScrolled ? 'p-1 rounded-full' : 'p-1.5 rounded-2xl'} border transition-all duration-500 ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
          {navLinks.map((link) => (
            <NavLink key={link.name} href={link.href} active={pathname === link.href} isDark={isDark} isScrolled={isScrolled}>
              {link.name}
            </NavLink>
          ))}
          {user && (
            <NavLink href={user.role === 'admin' ? '/admin' : '/intern'} active={pathname === '/admin' || pathname === '/intern'} isDark={isDark} isScrolled={isScrolled}>
              Dashboard
            </NavLink>
          )}
        </div>

        {/* Action Button Section Area */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          {!user ? (
            <Link
              href="/login"
              className={`relative overflow-hidden ${isScrolled ? 'px-4 py-2 rounded-full text-[0.65rem]' : 'px-6 py-3 rounded-xl text-[0.7rem]'} font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-black/5 border-black/5 text-[#111] hover:bg-black/10'}`}
            >
              Login
            </Link>
          ) : (
            <button
              onClick={logout}
              className={`relative overflow-hidden ${isScrolled ? 'px-4 py-2 rounded-full text-[0.65rem]' : 'px-6 py-3 rounded-xl text-[0.7rem]'} font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400' : 'bg-black/5 border-black/5 text-[#111] hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-600'}`}
            >
              Logout
            </button>
          )}
          
          <a
            href="https://wa.me/919161391566?text=I'd like to start growing my business with Synchronous Build Digital."
            target="_blank"
            rel="noopener noreferrer"
            className={`relative group overflow-hidden ${isScrolled ? 'px-5 py-2.5 rounded-full' : 'px-8 py-3.5 rounded-xl text-xs'} shadow-lg transition-all hover:scale-[1.03] active:scale-95 border ${isDark ? 'bg-white border-black/5' : 'bg-[#111] border-white/10'}`}
          >
            <span className={`font-bold uppercase tracking-widest relative z-10 transition-all duration-500 ${isScrolled ? 'text-[0.65rem]' : 'text-xs'} ${isDark ? 'text-[#111]' : 'text-white'}`}>Start Growing</span>
            <div className={`absolute top-0 right-0 ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'} bg-[#F05E23] mask-triangle z-20 transition-all duration-500`}></div>
          </a>
        </div>

        {/* Mobile Menu Toggle Area */}
        <button
          className={`md:hidden relative z-10 p-2 transition-all active:scale-90 ${isScrolled ? 'rounded-full' : 'rounded-xl'} ${isDark ? 'text-white bg-white/5' : 'text-[#111] bg-black/5'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className={isScrolled ? 'w-5 h-5' : 'w-6 h-6'} /> : <Menu className={isScrolled ? 'w-5 h-5' : 'w-6 h-6'} />}
        </button>
      </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed inset-0 z-[70] flex flex-col p-8 sm:p-12 overflow-y-auto transition-colors duration-500 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}
          >
            <div className="flex justify-between items-center mb-16">
              <div className="flex flex-col">
                <span className={`text-2xl font-black tracking-tighter leading-none uppercase transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}>Synchronous</span>
                <span className="text-[0.7rem] font-bold tracking-[0.3em] text-[#F05E23] leading-none uppercase mt-2">Digital</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors duration-500 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-[#F9F9F9] border-black/5'}`}
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
                    className={`text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.05em] leading-[0.85] transition-all hover:tracking-[-0.03em] ${pathname === link.href ? 'text-[#F05E23]' : `${isDark ? 'text-white/40 hover:text-white' : 'text-[#111]/40 hover:text-[#111]'} hover:text-[#F05E23]`
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
              <div className={`w-full h-px transition-colors duration-500 ${isDark ? 'bg-white/10' : 'bg-black/5'}`} />
              <div className={`flex items-center justify-between transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#111]'}`}>
                <span className="font-bold uppercase tracking-widest text-[0.6rem]">Ready to Scale?</span>
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full py-8 rounded-3xl flex items-center justify-center gap-4 transition-all group border ${isDark ? 'bg-white text-[#111] border-black/5' : 'bg-[#111] text-white border-white/10'}`}
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

function NavLink({ href, children, active, isDark, isScrolled }) {
  return (
    <Link
      href={href}
      className={`relative ${isScrolled ? 'px-4 py-2 text-[0.65rem]' : 'px-5 py-2.5 text-[0.75rem]'} font-bold uppercase tracking-widest transition-all duration-300 ${active ? (isDark ? 'text-[#111]' : 'text-white') : (isDark ? 'text-white/50 hover:text-white' : 'text-slate-500 hover:text-slate-900')
        }`}
    >
      <span className="relative z-10">{children}</span>
      {active && (
        <motion.div
          layoutId="nav-pill"
          className={`absolute inset-0 ${isScrolled ? 'rounded-full' : 'rounded-xl'} shadow-lg border ${isDark ? 'bg-white border-black/5' : 'bg-[#111] border-white/10'}`}
          transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
        />
      )}
    </Link>
  );
}

