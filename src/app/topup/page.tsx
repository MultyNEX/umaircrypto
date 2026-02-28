"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Copy,
  Check,
  AlertTriangle,
  Upload,
  X,
  ExternalLink,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TopupInfo {
  originalRefId: string;
  name: string;
  tier: string;
  tierPrice: string;
  amountReceived: string;
  amountRemaining: string;
  network: string;
}

const WALLET_META: Record<string, { qr: string; color: string; icon: string; explorerBase: string }> = {
  "Tron (TRC20)": { qr: "/qr-trc20.png", color: "#26A17B", icon: "₮", explorerBase: "https://tronscan.org/#/address/" },
  "Solana": { qr: "/qr-sol.png", color: "#9945FF", icon: "◎", explorerBase: "https://solscan.io/account/" },
  "Ethereum (ERC20)": { qr: "/qr-erc20.png", color: "#627EEA", icon: "Ξ", explorerBase: "https://etherscan.io/address/" },
};

const NETWORK_TO_WALLET_KEY: Record<string, string> = {
  "Tron (TRC20)": "trc20",
  "Solana": "sol",
  "Ethereum (ERC20)": "erc20",
};

export default function TopupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060612]" />}>
      <TopupContent />
    </Suspense>
  );
}

function TopupContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [info, setInfo] = useState<TopupInfo | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const gate = document.getElementById("preloader-gate");
    if (gate) gate.remove();
  }, []);

  // Fetch top-up info + wallet addresses
  useEffect(() => {
    if (!token) {
      setError("Missing top-up token. Please use the link from your email.");
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`/api/topup-info?token=${token}`).then((r) => r.json()),
      fetch("/api/wallets").then((r) => r.json()),
    ])
      .then(([topupData, walletData]) => {
        if (topupData.error) {
          setError(topupData.error);
        } else {
          setInfo(topupData);
          // Get the right wallet address for this network
          const walletKey = NETWORK_TO_WALLET_KEY[topupData.network];
          if (walletKey && walletData.wallets?.[walletKey]) {
            setWalletAddress(walletData.wallets[walletKey]);
          }
        }
      })
      .catch(() => setError("Failed to load top-up details. Please try again."))
      .finally(() => setLoading(false));
  }, [token]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = walletAddress;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const body = new FormData();
      body.append("topupToken", token || "");
      body.append("txHash", txHash);
      if (screenshot) body.append("screenshot", screenshot);

      const res = await fetch("/api/submit-topup", { method: "POST", body });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#060612] flex items-center justify-center">
        <p className="text-[#94a3b8] text-sm animate-pulse">Loading top-up details...</p>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-[#060612] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <h1 className="text-white font-semibold text-lg mb-2">Link Expired or Invalid</h1>
          <p className="text-[#94a3b8] text-sm mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block bg-[#38BDF8] text-[#060612] font-semibold px-6 py-3 rounded-xl text-sm hover:brightness-110 transition"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // Submitted state
  if (submitted) {
    return (
      <main className="min-h-screen bg-[#060612] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-green-400" />
          </div>
          <h1 className="text-white font-semibold text-lg mb-2">Top-Up Submitted!</h1>
          <p className="text-[#94a3b8] text-sm mb-2">We&apos;ve received your remaining payment proof.</p>
          <p className="text-[#94a3b8] text-sm">We&apos;ll verify it and send your booking link shortly — usually within a few hours.</p>
        </div>
      </main>
    );
  }

  if (!info) return null;

  const meta = WALLET_META[info.network];

  return (
    <main className="min-h-screen bg-[#060612] px-4 py-8 sm:py-12">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-block bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-[#F59E0B] text-xs font-semibold">Top-Up Required</span>
          </div>
          <h1 className="text-white font-semibold text-xl sm:text-2xl mb-1">Complete Your Payment</h1>
          <p className="text-[#94a3b8] text-sm">
            Original order: <span className="font-mono text-white">#{info.originalRefId}</span>
          </p>
        </div>

        {/* Shortfall summary */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#94a3b8]">Plan</span>
            <span className="text-white font-semibold">{info.tier} (${info.tierPrice})</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#94a3b8]">Amount Received</span>
            <span className="text-white">${info.amountReceived}</span>
          </div>
          <hr className="border-white/[0.06]" />
          <div className="flex justify-between text-base">
            <span className="text-[#F59E0B] font-semibold">Remaining</span>
            <span className="text-[#F59E0B] font-bold text-lg">${info.amountRemaining}</span>
          </div>
        </div>

        {/* Wallet + QR */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
            {meta && (
              <span className="text-xl font-bold" style={{ color: meta.color }}>{meta.icon}</span>
            )}
            <div>
              <p className="text-white text-sm font-semibold">{info.network}</p>
              <p className="text-[#64748b] text-xs">Same network as your original payment</p>
            </div>
          </div>

          <div className="p-6 flex flex-col items-center gap-6">
            {meta && (
              <div className="p-4 bg-white rounded-2xl shadow-lg">
                <Image src={meta.qr} alt={`${info.network} QR Code`} width={180} height={180} />
              </div>
            )}

            <div className="w-full">
              <p className="text-[#94a3b8] text-xs mb-2 text-center">Wallet Address</p>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <code className="flex-1 text-white text-xs font-mono break-all leading-relaxed">
                  {walletAddress || <span className="text-[#94a3b8] animate-pulse">Loading...</span>}
                </code>
                <button
                  onClick={handleCopy}
                  disabled={!walletAddress}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    copied
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-[#38BDF8]/15 text-[#38BDF8] hover:bg-[#38BDF8]/25 border border-[#38BDF8]/20"
                  } disabled:opacity-40`}
                >
                  {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="flex items-center gap-1 text-xs text-yellow-400/60">
                  <AlertTriangle size={11} />
                  Verify first and last 4 characters
                </p>
                {walletAddress && meta && (
                  <a
                    href={`${meta.explorerBase}${walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#38BDF8]/50 hover:text-[#38BDF8]/80 transition-colors"
                  >
                    Explorer <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>

            {/* Amount reminder */}
            <div className="w-full p-4 rounded-xl bg-[#F59E0B]/[0.06] border border-[#F59E0B]/20 text-center">
              <p className="text-[#94a3b8] text-xs mb-1">Send exactly</p>
              <p className="text-[#F59E0B] text-2xl font-bold">${info.amountRemaining}</p>
            </div>
          </div>
        </div>

        {/* Proof form */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <h3 className="text-white text-sm font-semibold mb-4">Submit Top-Up Proof</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                TX Hash <span className="text-[#94a3b8] text-xs font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Transaction hash"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-[#475569] focus:outline-none focus:border-[#38BDF8]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Screenshot <span className="text-red-400">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setScreenshot(e.target.files[0]);
                }}
              />
              {screenshot ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <p className="flex-1 text-white text-sm truncate">{screenshot.name}</p>
                  <button
                    type="button"
                    onClick={() => { setScreenshot(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="text-[#94a3b8] hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-6 rounded-xl border-2 border-dashed border-white/[0.08] hover:border-white/[0.15] text-center transition-colors"
                >
                  <Upload size={24} className="mx-auto text-[#475569] mb-2" />
                  <p className="text-[#94a3b8] text-sm">Click to upload screenshot</p>
                </button>
              )}
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={!screenshot || submitting}
              className="w-full py-4 rounded-xl text-base font-semibold bg-[#F59E0B] text-[#0a0a0f] hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : `Submit Top-Up Proof — $${info.amountRemaining}`}
            </button>
          </form>
        </div>

        {/* Security notice */}
        <div className="p-4 rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/[0.03]">
          <p className="text-[#22c55e] text-xs font-semibold mb-2 flex items-center gap-1.5">
            <Shield size={14} /> Security Notice
          </p>
          <div className="text-[#94a3b8] text-xs space-y-1">
            <p>· This is the same wallet address as your original payment</p>
            <p>· This link expires in 48 hours</p>
            <p>· We will NEVER ask for additional payments beyond this top-up</p>
          </div>
        </div>
      </div>
    </main>
  );
}
