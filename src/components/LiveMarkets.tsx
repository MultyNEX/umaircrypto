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

  const loadWidget = useCallback((symbol: string) => {
    if (!containerRef.current) return;

    const widgetDiv = containerRef.current.querySelector(
      ".tradingview-widget-container__widget"
    );
    if (!widgetDiv) return;

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
      // ── Match site colors exactly ──
      backgroundColor: "rgba(6, 6, 18, 1)",
      gridColor: "rgba(56, 189, 248, 0.04)",
      hide_volume: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      hide_side_toolbar: false,
      calendar: false,
      // Custom overrides via CSS
      overrides: {
        // Background
        "paneProperties.background": "#060612",
        "paneProperties.backgroundType": "solid",
        // Grid
        "paneProperties.vertGridProperties.color": "rgba(56, 189, 248, 0.04)",
        "paneProperties.horzGridProperties.color": "rgba(56, 189, 248, 0.04)",
        // Candles — green/red with accent tint
        "mainSeriesProperties.candleStyle.upColor": "#38BDF8",
        "mainSeriesProperties.candleStyle.downColor": "#EF4444",
        "mainSeriesProperties.candleStyle.borderUpColor": "#38BDF8",
        "mainSeriesProperties.candleStyle.borderDownColor": "#EF4444",
        "mainSeriesProperties.candleStyle.wickUpColor": "#38BDF8",
        "mainSeriesProperties.candleStyle.wickDownColor": "#EF4444",
        // Crosshair
        "paneProperties.crossHairProperties.color": "rgba(56, 189, 248, 0.3)",
        // Scale text
        "scalesProperties.textColor": "rgba(148, 163, 184, 0.7)",
        "scalesProperties.lineColor": "rgba(56, 189, 248, 0.08)",
        // Volume
        "volumePaneSize": "small",
      },
    });
    widgetDiv.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    loadWidget(activeSymbol);
  }, [isVisible, activeSymbol, loadWidget]);

  const handlePairSelect = (symbol: string) => {
    if (symbol === activeSymbol) return;
    setActiveSymbol(symbol);
  };

  return (
    <section id="markets" className="relative py-8 md:py-16 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-accent-primary/[0.04] blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8"
        >
          <div className="flex items-center justify-center mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-semibold uppercase tracking-widest shadow-[0_0_15px_rgba(56,189,248,0.15)]">
              <Activity size={14} />
              Real-Time Data
            </span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold">
            Live Markets
          </h2>
          <p className="text-text-secondary mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Real-time prices. No delay. Track BTC, ETH, and major altcoins with
            professional-grade charts.
          </p>
        </motion.div>

        {/* Coin pair selector */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 md:mb-5"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
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

        {/* Chart container */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
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

          {/* Glow wrapper */}
          <div className="relative rounded-2xl overflow-hidden">
            {/* Subtle edge glows to blend chart into page */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-accent-primary/[0.06] to-transparent pointer-events-none z-10 rounded-t-2xl" />
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-accent-secondary/[0.04] to-transparent pointer-events-none z-10 rounded-b-2xl" />
            <div className="absolute top-0 left-0 w-24 h-24 bg-accent-primary/[0.05] blur-2xl pointer-events-none z-10" />
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-secondary/[0.03] blur-2xl pointer-events-none z-10" />

            <div
              ref={containerRef}
              className="tradingview-widget-container rounded-2xl h-[350px] sm:h-[450px] md:h-[520px] lg:h-[560px]"
              style={{
                border: "1px solid rgba(56, 189, 248, 0.08)",
                boxShadow:
                  "0 0 40px rgba(56, 189, 248, 0.06), 0 0 80px rgba(168, 85, 247, 0.03), inset 0 1px 0 rgba(56, 189, 248, 0.08)",
              }}
            >
              <div
                className="tradingview-widget-container__widget"
                style={{ height: "100%", width: "100%" }}
              />
              {!isVisible && (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: "#060612" }}
                >
                  <span className="text-text-secondary text-sm">
                    Loading chart...
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}