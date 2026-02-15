"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Crypto symbols sized by market cap ─────────────────────────────
const CRYPTO_SYMBOLS = [
  { char: "₿", color: "#f7931a", size: 44 },
  { char: "Ξ", color: "#627eea", size: 38 },
  { char: "✕", color: "#38bdf8", size: 32 },
  { char: "₮", color: "#26a17b", size: 28 },
  { char: "◎", color: "#9945ff", size: 26 },
  { char: "B", color: "#f3ba2f", size: 24 },
  { char: "₳", color: "#0033ad", size: 22 },
  { char: "⬡", color: "#e6007a", size: 20 },
  { char: "Ð", color: "#c2a633", size: 18 },
  { char: "◈", color: "#2775ca", size: 16 },
];

// Pre-generate positions in a grid to ensure even spread
function generateSymbolPositions() {
  const positions: {
    symbol: typeof CRYPTO_SYMBOLS[number];
    x: number;
    y: number;
    delay: number;
    duration: number;
    floatAmp: number;
  }[] = [];

  // 5 cols x 4 rows = 20 symbols, 2 of each
  const cols = 5;
  const rows = 4;
  const total = cols * rows;

  for (let i = 0; i < total; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const sym = CRYPTO_SYMBOLS[i % CRYPTO_SYMBOLS.length];

    // Position within cell + jitter
    const cellW = 100 / cols;
    const cellH = 100 / rows;
    const x = cellW * (col + 0.5) + (Math.random() - 0.5) * cellW * 0.6;
    const y = cellH * (row + 0.5) + (Math.random() - 0.5) * cellH * 0.5;

    positions.push({
      symbol: sym,
      x: Math.max(3, Math.min(97, x)),
      y: Math.max(3, Math.min(97, y)),
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 3,
      floatAmp: 10 + Math.random() * 15,
    });
  }

  return positions;
}

// Generate once at module level so positions are stable
const SYMBOL_POSITIONS = generateSymbolPositions();

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const progressRef = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 3200;
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      // Don't start counting until 400ms in
      const adjusted = Math.max(0, elapsed - 400);
      const p = Math.min(adjusted / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      const val = Math.round(eased * 100);

      // Only update state every 3% to reduce rerenders on mobile
      if (val !== progressRef.current && (val - progressRef.current >= 3 || val === 100)) {
        progressRef.current = val;
        setProgress(val);
      }

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), 500);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060612]"
        >
          {/* Inline styles for CSS-only animations (no Framer Motion overhead) */}
          <style>{`
            @keyframes preloader-float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(var(--float-amp, -15px)); }
            }
            @keyframes preloader-pulse {
              0% { opacity: 0; }
              15% { opacity: var(--pulse-max, 0.18); }
              50% { opacity: var(--pulse-max, 0.18); }
              85% { opacity: var(--pulse-min, 0.06); }
              100% { opacity: var(--pulse-min, 0.06); }
            }
            @keyframes preloader-glow-a {
              0%, 100% { transform: scale(1); opacity: 0.08; }
              50% { transform: scale(1.3); opacity: 0.18; }
            }
            @keyframes preloader-glow-b {
              0%, 100% { transform: scale(1); opacity: 0.06; }
              50% { transform: scale(1.4); opacity: 0.15; }
            }
            @keyframes preloader-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes preloader-spin-reverse {
              from { transform: rotate(0deg); }
              to { transform: rotate(-360deg); }
            }
            @keyframes preloader-logo-in {
              from { opacity: 0; transform: scale(0.85); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes preloader-logo-glow {
              0%, 100% { transform: scale(1); opacity: 0.3; }
              50% { transform: scale(1.15); opacity: 0.5; }
            }
            .preloader-symbol {
              position: absolute;
              font-weight: bold;
              text-align: center;
              pointer-events: none;
              will-change: transform, opacity;
              animation:
                preloader-float var(--dur) ease-in-out var(--delay) infinite,
                preloader-pulse var(--dur) ease-in-out var(--delay) infinite;
            }
          `}</style>

          {/* Atmospheric background glows — CSS only */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-primary blur-[160px]"
              style={{ animation: "preloader-glow-a 4s ease-in-out infinite" }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-secondary blur-[160px]"
              style={{ animation: "preloader-glow-b 5s ease-in-out 1s infinite" }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-accent-warm/[0.06] to-transparent" />
          </div>

          {/* Circuit grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />

          {/* Floating crypto symbols — CSS only, no Framer Motion */}
          <div className="absolute inset-0 overflow-hidden">
            {SYMBOL_POSITIONS.map((p, i) => (
              <span
                key={i}
                className="preloader-symbol"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  fontSize: `${p.symbol.size}px`,
                  color: p.symbol.color,
                  textShadow: `0 0 ${p.symbol.size * 0.6}px ${p.symbol.color}`,
                  "--float-amp": `${-p.floatAmp}px`,
                  "--dur": `${p.duration}s`,
                  "--delay": `${0.3 + i * 0.08}s`,
                  "--pulse-min": "0",
                  "--pulse-max": `${0.12 + (11 - p.symbol.size / 4) * 0.008}`,
                } as React.CSSProperties}
              >
                {p.symbol.char}
              </span>
            ))}
          </div>

          {/* Spinning ring around logo — CSS only */}
          <div className="relative z-10 mb-10">
            <div
              className="absolute -inset-8 sm:-inset-12"
              style={{ animation: "preloader-spin 8s linear infinite" }}
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
            </div>

            {/* Reverse spinning ring — CSS only */}
            <div
              className="absolute -inset-12 sm:-inset-16"
              style={{ animation: "preloader-spin-reverse 12s linear infinite" }}
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
            </div>

            {/* Pulsing glow behind logo — CSS only */}
            <div
              className="absolute inset-0 rounded-full bg-accent-primary/20 blur-[40px]"
              style={{ animation: "preloader-logo-glow 3s ease-in-out infinite" }}
            />

            {/* Logo — CSS animation for entrance */}
            <div style={{ animation: "preloader-logo-in 0.8s ease-out forwards" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/UmairLogo.png"
                alt="Umair Crypto"
                className="w-64 sm:w-80 md:w-96 h-auto drop-shadow-[0_0_80px_rgba(56,189,248,0.35)]"
                style={{ imageRendering: "crisp-edges" }}
              />
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative z-10 w-56 sm:w-72">
            <div className="h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              className="h-6 -mt-3 rounded-full blur-lg bg-gradient-to-r from-accent-primary/25 via-accent-secondary/25 to-accent-primary/25 transition-[width] duration-150 ease-out"
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
