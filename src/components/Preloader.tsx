"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const duration = 1800;

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), 400);
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
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060612]"
        >
          {/* Atmospheric background glow */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-accent-primary/8 blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-[28rem] h-[28rem] rounded-full bg-accent-secondary/8 blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-accent-warm/5 to-transparent" />
          </div>

          {/* Circuit grid in background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-60" />

          {/* Full logo with cityscape */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 mb-8"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo_hero.png"
              srcSet="/logo_hero.png 1x, /logo_hero@2x.png 2x"
              alt="Umair Crypto"
              className="w-52 sm:w-72 h-auto drop-shadow-[0_0_60px_rgba(56,189,248,0.3)]"
            />
          </motion.div>

          {/* Neon progress bar */}
          <div className="relative z-10 w-48 sm:w-64">
            <div className="h-[2px] rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            {/* Glow under progress bar */}
            <div
              className="h-4 -mt-2 rounded-full blur-md bg-gradient-to-r from-accent-primary/30 via-accent-secondary/30 to-accent-primary/30 transition-all"
              style={{ width: `${progress}%` }}
            />
            <p className="text-text-secondary text-xs font-mono text-center mt-2 tracking-widest">
              {progress}%
            </p>
          </div>

          {/* Reflective line at bottom */}
          <div className="absolute bottom-20 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
