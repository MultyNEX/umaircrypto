"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const CHART_CONFIG = {
  autosize: true,
  symbol: "BINANCE:BTCUSDT",
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
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function LiveMarkets() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const widgetDiv = containerRef.current.querySelector(
      ".tradingview-widget-container__widget"
    );
    if (!widgetDiv || widgetDiv.querySelector("script")) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.type = "text/javascript";
    script.textContent = JSON.stringify(CHART_CONFIG);
    widgetDiv.appendChild(script);
  }, [isVisible]);

  return (
    <section id="markets" className="relative py-16 md:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <p className="text-accent-primary font-semibold text-sm uppercase tracking-widest mb-3">
            Markets
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold">
            Live Markets
          </h2>
          <p className="text-text-secondary mt-4 text-base sm:text-lg">
            Real-time prices. No delay.
          </p>
        </motion.div>

        {/* Chart — shorter on mobile */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div
            ref={containerRef}
            className="tradingview-widget-container rounded-2xl overflow-hidden border border-white/[0.08] h-[350px] sm:h-[420px] md:h-[500px]"
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
      </div>
    </section>
  );
}
