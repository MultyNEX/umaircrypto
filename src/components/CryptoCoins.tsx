"use client";

import { useEffect, useRef } from "react";

// Ordered by market cap — size decreases down the list
const SYMBOLS = [
  { char: "₿", color: "#f7931a", rank: 1 },   // BTC
  { char: "Ξ", color: "#627eea", rank: 2 },   // ETH
  { char: "✕", color: "#38bdf8", rank: 3 },   // XRP
  { char: "₮", color: "#26a17b", rank: 4 },   // USDT
  { char: "◎", color: "#9945ff", rank: 5 },   // SOL
  { char: "B", color: "#f3ba2f", rank: 6 },   // BNB
  { char: "₳", color: "#0033ad", rank: 7 },   // ADA
  { char: "⬡", color: "#e6007a", rank: 8 },   // DOT
  { char: "Ð", color: "#c2a633", rank: 9 },   // DOGE
  { char: "◈", color: "#2775ca", rank: 10 },  // USDC
];

// Size mapping: rank 1 = biggest, rank 10 = smallest
function sizeFromRank(rank: number, isMobile: boolean): number {
  const base = isMobile ? 38 : 52;
  const min = isMobile ? 12 : 16;
  // Exponential falloff so BTC is significantly larger
  const scale = Math.pow(0.82, rank - 1);
  return Math.max(min, Math.round(base * scale));
}

interface Particle {
  baseX: number;
  baseY: number;
  size: number;
  symbol: typeof SYMBOLS[number];
  phase: number;
  floatSpeed: number;
  floatAmp: number;
  opacity: number;
}

export default function CryptoCoins() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    console.log("[CryptoCoins] mounted, canvas:", canvas.width, canvas.height);
    const ctx = canvas.getContext("2d")!;
    let frameId: number;
    let particles: Particle[] = [];

    const isMobile =
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // More particles on desktop, each symbol appears multiple times
    const REPEATS = isMobile ? 2 : 4;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      // Total particles
      const allSymbols: typeof SYMBOLS[number][] = [];
      for (let r = 0; r < REPEATS; r++) {
        SYMBOLS.forEach((s) => allSymbols.push(s));
      }

      const total = allSymbols.length;

      // Grid-based distribution for even spread
      const cols = Math.ceil(Math.sqrt(total * (w / h)));
      const rows = Math.ceil(total / cols);
      const cellW = w / cols;
      const cellH = h / rows;

      allSymbols.forEach((symbol, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);

        // Position within cell with randomness (but stay within cell bounds)
        const jitterX = (Math.random() - 0.5) * cellW * 0.7;
        const jitterY = (Math.random() - 0.5) * cellH * 0.7;
        const baseX = cellW * (col + 0.5) + jitterX;
        const baseY = cellH * (row + 0.5) + jitterY;

        const size = sizeFromRank(symbol.rank, isMobile);

        // Higher rank = slightly more visible
        const baseOpacity = 0.06 + (11 - symbol.rank) * 0.012;
        const opacity = baseOpacity + Math.random() * 0.06;

        particles.push({
          baseX,
          baseY,
          size,
          symbol,
          phase: Math.random() * Math.PI * 2,
          floatSpeed: 0.2 + Math.random() * 0.4,
          floatAmp: 12 + Math.random() * 22,
          opacity: Math.min(opacity, 0.25),
        });
      });
    }

    resize();
    createParticles();

    let time = 0;

    function animate() {
      frameId = requestAnimationFrame(animate);
      time += 0.016;
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        const y = p.baseY + Math.sin(time * p.floatSpeed + p.phase) * p.floatAmp;
        const x = p.baseX + Math.sin(time * 0.15 + p.phase * 0.7) * 8;

        ctx.save();
        ctx.translate(x, y);
        ctx.shadowColor = p.symbol.color;
        ctx.shadowBlur = p.size * 0.6;
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.symbol.color;
        ctx.font = `bold ${p.size}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.symbol.char, 0, 0);
        ctx.restore();
      });
    }

    animate();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        createParticles();
      }, 200);
    }
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-[2] pointer-events-none"
      aria-hidden="true"
    />
  );
}
