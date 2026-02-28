import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getOrder, updateOrder } from "@/lib/orders";
import { buildWrongAmountEmailHtml } from "@/lib/email-templates";
import { getRedis } from "@/lib/redis";

function isAuthorized(req: NextRequest): boolean {
  const key = req.headers.get("x-admin-key");
  const secret = process.env.ADMIN_TWEETS_KEY;
  return !!secret && key === secret;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status !== "pending") {
    return NextResponse.json(
      { error: `Order already ${order.status}` },
      { status: 400 }
    );
  }

  const body = await req.json();
  const received = parseFloat(body.amountReceived);
  const tierPrice = parseFloat(order.amount.replace(/[^0-9.]/g, ""));

  if (isNaN(received) || received <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }
  if (received >= tierPrice) {
    return NextResponse.json(
      { error: "Amount received is equal to or more than the plan price. Use Approve instead." },
      { status: 400 }
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
      originalRefId: order.refId,
      name: order.name,
      email: order.email,
      tier: order.tier,
      tierPrice: tierPrice.toFixed(2),
      amountReceived: received.toFixed(2),
      amountRemaining: remaining,
      network: order.network,
      createdAt: new Date().toISOString(),
    };
    await redis.set(`topup:${topupToken}`, JSON.stringify(topupData), { ex: 172800 });
  }

  // Update original order
  await updateOrder(id, {
    status: "wrong_amount",
    amountReceived: received.toFixed(2),
    amountRemaining: remaining,
    topupToken,
  });

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
    from: '"UmairCrypto" <no-reply@umaircrypto.com>',
    to: order.email,
    subject: `Action Required — Your payment is short by $${remaining}`,
    html: buildWrongAmountEmailHtml(
      {
        refId: order.refId,
        name: order.name,
        email: order.email,
        tier: order.tier,
        amount: order.amount,
        network: order.network,
      },
      received.toFixed(2),
      remaining,
      topupUrl
    ),
  });

  return NextResponse.json({ success: true, amountRemaining: remaining });
}
