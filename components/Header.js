"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Zap, Sun, Moon, Bell, CheckCircle2, Clock, MessageSquare, ExternalLink, Calendar, Activity } from "lucide-react";
import { useTheme } from './ThemeContext';
import { useAuth } from "./AuthContext";
import PWAInstallButton from "./PWAInstallButton";

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Process', href: '/process' },
  { name: 'Work', href: '/work' },
  { name: 'Production', href: '/production' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, notifications = [], unreadNotifCount = 0, markAllNotificationsRead } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNotifClick = (n) => {
    if (n.unread) markAllNotificationsRead();
    setNotifOpen(false);
    if (n.taskId) {
      const dashPath = user?.role === 'admin' ? '/admin' : (user?.role === 'brand_manager' ? '/brand' : (user?.role === 'client' ? '/client' : '/intern'));
      const action = n.type === 'chat' ? 'chat' : 'update';
      const targetUrl = `${dashPath}?notif_task=${n.taskId}&notif_action=${action}`;
      if (pathname === dashPath) {
        window.history.pushState({}, '', targetUrl);
        window.dispatchEvent(new Event('notif_navigation'));
      } else {
        router.push(targetUrl);
      }
    } else if (n.type === 'leave') {
      const dashPath = user?.role === 'admin' ? '/admin' : '/intern';
      const targetUrl = `${dashPath}?notif_section=leave`;
      if (pathname === dashPath) {
        window.history.pushState({}, '', targetUrl);
        window.dispatchEvent(new Event('notif_navigation'));
      } else {
        router.push(targetUrl);
      }
    }
  };

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
            <NavLink href={user.role === 'admin' ? '/admin' : (user.role === 'client' ? '/client' : (user.role === 'brand_manager' ? '/brand' : '/intern'))} active={pathname === '/admin' || pathname === '/intern' || pathname === '/client' || pathname === '/brand'} isDark={isDark} isScrolled={isScrolled}>
              Dashboard
            </NavLink>
          )}
        </div>

        {/* Action Button Section Area */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          {/* Notification Bell */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                title="Notifications"
                className={`relative overflow-hidden ${isScrolled ? 'p-2 rounded-full' : 'p-2.5 rounded-xl'} border transition-all hover:scale-105 active:scale-95 group ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white hover:bg-amber-400/20 hover:border-amber-400/30 hover:text-amber-400'
                    : 'bg-black/5 border-black/5 text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600'
                }`}
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F05E23] text-white text-[0.55rem] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-[#F05E23]/50">
                    {unreadNotifCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`relative overflow-hidden ${isScrolled ? 'p-2 rounded-full' : 'p-2.5 rounded-xl'} border transition-all hover:scale-105 active:scale-95 group ${
              isDark
                ? 'bg-white/5 border-white/10 text-white hover:bg-amber-400/20 hover:border-amber-400/30 hover:text-amber-400'
                : 'bg-black/5 border-black/5 text-slate-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            {isDark
              ? <Sun className="w-4 h-4 transition-transform group-hover:rotate-45 duration-300" />
              : <Moon className="w-4 h-4 transition-transform group-hover:-rotate-12 duration-300" />
            }
          </button>
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
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className={`relative z-10 p-2 transition-all active:scale-90 ${isScrolled ? 'rounded-full' : 'rounded-xl'} ${
                  isDark ? 'text-white bg-white/5' : 'text-slate-700 bg-black/5'
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F05E23] text-white text-[0.55rem] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-[#F05E23]/50">
                    {unreadNotifCount}
                  </span>
                )}
              </button>
            </div>
          )}
          <button
            onClick={toggleTheme}
            className={`relative z-10 p-2 transition-all active:scale-90 ${isScrolled ? 'rounded-full' : 'rounded-xl'} ${
              isDark
                ? 'text-amber-400 bg-amber-400/10'
                : 'text-slate-600 bg-black/5'
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            className={`relative z-10 p-2 transition-all active:scale-90 ${isScrolled ? 'rounded-full' : 'rounded-xl'} ${isDark ? 'text-white bg-white/5' : 'text-[#111] bg-black/5'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className={isScrolled ? 'w-5 h-5' : 'w-6 h-6'} /> : <Menu className={isScrolled ? 'w-5 h-5' : 'w-6 h-6'} />}
          </button>
        </div>
      </motion.nav>
      </div>

      {/* Glassmorphic Notification Dropdown Panel */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed top-16 sm:top-20 right-2 sm:right-6 w-[calc(100vw-1rem)] sm:w-96 max-h-[75vh] bg-white dark:bg-[#0A0A0E] rounded-[2rem] shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden z-[1000] flex flex-col backdrop-blur-3xl"
          >
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#F05E23] to-[#ff7e47] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5" />
                <h3 className="text-sm sm:text-base font-black uppercase tracking-wider italic">Notifications</h3>
                {unreadNotifCount > 0 && (
                  <span className="bg-white text-[#F05E23] px-2 py-0.5 rounded-full text-[0.6rem] font-black">{unreadNotifCount} New</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {unreadNotifCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[0.6rem] font-black uppercase tracking-widest bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-xl transition-all"
                  >
                    Mark Read
                  </button>
                )}
                <button onClick={() => setNotifOpen(false)} className="hover:bg-white/20 p-1.5 rounded-xl transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto divide-y divide-black/5 dark:divide-white/5 max-h-[60vh] p-2 space-y-1">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="w-8 h-8 opacity-40" />
                  No new notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotifClick(n)}
                    className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer flex items-start gap-3 ${
                      n.unread ? "bg-[#F05E23]/10 dark:bg-[#F05E23]/15 border border-[#F05E23]/20" : "hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${n.type === 'task' ? 'bg-amber-500/10 text-amber-500' : n.type === 'link' ? 'bg-blue-500/10 text-blue-500' : n.type === 'chat' ? 'bg-purple-500/10 text-purple-500' : 'bg-green-500/10 text-green-500'}`}>
                      {n.type === 'task' ? <Activity className="w-4 h-4" /> : n.type === 'link' ? <ExternalLink className="w-4 h-4" /> : n.type === 'chat' ? <MessageSquare className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-black uppercase tracking-wide truncate text-slate-900 dark:text-white">{n.title}</h4>
                        <span className="text-[0.55rem] font-bold text-slate-400 shrink-0 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[0.65rem] font-bold text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">{n.desc}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              {user && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  <Link
                    href={user.role === 'admin' ? '/admin' : (user.role === 'client' ? '/client' : (user.role === 'brand_manager' ? '/brand' : '/intern'))}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.05em] leading-[0.85] transition-all hover:tracking-[-0.03em] ${
                      pathname === '/admin' || pathname === '/intern' || pathname === '/client' || pathname === '/brand' ? 'text-[#F05E23]' : `${isDark ? 'text-white/40 hover:text-white' : 'text-[#111]/40 hover:text-[#111]'} hover:text-[#F05E23]`
                    }`}
                  >
                    Dashboard
                  </Link>
                </motion.div>
              )}
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
              <PWAInstallButton isDark={isDark} mobile={true} />
              {!user ? (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm transition-all shadow-sm border ${
                    isDark ? 'bg-white/10 text-white border-white/10 hover:bg-white/20' : 'bg-black/5 text-[#111] border-black/10 hover:bg-black/10'
                  }`}
                >
                  <span>Login / Portal Access</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm transition-all shadow-sm border ${
                    isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-50 text-red-600 border-red-200'
                  }`}
                >
                  <span>Logout</span>
                </button>
              )}
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
