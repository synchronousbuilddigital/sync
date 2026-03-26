import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingScreen from "../components/LoadingScreen";
import ChatBot from "../components/ChatBot";
import CTA from "../components/CTA";

const outfit = Outfit({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Synchronous Build Digital | High-Velocity Growth Architecture",
  description: "Architecting sustainable, high-performance digital ecosystems for high-growth brands. Specialized in AI automation, brand systems, and data-backed performance marketing.",
  keywords: ["digital marketing", "AI automation", "brand architecture", "growth engineering", "Synchronous Build Digital", "performance marketing"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${outfit.className} antialiased min-h-screen flex flex-col`}
        style={{ backgroundColor: '#FFFFFF', color: '#0F1729' }}
        suppressHydrationWarning
      >
        <LoadingScreen />
        <Header />
        {/* Premium Ambient Background — warm subtle glow orbs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          {/* Top-left warm indigo glow */}
          <div className="absolute -top-[200px] -left-[200px] w-[700px] h-[700px] rounded-full opacity-[0.04] animate-ambient"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)' }}
          ></div>
          {/* Center-right violet glow */}
          <div className="absolute top-[30%] -right-[150px] w-[600px] h-[600px] rounded-full opacity-[0.03] animate-ambient"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)', animationDelay: '5s' }}
          ></div>
          {/* Bottom warm golden glow */}
          <div className="absolute -bottom-[200px] left-[30%] w-[500px] h-[500px] rounded-full opacity-[0.025] animate-ambient"
            style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.4), transparent 70%)', animationDelay: '10s' }}
          ></div>
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
          ></div>
        </div>
        <div className="relative z-10 flex-grow pt-28">
          {children}
        </div>
        <CTA />
        <Footer />
        <ChatBot />
      </body>
    </html>
  );
}
