"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Shield, ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── Wallet data ────────────────────────────────────────────────────
const WALLETS = [
  {
    id: "trc20",
    network: "Tron (TRC20)",
    token: "USDT",
    address: "TF2Hu8Uu6rcLNQX32681G2Cu9uCjCQwoeg",
    qr: "/qr-trc20.png",
    color: "#26A17B",
    icon: "₮",
    fee: "~$1",
    speed: "~30 seconds",
  },
  {
    id: "sol",
    network: "Solana",
    token: "USDT",
    address: "4ueGVRXrbY1tA4LSRQ6R6Se6tWwgAJHmEHQ8SqBTKEdj",
    qr: "/qr-sol.png",
    color: "#9945FF",
    icon: "◎",
    fee: "~$0.01",
    speed: "~2 seconds",
  },
  {
    id: "erc20",
    network: "Ethereum (ERC20)",
    token: "USDT / ETH",
    address: "0x59cda610b21524ec8c70fe4e7c5f3fbb134b9d9e",
    qr: "/qr-erc20.png",
    color: "#627EEA",
    icon: "Ξ",
    fee: "~$2-10",
    speed: "~30 seconds",
  },
];

const TIERS = [
  { name: "Starter", title: "1-on-1 Chart Review", price: "$200", duration: "30 min" },
  { name: "Pro", title: "Full Consultation", price: "$350", duration: "60 min" },
  { name: "VIP", title: "Ongoing Mentorship", price: "$1,200", duration: "6 months" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PaymentPage() {
  const [activeWallet, setActiveWallet] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const networkRef = useRef<HTMLDivElement>(null);

  // Remove preloader gate on mount
  useEffect(() => {
    const gate = document.getElementById("preloader-gate");
    if (gate) gate.remove();
  }, []);

  const wallet = WALLETS[activeWallet];

  const handleTierSelect = (i: number) => {
    setSelectedTier(i);
    // Smooth scroll to network selection
    setTimeout(() => {
      networkRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = wallet.address;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="relative min-h-screen bg-bg-primary">
      {/* Background effects */}
      <div className="aurora-orb aurora-orb-teal top-[10%] right-[10%]" />
      <div className="aurora-orb aurora-orb-gold bottom-[20%] left-[5%]" />

      {/* Circuit grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-20">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-accent-primary font-semibold text-sm uppercase tracking-widest mb-3">
            Payment
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold">
            Pay With{" "}
            <span className="text-gradient-animated">Crypto</span>
          </h1>
          <p className="text-text-secondary mt-4 text-sm sm:text-base max-w-lg mx-auto">
            Select your service, choose a network, and send the exact amount.
            Confirmation is typically within minutes.
          </p>
        </motion.div>

        {/* Step 1 — Select Tier */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <p className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-primary/20 text-accent-primary text-[11px] font-bold mr-2">
              1
            </span>
            Select Your Plan
          </p>
          <div className="grid grid-cols-3 gap-3">
            {TIERS.map((tier, i) => (
              <button
                key={tier.name}
                onClick={() => handleTierSelect(i)}
                className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                  selectedTier === i
                    ? "border-accent-primary bg-accent-primary/[0.08] shadow-[0_0_20px_rgba(56,189,248,0.15)]"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                {selectedTier === i && (
                  <div className="absolute top-2 right-2">
                    <Check size={14} className="text-accent-primary" />
                  </div>
                )}
                <p className="text-[11px] text-text-secondary uppercase tracking-widest font-semibold">
                  {tier.name}
                </p>
                <p className="text-accent-primary font-heading text-xl sm:text-2xl font-bold mt-1">
                  {tier.price}
                </p>
                <p className="text-text-secondary text-xs mt-0.5">
                  {tier.duration}
                </p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Step 2 — Select Network */}
        <motion.div
          ref={networkRef}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-primary/20 text-accent-primary text-[11px] font-bold mr-2">
              2
            </span>
            Choose Network
          </p>
          <div className="grid grid-cols-3 gap-3">
            {WALLETS.map((w, i) => (
              <button
                key={w.id}
                onClick={() => {
                  setActiveWallet(i);
                  setCopied(false);
                }}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                  activeWallet === i
                    ? "border-white/20 bg-white/[0.06] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <span
                  className="text-2xl font-bold"
                  style={{ color: w.color }}
                >
                  {w.icon}
                </span>
                <span className="text-text-primary text-sm font-semibold">
                  {w.token}
                </span>
                <span className="text-text-secondary text-[10px] sm:text-xs">
                  {w.network}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Step 3 — Wallet Card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-primary/20 text-accent-primary text-[11px] font-bold mr-2">
              3
            </span>
            Send Payment
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={wallet.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-white/[0.08] bg-bg-secondary/60 backdrop-blur-xl overflow-hidden"
            >
              {/* Network header bar */}
              <div
                className="flex items-center justify-between px-6 py-3"
                style={{
                  background: `linear-gradient(90deg, ${wallet.color}15, transparent)`,
                  borderBottom: `1px solid ${wallet.color}20`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-xl font-bold"
                    style={{ color: wallet.color }}
                  >
                    {wallet.icon}
                  </span>
                  <div>
                    <p className="text-text-primary text-sm font-semibold">
                      {wallet.network}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {wallet.token}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-text-secondary text-[10px] uppercase tracking-wider">
                    Fee: {wallet.fee} · {wallet.speed}
                  </p>
                </div>
              </div>

              {/* QR + Address */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-col items-center gap-6">
                  {/* QR Code */}
                  <div className="relative p-4 bg-white rounded-2xl shadow-lg">
                    <Image
                      src={wallet.qr}
                      alt={`${wallet.network} QR Code`}
                      width={200}
                      height={200}
                      className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]"
                    />
                  </div>

                  {/* Address + Copy */}
                  <div className="w-full">
                    <p className="text-text-secondary text-xs mb-2 text-center">
                      Wallet Address
                    </p>
                    <div className="flex items-center gap-2 p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <code className="flex-1 text-text-primary text-xs sm:text-sm font-mono break-all leading-relaxed">
                        {wallet.address}
                      </code>
                      <button
                        onClick={handleCopy}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          copied
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-accent-primary/15 text-accent-primary hover:bg-accent-primary/25 border border-accent-primary/20"
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check size={14} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Amount reminder */}
                  {selectedTier !== null && (
                    <div className="w-full p-4 rounded-xl bg-accent-primary/[0.06] border border-accent-primary/20 text-center">
                      <p className="text-text-secondary text-xs mb-1">
                        Send exactly
                      </p>
                      <p className="text-accent-primary font-heading text-2xl font-bold">
                        {TIERS[selectedTier].price}{" "}
                        <span className="text-sm font-normal text-text-secondary">
                          worth of {wallet.token}
                        </span>
                      </p>
                      <p className="text-text-secondary text-xs mt-1">
                        for {TIERS[selectedTier].title} ({TIERS[selectedTier].duration})
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Warning / Info */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 p-4 rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/[0.05]"
        >
          <div className="flex gap-3">
            <AlertTriangle
              size={18}
              className="text-[#F59E0B] flex-shrink-0 mt-0.5"
            />
            <div className="text-sm text-text-secondary space-y-1">
              <p>
                <span className="text-[#F59E0B] font-semibold">
                  Important:
                </span>{" "}
                Double-check the wallet address and network before sending.
                Sending to the wrong network may result in permanent loss.
              </p>
              <p>
                After payment, send a screenshot of the transaction to{" "}
                <a
                  href="https://instagram.com/umairorkz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:underline"
                >
                  @umairorkz on Instagram
                </a>{" "}
                for confirmation and booking.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-6 mt-8 text-text-secondary text-xs"
        >
          <span className="flex items-center gap-1.5">
            <Shield size={14} className="text-accent-primary" />
            Non-custodial · Direct transfer
          </span>
        </motion.div>
      </div>
    </main>
  );
}
