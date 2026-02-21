"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Shield,
  ArrowLeft,
  AlertTriangle,
  Lock,
  Upload,
  X,
  ExternalLink,
} from "lucide-react";
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
    explorer: "https://tronscan.org/#/address/TF2Hu8Uu6rcLNQX32681G2Cu9uCjCQwoeg",
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
    explorer: "https://solscan.io/account/4ueGVRXrbY1tA4LSRQ6R6Se6tWwgAJHmEHQ8SqBTKEdj",
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
    explorer: "https://etherscan.io/address/0x59cda610b21524ec8c70fe4e7c5f3fbb134b9d9e",
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
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
      <PaymentContent />
    </Suspense>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const tierParam = searchParams.get("tier");
  const lockedTier = tierParam !== null ? parseInt(tierParam, 10) : null;
  const isLocked = lockedTier !== null && lockedTier >= 0 && lockedTier <= 2;

  const [activeWallet, setActiveWallet] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number | null>(
    isLocked ? lockedTier : null
  );
  const networkRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLDivElement>(null);

  // ─── Proof form state ───────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    txHash: "",
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Remove preloader gate on mount
  useEffect(() => {
    const gate = document.getElementById("preloader-gate");
    if (gate) gate.remove();
  }, []);

  const wallet = WALLETS[activeWallet];

  const handleTierSelect = (i: number) => {
    if (isLocked) return;
    setSelectedTier(i);
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

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      setScreenshot(e.dataTransfer.files[0]);
    }
  };

  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const body = new FormData();
      body.append("name", formData.name);
      body.append("email", formData.email);
      body.append("phone", formData.phone);
      body.append("txHash", formData.txHash);
      body.append("tier", TIERS[selectedTier!].name);
      body.append("amount", TIERS[selectedTier!].price);
      body.append("network", WALLETS[activeWallet].network);
      if (screenshot) {
        body.append("screenshot", screenshot);
      }

      const res = await fetch("/api/submit-proof", {
        method: "POST",
        body,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setSubmitting(false);
      setSubmitted(true);
    } catch (err: unknown) {
      setSubmitting(false);
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  // ─── Submitted success state ─────────────────────────────────────
  if (submitted) {
    const refId = Math.random().toString(36).substring(2, 8).toUpperCase();
    return (
      <main className="relative min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 max-w-lg mx-auto px-5 py-16 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-400" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            Payment Proof Received
          </h1>
          <p className="text-text-secondary mb-8">
            Thanks, {formData.name}! We&apos;ve received your payment proof.
          </p>

          <div className="rounded-xl bg-bg-secondary/60 border border-white/[0.08] p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Status</span>
              <span className="text-green-400 font-semibold">Proof Submitted</span>
            </div>
            {selectedTier !== null && (
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Service</span>
                <span className="text-text-primary font-semibold">{TIERS[selectedTier].title}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Network</span>
              <span className="text-text-primary font-semibold">{wallet.network}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Reference</span>
              <span className="text-accent-primary font-mono font-semibold">#PMT-{refId}</span>
            </div>
          </div>

          <div className="rounded-xl bg-accent-primary/[0.05] border border-accent-primary/20 p-5 mb-8 text-left">
            <p className="text-accent-primary font-semibold text-sm mb-3">What&apos;s Next:</p>
            <ol className="space-y-2 text-text-secondary text-sm">
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-accent-primary/20 text-accent-primary text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                Verification in progress (usually 5–15 minutes)
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-accent-primary/20 text-accent-primary text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                Confirmation sent to {formData.email}
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-accent-primary/20 text-accent-primary text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                Booking link delivered once verified
              </li>
            </ol>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-primary text-bg-primary font-semibold hover:brightness-110 transition-all"
          >
            Back to UmairCrypto
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-bg-primary">
      {/* Background effects */}
      <div className="aurora-orb aurora-orb-teal top-[10%] right-[10%]" />
      <div className="aurora-orb aurora-orb-gold bottom-[20%] left-[5%]" />
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
            {isLocked
              ? `Complete your payment for the ${TIERS[lockedTier].title}.`
              : "Select your service, choose a network, and send the exact amount."}
          </p>
        </motion.div>

        {/* ── Step 1: Plan ──────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <p className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-primary/20 text-accent-primary text-[11px] font-bold mr-2">1</span>
            {isLocked ? "Your Plan" : "Select Your Plan"}
          </p>

          {isLocked ? (
            <div className="relative p-5 rounded-xl border border-accent-primary bg-accent-primary/[0.08] shadow-[0_0_20px_rgba(56,189,248,0.15)]">
              <div className="absolute top-3 right-3">
                <Lock size={14} className="text-accent-primary" />
              </div>
              <p className="text-[11px] text-text-secondary uppercase tracking-widest font-semibold">
                {TIERS[lockedTier].name}
              </p>
              <div className="flex items-baseline gap-3 mt-1">
                <p className="text-accent-primary font-heading text-3xl font-bold">
                  {TIERS[lockedTier].price}
                </p>
                <p className="text-text-secondary text-sm">
                  {TIERS[lockedTier].title} · {TIERS[lockedTier].duration}
                </p>
              </div>
              <Link href="/payment" className="text-text-secondary text-xs hover:text-accent-primary transition-colors mt-2 inline-block">
                Change plan →
              </Link>
            </div>
          ) : (
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
                  <p className="text-[11px] text-text-secondary uppercase tracking-widest font-semibold">{tier.name}</p>
                  <p className="text-accent-primary font-heading text-xl sm:text-2xl font-bold mt-1">{tier.price}</p>
                  <p className="text-text-secondary text-xs mt-0.5">{tier.duration}</p>
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Step 2: Network ───────────────────────────────────── */}
        <motion.div
          ref={networkRef}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-primary/20 text-accent-primary text-[11px] font-bold mr-2">2</span>
            Choose Network
          </p>
          <div className="grid grid-cols-3 gap-3">
            {WALLETS.map((w, i) => (
              <button
                key={w.id}
                onClick={() => { setActiveWallet(i); setCopied(false); }}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                  activeWallet === i
                    ? "border-white/20 bg-white/[0.06] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <span className="text-2xl font-bold" style={{ color: w.color }}>{w.icon}</span>
                <span className="text-text-primary text-sm font-semibold">{w.token}</span>
                <span className="text-text-secondary text-[10px] sm:text-xs">{w.network}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Step 3: Wallet / QR ───────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-primary/20 text-accent-primary text-[11px] font-bold mr-2">3</span>
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
                  <span className="text-xl font-bold" style={{ color: wallet.color }}>{wallet.icon}</span>
                  <div>
                    <p className="text-text-primary text-sm font-semibold">{wallet.network}</p>
                    <p className="text-text-secondary text-xs">{wallet.token}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-text-secondary text-[10px] uppercase tracking-wider">
                    Fee: {wallet.fee} · {wallet.speed}
                  </p>
                </div>
              </div>

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
                    <p className="text-text-secondary text-xs mb-2 text-center">Wallet Address</p>
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
                        {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="flex items-center gap-1 text-xs text-yellow-400/60">
                        <AlertTriangle size={11} />
                        Always verify the first and last 4 characters after pasting
                      </p>
                      <a
                        href={wallet.explorer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-accent-primary/50 hover:text-accent-primary/80 transition-colors"
                      >
                        Verify on Explorer <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Amount reminder */}
                  {selectedTier !== null && (
                    <div className="w-full p-4 rounded-xl bg-accent-primary/[0.06] border border-accent-primary/20 text-center">
                      <p className="text-text-secondary text-xs mb-1">Send exactly</p>
                      <p className="text-accent-primary font-heading text-2xl font-bold">
                        {TIERS[selectedTier].price}{" "}
                        <span className="text-sm font-normal text-text-secondary">worth of {wallet.token}</span>
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

        {/* ── Security Badge ─────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 mb-8 p-4 rounded-xl bg-bg-secondary/30 border border-white/[0.05]"
        >
          <p className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary/80 mb-2.5">
            <Shield size={13} className="text-accent-primary/60" />
            Payment Security
          </p>
          <div className="space-y-1.5 text-xs text-text-secondary/60">
            <p>✓ Verify address matches after pasting</p>
            <p>✓ Only pay from your own wallet</p>
            <p>✓ Save your TX hash for verification</p>
          </div>
        </motion.div>

        {/* ── Step 4: Upload Proof ──────────────────────────────── */}
        <motion.div
          ref={proofRef}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <p className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-primary/20 text-accent-primary text-[11px] font-bold mr-2">4</span>
            Submit Payment Proof
          </p>

          <div className="rounded-2xl border border-white/[0.08] bg-bg-secondary/60 backdrop-blur-xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Screenshot upload */}
              <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                  Payment Screenshot <span className="text-red-400">*</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? "border-accent-primary bg-accent-primary/[0.08]"
                      : screenshot
                      ? "border-green-500/30 bg-green-500/[0.05]"
                      : "border-white/[0.1] bg-white/[0.02] hover:border-accent-primary/30 hover:bg-white/[0.04]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setScreenshot(e.target.files[0]);
                    }}
                  />
                  {screenshot ? (
                    <div className="flex items-center justify-center gap-3">
                      <Check size={20} className="text-green-400" />
                      <span className="text-text-primary text-sm">{screenshot.name}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setScreenshot(null); }}
                        className="p-1 rounded-full hover:bg-white/10 text-text-secondary"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="mx-auto text-text-secondary/40 mb-3" />
                      <p className="text-text-primary text-sm">Click or drag screenshot here</p>
                      <p className="text-text-secondary text-xs mt-1">JPG, PNG, PDF · Max 5MB</p>
                    </>
                  )}
                </div>
                <div className="mt-3 p-3 rounded-lg bg-accent-primary/[0.04] border border-accent-primary/10">
                  <p className="text-accent-primary text-xs font-semibold mb-1.5">Screenshot must show:</p>
                  <div className="grid grid-cols-3 gap-2 text-text-secondary text-xs">
                    <span className="flex items-center gap-1"><Check size={12} className="text-green-400" /> Amount</span>
                    <span className="flex items-center gap-1"><Check size={12} className="text-green-400" /> Address</span>
                    <span className="flex items-center gap-1"><Check size={12} className="text-green-400" /> Completed</span>
                  </div>
                </div>
              </div>

              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-primary text-sm font-medium mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-text-primary text-sm font-medium mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Phone + TX Hash row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-primary text-sm font-medium mb-2">
                    Phone / WhatsApp <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+971 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-text-primary text-sm font-medium mb-2">
                    TX Hash <span className="text-text-secondary text-xs font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Transaction hash"
                    value={formData.txHash}
                    onChange={(e) => setFormData({ ...formData, txHash: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Submit */}
              {submitError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={!screenshot || !formData.name || !formData.email || !formData.phone || submitting}
                className="w-full py-4 rounded-xl text-base font-semibold transition-all duration-200 bg-accent-primary text-bg-primary hover:brightness-110 shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_40px_rgba(56,189,248,0.55)] btn-neon-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:shadow-none"
              >
                {submitting ? "Submitting..." : "Submit Payment Proof"}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Warning */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 p-4 rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/[0.05]"
        >
          <div className="flex gap-3">
            <AlertTriangle size={18} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <div className="text-sm text-text-secondary space-y-1">
              <p>
                <span className="text-[#F59E0B] font-semibold">Important:</span>{" "}
                Double-check the wallet address and network before sending. Sending to the wrong network may result in permanent loss.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security notice */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-4 p-4 rounded-xl border border-accent-secondary/20 bg-accent-secondary/[0.03]"
        >
          <p className="text-accent-secondary text-xs font-semibold mb-2 flex items-center gap-1.5">
            <Shield size={14} /> Security Notice
          </p>
          <div className="text-text-secondary text-xs space-y-1">
            <p>· We will NEVER ask for additional payments</p>
            <p>· These are the ONLY wallet addresses we use</p>
            <p>· Double-check network before sending</p>
            <p>· Verification takes 5–15 minutes</p>
          </div>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center justify-center gap-6 mt-6 mb-4 text-text-secondary text-xs"
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