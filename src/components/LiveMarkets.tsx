"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";
import DisclaimerBanner from "@/components/DisclaimerBanner";

const COIN_PAIRS = [
  {
    label: "BTC/USDT",
    symbol: "BINANCE:BTCUSDT",
    binanceSymbol: "BTCUSDT",
    name: "Bitcoin",
    short: "BTC",
    logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    color: "#F7931A",
  },
  {
    label: "ETH/USDT",
    symbol: "BINANCE:ETHUSDT",
    binanceSymbol: "ETHUSDT",
    name: "Ethereum",
    short: "ETH",
    logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    color: "#627EEA",
  },
  {
    label: "SOL/USDT",
    symbol: "BINANCE:SOLUSDT",
    binanceSymbol: "SOLUSDT",
    name: "Solana",
    short: "SOL",
    logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    color: "#9945FF",
  },
  {
    label: "BNB/USDT",
    symbol: "BINANCE:BNBUSDT",
    binanceSymbol: "BNBUSDT",
    name: "BNB",
    short: "BNB",
    logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
    color: "#F3BA2F",
  },
  {
    label: "XRP/USDT",
    symbol: "BINANCE:XRPUSDT",
    binanceSymbol: "XRPUSDT",
    name: "XRP",
    short: "XRP",
    logo: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
    color: "#23292F",
  },
  {
    label: "DOGE/USDT",
    symbol: "BINANCE:DOGEUSDT",
    binanceSymbol: "DOGEUSDT",
    name: "Dogecoin",
    short: "DOGE",
    logo: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
    color: "#C2A633",
  },
  {
    label: "ADA/USDT",
    symbol: "BINANCE:ADAUSDT",
    binanceSymbol: "ADAUSDT",
    name: "Cardano",
    short: "ADA",
    logo: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
    color: "#0033AD",
  },
  {
    label: "AVAX/USDT",
    symbol: "BINANCE:AVAXUSDT",
    binanceSymbol: "AVAXUSDT",
    name: "Avalanche",
    short: "AVAX",
    logo: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
    color: "#E84142",
  },
];

