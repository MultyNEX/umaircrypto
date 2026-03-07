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
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── Wallet display metadata (no sensitive addresses) ──────────────
const WALLET_META = [
  {
    id: "trc20",
    network: "Tron (TRC20)",
    token: "USDT",
    qr: "/qr-trc20.png",
    color: "#26A17B",
    icon: "₮",
    fee: "~$1",
    speed: "~30 seconds",
    explorerBase: "https://tronscan.org/#/address/",
  },
  {
    id: "sol",
    network: "Solana",
    token: "USDT",
    qr: "/qr-sol.png",
    color: "#9945FF",
    icon: "◎",
    fee: "~$0.01",
    speed: "~2 seconds",
    explorerBase: "https://solscan.io/account/",
  },
  {
    id: "erc20",
    network: "Ethereum (ERC20)",
    token: "USDT / ETH",
    qr: "/qr-erc20.png",
    color: "#627EEA",
    icon: "Ξ",
    fee: "~$2-10",
    speed: "~30 seconds",
    explorerBase: "https://etherscan.io/address/",
  },
];

const COUNTRY_CODES = [
  { code: "+93", flag: "🇦🇫", country: "Afghanistan", digits: 9 },
  { code: "+355", flag: "🇦🇱", country: "Albania", digits: 9 },
  { code: "+213", flag: "🇩🇿", country: "Algeria", digits: 9 },
  { code: "+376", flag: "🇦🇩", country: "Andorra", digits: 6 },
  { code: "+244", flag: "🇦🇴", country: "Angola", digits: 9 },
  { code: "+54", flag: "🇦🇷", country: "Argentina", digits: 10 },
  { code: "+374", flag: "🇦🇲", country: "Armenia", digits: 8 },
  { code: "+61", flag: "🇦🇺", country: "Australia", digits: 9 },
  { code: "+43", flag: "🇦🇹", country: "Austria", digits: 10 },
  { code: "+994", flag: "🇦🇿", country: "Azerbaijan", digits: 9 },
  { code: "+973", flag: "🇧🇭", country: "Bahrain", digits: 8 },
  { code: "+880", flag: "🇧🇩", country: "Bangladesh", digits: 10 },
  { code: "+375", flag: "🇧🇾", country: "Belarus", digits: 9 },
  { code: "+32", flag: "🇧🇪", country: "Belgium", digits: 9 },
  { code: "+501", flag: "🇧🇿", country: "Belize", digits: 7 },
  { code: "+229", flag: "🇧🇯", country: "Benin", digits: 8 },
  { code: "+975", flag: "🇧🇹", country: "Bhutan", digits: 8 },
  { code: "+591", flag: "🇧🇴", country: "Bolivia", digits: 8 },
  { code: "+387", flag: "🇧🇦", country: "Bosnia", digits: 8 },
  { code: "+267", flag: "🇧🇼", country: "Botswana", digits: 8 },
  { code: "+55", flag: "🇧🇷", country: "Brazil", digits: 9 },
  { code: "+673", flag: "🇧🇳", country: "Brunei", digits: 7 },
  { code: "+359", flag: "🇧🇬", country: "Bulgaria", digits: 9 },
  { code: "+226", flag: "🇧🇫", country: "Burkina Faso", digits: 8 },
  { code: "+257", flag: "🇧🇮", country: "Burundi", digits: 8 },
  { code: "+855", flag: "🇰🇭", country: "Cambodia", digits: 9 },
  { code: "+237", flag: "🇨🇲", country: "Cameroon", digits: 9 },
  { code: "+1", flag: "🇨🇦", country: "Canada", digits: 10 },
  { code: "+238", flag: "🇨🇻", country: "Cape Verde", digits: 7 },
  { code: "+236", flag: "🇨🇫", country: "Central African Rep.", digits: 8 },
  { code: "+235", flag: "🇹🇩", country: "Chad", digits: 8 },
  { code: "+56", flag: "🇨🇱", country: "Chile", digits: 9 },
  { code: "+86", flag: "🇨🇳", country: "China", digits: 11 },
  { code: "+57", flag: "🇨🇴", country: "Colombia", digits: 10 },
  { code: "+242", flag: "🇨🇬", country: "Congo", digits: 9 },
  { code: "+243", flag: "🇨🇩", country: "Congo (DR)", digits: 9 },
  { code: "+506", flag: "🇨🇷", country: "Costa Rica", digits: 8 },
  { code: "+385", flag: "🇭🇷", country: "Croatia", digits: 9 },
  { code: "+53", flag: "🇨🇺", country: "Cuba", digits: 8 },
  { code: "+357", flag: "🇨🇾", country: "Cyprus", digits: 8 },
  { code: "+420", flag: "🇨🇿", country: "Czech Republic", digits: 9 },
  { code: "+45", flag: "🇩🇰", country: "Denmark", digits: 8 },
  { code: "+253", flag: "🇩🇯", country: "Djibouti", digits: 8 },
  { code: "+593", flag: "🇪🇨", country: "Ecuador", digits: 9 },
  { code: "+20", flag: "🇪🇬", country: "Egypt", digits: 10 },
  { code: "+503", flag: "🇸🇻", country: "El Salvador", digits: 8 },
  { code: "+240", flag: "🇬🇶", country: "Equatorial Guinea", digits: 9 },
  { code: "+291", flag: "🇪🇷", country: "Eritrea", digits: 7 },
  { code: "+372", flag: "🇪🇪", country: "Estonia", digits: 8 },
  { code: "+251", flag: "🇪🇹", country: "Ethiopia", digits: 9 },
  { code: "+679", flag: "🇫🇯", country: "Fiji", digits: 7 },
  { code: "+358", flag: "🇫🇮", country: "Finland", digits: 9 },
  { code: "+33", flag: "🇫🇷", country: "France", digits: 9 },
  { code: "+241", flag: "🇬🇦", country: "Gabon", digits: 8 },
  { code: "+220", flag: "🇬🇲", country: "Gambia", digits: 7 },
  { code: "+995", flag: "🇬🇪", country: "Georgia", digits: 9 },
  { code: "+49", flag: "🇩🇪", country: "Germany", digits: 11 },
  { code: "+233", flag: "🇬🇭", country: "Ghana", digits: 9 },
  { code: "+30", flag: "🇬🇷", country: "Greece", digits: 10 },
  { code: "+502", flag: "🇬🇹", country: "Guatemala", digits: 8 },
  { code: "+224", flag: "🇬🇳", country: "Guinea", digits: 9 },
  { code: "+592", flag: "🇬🇾", country: "Guyana", digits: 7 },
  { code: "+509", flag: "🇭🇹", country: "Haiti", digits: 8 },
  { code: "+504", flag: "🇭🇳", country: "Honduras", digits: 8 },
  { code: "+852", flag: "🇭🇰", country: "Hong Kong", digits: 8 },
  { code: "+36", flag: "🇭🇺", country: "Hungary", digits: 9 },
  { code: "+354", flag: "🇮🇸", country: "Iceland", digits: 7 },
  { code: "+91", flag: "🇮🇳", country: "India", digits: 10 },
  { code: "+62", flag: "🇮🇩", country: "Indonesia", digits: 10 },
  { code: "+98", flag: "🇮🇷", country: "Iran", digits: 10 },
  { code: "+964", flag: "🇮🇶", country: "Iraq", digits: 10 },
  { code: "+353", flag: "🇮🇪", country: "Ireland", digits: 9 },
  { code: "+972", flag: "🇮🇱", country: "Israel", digits: 9 },
  { code: "+39", flag: "🇮🇹", country: "Italy", digits: 10 },
  { code: "+1876", flag: "🇯🇲", country: "Jamaica", digits: 7 },
  { code: "+81", flag: "🇯🇵", country: "Japan", digits: 10 },
  { code: "+962", flag: "🇯🇴", country: "Jordan", digits: 9 },
  { code: "+7", flag: "🇰🇿", country: "Kazakhstan", digits: 10 },
  { code: "+254", flag: "🇰🇪", country: "Kenya", digits: 9 },
  { code: "+965", flag: "🇰🇼", country: "Kuwait", digits: 8 },
  { code: "+996", flag: "🇰🇬", country: "Kyrgyzstan", digits: 9 },
  { code: "+856", flag: "🇱🇦", country: "Laos", digits: 10 },
  { code: "+371", flag: "🇱🇻", country: "Latvia", digits: 8 },
  { code: "+961", flag: "🇱🇧", country: "Lebanon", digits: 8 },
  { code: "+231", flag: "🇱🇷", country: "Liberia", digits: 7 },
  { code: "+218", flag: "🇱🇾", country: "Libya", digits: 9 },
  { code: "+370", flag: "🇱🇹", country: "Lithuania", digits: 8 },
  { code: "+352", flag: "🇱🇺", country: "Luxembourg", digits: 9 },
  { code: "+853", flag: "🇲🇴", country: "Macau", digits: 8 },
  { code: "+261", flag: "🇲🇬", country: "Madagascar", digits: 9 },
  { code: "+265", flag: "🇲🇼", country: "Malawi", digits: 7 },
  { code: "+60", flag: "🇲🇾", country: "Malaysia", digits: 10 },
  { code: "+960", flag: "🇲🇻", country: "Maldives", digits: 7 },
  { code: "+223", flag: "🇲🇱", country: "Mali", digits: 8 },
  { code: "+356", flag: "🇲🇹", country: "Malta", digits: 8 },
  { code: "+222", flag: "🇲🇷", country: "Mauritania", digits: 8 },
  { code: "+230", flag: "🇲🇺", country: "Mauritius", digits: 8 },
  { code: "+52", flag: "🇲🇽", country: "Mexico", digits: 10 },
  { code: "+373", flag: "🇲🇩", country: "Moldova", digits: 8 },
  { code: "+377", flag: "🇲🇨", country: "Monaco", digits: 9 },
  { code: "+976", flag: "🇲🇳", country: "Mongolia", digits: 8 },
  { code: "+382", flag: "🇲🇪", country: "Montenegro", digits: 8 },
  { code: "+212", flag: "🇲🇦", country: "Morocco", digits: 9 },
  { code: "+258", flag: "🇲🇿", country: "Mozambique", digits: 9 },
  { code: "+95", flag: "🇲🇲", country: "Myanmar", digits: 9 },
  { code: "+264", flag: "🇳🇦", country: "Namibia", digits: 8 },
  { code: "+977", flag: "🇳🇵", country: "Nepal", digits: 10 },
  { code: "+31", flag: "🇳🇱", country: "Netherlands", digits: 9 },
  { code: "+64", flag: "🇳🇿", country: "New Zealand", digits: 9 },
  { code: "+505", flag: "🇳🇮", country: "Nicaragua", digits: 8 },
  { code: "+227", flag: "🇳🇪", country: "Niger", digits: 8 },
  { code: "+234", flag: "🇳🇬", country: "Nigeria", digits: 10 },
  { code: "+47", flag: "🇳🇴", country: "Norway", digits: 8 },
  { code: "+968", flag: "🇴🇲", country: "Oman", digits: 8 },
  { code: "+92", flag: "🇵🇰", country: "Pakistan", digits: 10 },
  { code: "+970", flag: "🇵🇸", country: "Palestine", digits: 9 },
  { code: "+507", flag: "🇵🇦", country: "Panama", digits: 8 },
  { code: "+595", flag: "🇵🇾", country: "Paraguay", digits: 9 },
  { code: "+51", flag: "🇵🇪", country: "Peru", digits: 9 },
  { code: "+63", flag: "🇵🇭", country: "Philippines", digits: 10 },
  { code: "+48", flag: "🇵🇱", country: "Poland", digits: 9 },
  { code: "+351", flag: "🇵🇹", country: "Portugal", digits: 9 },
  { code: "+974", flag: "🇶🇦", country: "Qatar", digits: 8 },
  { code: "+40", flag: "🇷🇴", country: "Romania", digits: 9 },
  { code: "+7", flag: "🇷🇺", country: "Russia", digits: 10 },
  { code: "+250", flag: "🇷🇼", country: "Rwanda", digits: 9 },
  { code: "+966", flag: "🇸🇦", country: "Saudi Arabia", digits: 9 },
  { code: "+221", flag: "🇸🇳", country: "Senegal", digits: 9 },
  { code: "+381", flag: "🇷🇸", country: "Serbia", digits: 10 },
  { code: "+65", flag: "🇸🇬", country: "Singapore", digits: 8 },
  { code: "+421", flag: "🇸🇰", country: "Slovakia", digits: 9 },
  { code: "+386", flag: "🇸🇮", country: "Slovenia", digits: 9 },
  { code: "+252", flag: "🇸🇴", country: "Somalia", digits: 9 },
  { code: "+27", flag: "🇿🇦", country: "South Africa", digits: 9 },
  { code: "+82", flag: "🇰🇷", country: "South Korea", digits: 10 },
  { code: "+211", flag: "🇸🇸", country: "South Sudan", digits: 9 },
  { code: "+34", flag: "🇪🇸", country: "Spain", digits: 9 },
  { code: "+94", flag: "🇱🇰", country: "Sri Lanka", digits: 9 },
  { code: "+249", flag: "🇸🇩", country: "Sudan", digits: 9 },
  { code: "+46", flag: "🇸🇪", country: "Sweden", digits: 9 },
  { code: "+41", flag: "🇨🇭", country: "Switzerland", digits: 9 },
  { code: "+963", flag: "🇸🇾", country: "Syria", digits: 9 },
  { code: "+886", flag: "🇹🇼", country: "Taiwan", digits: 9 },
  { code: "+992", flag: "🇹🇯", country: "Tajikistan", digits: 9 },
  { code: "+255", flag: "🇹🇿", country: "Tanzania", digits: 9 },
  { code: "+66", flag: "🇹🇭", country: "Thailand", digits: 9 },
  { code: "+228", flag: "🇹🇬", country: "Togo", digits: 8 },
  { code: "+676", flag: "🇹🇴", country: "Tonga", digits: 5 },
  { code: "+1868", flag: "🇹🇹", country: "Trinidad & Tobago", digits: 7 },
  { code: "+216", flag: "🇹🇳", country: "Tunisia", digits: 8 },
  { code: "+90", flag: "🇹🇷", country: "Turkey", digits: 10 },
  { code: "+993", flag: "🇹🇲", country: "Turkmenistan", digits: 8 },
  { code: "+256", flag: "🇺🇬", country: "Uganda", digits: 9 },
  { code: "+380", flag: "🇺🇦", country: "Ukraine", digits: 9 },
  { code: "+971", flag: "🇦🇪", country: "UAE", digits: 9 },
  { code: "+44", flag: "🇬🇧", country: "United Kingdom", digits: 10 },
  { code: "+1", flag: "🇺🇸", country: "United States", digits: 10 },
  { code: "+598", flag: "🇺🇾", country: "Uruguay", digits: 8 },
  { code: "+998", flag: "🇺🇿", country: "Uzbekistan", digits: 9 },
  { code: "+58", flag: "🇻🇪", country: "Venezuela", digits: 10 },
  { code: "+84", flag: "🇻🇳", country: "Vietnam", digits: 9 },
  { code: "+967", flag: "🇾🇪", country: "Yemen", digits: 9 },
  { code: "+260", flag: "🇿🇲", country: "Zambia", digits: 9 },
  { code: "+263", flag: "🇿🇼", country: "Zimbabwe", digits: 9 },
];

