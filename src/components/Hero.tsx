"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowRight, Users, TrendingUp, Calendar, X } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

const trustItems = [
  { label: "152K+ Instagram", icon: TrendingUp },
  { label: "30K+ X", icon: TrendingUp },
  { label: "200K+ Traders", icon: Users },
  { label: "Since 2020", icon: Calendar },
];

// ─── Social links data ──────────────────────────────────────────────
const SOCIALS = [
  {
    name: "Instagram",
    handle: "@umairorkz",
    followers: "152K",
    posts: "280+",
    href: "https://instagram.com/umairorkz",
    color: "#E4405F",
    verified: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    handle: "@Umairorkz",
    followers: "30K+",
    posts: "Daily",
    href: "https://x.com/Umairorkz",
    color: "#1DA1F2",
    verified: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    handle: "Channel",
    followers: "25K+",
    posts: "Updates",
    href: "https://whatsapp.com/channel/0029VaqMPvw7IUYQ2BHgwr2L",
    color: "#25D366",
    verified: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    handle: "@umairfromx",
    followers: "900+",
    posts: "Signals",
    href: "https://t.me/umairfromx",
    color: "#229ED9",
    verified: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

// ─── Verified badge component ───────────────────────────────────────
function VerifiedBadge() {
  return (
    <svg
      viewBox="0 0 22 22"
      fill="#1DA1F2"
      className="inline w-3.5 h-3.5 ml-1 align-middle"
    >
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.144.271.587.703 1.087 1.24 1.44s1.167.551 1.813.568c.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.224 1.261.272 1.894.144.636-.13 1.22-.433 1.69-.878.445-.47.749-1.055.878-1.69.13-.634.08-1.29-.144-1.898.587-.274 1.087-.705 1.443-1.243.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </svg>
  );
}

// ─── Animation variants ─────────────────────────────────────────────
const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.1 + i * 0.08,
      duration: 0.4,
      ease: "easeOut" as const,
    },
  }),
};

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const magnetic1 = useMagnetic(0.2);
  const magnetic2 = useMagnetic(0.2);
  const [showSocials, setShowSocials] = useState(false);

  // Parallax background on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      bgRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Close on Escape key + lock scroll
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSocials(false);
    };
    if (showSocials) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [showSocials]);

  // Auto-updating years of experience
  const yearsExp = new Date().getFullYear() - 2020;

  return (
    <>
      <section
        id="hero"
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Aurora orbs */}
        <div className="aurora-orb aurora-orb-teal top-[10%] left-[5%]" />
        <div className="aurora-orb aurora-orb-gold bottom-[10%] right-[5%]" />
        <div className="aurora-orb aurora-orb-warm bottom-[5%] left-[30%]" />

        {/* Subtle green glow behind heading area */}
        <div className="absolute top-1/4 left-[10%] w-[500px] h-[400px] rounded-full bg-accent-primary/[0.06] blur-[120px] pointer-events-none" />

        {/* Background image with parallax */}
        <div
          ref={bgRef}
          className="absolute -inset-10 pointer-events-none transition-transform duration-1000 ease-out bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-bg-primary/60 pointer-events-none" />
        {/* Fade edges into site background */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/80 via-transparent to-bg-primary pointer-events-none" />

        {/* Reflective floor line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-accent-warm/[0.03] to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 w-full py-10 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Text content */}
            <div className="space-y-7 sm:space-y-8 text-center lg:text-left">
              {/* Green pill badge */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-accent-primary/15 text-sm text-accent-primary font-semibold tracking-wide">
                  <Users size={16} />
                  200K+ Traders Community
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="font-heading font-bold tracking-tight"
                style={{
                  fontSize: "clamp(2.25rem, 5vw, 4rem)",
                  lineHeight: 1.08,
                }}
              >
                Navigate Crypto Markets{" "}
                <span className="text-accent-primary">With Clarity.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Technical analysis. Real conviction. No fluff. Join 200,000+
                traders who trust Umair Crypto for BTC, ETH, and altcoin
                insights.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <a
                  ref={magnetic1.ref as React.RefObject<HTMLAnchorElement>}
                  onMouseMove={magnetic1.onMouseMove}
                  onMouseLeave={magnetic1.onMouseLeave}
                  href="/payment?from=hero"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl bg-accent-primary text-bg-primary hover:brightness-110 transition-all duration-200 shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_40px_rgba(56,189,248,0.55)] btn-neon-glow"
                >
                  Get Started
                  <ArrowRight size={18} />
                </a>
                <button
                  ref={magnetic2.ref as React.RefObject<HTMLButtonElement>}
                  onMouseMove={magnetic2.onMouseMove}
                  onMouseLeave={magnetic2.onMouseLeave}
                  onClick={() => setShowSocials(true)}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-semibold rounded-xl border border-white/[0.08] bg-white/[0.03] text-text-primary hover:bg-white/[0.06] transition-all duration-200"
                >
                  <span className="flex items-center gap-1.5 opacity-60">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#E4405F]"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#1DA1F2]"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#229ED9]"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  </span>
                  Connect With Me
                </button>
              </motion.div>

              {/* Social proof bar with icons */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={4}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 sm:gap-x-6 gap-y-2 text-sm text-text-secondary pt-3"
              >
                {trustItems.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5">
                    <item.icon size={14} className="text-accent-primary" />
                    {item.label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — Hero image card with floating badges */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="flex justify-center lg:justify-end order-first lg:order-last"
            >
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-accent-primary/15 via-transparent to-accent-secondary/15 blur-3xl" />

                {/* Main image card */}
                <div className="relative w-[280px] h-[340px] sm:w-[350px] sm:h-[420px] lg:w-[420px] lg:h-[480px] rounded-2xl border border-white/[0.08] overflow-hidden bg-bg-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/umair-hero.jpg"
                    alt="Umair Orakzai - Crypto Analyst"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/70 via-transparent to-bg-primary/20" />
                </div>

                {/* Floating badge — 200K+ Community (top-left) */}
                <div
                  className="absolute -left-12 top-[18%] z-20 float-bob"
                  style={{ animationDelay: "0s" }}
                >
                  <div className="px-5 py-4 rounded-xl border border-white/[0.1] bg-bg-primary/60 backdrop-blur-xl shadow-lg">
                    <p className="text-2xl font-bold text-accent-primary font-heading">
                      200K+
                    </p>
                    <p className="text-[11px] font-semibold tracking-[0.2em] text-text-secondary uppercase mt-0.5">
                      Community
                    </p>
                  </div>
                </div>

                {/* Floating badge — Years Exp (bottom-right, auto-updates) */}
                <div
                  className="absolute -right-10 bottom-[15%] z-20 float-bob"
                  style={{ animationDelay: "1.5s" }}
                >
                  <div className="px-5 py-4 rounded-xl border border-white/[0.1] bg-bg-primary/60 backdrop-blur-xl shadow-lg">
                    <p className="text-2xl font-bold text-accent-primary font-heading">
                      {yearsExp}+
                    </p>
                    <p className="text-[11px] font-semibold tracking-[0.2em] text-text-secondary uppercase mt-0.5">
                      Years Exp.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SOCIAL MEDIA POP-UP MODAL — STYLE 1 (2×2 Grid)
          ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showSocials && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[9998] flex items-center justify-center px-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-bg-primary/80 backdrop-blur-xl"
              onClick={() => setShowSocials(false)}
            />

            {/* Ambient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-accent-primary/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full bg-accent-secondary/[0.08] blur-[100px] pointer-events-none" />

            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 w-full max-w-[480px]"
            >
              <div className="relative rounded-2xl border border-white/[0.08] bg-bg-secondary/60 backdrop-blur-2xl overflow-hidden">
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent" />

                {/* Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/[0.03] via-transparent to-accent-secondary/[0.03] pointer-events-none" />

                {/* Close button */}
                <button
                  onClick={() => setShowSocials(false)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-text-secondary hover:text-text-primary hover:bg-white/[0.1] transition-all duration-200"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                {/* Content */}
                <div className="relative p-6 sm:p-8">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-accent-primary text-xs font-semibold tracking-[0.25em] uppercase mb-2"
                    >
                      Let&apos;s Connect
                    </motion.p>
                    <motion.h3
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="font-heading text-xl sm:text-2xl font-bold text-text-primary"
                    >
                      Follow{" "}
                      <span className="text-gradient-animated">
                        Umair Crypto
                      </span>
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-text-secondary text-sm mt-1.5"
                    >
                      Daily market updates, TA breakdowns &amp; community
                    </motion.p>
                  </div>

                  {/* 2×2 Social Cards Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {SOCIALS.map((social, i) => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                        className="group relative flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-300 overflow-hidden"
                        style={{
                          ["--card-color" as string]: social.color,
                        }}
                      >
                        {/* Hover glow */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at 50% 30%, ${social.color}12 0%, transparent 70%)`,
                          }}
                        />

                        {/* Hover border accent */}
                        <div
                          className="absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{ borderColor: `${social.color}30` }}
                        />

                        {/* Avatar circle */}
                        <div
                          className="relative w-[50px] h-[50px] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${social.color}25, ${social.color}10)`,
                            border: `2px solid ${social.color}40`,
                            color: social.color,
                          }}
                        >
                          {social.icon}
                          {/* Glow on hover */}
                          <div
                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
                            style={{ backgroundColor: `${social.color}20` }}
                          />
                        </div>

                        {/* Name + handle */}
                        <div className="relative text-center">
                          <p className="text-text-primary font-semibold text-[13px] group-hover:text-white transition-colors duration-200">
                            {social.name}
                            {social.verified && <VerifiedBadge />}
                          </p>
                          <p className="text-text-secondary text-[11px]">
                            {social.handle}
                          </p>
                        </div>

                        {/* Stats row */}
                        <div className="relative flex gap-4 justify-center">
                          <div className="text-center">
                            <p
                              className="text-[15px] font-extrabold font-mono"
                              style={{ color: social.color }}
                            >
                              {social.followers}
                            </p>
                            <p className="text-[9px] text-text-secondary uppercase tracking-[0.1em]">
                              followers
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[15px] font-extrabold font-mono text-text-primary">
                              {social.posts}
                            </p>
                            <p className="text-[9px] text-text-secondary uppercase tracking-[0.1em]">
                              posts
                            </p>
                          </div>
                        </div>

                        {/* Follow button */}
                        <button
                          className="relative w-full py-[7px] rounded-lg text-[12px] font-bold tracking-[0.03em] text-white transition-all duration-300 group-hover:brightness-110 group-hover:shadow-lg"
                          style={{
                            backgroundColor: social.color,
                            boxShadow: `0 0 0px ${social.color}00`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 16px ${social.color}40`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 0px ${social.color}00`;
                          }}
                          onClick={(e) => e.stopPropagation()}
                          tabIndex={-1}
                        >
                          Follow
                        </button>
                      </motion.a>
                    ))}
                  </div>

                  {/* Bottom tagline */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-text-secondary/50 text-[11px] tracking-[0.15em] uppercase mt-5"
                  >
                    200K+ Total Following · Founder of @thechuffgang
                  </motion.p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-secondary/30 to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}