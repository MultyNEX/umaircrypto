import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getOrder, updateOrderStatus } from "@/lib/orders";
import { buildApprovalEmailHtml, buildVipApprovalEmailHtml } from "@/lib/email-templates";

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

  const transporter = nodemailer.createTransport({
    host: "mail-eu.smtp2go.com",
    port: 2525,
    secure: false,
    auth: {
      user: process.env.SMTP2GO_USERNAME,
      pass: process.env.SMTP2GO_PASSWORD,
    },
  });

  const calBase =
    process.env.CAL_BOOKING_URL || "https://cal.com/umaircrypto";
  const calSlugs: Record<string, string> = {
    Starter: "/chart-review",
    Pro: "/full-consultation",
    VIP: "/vip-onboarding",
  };
  const bookingUrl = calBase + (calSlugs[order.tier] || "");

  const isVip = order.tier === "VIP";
  const emailPayload = {
    refId: order.refId,
    name: order.name,
    email: order.email,
    tier: order.tier,
    amount: order.amount,
    network: order.network,
  };

  await transporter.sendMail({
    from: '"UmairCrypto" <no-reply@umaircrypto.com>',
    to: order.email,
    subject: isVip
      ? `Welcome to VIP Mentorship — #${order.refId}`
      : `Payment Confirmed — Book Your Session #${order.refId}`,
    html: isVip
      ? buildVipApprovalEmailHtml(emailPayload, bookingUrl)
      : buildApprovalEmailHtml(emailPayload, bookingUrl),
  });

  await updateOrderStatus(id, "approved");

  return NextResponse.json({ success: true });
}