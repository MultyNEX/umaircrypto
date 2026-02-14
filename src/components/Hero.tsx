"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";

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
  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-110px)] md:min-h-[calc(100vh-126px)] flex items-center overflow-hidden"
    >
      {/* Background grid — larger cells on mobile to avoid visual noise */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(42,42,62,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(42,42,62,0.2)_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:60px_60px] pointer-events-none" />
      {/* Fade out grid at edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-transparent to-bg-primary pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-bg-secondary/60 backdrop-blur-xl glass text-sm text-accent-primary font-medium">
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
              custom={1}
              className="font-heading text-[2rem] leading-[1.15] sm:text-5xl md:text-6xl lg:text-7xl font-bold sm:leading-[1.1] tracking-tight"
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
              custom={3}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-7 py-4 text-base font-semibold rounded-xl bg-accent-primary text-bg-primary hover:brightness-110 transition-all duration-200 shadow-[0_0_25px_rgba(0,212,170,0.35)] hover:shadow-[0_0_40px_rgba(0,212,170,0.55)]"
              >
                Book a Free Consultation
              </a>
              <a
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
              custom={4}
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

          {/* Right — Photo placeholder (hidden on mobile, no image yet) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="hidden lg:flex justify-center lg:justify-end"
          >
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-primary/20 via-transparent to-accent-secondary/20 blur-2xl" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-bg-tertiary to-bg-secondary border border-border flex items-center justify-center overflow-hidden">
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-accent-primary/10 via-bg-secondary to-accent-secondary/10" />
                <span className="relative text-text-secondary text-sm font-medium tracking-wide">
                  PHOTO COMING SOON
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
