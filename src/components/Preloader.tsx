"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 3,
  duration: Math.random() * 3 + 2,
}));

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const duration = 2200;

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), 500);
      }
    };

    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060612]"
        >
          {/* Atmospheric background glows */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-primary blur-[160px]"
            />
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.06, 0.15, 0.06] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-secondary blur-[160px]"
            />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-accent-warm/[0.06] to-transparent" />
          </div>

          {/* Circuit grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />

          {/* Floating particles */}
          <div className="absolute inset-0">
            {PARTICLES.map((p) => (
              <motion.span
                key={p.id}
                className="absolute rounded-full bg-accent-primary"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                }}
                animate={{
                  opacity: [0, 0.5, 0],
                  y: [0, -30, -60],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* Spinning ring around logo */}
          <div className="relative z-10 mb-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 sm:-inset-12"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#A855F7" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <circle
                  cx="100" cy="100" r="95"
                  fill="none"
                  stroke="url(#ring-grad)"
                  strokeWidth="1.5"
                  strokeDasharray="80 200"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* Reverse spinning ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-12 sm:-inset-16"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle
                  cx="100" cy="100" r="95"
                  fill="none"
                  stroke="#A855F7"
                  strokeOpacity="0.15"
                  strokeWidth="1"
                  strokeDasharray="40 260"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* Pulsing glow behind logo */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-accent-primary/20 blur-[40px]"
            />

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/UmairLogo.png"
                alt="Umair Crypto"
                className="w-64 sm:w-80 md:w-96 h-auto drop-shadow-[0_0_80px_rgba(56,189,248,0.35)]"
                style={{ imageRendering: "crisp-edges" }}
              />
            </motion.div>
          </div>

          {/* Progress bar area */}
          <div className="relative z-10 w-56 sm:w-72">
            {/* Progress bar */}
            <div className="h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            {/* Glow under bar */}
            <div
              className="h-6 -mt-3 rounded-full blur-lg bg-gradient-to-r from-accent-primary/25 via-accent-secondary/25 to-accent-primary/25 transition-all"
              style={{ width: `${progress}%` }}
            />
            <p className="text-text-secondary text-xs font-mono text-center mt-1 tracking-[0.3em]">
              {progress}%
            </p>
          </div>

          {/* Reflective lines */}
          <div className="absolute bottom-24 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-accent-primary/15 to-transparent" />
          <div className="absolute bottom-16 left-[25%] right-[25%] h-px bg-gradient-to-r from-transparent via-accent-secondary/10 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
