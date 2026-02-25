"use client";

import { useState, useEffect } from "react";
import { X, Plus, ExternalLink, LogOut, Twitter } from "lucide-react";

export default function TweetAdminPage() {
  const [key, setKey] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [tweetIds, setTweetIds] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  // Load saved key from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("admin_tweets_key");
    if (stored) setSavedKey(stored);
  }, []);

  // When key is set, fetch current tweet list
  useEffect(() => {
    if (!savedKey) return;
    fetchList(savedKey);
  }, [savedKey]);

  function flash(text: string, ok: boolean) {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3000);
  }

  async function fetchList(adminKey: string) {
    const res = await fetch("/api/admin/tweets", {
      headers: { "x-admin-key": adminKey },
    });
    if (res.status === 401) {
      localStorage.removeItem("admin_tweets_key");
      setSavedKey(null);
      flash("Wrong key. Try again.", false);
      return;
    }
    const ids = await res.json();
    setTweetIds(ids);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    const res = await fetch("/api/admin/tweets", {
      headers: { "x-admin-key": key.trim() },
    });
    setLoading(false);
    if (res.status === 401) {
      flash("Wrong key. Try again.", false);
      return;
    }
    localStorage.setItem("admin_tweets_key", key.trim());
    setSavedKey(key.trim());
    const ids = await res.json();
    setTweetIds(ids);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!urlInput.trim() || !savedKey) return;
    setLoading(true);
    const res = await fetch("/api/admin/tweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": savedKey,
      },
      body: JSON.stringify({ url: urlInput.trim() }),
    });
    setLoading(false);
    if (!res.ok) {
      const { error } = await res.json();
      flash(error || "Failed to add tweet", false);
      return;
    }
    const { ids } = await res.json();
    setTweetIds(ids);
    setUrlInput("");
    flash("Tweet added!", true);
  }

  async function handleRemove(tweetId: string) {
    if (!savedKey) return;
    const res = await fetch("/api/admin/tweets", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": savedKey,
      },
      body: JSON.stringify({ tweetId }),
    });
    if (!res.ok) {
      flash("Failed to remove tweet", false);
      return;
    }
    const { ids } = await res.json();
    setTweetIds(ids);
    flash("Tweet removed", true);
  }

  function handleLogout() {
    localStorage.removeItem("admin_tweets_key");
    setSavedKey(null);
    setKey("");
    setTweetIds([]);
  }

  // ── Login screen ──────────────────────────────────────────────
  if (!savedKey) {
    return (
      <div className="min-h-screen bg-[#060612] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Twitter size={20} className="text-[#38BDF8]" />
            <span className="text-white font-semibold text-lg">Tweet Manager</span>
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
              {loading ? "Checking…" : "Enter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Management screen ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#060612] px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Twitter size={18} className="text-[#38BDF8]" />
            <h1 className="text-white font-semibold text-lg">Tweet Manager</h1>
            <span className="text-[#475569] text-sm ml-1">
              ({tweetIds.length}/12)
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[#64748b] hover:text-white text-sm transition-colors"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>

        {/* Toast */}
        {msg && (
          <div
            className={`px-4 py-3 rounded-xl text-sm font-medium border ${
              msg.ok
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* Add tweet form */}
        <form
          onSubmit={handleAdd}
          className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-3"
        >
          <label className="block text-sm font-medium text-[#94a3b8]">
            Add tweet
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://x.com/Umairorkz/status/..."
              className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#475569] outline-none focus:border-[#38BDF8]/50 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !urlInput.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#38BDF8] text-[#060612] font-semibold text-sm rounded-xl hover:bg-[#7DD3FC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Plus size={15} />
              Add
            </button>
          </div>
        </form>

        {/* Tweet list */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/[0.06]">
            <p className="text-xs text-[#64748b] uppercase tracking-widest font-semibold">
              Current tweets (newest first)
            </p>
          </div>
          {tweetIds.length === 0 ? (
            <p className="px-5 py-8 text-center text-[#475569] text-sm">
              No tweets yet. Add one above.
            </p>
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {tweetIds.map((id, i) => (
                <li key={id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="text-[#334155] text-xs font-mono w-4 text-right flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-[#94a3b8] font-mono text-xs flex-1 truncate">
                    {id}
                  </span>
                  <a
                    href={`https://x.com/i/status/${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#38BDF8] hover:text-[#7DD3FC] transition-colors flex-shrink-0"
                    title="View on X"
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => handleRemove(id)}
                    className="text-[#475569] hover:text-red-400 transition-colors flex-shrink-0"
                    title="Remove"
                  >
                    <X size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-center text-[#334155] text-xs">
          umaircrypto.com — tweet manager
        </p>
      </div>
    </div>
  );
}
