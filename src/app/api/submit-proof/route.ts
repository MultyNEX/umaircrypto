import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import sharp from "sharp";
import { createActionToken } from "@/lib/tokens";
import { saveOrder, type Order } from "@/lib/orders";
import { analyzeScreenshot, buildAnalysisEmailBlock } from "@/lib/lfgbot";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const txHash = (formData.get("txHash") as string) || "Not provided";
    const tier = formData.get("tier") as string;
    const network = formData.get("network") as string;
    const amount = formData.get("amount") as string;
    const screenshot = formData.get("screenshot") as File | null;

    // Validate required fields
    if (!name || !email || !phone || !tier || !network) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create SMTP transport via SMTP2GO
    const transporter = nodemailer.createTransport({
      host: "mail-eu.smtp2go.com",
      port: 2525,
      secure: false,
      auth: {
        user: process.env.SMTP2GO_USERNAME,
        pass: process.env.SMTP2GO_PASSWORD,
      },
    });

    // Build reference ID and action token
    const refId = `PMT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://umaircrypto.com";

    const token = await createActionToken({
      refId,
      name,
      email,
      tier,
      amount,
      network,
    });

    const approveUrl = `${baseUrl}/api/admin/approve?token=${token}`;
    const rejectUrl = `${baseUrl}/api/admin/reject?token=${token}`;
    const wrongAmountUrl = `${baseUrl}/api/admin/wrong-amount?token=${token}`;

    // Run AI screenshot analysis (non-blocking — if it fails, email still sends)
    let aiBlock = "";
    if (screenshot && screenshot.size > 0) {
      try {
        const buf = Buffer.from(await screenshot.arrayBuffer());
        const analysis = await analyzeScreenshot(buf, screenshot.type);
        if (analysis) {
          aiBlock = buildAnalysisEmailBlock(analysis, amount, network);
        }
      } catch (e) {
        console.error("AI analysis failed (non-critical):", e);
      }
    }

    // Build admin notification email HTML
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 30px; border-radius: 12px;">
        <h1 style="color: #38BDF8; margin-bottom: 8px;">New Payment Proof Submitted</h1>
        <p style="color: #94a3b8; font-size: 14px;">Reference: #${refId}</p>
        <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; width: 140px;">Service Plan</td>
            <td style="padding: 10px 0; color: #f1f5f9; font-weight: bold;">${tier} (${amount})</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94a3b8;">Network</td>
            <td style="padding: 10px 0; color: #f1f5f9; font-weight: bold;">${network}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94a3b8;">Full Name</td>
            <td style="padding: 10px 0; color: #f1f5f9;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94a3b8;">Email</td>
            <td style="padding: 10px 0; color: #38BDF8;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94a3b8;">Phone / WhatsApp</td>
            <td style="padding: 10px 0; color: #f1f5f9;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94a3b8;">TX Hash</td>
            <td style="padding: 10px 0; color: #f1f5f9; word-break: break-all; font-family: monospace; font-size: 13px;">${txHash}</td>
          </tr>
        </table>

        <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 13px;">Screenshot attached below (if provided).</p>

        ${aiBlock}

        <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />
        <p style="color: #f1f5f9; font-weight: bold; font-size: 15px; margin-bottom: 16px;">Quick Actions</p>
        <div style="text-align: center;">
          <div style="margin-bottom: 10px;">
            <a href="${approveUrl}" style="display: inline-block; background: #22c55e; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 15px; margin-right: 8px;">
              &#10003; Approve
            </a>
            <a href="${rejectUrl}" style="display: inline-block; background: #ef4444; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 15px;">
              &#10007; Reject
            </a>
          </div>
          <a href="${wrongAmountUrl}" style="display: inline-block; background: #F59E0B; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 15px;">
            &#9888; Wrong Amount
          </a>
        </div>
        <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 12px;">
          Approve sends booking link. Reject sends resubmit notice. Wrong Amount asks you how much was received. Links expire in 7 days.
        </p>
      </div>
    `;

    // Prepare attachments
    const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
    if (screenshot && screenshot.size > 0) {
      const buffer = Buffer.from(await screenshot.arrayBuffer());
      attachments.push({
        filename: screenshot.name,
        content: buffer,
        contentType: screenshot.type,
      });
    }

    // Send email to admin
    await transporter.sendMail({
      from: `"UmairCrypto Payments" <no-reply@umaircrypto.com>`,
      to: process.env.PROOF_RECIPIENT || "hello.multynex@gmail.com",
      replyTo: email,
      subject: `💰 New Payment Proof — ${tier} (${amount}) — ${name}`,
      html,
      attachments,
    });

    // Send confirmation email to the client
    await transporter.sendMail({
      from: `"UmairCrypto" <no-reply@umaircrypto.com>`,
      to: email,
      subject: `Payment Proof Received — #${refId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 30px; border-radius: 12px;">
          <h1 style="color: #38BDF8;">Payment Proof Received ✓</h1>
          <p>Hi ${name},</p>
          <p>We've received your payment proof for <strong>${tier} (${amount})</strong> via <strong>${network}</strong>.</p>
          <p>Reference ID: <strong>#${refId}</strong></p>
          <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />
          <h3 style="color: #38BDF8;">What's Next?</h3>
          <ol style="color: #94a3b8; line-height: 1.8;">
            <li>We'll verify your transaction shortly (usually within a few hours)</li>
            <li>You'll receive a confirmation email with your booking link</li>
            <li>Schedule your session at a time that works for you</li>
          </ol>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 20px;">Questions? Email us at <a href="mailto:contact@umaircrypto.com" style="color: #38BDF8;">contact@umaircrypto.com</a> or DM <a href="https://instagram.com/umairorkz" style="color: #38BDF8;">@umairorkz</a> on Instagram.</p>
          <p style="color: #64748b; font-size: 11px; margin-top: 12px;">This is an automated message — please do not reply to this email.</p>
        </div>
      `,
    });

    // Persist order to Redis (best-effort — don't break email flow)
    try {
      let thumbnail = "";
      if (screenshot && screenshot.size > 0) {
        const buf = Buffer.from(await screenshot.arrayBuffer());
        const compressed = await sharp(buf)
          .resize(200, undefined, { withoutEnlargement: true })
          .jpeg({ quality: 60 })
          .toBuffer();
        thumbnail = `data:image/jpeg;base64,${compressed.toString("base64")}`;
      }

      const order: Order = {
        refId,
        name,
        email,
        phone,
        tier,
        amount,
        network,
        txHash,
        thumbnail,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      await saveOrder(order);
    } catch (e) {
      console.error("Failed to persist order to Redis:", e);
    }

    return NextResponse.json({ success: true, refId });
  } catch (error) {
    console.error("Payment proof email error:", error);
    return NextResponse.json(
      { error: "Failed to send payment proof. Please try again." },
      { status: 500 }
    );
  }
}