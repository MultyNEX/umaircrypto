"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const coins = [
  { symbol: "BTC", color: "#F7931A" },
  { symbol: "ETH", color: "#627EEA" },
  { symbol: "USDT", color: "#26A17B" },
  { symbol: "USDC", color: "#2775CA" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Payment() {
  return (
    <section className="relative py-16 md:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-accent-primary font-semibold text-sm uppercase tracking-widest mb-3">
            Payment
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold">
            Pay With Crypto
          </h2>
          <p className="text-text-secondary mt-4 text-base sm:text-lg">
            Fast, secure, non-custodial.
          </p>
        </motion.div>

        {/* Payment card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-2xl mx-auto rounded-2xl bg-bg-secondary/60 backdrop-blur-xl border border-white/[0.08] glass p-6 sm:p-12"
        >
          {/* Floating coin icons */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8">
            {coins.map((coin, i) => (
              <motion.div
                key={coin.symbol}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2"
                  style={{
                    borderColor: coin.color,
                    backgroundColor: `${coin.color}15`,
                  }}
                >
                  <span
                    className="font-mono text-xs sm:text-sm font-bold"
                    style={{ color: coin.color }}
                  >
                    {coin.symbol}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 350+ text */}
          <p className="text-center text-text-secondary text-sm mb-10">
            <span className="text-text-primary font-semibold">
              350+ coins
            </span>{" "}
            accepted via NOWPayments
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center px-7 py-4 text-base font-semibold rounded-xl bg-accent-primary text-bg-primary hover:brightness-110 transition-all duration-200 shadow-[0_0_25px_rgba(0,212,170,0.35)] hover:shadow-[0_0_40px_rgba(0,212,170,0.55)]"
            >
              Pay Now
            </a>
            <a
              href="https://wa.me/PLACEHOLDER?text=Hi%20Umair,%20I'd%20like%20to%20discuss%20payment%20options"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold rounded-xl border border-border text-text-primary hover:bg-bg-tertiary transition-all duration-200"
            >
              <MessageCircle size={18} />
              Prefer to discuss first?
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
