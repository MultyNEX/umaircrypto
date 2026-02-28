import type { SubmissionPayload } from "./tokens";

export function buildApprovalEmailHtml(
  data: SubmissionPayload,
  bookingUrl: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 30px; border-radius: 12px;">
      <h1 style="color: #38BDF8; margin-bottom: 8px;">Payment Verified!</h1>
      <p>Hi ${data.name},</p>
      <p>Great news! Your payment for <strong>${data.tier} (${data.amount})</strong> via <strong>${data.network}</strong> has been verified and confirmed.</p>
      <p>Reference: <strong>#${data.refId}</strong></p>

      <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />

      <h3 style="color: #38BDF8;">Book Your Session</h3>
      <p>Click the button below to schedule your consultation at a time that works for you:</p>

      <div style="text-align: center; margin: 24px 0;">
        <a href="${bookingUrl}" style="display: inline-block; background: #38BDF8; color: #060612; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; font-size: 16px;">
          Book Your Session
        </a>
      </div>

      <p style="color: #94a3b8; font-size: 13px;">
        If the button doesn't work, copy this link:<br/>
        <a href="${bookingUrl}" style="color: #38BDF8; word-break: break-all;">${bookingUrl}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 13px;">
        Questions? Email us at <a href="mailto:contact@umaircrypto.com" style="color: #38BDF8;">contact@umaircrypto.com</a> or DM <a href="https://instagram.com/umairorkz" style="color: #38BDF8;">@umairorkz</a> on Instagram.
      </p>
      <p style="color: #64748b; font-size: 11px; margin-top: 12px;">This is an automated message — please do not reply to this email.</p>
    </div>
  `;
}

export function buildVipApprovalEmailHtml(
  data: SubmissionPayload,
  bookingUrl: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 30px; border-radius: 12px;">
      <!-- VIP Badge -->
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="display: inline-block; background: linear-gradient(135deg, #F59E0B, #D97706); color: #0a0a0f; font-weight: 800; font-size: 13px; letter-spacing: 1.5px; padding: 6px 20px; border-radius: 20px; text-transform: uppercase;">
          ★ VIP Member
        </span>
      </div>

      <h1 style="color: #F59E0B; margin-bottom: 4px; text-align: center; font-size: 24px;">Welcome to VIP Mentorship</h1>
      <p style="text-align: center; color: #94a3b8; font-size: 14px; margin-top: 0;">You're in. Let's get started.</p>

      <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />

      <p>Hi ${data.name},</p>
      <p>Your payment of <strong>${data.amount}</strong> via <strong>${data.network}</strong> has been confirmed.</p>
      <p>Reference: <strong>#${data.refId}</strong></p>

      <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />

      <h3 style="color: #F59E0B; margin-bottom: 12px;">What Happens Next</h3>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; vertical-align: top; width: 36px;">
            <span style="display: inline-block; background: #F59E0B20; color: #F59E0B; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px; font-weight: bold; font-size: 14px;">1</span>
          </td>
          <td style="padding: 12px 0; color: #f1f5f9;">
            <strong>Book Your Onboarding Call</strong><br/>
            <span style="color: #94a3b8; font-size: 13px;">This is your first 1-on-1 session where we'll review your portfolio, understand your goals, and map out your mentorship plan.</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; vertical-align: top;">
            <span style="display: inline-block; background: #F59E0B20; color: #F59E0B; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px; font-weight: bold; font-size: 14px;">2</span>
          </td>
          <td style="padding: 12px 0; color: #f1f5f9;">
            <strong>Fill In the Pre-Call Questions</strong><br/>
            <span style="color: #94a3b8; font-size: 13px;">After booking, you'll see a few questions about your experience, portfolio, and focus areas. Fill them in so we can hit the ground running.</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; vertical-align: top;">
            <span style="display: inline-block; background: #F59E0B20; color: #F59E0B; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px; font-weight: bold; font-size: 14px;">3</span>
          </td>
          <td style="padding: 12px 0; color: #f1f5f9;">
            <strong>Ongoing Access</strong><br/>
            <span style="color: #94a3b8; font-size: 13px;">As a VIP member you get ongoing mentorship for 6 months — weekly 1-on-1 calls, priority chart analysis, custom alerts, and direct WhatsApp support.</span>
          </td>
        </tr>
      </table>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${bookingUrl}" style="display: inline-block; background: linear-gradient(135deg, #F59E0B, #D97706); color: #0a0a0f; padding: 16px 40px; border-radius: 12px; font-weight: bold; text-decoration: none; font-size: 16px;">
          Book Your Onboarding Call
        </a>
      </div>

      <p style="color: #94a3b8; font-size: 13px; text-align: center;">
        If the button doesn't work, copy this link:<br/>
        <a href="${bookingUrl}" style="color: #F59E0B; word-break: break-all;">${bookingUrl}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />

      <div style="background: #F59E0B08; border: 1px solid #F59E0B20; border-radius: 10px; padding: 16px; margin-bottom: 16px;">
        <p style="color: #F59E0B; font-weight: bold; font-size: 14px; margin: 0 0 8px;">Your VIP Membership Includes</p>
        <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.8;">
          ✦ Onboarding strategy session<br/>
          ✦ Ongoing 1-on-1 mentorship for 6 months<br/>
          ✦ Personalized portfolio guidance<br/>
          ✦ Priority access to Umair's insights
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 13px;">
        Questions? Email us at <a href="mailto:contact@umaircrypto.com" style="color: #F59E0B;">contact@umaircrypto.com</a> or DM <a href="https://instagram.com/umairorkz" style="color: #F59E0B;">@umairorkz</a> on Instagram.
      </p>
      <p style="color: #64748b; font-size: 11px; margin-top: 12px;">This is an automated message — please do not reply to this email.</p>
    </div>
  `;
}

