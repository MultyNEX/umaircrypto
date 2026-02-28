import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import sharp from "sharp";
import { createActionToken } from "@/lib/tokens";
import { saveOrder, updateOrder, type Order } from "@/lib/orders";
import { getRedis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const token = formData.get("topupToken") as string;
    const txHash = (formData.get("txHash") as string) || "Not provided";
    const screenshot = formData.get("screenshot") as File | null;

    if (!token) {
      return NextResponse.json({ error: "Missing top-up token" }, { status: 400 });
    }

    // Fetch and validate top-up data from Redis
    const redis = getRedis();
    if (!redis) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
    }

    const raw = await redis.get<string>(`topup:${token}`);
    if (!raw) {
      return NextResponse.json(
        { error: "This top-up link has expired or already been used." },
        { status: 404 }
      );
    }

    const topupData = typeof raw === "string" ? JSON.parse(raw) : raw;

    // Delete the topup token (one-time use)
    await redis.del(`topup:${token}`);

    const refId = `TOP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://umaircrypto.com";

    const actionToken = await createActionToken({
      refId,
      name: topupData.name,
      email: topupData.email,
      tier: topupData.tier,
      amount: `$${topupData.amountRemaining}`,
      network: topupData.network,
    });

    const approveUrl = `${baseUrl}/api/admin/approve?token=${actionToken}`;
    const rejectUrl = `${baseUrl}/api/admin/reject?token=${actionToken}`;

    const transporter = nodemailer.createTransport({
      host: "mail-eu.smtp2go.com",
      port: 2525,
      secure: false,
      auth: {
        user: process.env.SMTP2GO_USERNAME,
        pass: process.env.SMTP2GO_PASSWORD,
      },
    });

    // Build admin email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 30px; border-radius: 12px;">
        <h1 style="color: #F59E0B; margin-bottom: 8px;">Top-Up Payment Received</h1>
        <p style="color: #94a3b8; font-size: 14px;">Top-up Reference: #${refId}</p>
        <p style="color: #94a3b8; font-size: 14px;">Original Order: #${topupData.originalRefId}</p>
        <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />

        <div style="background: #F59E0B10; border: 1px solid #F59E0B20; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; width: 140px;">Plan</td>
              <td style="padding: 6px 0; color: #f1f5f9; font-weight: bold;">${topupData.tier} ($${topupData.tierPrice})</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Previously Received</td>
              <td style="padding: 6px 0; color: #f1f5f9;">$${topupData.amountReceived}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #F59E0B; font-weight: bold;">Top-Up Amount</td>
              <td style="padding: 6px 0; color: #F59E0B; font-weight: bold;">$${topupData.amountRemaining}</td>
            </tr>
          </table>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; width: 140px;">Client</td>
            <td style="padding: 10px 0; color: #f1f5f9;">${topupData.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94a3b8;">Email</td>
            <td style="padding: 10px 0; color: #38BDF8;">${topupData.email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94a3b8;">Network</td>
            <td style="padding: 10px 0; color: #f1f5f9; font-weight: bold;">${topupData.network}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94a3b8;">TX Hash</td>
            <td style="padding: 10px 0; color: #f1f5f9; word-break: break-all; font-family: monospace; font-size: 13px;">${txHash}</td>
          </tr>
        </table>

        <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 13px;">Screenshot attached below (if provided).</p>

        <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />
        <p style="color: #f1f5f9; font-weight: bold; font-size: 15px; margin-bottom: 16px;">Quick Actions</p>
        <div style="text-align: center;">
          <a href="${approveUrl}" style="display: inline-block; background: #22c55e; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 15px; margin-right: 12px;">
            &#10003; Approve
          </a>
          <a href="${rejectUrl}" style="display: inline-block; background: #ef4444; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 15px;">
            &#10007; Reject
          </a>
        </div>
        <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 12px;">
          Approve sends booking link to client. Links expire in 7 days.
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
      to: process.env.PROOF_RECIPIENT || "umairxcrypto@gmail.com",
      replyTo: topupData.email,
      subject: `💰 Top-Up Payment — ${topupData.tier} — ${topupData.name} — $${topupData.amountRemaining}`,
      html,
      attachments,
    });

    // Send confirmation to client
    await transporter.sendMail({
      from: `"UmairCrypto" <no-reply@umaircrypto.com>`,
      to: topupData.email,
      subject: `Top-Up Payment Received — #${refId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 30px; border-radius: 12px;">
          <h1 style="color: #38BDF8;">Top-Up Payment Received ✓</h1>
          <p>Hi ${topupData.name},</p>
          <p>We've received your top-up payment of <strong>$${topupData.amountRemaining}</strong> for your <strong>${topupData.tier}</strong> plan.</p>
          <p>Reference ID: <strong>#${refId}</strong></p>
          <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />
          <p style="color: #94a3b8;">We'll verify this and send your booking link shortly — usually within a few hours.</p>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 20px;">Questions? Email us at <a href="mailto:contact@umaircrypto.com" style="color: #38BDF8;">contact@umaircrypto.com</a> or DM <a href="https://instagram.com/umairorkz" style="color: #38BDF8;">@umairorkz</a> on Instagram.</p>
          <p style="color: #64748b; font-size: 11px; margin-top: 12px;">This is an automated message — please do not reply to this email.</p>
        </div>
      `,
    });

    // Save top-up order to Redis
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
        name: topupData.name,
        email: topupData.email,
        phone: "",
        tier: topupData.tier,
        amount: `$${topupData.amountRemaining}`,
        network: topupData.network,
        txHash,
        thumbnail,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      await saveOrder(order);

      // Link top-up to original order
      await updateOrder(topupData.originalRefId, { topupRefId: refId });
    } catch (e) {
      console.error("Failed to persist top-up order:", e);
    }

    return NextResponse.json({ success: true, refId });
  } catch (error) {
    console.error("Top-up submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit top-up. Please try again." },
      { status: 500 }
    );
  }
}
