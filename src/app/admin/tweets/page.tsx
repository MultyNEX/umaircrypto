"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Image as ImageIcon,
  X,
} from "lucide-react";

interface Order {
  refId: string;
  name: string;
  email: string;
  phone: string;
  tier: string;
  amount: string;
  network: string;
  txHash: string;
  thumbnail: string;
  status: "pending" | "approved" | "rejected" | "wrong_amount";
  createdAt: string;
  resolvedAt?: string;
  amountReceived?: string;
  amountRemaining?: string;
}

type Filter = "all" | "pending" | "approved" | "rejected" | "wrong_amount";

const TIER_COLORS: Record<string, string> = {
  Starter: "#38BDF8",
  Pro: "#A855F7",
  VIP: "#F59E0B",
};

const STATUS_CONFIG = {
  pending: { color: "#F59E0B", bg: "#F59E0B15", label: "Pending", icon: Clock },
  approved: { color: "#22c55e", bg: "#22c55e15", label: "Approved", icon: CheckCircle2 },
  rejected: { color: "#ef4444", bg: "#ef444415", label: "Rejected", icon: XCircle },
  wrong_amount: { color: "#F97316", bg: "#F9731615", label: "Wrong Amount", icon: AlertTriangle },
};

export default function OrdersAdminPage() {
  const [mounted, setMounted] = useState(false);
  const [key, setKey] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    refId: string;
    action: "approve" | "reject";
  } | null>(null);
  const [wrongAmountModal, setWrongAmountModal] = useState<string | null>(null); // refId
  const [wrongAmountInput, setWrongAmountInput] = useState("");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("admin_tweets_key");
    if (stored) setSavedKey(stored);
    const gate = document.getElementById("preloader-gate");
    if (gate) gate.style.display = "none";
  }, []);

  function flash(text: string, ok: boolean) {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 4000);
  }

  const fetchOrders = useCallback(async (adminKey: string) => {
    const res = await fetch("/api/admin/orders", {
      headers: { "x-admin-key": adminKey },
    });
    if (res.status === 401) {
      localStorage.removeItem("admin_tweets_key");
      setSavedKey(null);
      flash("Wrong key. Try again.", false);
      return;
    }
    const data = await res.json();
    setOrders(data.orders || []);
  }, []);

  useEffect(() => {
    if (!savedKey) return;
    fetchOrders(savedKey);
  }, [savedKey, fetchOrders]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    const res = await fetch("/api/admin/orders", {
      headers: { "x-admin-key": key.trim() },
    });
    setLoading(false);
    if (res.status === 401) {
      flash("Wrong key. Try again.", false);
      return;
    }
    localStorage.setItem("admin_tweets_key", key.trim());
    setSavedKey(key.trim());
    const data = await res.json();
    setOrders(data.orders || []);
  }

  function handleLogout() {
    localStorage.removeItem("admin_tweets_key");
    setSavedKey(null);
    setKey("");
    setOrders([]);
  }

  async function handleAction(refId: string, action: "approve" | "reject") {
    if (!savedKey) return;
    setActionLoading(refId);
    setConfirmAction(null);

    const res = await fetch(`/api/admin/orders/${refId}/${action}`, {
      method: "POST",
      headers: { "x-admin-key": savedKey },
    });

    setActionLoading(null);

    if (!res.ok) {
      const data = await res.json();
      flash(data.error || `Failed to ${action}`, false);
      return;
    }

    flash(
      action === "approve"
        ? "Approved! Booking email sent."
        : "Rejected. Notification sent.",
      true
    );

    // Refresh orders
    await fetchOrders(savedKey);
  }

  async function handleWrongAmount(refId: string) {
    if (!savedKey || !wrongAmountInput) return;
    setActionLoading(refId);
    setWrongAmountModal(null);

    const res = await fetch(`/api/admin/orders/${refId}/wrong-amount`, {
      method: "POST",
      headers: {
        "x-admin-key": savedKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amountReceived: wrongAmountInput }),
    });

    setActionLoading(null);
    setWrongAmountInput("");

    if (!res.ok) {
      const data = await res.json();
      flash(data.error || "Failed to process wrong amount", false);
      return;
    }

    const data = await res.json();
    flash(`Top-up request sent! Client owes $${data.amountRemaining}`, true);
    await fetchOrders(savedKey);
  }

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    approved: orders.filter((o) => o.status === "approved").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
    wrong_amount: orders.filter((o) => o.status === "wrong_amount").length,
  };

  if (!mounted) return null;

  // Login screen
  if (!savedKey) {
    return (
      <div className="min-h-screen bg-[#060612] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-white font-semibold text-xl">Orders</h1>
            <p className="text-[#64748b] text-sm mt-1">Enter your admin key</p>
          </div>
          <form
            onSubmit={handleLogin}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4"
          >
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Admin key"
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

  return (
    <div className="min-h-screen bg-[#060612] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-[#64748b] hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-white font-semibold text-lg">Orders</h1>
              <p className="text-[#475569] text-xs">
                {counts.pending} pending
              </p>
            </div>
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

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(["all", "pending", "approved", "rejected", "wrong_amount"] as Filter[]).map((f) => {
            const label = f === "wrong_amount" ? "Wrong Amt" : f.charAt(0).toUpperCase() + f.slice(1);
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f
                    ? "bg-white/[0.1] text-white border border-white/[0.15]"
                    : "text-[#64748b] border border-transparent hover:text-[#94a3b8]"
                }`}
              >
                {label}
                <span className="ml-1.5 text-xs opacity-60">{counts[f]}</span>
              </button>
            );
          })}
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-6 py-16 text-center">
            <p className="text-[#475569] text-sm">
              {orders.length === 0
                ? "No orders yet. They'll appear here when clients submit payment proofs."
                : "No orders match this filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const sc = STATUS_CONFIG[order.status];
              const tierColor = TIER_COLORS[order.tier] || "#38BDF8";
              const isActioning = actionLoading === order.refId;

              return (
                <div
                  key={order.refId}
                  className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-4"
                >
                  {/* Top row: thumbnail + info + status */}
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    {order.thumbnail ? (
                      <button
                        onClick={() => setExpandedImage(order.thumbnail)}
                        className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-white/[0.08] hover:border-white/[0.2] transition-colors"
                      >
                        <img
                          src={order.thumbnail}
                          alt="Screenshot"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl border border-white/[0.08] flex items-center justify-center">
                        <ImageIcon size={20} className="text-[#334155]" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-white font-medium text-sm truncate">
                            {order.name}
                          </p>
                          <p className="text-[#64748b] text-xs truncate">
                            {order.email}
                          </p>
                        </div>
                        {/* Status badge */}
                        <div
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium flex-shrink-0"
                          style={{ backgroundColor: sc.bg, color: sc.color }}
                        >
                          <sc.icon size={12} />
                          {sc.label}
                        </div>
                      </div>

                      {/* Details row */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: `${tierColor}15`,
                            color: tierColor,
                          }}
                        >
                          {order.tier}
                        </span>
                        <span className="text-[#94a3b8] text-xs">
                          {order.amount}
                        </span>
                        <span className="text-[#475569] text-xs">
                          {order.network}
                        </span>
                        <span className="text-[#334155] text-xs font-mono">
                          #{order.refId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Extra details */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#475569]">
                    {order.phone && <span>Phone: {order.phone}</span>}
                    {order.txHash && order.txHash !== "Not provided" && (
                      <span className="font-mono truncate max-w-[200px]">
                        TX: {order.txHash}
                      </span>
                    )}
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Actions for pending orders */}
                  {order.status === "pending" && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() =>
                          setConfirmAction({
                            refId: order.refId,
                            action: "approve",
                          })
                        }
                        disabled={isActioning}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-medium hover:bg-green-500/20 transition-all disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} />
                        {isActioning ? "Sending..." : "Approve"}
                      </button>
                      <button
                        onClick={() =>
                          setConfirmAction({
                            refId: order.refId,
                            action: "reject",
                          })
                        }
                        disabled={isActioning}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-all disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          setWrongAmountModal(order.refId);
                          setWrongAmountInput("");
                        }}
                        disabled={isActioning}
                        className="flex items-center gap-1.5 px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl text-sm font-medium hover:bg-orange-500/20 transition-all disabled:opacity-50"
                      >
                        <AlertTriangle size={14} />
                        Wrong Amount
                      </button>
                    </div>
                  )}

                  {/* Shortfall info for wrong_amount orders */}
                  {order.status === "wrong_amount" && order.amountReceived && (
                    <div className="flex items-center gap-3 pt-1 text-xs">
                      <span className="text-[#94a3b8]">
                        Received: <span className="text-white font-medium">${order.amountReceived}</span>
                      </span>
                      <span className="text-orange-400 font-semibold">
                        Shortfall: ${order.amountRemaining}
                      </span>
                      <span className="text-[#475569]">Top-up email sent to client</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-[#334155] text-xs">
          umaircrypto.com — orders
        </p>
      </div>

      {/* Confirmation modal */}
      {confirmAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setConfirmAction(null)}
        >
          <div
            className="bg-[#0a0a1a] border border-white/[0.1] rounded-2xl p-6 max-w-sm w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-semibold text-base">
              {confirmAction.action === "approve"
                ? "Approve this order?"
                : "Reject this order?"}
            </h3>
            <p className="text-[#94a3b8] text-sm">
              {confirmAction.action === "approve"
                ? "This will send a booking email to the client."
                : "This will send a rejection notice to the client."}
            </p>
            <p className="text-[#475569] text-xs font-mono">
              #{confirmAction.refId}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-4 py-2.5 border border-white/[0.1] text-[#94a3b8] rounded-xl text-sm font-medium hover:bg-white/[0.04] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleAction(confirmAction.refId, confirmAction.action)
                }
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  confirmAction.action === "approve"
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {confirmAction.action === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wrong amount modal */}
      {wrongAmountModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setWrongAmountModal(null)}
        >
          <div
            className="bg-[#0a0a1a] border border-white/[0.1] rounded-2xl p-6 max-w-sm w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-semibold text-base">Wrong Amount Received</h3>
            <p className="text-[#94a3b8] text-sm">
              How much did you actually receive for this order? The system will calculate the shortfall and email the client a top-up link.
            </p>
            <p className="text-[#475569] text-xs font-mono">#{wrongAmountModal}</p>
            <div>
              <label className="block text-[#94a3b8] text-xs mb-1.5">Amount received ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={wrongAmountInput}
                onChange={(e) => setWrongAmountInput(e.target.value)}
                placeholder="e.g. 350.00"
                autoFocus
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm placeholder-[#475569] outline-none focus:border-[#F59E0B]/50 transition-colors"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setWrongAmountModal(null)}
                className="flex-1 px-4 py-2.5 border border-white/[0.1] text-[#94a3b8] rounded-xl text-sm font-medium hover:bg-white/[0.04] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleWrongAmount(wrongAmountModal)}
                disabled={!wrongAmountInput || parseFloat(wrongAmountInput) <= 0}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#F59E0B] text-[#0a0a0f] hover:bg-[#D97706] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Top-Up Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image expand modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-lg w-full">
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={expandedImage}
              alt="Screenshot"
              className="w-full rounded-2xl border border-white/[0.1]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
