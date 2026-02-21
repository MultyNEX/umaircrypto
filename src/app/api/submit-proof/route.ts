import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

    // Build email HTML
    const refId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 30px; border-radius: 12px;">
        <h1 style="color: #38BDF8; margin-bottom: 8px;">New Payment Proof Submitted</h1>
        <p style="color: #94a3b8; font-size: 14px;">Reference: #PMT-${refId}</p>
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

    // Send email to payments@
    await transporter.sendMail({
      from: `"UmairCrypto Payments" <payments@umaircrypto.com>`,
      to: process.env.PROOF_RECIPIENT || "hello.multynex@gmail.com",
      replyTo: email,
      subject: `💰 New Payment Proof — ${tier} (${amount}) — ${name}`,
      html,
      attachments,
    });

    // Send confirmation email to the client
    await transporter.sendMail({
      from: `"UmairCrypto" <contact@umaircrypto.com>`,
      to: email,
      subject: `Payment Proof Received — #PMT-${refId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 30px; border-radius: 12px;">
          <h1 style="color: #38BDF8;">Payment Proof Received ✓</h1>
          <p>Hi ${name},</p>
          <p>We've received your payment proof for <strong>${tier} (${amount})</strong> via <strong>${network}</strong>.</p>
          <p>Reference ID: <strong>#PMT-${refId}</strong></p>
          <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />
          <h3 style="color: #38BDF8;">What's Next?</h3>
          <ol style="color: #94a3b8; line-height: 1.8;">
            <li>We'll verify your transaction within 5-15 minutes</li>
            <li>You'll receive a confirmation email with your booking link</li>
            <li>Schedule your session at a time that works for you</li>
          </ol>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 20px;">Questions? Reply to this email or DM <a href="https://instagram.com/umairorkz" style="color: #38BDF8;">@umairorkz</a> on Instagram.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, refId: `PMT-${refId}` });
  } catch (error) {
    console.error("Payment proof email error:", error);
    return NextResponse.json(
      { error: "Failed to send payment proof. Please try again." },
      { status: 500 }
    );
  }
}
