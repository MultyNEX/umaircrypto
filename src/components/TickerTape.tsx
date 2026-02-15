"use client";

import { useEffect, useRef, useState } from "react";

const TICKER_CONFIG = {
  symbols: [
    { proName: "BINANCE:BTCUSDT", title: "BTC/USDT" },
    { proName: "BINANCE:ETHUSDT", title: "ETH/USDT" },
    { proName: "BINANCE:SOLUSDT", title: "SOL/USDT" },
    { proName: "BINANCE:BNBUSDT", title: "BNB/USDT" },
    { proName: "BINANCE:XRPUSDT", title: "XRP/USDT" },
  ],
  showSymbolLogo: true,
  isTransparent: true,
  displayMode: "adaptive",
  colorTheme: "dark",
  locale: "en",
};

export default function TickerTape() {
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
      { rootMargin: "200px" }
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
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.type = "text/javascript";
    script.textContent = JSON.stringify(TICKER_CONFIG);
    widgetDiv.appendChild(script);
  }, [isVisible]);

  return (
    <div className="fixed top-20 md:top-24 left-0 right-0 z-40 h-[72px] sm:h-[56px]">
      <div
        ref={containerRef}
        className="tradingview-widget-container h-full"
      >
        <div className="tradingview-widget-container__widget h-full" />
      </div>
    </div>
  );
}
