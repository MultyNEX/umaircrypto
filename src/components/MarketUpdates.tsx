"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// To add a new market update:
// 1. Go to the tweet on x.com
// 2. Copy the URL (e.g. https://x.com/Umairorkz/status/1234567890)
// 3. Add the number at the end (1234567890) to this array
// 4. Remove the oldest tweet to keep 6 max
const TWEET_IDS = [
  "2020463178292044032", // $AVAX analysis
  "2009563387626397774", // $LTC chart analysis
  "2000994564291879021", // $HYPE chart analysis
  "1990233276880232572", // $USDT.D divergence
  "1986007555374788967", // $ETH.D levels
  "1960727761305145400", // $BTC $125K shorts
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTweet: (
          id: string,
          el: HTMLElement,
          options?: Record<string, unknown>
        ) => Promise<HTMLElement | undefined>;
      };
      ready: (fn: () => void) => void;
    };
  }
}

function TweetCard({ tweetId, isVisible }: { tweetId: string; isVisible: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const rendered = useRef(false);

  useEffect(() => {
    if (!isVisible || rendered.current || !containerRef.current) return;

    function render() {
      if (!window.twttr || !containerRef.current || rendered.current) return;
      rendered.current = true;

      window.twttr.widgets
        .createTweet(tweetId, containerRef.current, {
          theme: "dark",
          dnt: true,
          conversation: "none",
          cards: "visible",
          width: 360,
        })
        .then((el) => {
          if (el) setLoaded(true);
        });
    }

    if (window.twttr?.widgets) {
      render();
    } else {
      const check = setInterval(() => {
        if (window.twttr?.widgets) {
          clearInterval(check);
          render();
        }
      }, 200);
      return () => clearInterval(check);
    }
  }, [isVisible, tweetId]);

  return (
    <div className="flex-shrink-0 w-[85vw] sm:w-[340px] md:w-[340px] lg:w-[360px] snap-center">
      <div
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
        style={{
          boxShadow:
            "0 0 20px rgba(56, 189, 248, 0.03), inset 0 1px 0 rgba(56, 189, 248, 0.05)",
          minHeight: 280,
        }}
      >
        {/* Loading skeleton */}
        {!loaded && (
          <div className="p-5 space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/[0.06]" />
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-white/[0.06] rounded w-28" />
                <div className="h-2.5 bg-white/[0.04] rounded w-20" />
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="h-3 bg-white/[0.05] rounded w-full" />
              <div className="h-3 bg-white/[0.05] rounded w-[90%]" />
              <div className="h-3 bg-white/[0.05] rounded w-[75%]" />
              <div className="h-3 bg-white/[0.04] rounded w-[60%]" />
            </div>
            <div className="h-40 bg-white/[0.03] rounded-xl" />
          </div>
        )}
        <div ref={containerRef} className={loaded ? "" : "hidden"} />
      </div>
    </div>
  );
}

export default function MarketUpdates() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Intersection observer — lazy load Twitter script
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

  // Load Twitter widget script when visible
  useEffect(() => {
    if (!isVisible) return;
    if (document.getElementById("twitter-wjs")) return;

    const script = document.createElement("script");
    script.id = "twitter-wjs";
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.head.appendChild(script);
  }, [isVisible]);

  // Track scroll position for arrow visibility
  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    updateScrollButtons();
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [updateScrollButtons]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.offsetWidth ?? 360;
    el.scrollBy({
      left: direction === "left" ? -cardWidth - 16 : cardWidth + 16,
      behavior: "smooth",
    });
  };

  return (
    <section ref={sectionRef} id="updates" className="relative py-8 md:py-16 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent-primary/[0.03] blur-[120px] pointer-events-none" />

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
              <span className="text-sm">📊</span>
              Live from X
            </span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold">
            Market Updates
          </h2>
          <p className="text-text-secondary mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Latest analysis and trade setups from X
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-bg-primary/90 border border-white/[0.1] text-text-secondary hover:text-text-primary hover:border-accent-primary/30 transition-all backdrop-blur-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-bg-primary/90 border border-white/[0.1] text-text-secondary hover:text-text-primary hover:border-accent-primary/30 transition-all backdrop-blur-sm"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-5 px-5 sm:mx-0 sm:px-0"
          >
            {TWEET_IDS.map((id) => (
              <TweetCard key={id} tweetId={id} isVisible={isVisible} />
            ))}
          </div>
        </motion.div>

        {/* Follow button */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mt-8"
        >
          <a
            href="https://x.com/Umairorkz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-semibold rounded-xl border border-white/[0.08] text-text-primary hover:bg-white/[0.04] hover:border-white/[0.15] transition-all duration-200"
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Follow @Umairorkz on X
          </a>
        </motion.div>
      </div>
    </section>
  );
}
