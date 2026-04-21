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
  metadataBase: new URL('https://synchronousbuilddigital.com'),
  title: {
    default: "Synchronous Build Digital | High-Velocity Growth Architecture",
    template: "%s | Synchronous Build Digital"
  },
  description: "Architecting sustainable, high-performance digital ecosystems for high-growth brands. Specialized in AI automation, brand systems, and data-backed performance marketing.",
  keywords: [
    "digital marketing", "AI automation", "brand architecture", "growth engineering",
    "Synchronous Build Digital", "performance marketing", "surgical UX", "conversion optimization",
    "headless website development", "AI-powered branding", "neural marketing scaling",
    "data-driven growth strategy", "premium digital design", "high-velocity ecommerce",
    "boutique digital agency", "enterprise growth systems", "algorithmic marketing",
    "B2B growth architecture", "DTC scaling frameworks", "custom AI assistants for business"
  ],
  authors: [{ name: "Devam Srivastava" }],
  creator: "Devam Srivastava",
  publisher: "Synchronous Build Digital",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Synchronous Build Digital | High-Velocity Growth Architecture",
    description: "Architecting sustainable, high-performance digital ecosystems for high-growth brands.",
    url: 'https://synchronousbuilddigital.com',
    siteName: 'Synchronous Build Digital',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png', // User should provide this or I'll use a placeholder/logo
        width: 1200,
        height: 630,
        alt: 'Synchronous Build Digital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Synchronous Build Digital | Growth Architecture",
    description: "Architecting sustainable, high-performance digital ecosystems.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
  },
};

import { ThemeProvider } from "../components/ThemeContext";
import { AuthProvider } from "../components/AuthContext";
import { ChatProvider } from "../components/ChatContext";

export default function RootLayout({ children }) {

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${outfit.className} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            <ChatProvider>
              <LoadingScreen />
              <Header />
              <div className="relative z-10 flex-grow pt-28 transition-colors duration-500">
                {children}
              </div>
              <CTA />
              <Footer />
              <ChatBot />
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
