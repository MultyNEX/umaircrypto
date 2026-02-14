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
  title: "Umair Crypto | Crypto Trading Consultant & Analyst",
  description:
    "Join 300K+ traders. Umair Orakzai provides expert BTC & ETH technical analysis, 1-on-1 consultations, and a thriving crypto trading community. 152K+ on Instagram.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Umair Crypto | Crypto Trading Consultant & Analyst",
    description:
      "Join 300K+ traders. Umair Orakzai provides expert BTC & ETH technical analysis, 1-on-1 consultations, and a thriving crypto trading community.",
    type: "website",
    locale: "en_US",
    url: "https://umaircrypto.com",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@Umairorkz",
    title: "Umair Crypto | Crypto Trading Consultant & Analyst",
    description:
      "Join 300K+ traders. Umair Orakzai provides expert BTC & ETH technical analysis, 1-on-1 consultations, and a thriving crypto trading community.",
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
