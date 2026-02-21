"use client";

import { motion } from "framer-motion";
import { Shield, Zap, ArrowRight } from "lucide-react";

const cryptos = [
  { name: "USDT", label: "Tron (TRC20)", color: "#26A17B", char: "₮" },
  { name: "USDT", label: "Solana", color: "#9945FF", char: "◎" },
  { name: "USDT / ETH", label: "Ethereum (ERC20)", color: "#627EEA", char: "Ξ" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Payment() {
  return (
    <section className="relative py-8 md:py-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8"
        >
          <p className="text-accent-primary font-semibold text-sm uppercase tracking-widest mb-3">
            Payment
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold">
            Pay With <span className="text-gradient-animated">Crypto</span>
          </h2>
          <p className="text-text-secondary mt-4 text-sm sm:text-base max-w-xl mx-auto">
            Pay securely with USDT or ETH across three networks. Direct wallet
            transfer — no middleman.
          </p>
        </motion.div>

        {/* Payment card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-2xl mx-auto rounded-2xl bg-bg-secondary/60 glass-enhanced border border-white/[0.08] p-6 sm:p-12 shimmer-card"
        >
          {/* Accepted cryptos */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            {cryptos.map((coin, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <span
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: coin.color }}
                >
                  {coin.char}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-text-primary">
                  {coin.name}
                </span>
                <span className="text-[10px] sm:text-xs text-text-secondary text-center">
                  {coin.label}
                </span>
              </div>
            ))}
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 mb-8 text-text-secondary text-xs sm:text-sm">
            <span className="flex items-center gap-1.5">
              <Shield size={14} className="text-accent-primary" />
              Non-custodial
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-accent-warm" />
              Fast verification
            </span>
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <a
              href="/payment"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl bg-accent-primary text-bg-primary hover:brightness-110 transition-all duration-200 shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_40px_rgba(56,189,248,0.55)] btn-neon-glow"
            >
              Pay Now
              <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
