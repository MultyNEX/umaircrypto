"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Users, TrendingUp, Calendar } from "lucide-react";
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
  { label: "26.8K X", icon: TrendingUp },
  { label: "300K+ Traders", icon: Users },
  { label: "Since 2021", icon: Calendar },
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
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Aurora orbs */}
      <div className="aurora-orb aurora-orb-teal top-[10%] left-[5%]" />
      <div className="aurora-orb aurora-orb-gold bottom-[10%] right-[5%]" />
      <div className="aurora-orb aurora-orb-warm bottom-[5%] left-[30%]" />

      {/* Subtle green glow behind heading area */}
      <div className="absolute top-1/4 left-[10%] w-[500px] h-[400px] rounded-full bg-accent-primary/[0.06] blur-[120px] pointer-events-none" />

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

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full py-20 md:py-28 lg:py-32">
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
                300K+ Traders Community
              </span>
            </motion.div>

            {/* Headline — significantly larger */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-heading font-bold tracking-tight"
              style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)", lineHeight: 1.08 }}
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
              className="text-text-secondary text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Technical analysis. Real conviction. No fluff. Join 300,000+
              traders who trust Umair Crypto for BTC, ETH, and altcoin insights.
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
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl bg-accent-primary text-bg-primary hover:brightness-110 transition-all duration-200 shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_40px_rgba(56,189,248,0.55)] btn-neon-glow"
              >
                Book a Free Consultation
                <ArrowRight size={18} />
              </a>
              <a
                ref={magnetic2.ref as React.RefObject<HTMLAnchorElement>}
                onMouseMove={magnetic2.onMouseMove}
                onMouseLeave={magnetic2.onMouseLeave}
                href="https://whatsapp.com/channel/0029VaqMPvw7IUYQ2BHgwr2L"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl border border-white/[0.08] bg-white/[0.03] text-text-primary hover:bg-white/[0.06] transition-all duration-200"
              >
                Join the Community
                <ArrowRight size={18} />
              </a>
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
            className="hidden lg:flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-accent-primary/15 via-transparent to-accent-secondary/15 blur-3xl" />

              {/* Main image card */}
              <div className="relative w-[420px] h-[480px] rounded-2xl border border-white/[0.08] overflow-hidden bg-bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/umair-hero.jpg"
                  alt="Umair Orakzai - Crypto Analyst"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/70 via-transparent to-bg-primary/20" />
              </div>

              {/* Floating badge — 300K+ Community (top-left) */}
              <div
                className="absolute -left-12 top-[18%] z-20 float-bob"
                style={{ animationDelay: "0s" }}
              >
                <div className="px-5 py-4 rounded-xl border border-white/[0.1] bg-bg-primary/60 backdrop-blur-xl shadow-lg">
                  <p className="text-2xl font-bold text-accent-primary font-heading">
                    300K+
                  </p>
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-text-secondary uppercase mt-0.5">
                    Community
                  </p>
                </div>
              </div>

              {/* Floating badge — 4+ Years Exp (bottom-right) */}
              <div
                className="absolute -right-10 bottom-[15%] z-20 float-bob"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="px-5 py-4 rounded-xl border border-white/[0.1] bg-bg-primary/60 backdrop-blur-xl shadow-lg">
                  <p className="text-2xl font-bold text-accent-primary font-heading">
                    4+
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
  );
}
