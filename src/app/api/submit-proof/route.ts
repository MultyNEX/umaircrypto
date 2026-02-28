import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import sharp from "sharp";
import { createActionToken } from "@/lib/tokens";
import { saveOrder, type Order } from "@/lib/orders";
import {
  analyzeScreenshot,
  buildAnalysisEmailBlock,
  networksMatch,
  type ScreenshotAnalysis,
} from "@/lib/lfgbot";
import {
  buildApprovalEmailHtml,
  buildVipApprovalEmailHtml,
} from "@/lib/email-templates";
import { verifyTransaction, type TxVerification } from "@/lib/verify-tx";

// Network alias map — maps detected network strings to wallet env var keys
const NETWORK_TO_WALLET_KEY: Record<string, string> = {
  trc20: "WALLET_USDT_TRC20",
  tron: "WALLET_USDT_TRC20",
  trx: "WALLET_USDT_TRC20",
  erc20: "WALLET_USDT_ERC20",
  ethereum: "WALLET_USDT_ERC20",
  eth: "WALLET_USDT_ERC20",
  solana: "WALLET_USDT_SOL",
  sol: "WALLET_USDT_SOL",
  bep20: "WALLET_USDT_ERC20", // fallback
};

function getExpectedWalletAddress(network: string): string {
  const normalized = network.toLowerCase().replace(/[\s()-]/g, "");
  for (const [key, envVar] of Object.entries(NETWORK_TO_WALLET_KEY)) {
    if (normalized.includes(key)) {
      return process.env[envVar] || "";
    }
  }
  return "";
}

