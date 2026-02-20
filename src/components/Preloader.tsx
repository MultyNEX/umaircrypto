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
    symbol: (typeof CRYPTO_SYMBOLS)[number];
    x: number;
    y: number;
    delay: number;
    duration: number;
    floatAmp: number;
  }[] = [];

  const cols = 5;
  const rows = 4;
  const total = cols * rows;

  for (let i = 0; i < total; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const sym = CRYPTO_SYMBOLS[i % CRYPTO_SYMBOLS.length];

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

const SYMBOL_POSITIONS = generateSymbolPositions();

// ─── Police tape text ───────────────────────────────────────────────
const TAPE_TEXT = "⚠ NOT FINANCIAL ADVICE \u00A0\u00A0 FOR EDUCATIONAL PURPOSES ONLY \u00A0\u00A0 TRADING INVOLVES RISK \u00A0\u00A0 ALWAYS DYOR \u00A0\u00A0";
// Repeat enough to fill any screen width at an angle
const TAPE_REPEAT = TAPE_TEXT.repeat(6);

// Number of tape strips
const TAPE_STRIPS = [
  { top: "8%", delay: 0, direction: 1 },
  { top: "24%", delay: 0.08, direction: -1 },
  { top: "40%", delay: 0.16, direction: 1 },
  { top: "56%", delay: 0.24, direction: -1 },
  { top: "72%", delay: 0.32, direction: 1 },
  { top: "88%", delay: 0.4, direction: -1 },
];

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"tape" | "loader" | "done">("tape");
  const progressRef = useRef(0);

  // Phase 1 → Phase 2 transition (tape → loader)
  useEffect(() => {
    const tapeTimer = setTimeout(() => {
      setPhase("loader");
    }, 4000);
    return () => clearTimeout(tapeTimer);
  }, []);

  // Phase 2: Progress bar animation
  useEffect(() => {
    if (phase !== "loader") return;

    const start = performance.now();
    const duration = 4500;
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const adjusted = Math.max(0, elapsed - 300);
      const p = Math.min(adjusted / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      const val = Math.round(eased * 100);

      if (
        val !== progressRef.current &&
        (val - progressRef.current >= 3 || val === 100)
      ) {
        progressRef.current = val;
        setProgress(val);
      }

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setPhase("done"), 500);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Lock scroll during preloader
  useEffect(() => {
    document.body.style.overflow = phase !== "done" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  // Remove the HTML-blocking gate once this component mounts
  useEffect(() => {
    const gate = document.getElementById("preloader-gate");
    if (gate) gate.remove();
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#060612]"
        >
          {/* ═══════════════════════════════════════════════
              INLINE STYLES — all CSS-only animations
              ═══════════════════════════════════════════════ */}
          <style>{`
            /* ── Police tape animations ── */
            @keyframes tape-scroll {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            @keyframes tape-scroll-reverse {
              from { transform: translateX(-50%); }
              to { transform: translateX(0); }
            }
            @keyframes tape-strip-in {
              from { 
                opacity: 0; 
                transform: rotate(-8deg) scaleX(0);
              }
              to { 
                opacity: 1; 
                transform: rotate(-8deg) scaleX(1);
              }
            }
            @keyframes tape-strip-out {
              from { 
                opacity: 1; 
                transform: rotate(-8deg) scaleX(1);
              }
              to { 
                opacity: 0; 
                transform: rotate(-8deg) scaleX(1.3);
              }
            }
            @keyframes tape-hazard-pulse {
              0%, 100% { opacity: 0.9; }
              50% { opacity: 1; }
            }
            @keyframes tape-center-glow {
              0%, 100% { text-shadow: 0 0 20px rgba(245,158,11,0.3), 0 0 60px rgba(245,158,11,0.15); }
              50% { text-shadow: 0 0 30px rgba(245,158,11,0.5), 0 0 80px rgba(245,158,11,0.25), 0 0 120px rgba(245,158,11,0.1); }
            }
            @keyframes tape-stamp-in {
              0% { opacity: 0; transform: scale(3) rotate(-12deg); }
              60% { opacity: 1; transform: scale(0.9) rotate(-12deg); }
              80% { transform: scale(1.05) rotate(-12deg); }
              100% { transform: scale(1) rotate(-12deg); }
            }

            .tape-strip {
              position: absolute;
              left: -20%;
              right: -20%;
              height: 44px;
              transform-origin: center center;
              will-change: transform, opacity;
            }
            .tape-strip-entering {
              animation: tape-strip-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .tape-strip-exiting {
              animation: tape-strip-out 0.4s ease-in forwards;
            }
            .tape-inner {
              display: flex;
              white-space: nowrap;
              height: 100%;
              align-items: center;
            }
            .tape-scroll-fwd {
              animation: tape-scroll 20s linear infinite;
            }
            .tape-scroll-rev {
              animation: tape-scroll-reverse 20s linear infinite;
            }
            .tape-text {
              font-family: var(--font-space-grotesk), 'Arial Black', sans-serif;
              font-weight: 800;
              font-size: 13px;
              letter-spacing: 0.15em;
              text-transform: uppercase;
              color: #0a0a0f;
              padding: 0 4px;
              animation: tape-hazard-pulse 2s ease-in-out infinite;
            }

            /* ── Preloader animations (kept from original) ── */
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

          {/* ═══════════════════════════════════════════════
              PHASE 1: POLICE TAPE DISCLAIMER
              ═══════════════════════════════════════════════ */}
          <AnimatePresence>
            {phase === "tape" && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
              >
                {/* Dark vignette background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,6,18,0.85)_0%,rgba(6,6,18,0.97)_70%)]" />

                {/* Subtle warning pulse in background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.04)_0%,transparent_60%)]" />

                {/* Diagonal police tape strips */}
                {TAPE_STRIPS.map((strip, i) => (
                  <div
                    key={i}
                    className="tape-strip tape-strip-entering"
                    style={{
                      top: strip.top,
                      animationDelay: `${strip.delay}s`,
                      transform: "rotate(-8deg)",
                    }}
                  >
                    {/* Hazard stripe background */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `repeating-linear-gradient(
                          -45deg,
                          #F59E0B,
                          #F59E0B 18px,
                          #0a0a0f 18px,
                          #0a0a0f 36px
                        )`,
                      }}
                    />
                    {/* Scrolling text on top */}
                    <div
                      className={`tape-inner ${
                        strip.direction === 1
                          ? "tape-scroll-fwd"
                          : "tape-scroll-rev"
                      }`}
                    >
                      <span className="tape-text">{TAPE_REPEAT}</span>
                      <span className="tape-text">{TAPE_REPEAT}</span>
                    </div>
                  </div>
                ))}

                {/* Center stamp — big warning */}
                <div
                  className="relative z-30 text-center px-4"
                  style={{
                    animation: "tape-stamp-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both",
                  }}
                >
                  <div className="inline-block px-8 py-6 sm:px-12 sm:py-8 border-4 border-[#F59E0B] rounded-sm bg-[#060612]/90 backdrop-blur-sm">
                    <p
                      className="text-[#F59E0B] font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-[0.1em] uppercase"
                      style={{
                        animation: "tape-center-glow 3s ease-in-out infinite",
                      }}
                    >
                      ⚠ Not Financial Advice
                    </p>
                    <div className="w-full h-px bg-[#F59E0B]/30 my-3" />
                    <p className="text-[#F59E0B]/70 font-body text-xs sm:text-sm tracking-[0.2em] uppercase">
                      For Educational &amp; Informational Purposes Only
                    </p>
                    <p className="text-[#F59E0B]/50 font-body text-[10px] sm:text-xs tracking-[0.15em] uppercase mt-2">
                      Trading involves substantial risk of loss
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════════════════════════════════════════════
              PHASE 2: MAIN PRELOADER (logo + progress)
              ═══════════════════════════════════════════════ */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
              phase === "loader" ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Atmospheric background glows */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-primary blur-[160px]"
                style={{
                  animation: "preloader-glow-a 4s ease-in-out infinite",
                }}
              />
              <div
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-secondary blur-[160px]"
                style={{
                  animation: "preloader-glow-b 5s ease-in-out 1s infinite",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-accent-warm/[0.06] to-transparent" />
            </div>

            {/* Circuit grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.025)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />

            {/* Floating crypto symbols */}
            <div className="absolute inset-0 overflow-hidden">
              {SYMBOL_POSITIONS.map((p, i) => (
                <span
                  key={i}
                  className="preloader-symbol"
                  style={
                    {
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
                    } as React.CSSProperties
                  }
                >
                  {p.symbol.char}
                </span>
              ))}
            </div>

            {/* Spinning ring around logo */}
            <div className="relative z-10 mb-10">
              <div
                className="absolute -inset-8 sm:-inset-12"
                style={{ animation: "preloader-spin 8s linear infinite" }}
              >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient
                      id="ring-grad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor="#38BDF8"
                        stopOpacity="0.6"
                      />
                      <stop
                        offset="50%"
                        stopColor="#A855F7"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor="#38BDF8"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="100"
                    cy="100"
                    r="95"
                    fill="none"
                    stroke="url(#ring-grad)"
                    strokeWidth="1.5"
                    strokeDasharray="80 200"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Reverse spinning ring */}
              <div
                className="absolute -inset-12 sm:-inset-16"
                style={{
                  animation: "preloader-spin-reverse 12s linear infinite",
                }}
              >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle
                    cx="100"
                    cy="100"
                    r="95"
                    fill="none"
                    stroke="#A855F7"
                    strokeOpacity="0.15"
                    strokeWidth="1"
                    strokeDasharray="40 260"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Pulsing glow behind logo */}
              <div
                className="absolute inset-0 rounded-full bg-accent-primary/20 blur-[40px]"
                style={{
                  animation: "preloader-logo-glow 3s ease-in-out infinite",
                }}
              />

              {/* Logo */}
              <div
                style={{
                  animation: "preloader-logo-in 0.8s ease-out forwards",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/UmairLogo.png"
                  alt="Umair Crypto"
                  className="w-64 sm:w-80 md:w-96 h-auto drop-shadow-[0_0_80px_rgba(56,189,248,0.35)]"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}