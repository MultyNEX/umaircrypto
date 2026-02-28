import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { verifyActionToken } from "@/lib/tokens";
import { buildWrongAmountEmailHtml } from "@/lib/email-templates";
import { updateOrder } from "@/lib/orders";
import { getRedis } from "@/lib/redis";

function buildFormHtml(refId: string, name: string, tier: string, amount: string, token: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Wrong Amount — UmairCrypto Admin</title>
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #060612; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .card { background: #0a0a1a; border: 1px solid #1e1e3a; border-radius: 16px; padding: 40px; max-width: 440px; width: 100%; }
    .icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 28px; font-weight: bold; background: #F59E0B20; color: #F59E0B; }
    h1 { font-size: 20px; margin: 0 0 4px; color: #F59E0B; text-align: center; }
    .ref { color: #94a3b8; font-size: 14px; margin-bottom: 20px; text-align: center; }
    .info { color: #94a3b8; font-size: 14px; margin-bottom: 20px; line-height: 1.6; }
    .info strong { color: #f1f5f9; }
    label { display: block; color: #94a3b8; font-size: 13px; margin-bottom: 6px; }
    input[type="number"] { width: 100%; padding: 12px 16px; background: #0a0a2a; border: 1px solid #2a2a4a; border-radius: 10px; color: #f1f5f9; font-size: 18px; font-weight: bold; outline: none; box-sizing: border-box; }
    input[type="number"]:focus { border-color: #F59E0B; }
    .btn { width: 100%; padding: 14px; margin-top: 16px; background: #F59E0B; color: #0a0a0f; border: none; border-radius: 10px; font-size: 15px; font-weight: bold; cursor: pointer; }
    .btn:hover { background: #D97706; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">&#9888;</div>
    <h1>Wrong Amount Received</h1>
    <p class="ref">#${refId} — ${name}</p>
    <p class="info">Plan: <strong>${tier} (${amount})</strong></p>
    <form method="POST" action="/api/admin/wrong-amount">
      <input type="hidden" name="token" value="${token}" />
      <label for="amountReceived">How much did you actually receive? ($)</label>
      <input type="number" id="amountReceived" name="amountReceived" step="0.01" min="0" required placeholder="e.g. 350.00" />
      <button type="submit" class="btn">Send Top-Up Request to Client</button>
    </form>
  </div>
</body>
</html>`;
}

function buildResultHtml(success: boolean, message: string): string {
  const color = success ? "#22c55e" : "#ef4444";
  const icon = success ? "&#10003;" : "&#10007;";
  const title = success ? "Top-Up Request Sent" : "Error";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — UmairCrypto Admin</title>
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #060612; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .card { background: #0a0a1a; border: 1px solid #1e1e3a; border-radius: 16px; padding: 40px; max-width: 440px; text-align: center; }
    .icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 28px; font-weight: bold; }
    h1 { font-size: 22px; margin: 0 0 12px; }
    .msg { color: #94a3b8; font-size: 15px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon" style="background: ${color}20; color: ${color};">${icon}</div>
    <h1 style="color: ${color};">${title}</h1>
    <p class="msg">${message}</p>
  </div>
</body>
</html>`;
}

// GET — show the form where Umair enters amount received
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return new NextResponse("Missing token", { status: 400 });
  }

  try {
    const data = await verifyActionToken(token);
    return new NextResponse(
      buildFormHtml(data.refId, data.name, data.tier, data.amount, token),
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("exp")
        ? "This link has expired (7-day limit)."
        : "Invalid or expired link.";
    return new NextResponse(buildResultHtml(false, message), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }
}

// POST — process the form submission
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = formData.get("token") as string;
    const amountReceived = formData.get("amountReceived") as string;

    if (!token || !amountReceived) {
      return new NextResponse(
        buildResultHtml(false, "Missing required fields."),
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }

    const data = await verifyActionToken(token);
    const received = parseFloat(amountReceived);
    const tierPrice = parseFloat(data.amount.replace(/[^0-9.]/g, ""));

    if (isNaN(received) || received <= 0) {
      return new NextResponse(
        buildResultHtml(false, "Invalid amount entered."),
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }

    if (received >= tierPrice) {
      return new NextResponse(
        buildResultHtml(false, `Amount received ($${received.toFixed(2)}) is equal to or more than the plan price. Use Approve instead.`),
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }

    const remaining = (tierPrice - received).toFixed(2);

    // Generate top-up token
    const topupToken = `topup-${Math.random().toString(36).substring(2, 12)}`;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://umaircrypto.com";
    const topupUrl = `${baseUrl}/topup?token=${topupToken}`;

    // Store top-up data in Redis with 48hr TTL
    const redis = getRedis();
    if (redis) {
      const topupData = {
        originalRefId: data.refId,
        name: data.name,
        email: data.email,
        tier: data.tier,
        tierPrice: tierPrice.toFixed(2),
        amountReceived: received.toFixed(2),
        amountRemaining: remaining,
        network: data.network,
        createdAt: new Date().toISOString(),
      };
      await redis.set(`topup:${topupToken}`, JSON.stringify(topupData), { ex: 172800 }); // 48 hours

      // Update original order
      await updateOrder(data.refId, {
        status: "wrong_amount",
        amountReceived: received.toFixed(2),
        amountRemaining: remaining,
        topupToken,
      });
    }

    // Email the client
    const transporter = nodemailer.createTransport({
      host: "mail-eu.smtp2go.com",
      port: 2525,
      secure: false,
      auth: {
        user: process.env.SMTP2GO_USERNAME,
        pass: process.env.SMTP2GO_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"UmairCrypto" <noreply@umaircrypto.com>',
      to: data.email,
      subject: `Action Required — Your payment is short by $${remaining}`,
      html: buildWrongAmountEmailHtml(data, received.toFixed(2), remaining, topupUrl),
    });

    return new NextResponse(
      buildResultHtml(true, `Top-up request sent to <strong>${data.email}</strong>.<br/><br/>Amount received: $${received.toFixed(2)}<br/>Shortfall: $${remaining}<br/>Top-up link expires in 48 hours.`),
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    console.error("Wrong amount error:", error);
    const message =
      error instanceof Error && error.message.includes("exp")
        ? "This link has expired (7-day limit)."
        : "Something went wrong. Please try again.";
    return new NextResponse(
      buildResultHtml(false, message),
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }
}