// Check if all scanner conditions pass for auto-approval
function shouldAutoApprove(
  analysis: ScreenshotAnalysis,
  expectedAmount: string,
  expectedNetwork: string,
  expectedAddress: string,
  chainVerification: TxVerification | null
): { approve: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 1. Confidence must be high
  if (analysis.confidence !== "high") {
    reasons.push(`Low confidence: ${analysis.confidence}`);
  }

  // 2. Amount must match or exceed expected
  if (analysis.amountSent) {
    const sent = parseFloat(analysis.amountSent);
    const expected = parseFloat(expectedAmount.replace(/[^0-9.]/g, ""));
    if (!isNaN(sent) && !isNaN(expected)) {
      if (sent < expected) {
        reasons.push(`Amount short: $${sent} vs expected $${expected}`);
      }
    } else {
      reasons.push("Could not parse amount");
    }
  } else {
    reasons.push("Amount not detected");
  }

  // 3. Network must match (using canonical alias matching)
  if (analysis.network) {
    if (!networksMatch(analysis.network, expectedNetwork)) {
      reasons.push(`Network mismatch: ${analysis.network} vs ${expectedNetwork}`);
    }
  } else {
    reasons.push("Network not detected");
  }

  // 4. Address must match (if we have both)
  if (analysis.receivingAddress && expectedAddress) {
    if (analysis.receivingAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
      reasons.push("Address mismatch");
    }
  }

  // 5. Transaction status must be completed/successful
  if (analysis.status) {
    const s = analysis.status.toLowerCase();
    if (!s.includes("complet") && !s.includes("success") && !s.includes("confirm")) {
      reasons.push(`Status not confirmed: ${analysis.status}`);
    }
  } else {
    reasons.push("Status not detected");
  }

  // 6. No warnings from AI
  if (analysis.warnings && analysis.warnings.length > 0) {
    reasons.push(`AI warnings: ${analysis.warnings.length}`);
  }

  // 7. On-chain TX verification must confirm
  if (chainVerification) {
    if (!chainVerification.verified) {
      reasons.push(`TX not verified on-chain: ${chainVerification.status}`);
    } else {
      // Cross-check on-chain amount against expected
      const expected = parseFloat(expectedAmount.replace(/[^0-9.]/g, ""));
      if (chainVerification.amount !== null && !isNaN(expected) && chainVerification.amount < expected) {
        reasons.push(`On-chain amount short: $${chainVerification.amount.toFixed(2)} vs expected $${expected}`);
      }
      // Cross-check on-chain address against expected
      if (chainVerification.toAddress && expectedAddress) {
        if (chainVerification.toAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
          reasons.push("On-chain recipient address mismatch");
        }
      }
    }
  } else {
    reasons.push("On-chain verification unavailable");
  }

  return { approve: reasons.length === 0, reasons };
}

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

    // Build reference ID
    const refId = `PMT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://umaircrypto.com";

    // ── Run server-side AI analysis (authoritative for auto-approve) ──
    let serverAnalysis: ScreenshotAnalysis | null = null;
    let aiBlock = "";

    if (screenshot && screenshot.size > 0) {
      try {
        const buf = Buffer.from(await screenshot.arrayBuffer());
        serverAnalysis = await analyzeScreenshot(buf, screenshot.type);
        if (serverAnalysis) {
          aiBlock = buildAnalysisEmailBlock(serverAnalysis, amount, network);
        }
      } catch (e) {
        console.error("AI analysis failed (non-critical):", e);
      }
    }

    // Fallback: if server analysis failed, try client's pre-computed analysis for email only
    if (!aiBlock) {
      const preComputedAnalysis = formData.get("analysis") as string | null;
      if (preComputedAnalysis) {
        try {
          const parsed = JSON.parse(preComputedAnalysis) as ScreenshotAnalysis;
          aiBlock = buildAnalysisEmailBlock(parsed, amount, network);
        } catch {}
      }
    }

    // ── Verify TX on-chain ──
    let chainVerification: TxVerification | null = null;
    const detectedHash = serverAnalysis?.txHash || txHash;
    if (detectedHash && detectedHash !== "Not provided") {
      try {
        chainVerification = await verifyTransaction(detectedHash, network);
      } catch (e) {
        console.error("On-chain verification failed (non-critical):", e);
      }
    }

    // ── Check auto-approve conditions ──
    const expectedAddress = getExpectedWalletAddress(network);
    const autoApproveResult = serverAnalysis
      ? shouldAutoApprove(serverAnalysis, amount, network, expectedAddress, chainVerification)
      : { approve: false, reasons: ["No AI analysis available"] };

    const isAutoApproved = autoApproveResult.approve;

    // ── Prepare attachments ──
    const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
    if (screenshot && screenshot.size > 0) {
      const buffer = Buffer.from(await screenshot.arrayBuffer());
      attachments.push({
        filename: screenshot.name,
        content: buffer,
        contentType: screenshot.type,
      });
    }

    if (isAutoApproved) {
      // ═══════════════════════════════════════════════════════
      // AUTO-APPROVED — all checks green
      // ═══════════════════════════════════════════════════════

      // 1. Send booking link to client immediately
      const calBase =
        process.env.CAL_BOOKING_URL || "https://cal.com/umaircrypto";
      const calSlugs: Record<string, string> = {
        Starter: "/chart-review",
        Pro: "/full-consultation",
        VIP: "/vip-onboarding",
      };
      const bookingUrl = calBase + (calSlugs[tier] || "");
      const isVip = tier === "VIP";
      const emailPayload = { refId, name, email, tier, amount, network };

      await transporter.sendMail({
        from: '"UmairCrypto" <no-reply@umaircrypto.com>',
        to: email,
        subject: isVip
          ? `Welcome to VIP Mentorship — #${refId}`
          : `Payment Confirmed — Book Your Session #${refId}`,
        html: isVip
          ? buildVipApprovalEmailHtml(emailPayload, bookingUrl)
          : buildApprovalEmailHtml(emailPayload, bookingUrl),
      });

      // 2. Notify admin (info only — already approved)
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 30px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 16px;">
            <span style="display: inline-block; background: #22c55e20; color: #22c55e; font-weight: 800; font-size: 13px; letter-spacing: 1px; padding: 6px 20px; border-radius: 20px;">
              AUTO-APPROVED BY LFGBOT
            </span>
          </div>
          <h1 style="color: #22c55e; margin-bottom: 8px;">Payment Auto-Approved</h1>
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
          <div style="background: #22c55e10; border: 1px solid #22c55e30; border-radius: 10px; padding: 16px;">
            <p style="color: #22c55e; font-weight: bold; font-size: 14px; margin: 0 0 4px;">All checks passed — booking link sent automatically</p>
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">Amount, network, address, and status all verified by LFGbot. No manual action needed.</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: '"UmairCrypto Payments" <no-reply@umaircrypto.com>',
        to: process.env.PROOF_RECIPIENT || "umairxcrypto@gmail.com",
        replyTo: email,
        subject: `✅ Auto-Approved — ${tier} (${amount}) — ${name}`,
        html: adminHtml,
        attachments,
      });

      // 3. Save order as approved
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
          status: "approved",
          createdAt: new Date().toISOString(),
        };
        await saveOrder(order);
      } catch (e) {
        console.error("Failed to persist order to Redis:", e);
      }

      return NextResponse.json({ success: true, refId, autoApproved: true });
    } else {
      // ═══════════════════════════════════════════════════════
      // MANUAL REVIEW — some checks failed, push to admin
      // ═══════════════════════════════════════════════════════

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

      // Build the "why not auto-approved" block
      const manualReasonBlock = autoApproveResult.reasons.length > 0
        ? `
          <div style="background: #F59E0B10; border: 1px solid #F59E0B30; border-radius: 10px; padding: 16px; margin: 16px 0;">
            <p style="color: #F59E0B; font-weight: bold; font-size: 14px; margin: 0 0 8px;">Pushed to Manual Review</p>
            ${autoApproveResult.reasons.map((r) => `<p style="color: #94a3b8; font-size: 12px; margin: 2px 0;">• ${r}</p>`).join("")}
          </div>
        `
        : "";

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 30px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 16px;">
            <span style="display: inline-block; background: #F59E0B20; color: #F59E0B; font-weight: 800; font-size: 13px; letter-spacing: 1px; padding: 6px 20px; border-radius: 20px;">
              MANUAL REVIEW REQUIRED
            </span>
          </div>
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
          ${manualReasonBlock}

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

      // Send admin email with approve/reject buttons
      await transporter.sendMail({
        from: '"UmairCrypto Payments" <no-reply@umaircrypto.com>',
        to: process.env.PROOF_RECIPIENT || "umairxcrypto@gmail.com",
        replyTo: email,
        subject: `⚠️ Manual Review — ${tier} (${amount}) — ${name}`,
        html,
        attachments,
      });

      // Send confirmation email to the client
      await transporter.sendMail({
        from: '"UmairCrypto" <no-reply@umaircrypto.com>',
        to: email,
        subject: `Payment Proof Received — #${refId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 30px; border-radius: 12px;">
            <h1 style="color: #38BDF8;">Payment Proof Received</h1>
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

      // Persist order as pending
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

      return NextResponse.json({ success: true, refId, autoApproved: false });
    }
  } catch (error) {
    console.error("Payment proof email error:", error);
    return NextResponse.json(
      { error: "Failed to send payment proof. Please try again." },
      { status: 500 }
    );
  }
}
