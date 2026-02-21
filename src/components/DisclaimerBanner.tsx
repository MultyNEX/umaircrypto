"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface DisclaimerBannerProps {
  /** Short text variant */
  variant?: "trading" | "past" | "education";
  className?: string;
}

const MESSAGES = {
  trading:
    "Trading crypto involves significant risk. Never invest more than you can afford to lose.",
  past: "Past performance does not guarantee future results.",
  education:
    "For educational purposes only. This is not financial advice.",
};

export default function DisclaimerBanner({
  variant = "education",
  className = "",
}: DisclaimerBannerProps) {
  return (
    <div
      className={`flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] sm:text-xs text-text-secondary/50 ${className}`}
    >
      <AlertTriangle size={12} className="flex-shrink-0 text-text-secondary/30" />
      <span>{MESSAGES[variant]}</span>
      <Link
        href="/risk"
        className="text-accent-primary/40 hover:text-accent-primary/70 transition-colors underline underline-offset-2 flex-shrink-0"
      >
        Learn more
      </Link>
    </div>
  );
}