interface TickerData {
  lastPrice: string;
  highPrice: string;
  lowPrice: string;
  priceChangePercent: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function formatPrice(price: string, symbol: string): string {
  const num = parseFloat(price);
  if (
    symbol === "BTCUSDT" ||
    symbol === "ETHUSDT" ||
    symbol === "BNBUSDT"
  ) {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (num >= 1) {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

export default function LiveMarkets() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [chartReady, setChartReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tickerData, setTickerData] = useState<Record<string, TickerData>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const candleSeriesRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const volumeSeriesRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const activePair = COIN_PAIRS[activeIndex];

  // Intersection observer for lazy loading
  useEffect(() => {
    const el = sectionRef.current;
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

  // Fetch ticker data from Binance
  const fetchTicker = useCallback(async (binanceSymbol: string) => {
    try {
      const res = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`
      );
      if (!res.ok) return;
      const data = await res.json();
      setTickerData((prev) => ({
        ...prev,
        [binanceSymbol]: {
          lastPrice: data.lastPrice,
          highPrice: data.highPrice,
          lowPrice: data.lowPrice,
          priceChangePercent: data.priceChangePercent,
        },
      }));
    } catch {
      // Silently fail — chart still works
    }
  }, []);

  // Fetch active pair ticker + refresh every 10s
  useEffect(() => {
    fetchTicker(activePair.binanceSymbol);
    const interval = setInterval(
      () => fetchTicker(activePair.binanceSymbol),
      10000
    );
    return () => clearInterval(interval);
  }, [activePair.binanceSymbol, fetchTicker]);

  // Initialize lightweight-charts once visible
  useEffect(() => {
    if (!isVisible || !chartContainerRef.current) return;

    let disposed = false;

    async function initChart() {
      const lc = await import("lightweight-charts");

      if (disposed || !chartContainerRef.current) return;

      const chart = lc.createChart(chartContainerRef.current, {
        autoSize: true,
        layout: {
          background: { type: lc.ColorType.Solid, color: "#060612" },
          textColor: "rgba(148, 163, 184, 0.6)",
          fontFamily: "'DM Sans', sans-serif",
        },
        grid: {
          vertLines: { color: "rgba(56, 189, 248, 0.04)" },
          horzLines: { color: "rgba(56, 189, 248, 0.04)" },
        },
        crosshair: {
          mode: lc.CrosshairMode.Normal,
          vertLine: {
            color: "rgba(56, 189, 248, 0.3)",
            width: 1,
            style: lc.LineStyle.Dashed,
            labelBackgroundColor: "#1a1a2e",
          },
          horzLine: {
            color: "rgba(56, 189, 248, 0.3)",
            width: 1,
            style: lc.LineStyle.Dashed,
            labelBackgroundColor: "#1a1a2e",
          },
        },
        rightPriceScale: {
          borderColor: "rgba(56, 189, 248, 0.06)",
          scaleMargins: { top: 0.1, bottom: 0.2 },
        },
        timeScale: {
          borderColor: "rgba(56, 189, 248, 0.06)",
          timeVisible: false,
          secondsVisible: false,
        },
      });

      const candleSeries = chart.addSeries(lc.CandlestickSeries, {
        upColor: "#38BDF8",
        downColor: "#E74694",
        borderUpColor: "#38BDF8",
        borderDownColor: "#E74694",
        wickUpColor: "#38BDF8",
        wickDownColor: "#E74694",
        priceLineColor: "#38BDF8",
        priceLineStyle: lc.LineStyle.Dashed,
      });

      const volumeSeries = chart.addSeries(lc.HistogramSeries, {
        priceFormat: { type: "volume" },
      }, 1);

      volumeSeries.priceScale().applyOptions({
        scaleMargins: { top: 0.2, bottom: 0 },
      });

      chartRef.current = chart;
      candleSeriesRef.current = candleSeries;
      volumeSeriesRef.current = volumeSeries;
      setChartReady(true);
    }

    initChart();

    return () => {
      disposed = true;
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candleSeriesRef.current = null;
        volumeSeriesRef.current = null;
        setChartReady(false);
      }
    };
  }, [isVisible]);

  // Load data + WebSocket when pair changes (or chart first mounts)
  useEffect(() => {
    if (!chartReady || !candleSeriesRef.current || !volumeSeriesRef.current)
      return;

    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    const symbol = activePair.binanceSymbol.toLowerCase();

    // Disconnect previous WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    let cancelled = false;

    async function loadHistorical() {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${activePair.binanceSymbol}&interval=4h&limit=200`
        );
        if (!res.ok || cancelled) return;
        const klines: (string | number)[][] = await res.json();

        const candles = klines.map((k) => ({
          time: (Math.floor(Number(k[0]) / 1000) as number),
          open: parseFloat(k[1] as string),
          high: parseFloat(k[2] as string),
          low: parseFloat(k[3] as string),
          close: parseFloat(k[4] as string),
        }));

        const volumes = klines.map((k) => {
          const open = parseFloat(k[1] as string);
          const close = parseFloat(k[4] as string);
          return {
            time: (Math.floor(Number(k[0]) / 1000) as number),
            value: parseFloat(k[5] as string),
            color:
              close >= open
                ? "rgba(56, 189, 248, 0.25)"
                : "rgba(231, 70, 148, 0.25)",
          };
        });

        if (cancelled) return;
        candleSeries.setData(candles);
        volumeSeries.setData(volumes);
      } catch {
        // Fail silently
      }
    }

    loadHistorical().then(() => {
      if (cancelled) return;

      // Connect WebSocket for live updates
      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol}@kline_4h`
      );
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const k = msg.k;
        if (!k) return;

        const candle = {
          time: (Math.floor(k.t / 1000) as number),
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
        };

        const volume = {
          time: (Math.floor(k.t / 1000) as number),
          value: parseFloat(k.v),
          color:
            candle.close >= candle.open
              ? "rgba(56, 189, 248, 0.25)"
              : "rgba(231, 70, 148, 0.25)",
        };

        candleSeries.update(candle);
        volumeSeries.update(volume);
      };
    });

    return () => {
      cancelled = true;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [chartReady, activePair.binanceSymbol]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePairSelect = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  const ticker = tickerData[activePair.binanceSymbol];
  const changePercent = ticker ? parseFloat(ticker.priceChangePercent) : 0;
  const isPositive = changePercent >= 0;

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
            {COIN_PAIRS.map((pair, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={pair.symbol}
                  onClick={() => handlePairSelect(i)}
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

        {/* ── Live Price Header ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-4"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activePair.binanceSymbol}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
            >
              {/* Coin logo + name + price */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${activePair.color}30, ${activePair.color}10)`,
                    border: `1px solid ${activePair.color}40`,
                  }}
                >
                  <Image
                    src={activePair.logo}
                    alt={activePair.name}
                    width={28}
                    height={28}
                    className="w-7 h-7 sm:w-7 sm:h-7"
                    unoptimized
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary font-heading text-xl sm:text-2xl font-bold">
                      {ticker
                        ? `$${formatPrice(ticker.lastPrice, activePair.binanceSymbol)}`
                        : "—"}
                    </span>
                    {ticker && (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          isPositive
                            ? "bg-green-500/15 text-green-400 border border-green-500/20"
                            : "bg-red-500/15 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp size={12} />
                        ) : (
                          <TrendingDown size={12} />
                        )}
                        {isPositive ? "+" : ""}
                        {changePercent.toFixed(2)}%
                      </span>
                    )}
                  </div>
                  <p className="text-text-secondary text-xs sm:text-sm mt-0.5">
                    {activePair.name}{" "}
                    <span className="text-text-secondary/50">
                      ({activePair.short})
                    </span>
                  </p>
                </div>
              </div>

              {/* 24h High / Low */}
              {ticker && (
                <div className="flex items-center gap-4 sm:gap-6 sm:ml-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/15">
                      24h High
                    </span>
                    <span className="text-text-primary text-sm sm:text-base font-semibold font-mono">
                      ${formatPrice(ticker.highPrice, activePair.binanceSymbol)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/15">
                      24h Low
                    </span>
                    <span className="text-text-primary text-sm sm:text-base font-semibold font-mono">
                      ${formatPrice(ticker.lowPrice, activePair.binanceSymbol)}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Chart container */}
        <motion.div
          ref={sectionRef}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Live status dot */}
          <div className="absolute -top-3 right-4 sm:right-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#060612]/90 backdrop-blur-sm border border-accent-primary/10">
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
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-accent-primary/[0.05] to-transparent pointer-events-none z-10 rounded-t-2xl" />
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-accent-secondary/[0.03] to-transparent pointer-events-none z-10 rounded-b-2xl" />
            <div className="absolute top-0 left-0 w-20 h-20 bg-accent-primary/[0.04] blur-2xl pointer-events-none z-10" />
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent-secondary/[0.03] blur-2xl pointer-events-none z-10" />

            <div
              className="rounded-2xl h-[350px] sm:h-[450px] md:h-[520px] lg:h-[560px]"
              style={{
                border: "1px solid rgba(56, 189, 248, 0.06)",
                boxShadow:
                  "0 0 30px rgba(56, 189, 248, 0.04), 0 0 60px rgba(168, 85, 247, 0.02), inset 0 1px 0 rgba(56, 189, 248, 0.06)",
                background: "#060612",
              }}
            >
              <div
                ref={chartContainerRef}
                style={{ width: "100%", height: "100%" }}
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

        {/* Subtle disclaimer */}
        <DisclaimerBanner variant="trading" className="mt-4" />
      </div>
    </section>
  );
}
