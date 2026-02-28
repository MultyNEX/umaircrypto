import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { verifyActionToken } from "@/lib/tokens";
import {
  buildApprovalEmailHtml,
  buildVipApprovalEmailHtml,
  buildAdminResultPageHtml,
} from "@/lib/email-templates";
import { updateOrderStatus } from "@/lib/orders";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return new NextResponse("Missing token", { status: 400 });
  }

  try {
    const data = await verifyActionToken(token);

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
    const bookingUrl = calBase + (calSlugs[data.tier] || "");

    const isVip = data.tier === "VIP";

    await transporter.sendMail({
      from: '"UmairCrypto" <contact@umaircrypto.com>',
      to: data.email,
      subject: isVip
        ? `Welcome to VIP Mentorship — #${data.refId}`
        : `Payment Confirmed — Book Your Session #${data.refId}`,
      html: isVip
        ? buildVipApprovalEmailHtml(data, bookingUrl)
        : buildApprovalEmailHtml(data, bookingUrl),
    });

    // Sync status to Redis (best-effort)
    try { await updateOrderStatus(data.refId, "approved"); } catch {}

    return new NextResponse(
      buildAdminResultPageHtml("approved", data.name, data.email, data.refId),
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    console.error("Approve error:", error);
    const message =
      error instanceof Error && error.message.includes("exp")
        ? "This approval link has expired (7-day limit). Ask the client to resubmit."
        : "Invalid or expired approval link.";
    return new NextResponse(message, { status: 400 });
  }
}