const SORTED_COUNTRY_CODES = [...COUNTRY_CODES].sort(
  (a, b) => parseInt(a.code) - parseInt(b.code)
);

const EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
  "icloud.com", "protonmail.com", "aol.com", "live.com",
  "me.com", "msn.com", "mail.com",
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
  const fromParam = searchParams.get("from");
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
    nationality: "",
    language: "",
  });
  const [selectedCode, setSelectedCode] = useState<(typeof COUNTRY_CODES)[0] | null>(null);
  const [dialInput, setDialInput] = useState("");
  const [showDialDropdown, setShowDialDropdown] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [autoApproved, setAutoApproved] = useState(false);

  // LFGbot analysis state
  interface AnalysisResult {
    amountSent: string | null;
    currency: string | null;
    receivingAddress: string | null;
    txHash: string | null;
    network: string | null;
    exchange: string | null;
    status: string | null;
    confidence: "high" | "medium" | "low";
    summary: string;
    warnings: string[];
  }
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState("");

  // On-chain TX verification state
  interface TxVerifyResult {
    verified: boolean;
    amount: number | null;
    toAddress: string | null;
    fromAddress: string | null;
    status: "confirmed" | "pending" | "failed" | "not_found";
    network: string;
    error?: string;
  }
  const [txVerifying, setTxVerifying] = useState(false);
  const [txVerification, setTxVerification] = useState<TxVerifyResult | null>(null);
  const [walletAddresses, setWalletAddresses] = useState<Record<string, string>>({});
  const [walletsLoading, setWalletsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const codeWrapperRef = useRef<HTMLDivElement>(null);
  const emailWrapperRef = useRef<HTMLDivElement>(null);

  // Fetch wallet addresses from backend (never hardcoded)
  useEffect(() => {
    fetch("/api/wallets")
      .then((res) => res.json())
      .then((data) => setWalletAddresses(data.wallets || {}))
      .catch(() => console.error("Failed to load wallet addresses"))
      .finally(() => setWalletsLoading(false));
  }, []);

  // Remove preloader gate on mount
  useEffect(() => {
    const gate = document.getElementById("preloader-gate");
    if (gate) gate.remove();
  }, []);

  // Close dial code dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (codeWrapperRef.current && !codeWrapperRef.current.contains(e.target as Node)) {
        setShowDialDropdown(false);
      }
      if (emailWrapperRef.current && !emailWrapperRef.current.contains(e.target as Node)) {
        setShowEmailSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredCodes = SORTED_COUNTRY_CODES.filter((c) => {
    const q = dialInput.toLowerCase().replace(/^\+/, "");
    if (!q) return true;
    const numPart = c.code.replace("+", "");
    return numPart.startsWith(q) || c.country.toLowerCase().includes(q);
  });

  const emailSuggestions = (() => {
    const val = formData.email;
    if (!val) return [];
    const atIdx = val.indexOf("@");
    if (atIdx === -1) {
      // No @ yet — suggest adding popular domains
      return EMAIL_DOMAINS.map((d) => `${val}@${d}`);
    }
    const local = val.slice(0, atIdx);
    const typed = val.slice(atIdx + 1);
    if (!local) return [];
    // Filter domains that start with what user typed after @
    const matches = typed
      ? EMAIL_DOMAINS.filter((d) => d.startsWith(typed) && d !== typed)
      : EMAIL_DOMAINS;
    return matches.map((d) => `${local}@${d}`);
  })();

  const walletMeta = WALLET_META[activeWallet];
  const wallet = {
    ...walletMeta,
    address: walletAddresses[walletMeta.id] || "",
    explorer: walletAddresses[walletMeta.id]
      ? `${walletMeta.explorerBase}${walletAddresses[walletMeta.id]}`
      : "",
  };

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
      const file = e.dataTransfer.files[0];
      setScreenshot(file);
      analyzeFile(file);
    }
  };

  const verifyTxOnChain = async (txHash: string, network: string) => {
    setTxVerifying(true);
    setTxVerification(null);
    try {
      const res = await fetch("/api/verify-tx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash, network }),
      });
      const data = await res.json();
      setTxVerification(data);
    } catch {
      setTxVerification(null);
    } finally {
      setTxVerifying(false);
    }
  };

  const analyzeFile = async (file: File) => {
    setAnalyzing(true);
    setAnalysis(null);
    setAnalysisError("");
    setTxVerification(null);
    setTxVerifying(false);
    try {
      const body = new FormData();
      body.append("screenshot", file);
      const res = await fetch("/api/analyze-screenshot", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
        // Auto-fill TX hash if detected and field is empty
        if (data.analysis.txHash && !formData.txHash) {
          setFormData((prev) => ({ ...prev, txHash: data.analysis.txHash }));
        }
        // Verify TX hash on-chain if detected
        if (data.analysis.txHash && data.analysis.network) {
          verifyTxOnChain(data.analysis.txHash, data.analysis.network);
        }
      } else {
        setAnalysisError(data.error || "Analysis unavailable");
      }
    } catch {
      setAnalysisError("Analysis unavailable — you can still submit normally");
    } finally {
      setAnalyzing(false);
    }
  };

  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTier === null) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const body = new FormData();
      body.append("name", formData.name);
      body.append("email", formData.email);
      body.append("phone", selectedCode ? `${selectedCode.code}${formData.phone.replace(/\s/g, "")}` : formData.phone);
      body.append("txHash", formData.txHash);
      body.append("nationality", formData.nationality);
      body.append("language", formData.language);
      body.append("tier", TIERS[selectedTier].name);
      body.append("amount", TIERS[selectedTier].price);
      body.append("network", WALLET_META[activeWallet].network);
      if (screenshot) {
        body.append("screenshot", screenshot);
      }
      if (analysis) {
        body.append("analysis", JSON.stringify(analysis));
      }

      const res = await fetch("/api/submit-proof", {
        method: "POST",
        body,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      const data = await res.json();
      setSubmitting(false);
      setAutoApproved(!!data.autoApproved);
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
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            autoApproved
              ? "bg-green-500/20 border border-green-500/30"
              : "bg-green-500/20 border border-green-500/30"
          }`}>
            <Check size={40} className="text-green-400" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            {autoApproved ? "Payment Verified!" : "Payment Proof Received"}
          </h1>
          <p className="text-text-secondary mb-8">
            {autoApproved
              ? <>Thanks, {formData.name}! Your payment has been verified automatically. Check your email for your booking link.</>
              : <>Thanks, {formData.name}! We&apos;ve received your payment proof.</>
            }
          </p>

          <div className="rounded-xl bg-bg-secondary/60 border border-white/[0.08] p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Status</span>
              {autoApproved ? (
                <span className="text-green-400 font-semibold flex items-center gap-1.5">
                  <span className="lfgbot-dot bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
                  Auto-Approved
                </span>
              ) : (
                <span className="text-yellow-400 font-semibold flex items-center gap-1.5">
                  <span className="lfgbot-dot bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.6)]" />
                  Under Review
                </span>
              )}
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

          {autoApproved ? (
            <div className="rounded-xl bg-green-500/[0.05] border border-green-500/20 p-5 mb-8 text-left">
              <div className="flex items-center gap-2 mb-3">
                <img src="/robot.png" alt="LFGbot" className="lfgbot-icon" />
                <p className="text-green-400 font-semibold text-sm">Verified by LFGbot</p>
              </div>
              <p className="text-text-secondary text-sm mb-3">
                All checks passed — amount, network, address, and transaction status verified.
              </p>
              <p className="text-text-secondary text-sm">
                Your booking link has been sent to <strong className="text-text-primary">{formData.email}</strong>
              </p>
            </div>
          ) : (
            <div className="rounded-xl bg-accent-primary/[0.05] border border-accent-primary/20 p-5 mb-8 text-left">
              <p className="text-accent-primary font-semibold text-sm mb-3">What&apos;s Next:</p>
              <ol className="space-y-2 text-text-secondary text-sm">
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-accent-primary/20 text-accent-primary text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                  Verification in progress (usually within a few hours)
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
          )}

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
          href={fromParam ? `/#${fromParam}` : "/"}
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          {fromParam ? "Back" : "Back to home"}
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
            {WALLET_META.map((w, i) => (
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
                        {walletsLoading ? (
                          <span className="text-text-secondary animate-pulse">Loading wallet address...</span>
                        ) : wallet.address ? (
                          wallet.address
                        ) : (
                          <span className="text-red-400">Failed to load address. Refresh the page.</span>
                        )}
                      </code>
                      <button
                        onClick={handleCopy}
                        disabled={!wallet.address}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          copied
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-accent-primary/15 text-accent-primary hover:bg-accent-primary/25 border border-accent-primary/20"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="flex items-center gap-1 text-xs text-yellow-400/60">
                        <AlertTriangle size={11} />
                        Always verify the first and last 4 characters after pasting
                      </p>
                      {wallet.explorer && (
                        <a
                          href={wallet.explorer}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-accent-primary/50 hover:text-accent-primary/80 transition-colors"
                        >
                          Verify on Explorer <ExternalLink size={11} />
                        </a>
                      )}
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
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0];
                        setScreenshot(file);
                        analyzeFile(file);
                      }
                    }}
                  />
                  {screenshot ? (
                    <div className="flex items-center justify-center gap-3">
                      <Check size={20} className="text-green-400" />
                      <span className="text-text-primary text-sm">{screenshot.name}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setScreenshot(null); setAnalysis(null); setAnalysisError(""); setAnalyzing(false); setTxVerification(null); setTxVerifying(false); }}
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

                {/* LFGbot Analysis Results */}
                {analyzing && (
                  <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-accent-primary/20 animate-pulse">
                    <div className="flex items-center gap-2 mb-2">
                      <img src="/robot.png" alt="LFGbot" className="lfgbot-icon" />
                      <span className="text-accent-primary text-sm font-semibold">LFGbot</span>
                    </div>
                    <p className="text-text-secondary text-sm">Scanning your screenshot...</p>
                  </div>
                )}

                {analysis && !analyzing && (() => {
                  // Price verification
                  const expectedPrice = selectedTier !== null ? parseFloat(TIERS[selectedTier].price.replace(/[^0-9.]/g, "")) : 0;
                  const detectedAmount = analysis.amountSent ? parseFloat(analysis.amountSent) : 0;
                  const amountMatch = detectedAmount >= expectedPrice && expectedPrice > 0;
                  const amountShort = expectedPrice > 0 && detectedAmount > 0 && detectedAmount < expectedPrice;

                  // Network verification (canonical alias matching)
                  const networkAliases: Record<string, string[]> = {
                    tron: ["trc20", "tron", "trx", "trontrc20"],
                    ethereum: ["erc20", "ethereum", "eth", "ethereumerc20"],
                    solana: ["solana", "sol", "spl"],
                  };
                  const findGroup = (s: string) => {
                    const n = s.toLowerCase().replace(/[\s()\-\/]/g, "");
                    for (const [g, aliases] of Object.entries(networkAliases)) {
                      if (aliases.some((a) => n.includes(a) || a.includes(n))) return g;
                    }
                    return n;
                  };
                  const networkMatch = analysis.network && wallet.network &&
                    findGroup(analysis.network) === findGroup(wallet.network);

                  return (
                  <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <img src="/robot.png" alt="LFGbot" className="lfgbot-icon" />
                        <span className="text-accent-primary text-sm font-semibold">LFGbot Analysis</span>
                      </div>
                      <span className={`lfgbot-dot ${
                        analysis.confidence === "high"
                          ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]"
                          : analysis.confidence === "medium"
                          ? "bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.6)]"
                          : "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]"
                      }`} title={`${analysis.confidence} confidence`} />
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      {analysis.amountSent && (
                        <div className="flex justify-between items-center col-span-2 sm:col-span-1">
                          <span className="text-text-secondary">Amount</span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-text-primary font-semibold">
                              {analysis.amountSent} {analysis.currency || ""}
                            </span>
                            {expectedPrice > 0 && (
                              amountMatch
                                ? <span className="text-green-400 flex items-center gap-0.5 text-xs"><Check size={12} /></span>
                                : amountShort
                                ? <span className="text-red-400 flex items-center gap-0.5 text-xs"><AlertTriangle size={12} /> Short</span>
                                : <span className="text-yellow-400 flex items-center gap-0.5 text-xs"><AlertTriangle size={12} /></span>
                            )}
                          </span>
                        </div>
                      )}
                      {analysis.network && (
                        <div className="flex justify-between items-center col-span-2 sm:col-span-1">
                          <span className="text-text-secondary">Network</span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-text-primary font-semibold">{analysis.network}</span>
                            {wallet.network && (
                              networkMatch
                                ? <span className="text-green-400"><Check size={12} /></span>
                                : <span className="text-red-400 flex items-center gap-0.5 text-xs"><AlertTriangle size={12} /> Wrong</span>
                            )}
                          </span>
                        </div>
                      )}
                      {analysis.exchange && (
                        <div className="flex justify-between col-span-2 sm:col-span-1">
                          <span className="text-text-secondary">Exchange</span>
                          <span className="text-text-primary font-semibold">{analysis.exchange}</span>
                        </div>
                      )}
                      {analysis.status && (
                        <div className="flex justify-between col-span-2 sm:col-span-1">
                          <span className="text-text-secondary">Status</span>
                          <span className={`font-semibold ${
                            analysis.status.toLowerCase().includes("complet") ||
                            analysis.status.toLowerCase().includes("success")
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}>
                            {analysis.status}
                          </span>
                        </div>
                      )}
                      {analysis.txHash && (
                        <div className="flex justify-between items-center col-span-2">
                          <span className="text-text-secondary">TX Hash</span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-accent-primary font-mono text-xs">
                              {analysis.txHash.slice(0, 8)}...{analysis.txHash.slice(-8)}
                            </span>
                            {txVerifying && (
                              <span className="text-text-secondary text-xs animate-pulse">Verifying...</span>
                            )}
                            {txVerification && !txVerifying && (
                              txVerification.verified && txVerification.toAddress && wallet.address &&
                              txVerification.toAddress.toLowerCase() === wallet.address.toLowerCase()
                                ? <span className="text-green-400 flex items-center gap-0.5 text-xs"><Check size={12} /> Received</span>
                                : txVerification.verified
                                ? <span className="text-yellow-400 flex items-center gap-0.5 text-xs"><AlertTriangle size={12} /> Wrong wallet</span>
                                : txVerification.status === "not_found"
                                ? <span className="text-red-400 flex items-center gap-0.5 text-xs"><AlertTriangle size={12} /> Not found</span>
                                : <span className="text-yellow-400 flex items-center gap-0.5 text-xs"><AlertTriangle size={12} /> {txVerification.status}</span>
                            )}
                          </span>
                        </div>
                      )}
                      {analysis.receivingAddress && (
                        <div className="flex justify-between items-center col-span-2">
                          <span className="text-text-secondary">Address</span>
                          <span className="font-mono text-xs flex items-center gap-1.5">
                            {analysis.receivingAddress.slice(0, 6)}...{analysis.receivingAddress.slice(-6)}
                            {wallet.address && (
                              analysis.receivingAddress.toLowerCase() === wallet.address.toLowerCase()
                                ? <span className="text-green-400 flex items-center gap-0.5"><Check size={12} /> Match</span>
                                : <span className="text-red-400 flex items-center gap-0.5"><AlertTriangle size={12} /> Mismatch</span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Amount mismatch warning */}
                    {amountShort && (
                      <div className="mt-3 p-2.5 rounded-lg bg-red-500/[0.08] border border-red-500/20">
                        <p className="text-red-400 text-xs font-medium flex items-start gap-1.5">
                          <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                          Amount is short — expected ${expectedPrice} but screenshot shows ${detectedAmount}. You&apos;re ${(expectedPrice - detectedAmount).toFixed(2)} short.
                        </p>
                      </div>
                    )}

                    {/* Network mismatch warning */}
                    {analysis.network && wallet.network && !networkMatch && (
                      <div className="mt-3 p-2.5 rounded-lg bg-red-500/[0.08] border border-red-500/20">
                        <p className="text-red-400 text-xs font-medium flex items-start gap-1.5">
                          <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                          Network mismatch — you selected {wallet.network} but the screenshot shows {analysis.network}. Sending on the wrong network may result in lost funds.
                        </p>
                      </div>
                    )}

                    {/* Address mismatch warning */}
                    {analysis.receivingAddress && wallet.address &&
                      analysis.receivingAddress.toLowerCase() !== wallet.address.toLowerCase() && (
                      <div className="mt-3 p-2.5 rounded-lg bg-red-500/[0.08] border border-red-500/20">
                        <p className="text-red-400 text-xs font-medium flex items-start gap-1.5">
                          <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                          The receiving address does not match. Please double-check you sent to the correct address.
                        </p>
                        <div className="mt-2 grid gap-1 text-[11px] font-mono">
                          <div className="flex gap-2">
                            <span className="text-text-secondary shrink-0">Expected:</span>
                            <span className="text-green-400/80 break-all">{wallet.address}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-text-secondary shrink-0">Detected:</span>
                            <span className="text-red-400/80 break-all">{analysis.receivingAddress}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {analysis.warnings?.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {analysis.warnings.map((w, i) => (
                          <p key={i} className="text-yellow-400/80 text-xs flex items-start gap-1.5">
                            <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                            {w}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* On-chain verification result */}
                    {txVerification && !txVerifying && txVerification.verified && (() => {
                      const walletReceived = txVerification.toAddress && wallet.address &&
                        txVerification.toAddress.toLowerCase() === wallet.address.toLowerCase();
                      const amountOk = txVerification.amount !== null && expectedPrice > 0 && txVerification.amount >= expectedPrice;
                      const allGreen = walletReceived && amountOk;

                      return allGreen ? (
                        <div className="mt-3 p-2.5 rounded-lg bg-green-500/[0.06] border border-green-500/20">
                          <p className="text-green-400 text-xs font-medium flex items-center gap-1.5 mb-1.5">
                            <Check size={13} />
                            Payment received — ${txVerification.amount?.toFixed(2)} confirmed to your wallet
                          </p>
                        </div>
                      ) : (
                        <div className="mt-3 p-2.5 rounded-lg bg-yellow-500/[0.06] border border-yellow-500/20">
                          <p className="text-yellow-400 text-xs font-medium flex items-center gap-1.5 mb-1.5">
                            <AlertTriangle size={13} />
                            Transaction found on-chain but has issues
                          </p>
                          <div className="grid gap-1 text-[11px]">
                            {txVerification.amount !== null && (
                              <div className="flex gap-2">
                                <span className="text-text-secondary shrink-0">Received:</span>
                                <span className={`font-mono ${amountOk ? "text-green-400/80" : "text-yellow-400/80"}`}>
                                  ${txVerification.amount.toFixed(2)}
                                  {!amountOk && expectedPrice > 0 && ` (short by $${(expectedPrice - txVerification.amount).toFixed(2)})`}
                                </span>
                              </div>
                            )}
                            {txVerification.toAddress && (
                              <div className="flex gap-2 items-center">
                                <span className="text-text-secondary shrink-0">Sent to:</span>
                                <span className="font-mono break-all text-text-secondary/80">
                                  {txVerification.toAddress.slice(0, 8)}...{txVerification.toAddress.slice(-8)}
                                </span>
                                {walletReceived
                                  ? <span className="text-green-400 flex items-center gap-0.5 shrink-0"><Check size={11} /> Our wallet</span>
                                  : <span className="text-red-400 flex items-center gap-0.5 shrink-0"><AlertTriangle size={11} /> Wrong wallet</span>
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                    {txVerification && !txVerifying && !txVerification.verified && (
                      <div className="mt-3 p-2.5 rounded-lg bg-red-500/[0.08] border border-red-500/20">
                        <p className="text-red-400 text-xs font-medium flex items-center gap-1.5">
                          <AlertTriangle size={13} />
                          TX hash not found on-chain — this transaction doesn&apos;t exist or hasn&apos;t been confirmed yet
                        </p>
                      </div>
                    )}
                    {txVerifying && (
                      <div className="mt-3 p-2.5 rounded-lg bg-accent-primary/[0.04] border border-accent-primary/10 animate-pulse">
                        <p className="text-accent-primary/60 text-xs flex items-center gap-1.5">
                          <span className="lfgbot-dot bg-accent-primary shadow-[0_0_6px_rgba(56,189,248,0.4)]" />
                          Checking if your wallet received the funds...
                        </p>
                      </div>
                    )}
                  </div>
                  );
                })()}

                {analysisError && !analyzing && (
                  <div className="mt-4 p-3 rounded-xl bg-yellow-500/[0.06] border border-yellow-500/15">
                    <p className="text-yellow-400/70 text-xs flex items-center gap-1.5">
                      <AlertTriangle size={12} />
                      {analysisError}
                    </p>
                  </div>
                )}
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
                    placeholder="Satoshi Nakamoto"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-primary/50 transition-colors"
                  />
                </div>
                <div ref={emailWrapperRef} className="relative">
                  <label className="block text-text-primary text-sm font-medium mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    placeholder="satoshi@bitcoin.org"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (emailError) setEmailError("");
                      setShowEmailSuggestions(true);
                    }}
                    onFocus={() => setShowEmailSuggestions(true)}
                    onBlur={() => {
                      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                        setEmailError("Please enter a valid email");
                      } else {
                        setEmailError("");
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none transition-colors ${
                      emailError
                        ? "border-red-500/50 focus:border-red-500/70"
                        : "border-white/[0.08] focus:border-accent-primary/50"
                    }`}
                  />
                  {showEmailSuggestions && emailSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl bg-[#0c0c1d] border border-white/[0.08] shadow-2xl overflow-hidden">
                      {emailSuggestions.slice(0, 5).map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setFormData({ ...formData, email: suggestion });
                            setShowEmailSuggestions(false);
                            setEmailError("");
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/[0.06] transition-colors flex items-center gap-2"
                        >
                          <span className="text-text-secondary text-xs">✉</span>
                          <span className="text-text-primary">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {emailError && (
                    <p className="text-red-400 text-xs mt-1.5">{emailError}</p>
                  )}
                </div>
              </div>

              {/* Phone row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-primary text-sm font-medium mb-2">
                    Phone / WhatsApp <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    {/* Searchable dial code combobox */}
                    <div ref={codeWrapperRef} className="relative w-[108px] flex-shrink-0">
                      <div className="relative flex items-center">
                        {selectedCode && (
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-base pointer-events-none z-10 leading-none">
                            {selectedCode.flag}
                          </span>
                        )}
                        <input
                          type="text"
                          value={dialInput}
                          onChange={(e) => {
                            setDialInput(e.target.value);
                            setSelectedCode(null);
                            setShowDialDropdown(true);
                          }}
                          onFocus={() => setShowDialDropdown(true)}
                          placeholder="+1"
                          className={`w-full py-3 pr-7 rounded-xl bg-white/[0.03] border border-white/[0.08] text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-primary/50 transition-colors ${
                            selectedCode ? "pl-8" : "pl-3"
                          }`}
                        />
                        <ChevronDown
                          size={13}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                        />
                      </div>

                      {showDialDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-72 z-50 rounded-xl bg-[#0c0c1d] border border-white/[0.08] shadow-2xl overflow-hidden">
                          <div className="max-h-52 overflow-y-auto scrollbar-hide">
                            {filteredCodes.length === 0 ? (
                              <p className="text-text-secondary text-xs text-center py-4">No results</p>
                            ) : (
                              filteredCodes.map((c) => (
                                <button
                                  key={`${c.code}-${c.country}`}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setSelectedCode(c);
                                    setDialInput(c.code);
                                    setShowDialDropdown(false);
                                  }}
                                  className={`w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/[0.06] text-left transition-colors ${
                                    selectedCode?.country === c.country ? "bg-accent-primary/10" : ""
                                  }`}
                                >
                                  <span className="text-base w-6 flex-shrink-0 leading-none">{c.flag}</span>
                                  <span className="text-accent-primary text-sm font-mono w-10 flex-shrink-0">{c.code}</span>
                                  <span className="text-text-secondary text-xs truncate">{c.country}</span>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <input
                      type="tel"
                      required
                      placeholder="50 123 4567"
                      maxLength={selectedCode ? selectedCode.digits + 3 : 15}
                      value={formData.phone}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/[^\d\s\-]/g, "");
                        setFormData({ ...formData, phone: digitsOnly });
                      }}
                      className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Nationality + Language row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-primary text-sm font-medium mb-2">
                    Nationality <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pakistani, Saudi, British"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-text-primary text-sm font-medium mb-2">
                    Preferred Language <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-text-primary text-sm focus:outline-none focus:border-accent-primary/50 transition-colors appearance-none cursor-pointer"
                      style={{ colorScheme: "dark" }}
                    >
                      <option value="" disabled className="bg-[#0c0c1d] text-text-secondary">Select language</option>
                      <option value="English" className="bg-[#0c0c1d] text-text-primary">English</option>
                      <option value="Urdu" className="bg-[#0c0c1d] text-text-primary">اردو — Urdu</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* TX Hash */}
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

              {/* Submit */}
              {submitError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={!screenshot || !formData.name || !formData.email || !formData.phone || !formData.nationality || !formData.language || !wallet.address || selectedTier === null || submitting}
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
            <p>· Verification is usually done within a few hours</p>
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