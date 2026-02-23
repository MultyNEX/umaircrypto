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
        Questions? Reply to this email or DM <a href="https://instagram.com/umairorkz" style="color: #38BDF8;">@umairorkz</a> on Instagram.
      </p>
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
        Need help? Reply to this email or DM <a href="https://instagram.com/umairorkz" style="color: #38BDF8;">@umairorkz</a> on Instagram.
      </p>
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
