import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import ParticleBackground from "@/components/ParticleBackground";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UmairCrypto - Crypto Trading Signals & Analysis",
    template: "%s | UmairCrypto",
  },
  description:
    "Professional cryptocurrency trading signals, market analysis, and crypto education by Umair. Join 300K+ traders for expert BTC & ETH technical analysis and 1-on-1 consultations.",
  metadataBase: new URL("https://umaircrypto.com"),
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "UmairCrypto",
    description:
      "Professional crypto trading signals & analysis. Join 300K+ traders for expert BTC & ETH insights.",
    url: "https://umaircrypto.com",
    siteName: "UmairCrypto",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@Umairorkz",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-body antialiased overflow-x-hidden`}
      >
        <Preloader />
        <CustomCursor />
        <ParticleBackground />
        {/* Circuit board grid overlay */}
        <div className="circuit-grid" aria-hidden="true" />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