export function buildRejectionEmailHtml(data: SubmissionPayload): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 30px; border-radius: 12px;">
      <h1 style="color: #F59E0B; margin-bottom: 8px;">Payment Update</h1>
      <p>Hi ${data.name},</p>
      <p>We were unable to verify your payment for <strong>${data.tier} (${data.amount})</strong> via <strong>${data.network}</strong>.</p>
      <p>Reference: <strong>#${data.refId}</strong></p>

      <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />

      <p>This could be due to:</p>
      <ul style="color: #94a3b8; line-height: 1.8;">
        <li>Transaction not yet confirmed on the blockchain</li>
        <li>Amount doesn't match the selected plan</li>
        <li>Screenshot is unclear or incomplete</li>
      </ul>

      <p>Please feel free to resubmit your payment proof:</p>

      <div style="text-align: center; margin: 24px 0;">
        <a href="https://umaircrypto.com/payment" style="display: inline-block; background: #38BDF8; color: #060612; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; font-size: 16px;">
          Resubmit Payment Proof
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 13px;">
        Need help? Email us at <a href="mailto:contact@umaircrypto.com" style="color: #38BDF8;">contact@umaircrypto.com</a> or DM <a href="https://instagram.com/umairorkz" style="color: #38BDF8;">@umairorkz</a> on Instagram.
      </p>
      <p style="color: #64748b; font-size: 11px; margin-top: 12px;">This is an automated message — please do not reply to this email.</p>
    </div>
  `;
}

export function buildAdminResultPageHtml(
  action: "approved" | "rejected",
  clientName: string,
  clientEmail: string,
  refId: string
): string {
  const isApproved = action === "approved";
  const color = isApproved ? "#38BDF8" : "#F59E0B";
  const icon = isApproved ? "&#10003;" : "&#10007;";
  const title = isApproved ? "Payment Approved" : "Payment Rejected";
  const message = isApproved
    ? `Booking email sent to <strong>${clientEmail}</strong>`
    : `Rejection notice sent to <strong>${clientEmail}</strong>`;

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
    h1 { font-size: 22px; margin: 0 0 8px; }
    .ref { color: #94a3b8; font-size: 14px; margin-bottom: 16px; }
    .msg { color: #94a3b8; font-size: 15px; line-height: 1.6; }
    .msg strong { color: #f1f5f9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon" style="background: ${color}20; color: ${color};">${icon}</div>
    <h1 style="color: ${color};">${title}</h1>
    <p class="ref">#${refId} — ${clientName}</p>
    <p class="msg">${message}</p>
  </div>
</body>
</html>`;
}

