import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
    "Professional cryptocurrency trading signals, market analysis, and crypto education by Umair. Join 200K+ traders for expert BTC & ETH technical analysis and 1-on-1 consultations.",
  keywords: [
    "crypto trading signals",
    "cryptocurrency analysis",
    "BTC signals",
    "ETH analysis",
    "crypto consultancy",
    "technical analysis",
    "UmairCrypto",
    "crypto education",
    "altcoin signals",
    "crypto trading community",
  ],
  metadataBase: new URL("https://umaircrypto.com"),
  alternates: {
    canonical: "https://umaircrypto.com",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "UmairCrypto - Crypto Trading Signals & Analysis",
    description:
      "Professional crypto trading signals & analysis. Join 200K+ traders for expert BTC & ETH insights.",
    url: "https://umaircrypto.com",
    siteName: "UmairCrypto",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UmairCrypto - Crypto Trading Signals & Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@Umairorkz",
    title: "UmairCrypto - Crypto Trading Signals & Analysis",
    description:
      "Professional crypto trading signals & analysis. Join 200K+ traders for expert BTC & ETH insights.",
    images: [
      {
        url: "/twitter-card.png",
        width: 1200,
        height: 600,
        alt: "UmairCrypto - Crypto Trading Signals & Analysis",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "UmairCrypto",
                  url: "https://umaircrypto.com",
                  logo: "https://umaircrypto.com/UmairLogo.png",
                  description:
                    "Professional cryptocurrency trading signals, market analysis, and crypto education.",
                  founder: {
                    "@type": "Person",
                    name: "Umair Orakzai",
                  },
                  sameAs: [
                    "https://instagram.com/umairorkz",
                    "https://x.com/Umairorkz",
                    "https://whatsapp.com/channel/0029VaqMPvw7IUYQ2BHgwr2L",
                  ],
                },
                {
                  "@type": "WebSite",
                  name: "UmairCrypto",
                  url: "https://umaircrypto.com",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://umaircrypto.com/?q={search_term_string}",
                    "query-input":
                      "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-body antialiased overflow-x-hidden`}
      >
        {/*
          Preloader gate — covers screen with dark bg until removed.
          Removed by:
          - Homepage: Preloader component (after animation, or instantly if session already played)
          - /payment, /risk: useEffect in those page components
        */}
        <div
          id="preloader-gate"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "#060612",
            pointerEvents: "none",
          }}
        />

        {/* Circuit board grid overlay */}
        <div className="circuit-grid" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}