"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
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
  "152K+ Instagram",
  "26.8K X",
  "300K+ Traders",
  "Since 2021",
];

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const magnetic1 = useMagnetic(0.2);
  const magnetic2 = useMagnetic(0.2);

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

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-110px)] md:min-h-[calc(100vh-126px)] flex items-center overflow-hidden"
    >
      {/* Aurora orbs — neon bloom */}
      <div className="aurora-orb aurora-orb-teal top-[10%] left-[5%]" />
      <div className="aurora-orb aurora-orb-gold bottom-[10%] right-[5%]" />
      <div className="aurora-orb aurora-orb-warm bottom-[5%] left-[30%]" />

      {/* Parallax circuit grid */}
      <div
        ref={bgRef}
        className="absolute -inset-10 pointer-events-none transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px),
            linear-gradient(rgba(168,85,247,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px, 80px 80px, 20px 20px, 20px 20px",
        }}
      />
      {/* Fade out grid at edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-transparent to-bg-primary pointer-events-none" />

      {/* Reflective floor line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-accent-warm/[0.03] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Hero logo */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo_hero.png"
                srcSet="/logo_hero.png 1x, /logo_hero@2x.png 2x"
                alt="Umair Crypto"
                className="h-20 sm:h-28 md:h-32 w-auto mx-auto lg:mx-0 drop-shadow-[0_0_40px_rgba(56,189,248,0.25)]"
              />
            </motion.div>

            {/* Badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-bg-secondary/60 backdrop-blur-xl glass-enhanced text-sm text-accent-primary font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-primary" />
                </span>
                <Users size={14} />
                300K+ Traders Community
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="font-heading text-[2rem] leading-[1.15] sm:text-5xl md:text-6xl lg:text-7xl font-bold sm:leading-[1.1] tracking-tight"
            >
              Navigate Crypto Markets{" "}
              <span className="text-gradient-animated">With Clarity.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Technical analysis. Real conviction. No fluff. Join 300,000+
              traders who trust Umair Crypto for BTC, ETH, and altcoin insights.
            </motion.p>

            {/* CTAs — full width stacked on mobile */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <a
                ref={magnetic1.ref as React.RefObject<HTMLAnchorElement>}
                onMouseMove={magnetic1.onMouseMove}
                onMouseLeave={magnetic1.onMouseLeave}
                href="#contact"
                className="inline-flex items-center justify-center px-7 py-4 text-base font-semibold rounded-xl bg-accent-primary text-bg-primary hover:brightness-110 transition-all duration-200 shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_40px_rgba(56,189,248,0.55)] btn-neon-glow"
              >
                Book a Free Consultation
              </a>
              <a
                ref={magnetic2.ref as React.RefObject<HTMLAnchorElement>}
                onMouseMove={magnetic2.onMouseMove}
                onMouseLeave={magnetic2.onMouseLeave}
                href="https://whatsapp.com/channel/0029VaqMPvw7IUYQ2BHgwr2L"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold rounded-xl border border-border text-text-primary hover:bg-bg-tertiary transition-all duration-200"
              >
                Join the Community
                <ArrowRight size={18} />
              </a>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={5}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2 sm:gap-x-4 gap-y-1 text-xs sm:text-sm text-text-secondary pt-2"
            >
              {trustItems.map((item, i) => (
                <span key={i} className="flex items-center gap-1 sm:gap-2">
                  {i > 0 && <span className="text-border">·</span>}
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — Umair's photo */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="hidden lg:flex justify-center lg:justify-end"
          >
            <div className="relative w-80 h-[26rem] md:w-[26rem] md:h-[30rem]">
              {/* Glow behind the photo */}
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-accent-primary/20 via-transparent to-accent-secondary/20 blur-2xl" />
              <div className="relative w-full h-full rounded-2xl border border-white/[0.08] glass-enhanced overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/umair-hero.jpg"
                  alt="Umair Orakzai - Crypto Analyst"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
