"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, MessageSquare, LogOut } from "lucide-react";

export default function AdminHomePage() {
  const [mounted, setMounted] = useState(false);
  const [key, setKey] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("admin_tweets_key");
    if (stored) setSavedKey(stored);
    const gate = document.getElementById("preloader-gate");
    if (gate) gate.style.display = "none";
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    // Verify key against existing admin endpoint
    const res = await fetch("/api/admin/tweets", {
      headers: { "x-admin-key": key.trim() },
    });
    setLoading(false);
    if (res.status === 401) {
      setMsg({ text: "Wrong key. Try again.", ok: false });
      setTimeout(() => setMsg(null), 3000);
      return;
    }
    localStorage.setItem("admin_tweets_key", key.trim());
    setSavedKey(key.trim());
  }

  function handleLogout() {
    localStorage.removeItem("admin_tweets_key");
    setSavedKey(null);
    setKey("");
  }

  if (!mounted) return null;

  if (!savedKey) {
    return (
      <div className="min-h-screen bg-[#060612] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-white font-semibold text-xl">UmairCrypto Admin</h1>
            <p className="text-[#64748b] text-sm mt-1">Enter your admin key to continue</p>
          </div>
          <form
            onSubmit={handleLogin}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4"
          >
            <label className="block text-sm text-[#94a3b8] mb-1">Admin key</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your admin key"
              autoFocus
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm placeholder-[#475569] outline-none focus:border-[#38BDF8]/50 transition-colors"
            />
            {msg && (
              <p className={`text-sm ${msg.ok ? "text-green-400" : "text-red-400"}`}>
                {msg.text}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !key.trim()}
              className="w-full bg-[#38BDF8] text-[#060612] font-semibold py-3 rounded-xl text-sm hover:bg-[#7DD3FC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Checking..." : "Enter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Orders",
      description: "View submissions, approve or reject payments",
      href: "/admin/orders",
      icon: ShoppingBag,
      color: "#38BDF8",
    },
    {
      title: "Tweets",
      description: "Manage Market Updates tweet carousel",
      href: "/admin/tweets",
      icon: MessageSquare,
      color: "#A855F7",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060612] px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-semibold text-xl">UmairCrypto Admin</h1>
            <p className="text-[#64748b] text-sm mt-0.5">Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[#64748b] hover:text-white text-sm transition-colors"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>

        {/* Nav cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] hover:bg-white/[0.04] transition-all"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${card.color}15`, color: card.color }}
              >
                <card.icon size={20} />
              </div>
              <h2 className="text-white font-semibold text-base group-hover:text-[#38BDF8] transition-colors">
                {card.title}
              </h2>
              <p className="text-[#64748b] text-sm mt-1">{card.description}</p>
            </Link>
          ))}
        </div>

        <p className="text-center text-[#334155] text-xs">
          umaircrypto.com — admin
        </p>
      </div>
    </div>
  );
}
