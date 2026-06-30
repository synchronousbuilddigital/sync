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
    default: "Synchronous Build Digital | Expert Branding & Websites",
    template: "%s | Synchronous Build Digital"
  },
  description: "Helping brands grow with fast websites, expert design, and smart AI tools. We build high-quality digital systems that work for you.",
  keywords: [
    "digital marketing", "AI tools", "brand design", "growth strategy",
    "Synchronous Build Digital", "performance marketing", "quality design", "conversion optimization",
    "website development", "AI branding", "marketing scaling",
    "data-driven growth", "premium digital design", "fast ecommerce",
    "boutique digital agency", "business growth", "smart marketing",
    "B2B growth", "scaling strategy", "custom AI assistants"
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
    title: "Synchronous Build Digital | Expert Branding & Websites",
    description: "Helping brands grow with fast websites, expert design, and smart AI tools.",
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
    title: "Synchronous Build Digital | Branding & Websites",
    description: "Helping brands grow with fast websites and smart AI tools.",
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
  manifest: '/manifest.json',
};

import { ThemeProvider } from "../components/ThemeContext";
import { AuthProvider } from "../components/AuthContext";
import { ChatProvider } from "../components/ChatContext";
import PWARegister from "../components/PWARegister";

export default function RootLayout({ children }) {

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F05E23" />
      </head>
      <body
        className={`${outfit.className} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <PWARegister />
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
