import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getRedis } from "@/lib/redis";
import { buildVipWeeklyCheckinHtml } from "@/lib/email-templates";

// Vercel Cron: runs daily at 9 AM UTC
// Checks which VIP members need their weekly check-in email

interface VipRecord {
  refId: string;
  name: string;
  email: string;
  startDate: string;
  weeksSent: number;
}

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sends this automatically)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Redis not available" }, { status: 500 });
  }

  try {
    const activeIds = await redis.lrange("vip_active", 0, -1);
    if (!activeIds || activeIds.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, message: "No active VIPs" });
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
    const bookingUrl = calBase + "/vip-onboarding";

    let sent = 0;
    let completed = 0;
    const errors: string[] = [];

    for (const refId of activeIds) {
      try {
        const raw = await redis.get<string>(`vip:${refId}`);
        if (!raw) continue;
        const vip: VipRecord =
          typeof raw === "string" ? JSON.parse(raw) : (raw as unknown as VipRecord);

        const startDate = new Date(vip.startDate);
        const now = new Date();
        const daysSinceStart = Math.floor(
          (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const currentWeek = Math.floor(daysSinceStart / 7) + 1;

        // If 26 weeks have passed, mark as completed and remove
        if (currentWeek > 26) {
          await redis.lrem("vip_active", 1, refId);
          await redis.del(`vip:${refId}`);
          completed++;
          continue;
        }

        // If we already sent this week's email, skip
        if (vip.weeksSent >= currentWeek) continue;

        // Send the weekly check-in email
        await transporter.sendMail({
          from: '"UmairCrypto VIP" <no-reply@umaircrypto.com>',
          to: vip.email,
          subject: `Week ${currentWeek}/26 — Book Your VIP Call 🔥`,
          html: buildVipWeeklyCheckinHtml(vip.name, currentWeek, bookingUrl),
        });

        // Update weeksSent
        vip.weeksSent = currentWeek;
        await redis.set(`vip:${refId}`, JSON.stringify(vip));
        sent++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${refId}: ${msg}`);
        console.error(`VIP cron error for ${refId}:`, msg);
      }
    }

    console.log(
      `VIP cron: ${sent} emails sent, ${completed} completed, ${errors.length} errors`
    );

    return NextResponse.json({
      ok: true,
      sent,
      completed,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("VIP cron job failed:", error);
    return NextResponse.json(
      { error: "Cron job failed" },
      { status: 500 }
    );
  }
}