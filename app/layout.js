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

import { ThemeProvider } from "../components/ThemeContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${outfit.className} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <LoadingScreen />
          <Header />
          <div className="relative z-10 flex-grow pt-28 transition-colors duration-500">
            {children}
          </div>
          <CTA />
          <Footer />
          <ChatBot />
        </ThemeProvider>
      </body>
    </html>
  );
}