export function buildWrongAmountEmailHtml(
  data: SubmissionPayload,
  amountReceived: string,
  amountRemaining: string,
  topupUrl: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 30px; border-radius: 12px;">
      <h1 style="color: #F59E0B; margin-bottom: 8px;">Payment Shortfall</h1>
      <p>Hi ${data.name},</p>
      <p>We received <strong>$${amountReceived}</strong> toward your <strong>${data.tier}</strong> plan (${data.amount}) via <strong>${data.network}</strong>.</p>
      <p>You are short by <strong style="color: #F59E0B;">$${amountRemaining}</strong>.</p>
      <p>Reference: <strong>#${data.refId}</strong></p>

      <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />

      <div style="background: #F59E0B10; border: 1px solid #F59E0B20; border-radius: 10px; padding: 16px; margin: 16px 0;">
        <p style="color: #F59E0B; font-weight: bold; font-size: 14px; margin: 0 0 8px;">Why does this happen?</p>
        <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.6;">
          This usually happens when your exchange deducts a withdrawal fee from the amount you send. For example, Binance charges ~$1 for TRC20 withdrawals, which reduces the amount we receive.
        </p>
      </div>

      <p>Please send the remaining <strong>$${amountRemaining}</strong> to complete your payment:</p>

      <div style="text-align: center; margin: 24px 0;">
        <a href="${topupUrl}" style="display: inline-block; background: #F59E0B; color: #0a0a0f; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; font-size: 16px;">
          Complete Payment — Send $${amountRemaining}
        </a>
      </div>

      <p style="color: #94a3b8; font-size: 13px; text-align: center;">
        If the button doesn't work, copy this link:<br/>
        <a href="${topupUrl}" style="color: #F59E0B; word-break: break-all;">${topupUrl}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />

      <p style="color: #ef4444; font-size: 13px; font-weight: bold;">⏰ This link expires in 48 hours.</p>

      <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 13px;">
        Questions? Email us at <a href="mailto:contact@umaircrypto.com" style="color: #38BDF8;">contact@umaircrypto.com</a> or DM <a href="https://instagram.com/umairorkz" style="color: #38BDF8;">@umairorkz</a> on Instagram.
      </p>
      <p style="color: #64748b; font-size: 11px; margin-top: 12px;">This is an automated message — please do not reply to this email.</p>
    </div>
  `;
}

export function buildThankYouEmailHtml(
  name: string,
  tier: string,
  refId: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 30px; border-radius: 12px;">
      <h1 style="color: #38BDF8; margin-bottom: 8px;">Thanks for Your Session! 🎉</h1>
      <p>Hi ${name},</p>
      <p>Hope you got value from our <strong>${tier}</strong> session today. It was great working through your portfolio and strategy together.</p>
      <p style="color: #94a3b8; font-size: 13px;">Reference: #${refId}</p>

      <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />

      <div style="background: #38BDF810; border: 1px solid #38BDF820; border-radius: 10px; padding: 16px; margin: 16px 0;">
        <p style="color: #38BDF8; font-weight: bold; font-size: 14px; margin: 0 0 8px;">Quick Reminders</p>
        <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.8;">
          ✦ Review the key levels and setups we discussed<br/>
          ✦ Stick to the plan — discipline over emotion<br/>
          ✦ DM me anytime if something comes up before your next session
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />

      <p style="color: #94a3b8; font-size: 13px;">
        Want to keep going? <a href="https://umaircrypto.com/payment" style="color: #38BDF8;">Book another session</a> or follow <a href="https://instagram.com/umairorkz" style="color: #38BDF8;">@umairorkz</a> for daily insights.
      </p>
    </div>
  `;
}

export function buildVipWeeklyCheckinHtml(
  name: string,
  weekNumber: number,
  bookingUrl: string
): string {
  const weeksLeft = 26 - weekNumber;
  const motivations = [
    "Let's keep the momentum going.",
    "Consistency is what separates winners from the rest.",
    "Another week to sharpen your edge.",
    "Your portfolio doesn't build itself — let's work.",
    "Stay locked in. The market rewards the disciplined.",
    "Let's review your setups and stay ahead.",
  ];
  const motivation = motivations[(weekNumber - 1) % motivations.length];

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 30px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 16px;">
        <span style="display: inline-block; background: linear-gradient(135deg, #F59E0B, #D97706); color: #0a0a0f; font-weight: 800; font-size: 11px; letter-spacing: 1.5px; padding: 4px 14px; border-radius: 20px; text-transform: uppercase;">
          ★ VIP — Week ${weekNumber} of 26
        </span>
      </div>

      <h1 style="color: #F59E0B; margin-bottom: 4px; text-align: center; font-size: 22px;">Time for Your Weekly Call</h1>
      <p style="text-align: center; color: #94a3b8; font-size: 14px; margin-top: 4px;">${motivation}</p>

      <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />

      <p>Hey ${name},</p>
      <p>Week ${weekNumber} of your VIP mentorship — ${weeksLeft > 0 ? `${weeksLeft} weeks remaining` : "this is your final week!"}. Book your 1-on-1 call for this week:</p>

      <div style="text-align: center; margin: 24px 0;">
        <a href="${bookingUrl}" style="display: inline-block; background: linear-gradient(135deg, #F59E0B, #D97706); color: #0a0a0f; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; font-size: 16px;">
          Book This Week's Call
        </a>
      </div>

      <div style="background: #F59E0B08; border: 1px solid #F59E0B20; border-radius: 10px; padding: 16px; margin: 16px 0;">
        <p style="color: #F59E0B; font-weight: bold; font-size: 13px; margin: 0 0 6px;">Before your call, think about:</p>
        <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.8;">
          ✦ Any trades you took this week — wins or losses<br/>
          ✦ Charts or setups you want reviewed<br/>
          ✦ Questions about your strategy or risk management
        </p>
      </div>

      <div style="margin: 20px 0;">
        <p style="color: #94a3b8; font-size: 12px; margin-bottom: 6px;">Mentorship Progress</p>
        <div style="background: #1e293b; border-radius: 6px; height: 8px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #F59E0B, #D97706); height: 100%; width: ${Math.round((weekNumber / 26) * 100)}%; border-radius: 6px;"></div>
        </div>
        <p style="color: #64748b; font-size: 11px; margin-top: 4px; text-align: right;">${Math.round((weekNumber / 26) * 100)}% complete</p>
      </div>

      <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 13px;">
        Questions? Email us at <a href="mailto:contact@umaircrypto.com" style="color: #F59E0B;">contact@umaircrypto.com</a> or DM <a href="https://instagram.com/umairorkz" style="color: #F59E0B;">@umairorkz</a> on Instagram.
      </p>
      <p style="color: #64748b; font-size: 11px; margin-top: 12px;">This is an automated message — please do not reply to this email.</p>
    </div>
  `;
}
