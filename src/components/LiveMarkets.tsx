"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const COIN_PAIRS = [
  { label: "BTC/USDT", symbol: "BINANCE:BTCUSDT" },
  { label: "ETH/USDT", symbol: "BINANCE:ETHUSDT" },
  { label: "SOL/USDT", symbol: "BINANCE:SOLUSDT" },
  { label: "BNB/USDT", symbol: "BINANCE:BNBUSDT" },
  { label: "XRP/USDT", symbol: "BINANCE:XRPUSDT" },
  { label: "DOGE/USDT", symbol: "BINANCE:DOGEUSDT" },
  { label: "ADA/USDT", symbol: "BINANCE:ADAUSDT" },
  { label: "AVAX/USDT", symbol: "BINANCE:AVAXUSDT" },
];

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 2.5 + 1,
  delay: Math.random() * 6,
  duration: Math.random() * 4 + 4,
}));

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function LiveMarkets() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSymbol, setActiveSymbol] = useState(COIN_PAIRS[0].symbol);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const loadWidget = useCallback(
    (symbol: string) => {
      if (!containerRef.current) return;

      const widgetDiv = containerRef.current.querySelector(
        ".tradingview-widget-container__widget"
      );
      if (!widgetDiv) return;

      // Clear previous widget
      widgetDiv.innerHTML = "";

      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.async = true;
      script.type = "text/javascript";
      script.textContent = JSON.stringify({
        autosize: true,
        symbol,
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        allow_symbol_change: true,
        support_host: "https://www.tradingview.com",
        backgroundColor: "rgba(10, 10, 15, 1)",
        gridColor: "rgba(42, 42, 62, 0.3)",
        hide_volume: false,
      });
      widgetDiv.appendChild(script);
    },
    []
  );

  // Initial load
  useEffect(() => {
    if (!isVisible) return;
    loadWidget(activeSymbol);
  }, [isVisible, activeSymbol, loadWidget]);

  const handlePairSelect = (symbol: string) => {
    if (symbol === activeSymbol) return;
    setActiveSymbol(symbol);
  };

  return (
    <section id="markets" className="relative py-16 md:py-32 overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-accent-primary/[0.15] animate-pulse"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-accent-primary/[0.04] blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          {/* Badge pill */}
          <div className="flex items-center justify-center mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-semibold uppercase tracking-widest shadow-[0_0_15px_rgba(56,189,248,0.15)]">
              <Activity size={14} />
              Real-Time Data
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold">
            Live Markets
          </h2>
          <p className="text-text-secondary mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Real-time prices. No delay. Track BTC, ETH, and major altcoins with
            professional-grade charts.
          </p>
        </motion.div>

        {/* Chart container */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          {/* Live status dot */}
          <div className="absolute -top-3 right-4 sm:right-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-primary/80 backdrop-blur-sm border border-white/[0.06]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inset-0 rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
            </span>
            <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
              Live
            </span>
          </div>

          <div
            ref={containerRef}
            className="tradingview-widget-container rounded-2xl overflow-hidden border border-white/[0.08] h-[350px] sm:h-[450px] md:h-[520px] lg:h-[560px]"
          >
            <div
              className="tradingview-widget-container__widget"
              style={{ height: "100%", width: "100%" }}
            />
            {!isVisible && (
              <div className="w-full h-full bg-bg-secondary flex items-center justify-center">
                <span className="text-text-secondary text-sm">
                  Loading chart...
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Coin pair quick-select buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-5 md:mt-6"
        >
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
            {COIN_PAIRS.map((pair) => {
              const isActive = pair.symbol === activeSymbol;
              return (
                <button
                  key={pair.symbol}
                  onClick={() => handlePairSelect(pair.symbol)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? "bg-accent-primary/15 border-accent-primary/40 text-accent-primary shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                      : "bg-white/[0.03] border-white/[0.08] text-text-secondary hover:text-text-primary hover:border-white/[0.15] hover:bg-white/[0.06]"
                  }`}
                >
                  {pair.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
