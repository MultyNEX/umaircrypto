import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { verifyActionToken } from "@/lib/tokens";
import {
  buildRejectionEmailHtml,
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

    await transporter.sendMail({
      from: '"UmairCrypto" <contact@umaircrypto.com>',
      to: data.email,
      subject: `Payment Update — #${data.refId}`,
      html: buildRejectionEmailHtml(data),
    });

    // Sync status to Redis (best-effort)
    try { await updateOrderStatus(data.refId, "rejected"); } catch {}

    return new NextResponse(
      buildAdminResultPageHtml("rejected", data.name, data.email, data.refId),
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    console.error("Reject error:", error);
    const message =
      error instanceof Error && error.message.includes("exp")
        ? "This rejection link has expired (7-day limit). Ask the client to resubmit."
        : "Invalid or expired rejection link.";
    return new NextResponse(message, { status: 400 });
  }
}
