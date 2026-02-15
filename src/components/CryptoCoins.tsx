"use client";

import { useEffect, useRef } from "react";

const SYMBOLS = [
  { char: "₿", label: "BTC", color: "#f7931a", rank: 1 },
  { char: "Ξ", label: "ETH", color: "#627eea", rank: 2 },
  { char: "◎", label: "SOL", color: "#9945ff", rank: 3 },
  { char: "B", label: "BNB", color: "#f3ba2f", rank: 4 },
  { char: "✕", label: "XRP", color: "#38bdf8", rank: 5 },
  { char: "Ð", label: "DOGE", color: "#c2a633", rank: 6 },
  { char: "₳", label: "ADA", color: "#0033ad", rank: 7 },
  { char: "A", label: "AVAX", color: "#e84142", rank: 8 },
];

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sizeFromRank(rank: number, isMobile: boolean): number {
  const base = isMobile ? 56 : 82;
  const min = isMobile ? 26 : 34;
  const scale = Math.pow(0.86, rank - 1);
  return Math.max(min, Math.round(base * scale));
}

interface Particle {
  ratioX: number;
  ratioY: number;
  size: number;
  symbol: typeof SYMBOLS[number];
  phase: number;
  floatSpeedY: number;
  floatAmpY: number;
  floatSpeedX: number;
  floatAmpX: number;
  opacity: number;
  offsetX: number;
  offsetY: number;
}

function generateParticles(isMobile: boolean): Particle[] {
  const rand = mulberry32(77742);
  const COUNT = isMobile ? 16 : 30;
  const MIN_DIST = isMobile ? 0.13 : 0.11;

  const points: { x: number; y: number }[] = [];
  let attempts = 0;

  while (points.length < COUNT && attempts < 800) {
    const x = 0.02 + rand() * 0.96;
    const y = 0.02 + rand() * 0.96;
    attempts++;

    let tooClose = false;
    for (const p of points) {
      const dx = x - p.x;
      const dy = y - p.y;
      if (Math.sqrt(dx * dx + dy * dy) < MIN_DIST) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) {
      points.push({ x, y });
      attempts = 0;
    }
  }

  const particles: Particle[] = [];

  points.forEach((pt, i) => {
    const symbol = SYMBOLS[i % SYMBOLS.length];
    const size = sizeFromRank(symbol.rank, isMobile);
    const baseOpacity = 0.07 + (9 - symbol.rank) * 0.016;

    particles.push({
      ratioX: pt.x,
      ratioY: pt.y,
      size,
      symbol,
      phase: rand() * Math.PI * 2,
      floatSpeedY: 0.25 + rand() * 0.35,
      floatAmpY: 25 + rand() * 35,
      floatSpeedX: 0.15 + rand() * 0.25,
      floatAmpX: 15 + rand() * 25,
      opacity: Math.min(baseOpacity + rand() * 0.05, 0.3),
      offsetX: 0,
      offsetY: 0,
    });
  });

  return particles;
}

export default function CryptoCoins() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;

    const isMobile =
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const particles = generateParticles(isMobile);

    const MOUSE_RADIUS = isMobile ? 0 : 200;
    const PUSH_STRENGTH = 70;
    const RETURN_SPEED = 0.03;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();

    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }

    function onMouseLeave() {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    }

    if (!isMobile) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      document.addEventListener("mouseleave", onMouseLeave);
    }

    let time = 0;

    function animate() {
      frameId = requestAnimationFrame(animate);
      if (!canvas || !ctx) return;

      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particles.forEach((p) => {
        const baseX = p.ratioX * w;
        const baseY = p.ratioY * h;

        // More movement — both axes have independent speed and amplitude
        const floatX = baseX + Math.sin(time * p.floatSpeedX + p.phase * 0.7) * p.floatAmpX;
        const floatY = baseY + Math.sin(time * p.floatSpeedY + p.phase) * p.floatAmpY;

        if (MOUSE_RADIUS > 0) {
          const dx = floatX + p.offsetX - mx;
          const dy = floatY + p.offsetY - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (1 - dist / MOUSE_RADIUS) * PUSH_STRENGTH;
            const angle = Math.atan2(dy, dx);
            p.offsetX += Math.cos(angle) * force * 0.15;
            p.offsetY += Math.sin(angle) * force * 0.15;
          }

          p.offsetX *= 1 - RETURN_SPEED;
          p.offsetY *= 1 - RETURN_SPEED;
        }

        const finalX = floatX + p.offsetX;
        const finalY = floatY + p.offsetY;

        let drawOpacity = p.opacity;
        if (MOUSE_RADIUS > 0) {
          const distToMouse = Math.sqrt(
            (finalX - mx) ** 2 + (finalY - my) ** 2
          );
          if (distToMouse < MOUSE_RADIUS * 1.5) {
            const boost = (1 - distToMouse / (MOUSE_RADIUS * 1.5)) * 0.15;
            drawOpacity = Math.min(p.opacity + boost, 0.45);
          }
        }

        ctx.save();
        ctx.translate(finalX, finalY);
        ctx.shadowColor = p.symbol.color;
        ctx.shadowBlur = p.size * 0.7;
        ctx.globalAlpha = drawOpacity;
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
      resizeTimeout = setTimeout(resize, 200);
    }
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
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
