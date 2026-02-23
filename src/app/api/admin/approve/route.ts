import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { verifyActionToken } from "@/lib/tokens";
import {
  buildApprovalEmailHtml,
  buildAdminResultPageHtml,
} from "@/lib/email-templates";

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

    const bookingUrl =
      process.env.CAL_BOOKING_URL || "https://cal.com/your-link";

    await transporter.sendMail({
      from: '"UmairCrypto" <contact@umaircrypto.com>',
      to: data.email,
      subject: `Payment Confirmed — Book Your Session #${data.refId}`,
      html: buildApprovalEmailHtml(data, bookingUrl),
    });

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
