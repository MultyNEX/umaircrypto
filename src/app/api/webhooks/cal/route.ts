import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAllOrders, updateOrder } from "@/lib/orders";
import { buildThankYouEmailHtml } from "@/lib/email-templates";

// Cal.com sends webhook events for bookings and meetings
// Set this up in Cal.com → Settings → Developer → Webhooks
// URL: https://umaircrypto.com/api/webhooks/cal
// Events: BOOKING_CREATED, MEETING_ENDED

export async function POST(req: NextRequest) {
  try {
    // Verify webhook secret if configured
    const secret = process.env.CAL_WEBHOOK_SECRET;
    if (secret) {
      const headerSecret = req.headers.get("x-cal-signature-256");
      // For now, simple secret check via query param as fallback
      const urlSecret = req.nextUrl.searchParams.get("secret");
      if (headerSecret !== secret && urlSecret !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json();
    const event = body.triggerEvent;
    const payload = body.payload;

    if (!event || !payload) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Get attendee email to match to order
    const attendeeEmail =
      payload.attendees?.[0]?.email ||
      payload.responses?.email?.value ||
      null;

    if (!attendeeEmail) {
      console.log("Cal webhook: no attendee email found, skipping");
      return NextResponse.json({ ok: true, action: "skipped" });
    }

    // Find the matching order by email (most recent approved one)
    const orders = await getAllOrders();
    const matchingOrder = orders
      .filter(
        (o) =>
          o.email.toLowerCase() === attendeeEmail.toLowerCase() &&
          (o.status === "approved" || o.status === "booked")
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

    if (!matchingOrder) {
      console.log(`Cal webhook: no matching order for ${attendeeEmail}`);
      return NextResponse.json({ ok: true, action: "no_match" });
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

    if (event === "BOOKING_CREATED") {
      // Update order status to booked
      await updateOrder(matchingOrder.refId, {
        status: "booked",
        resolvedAt: new Date().toISOString(),
      });
      console.log(`Cal webhook: ${matchingOrder.refId} marked as booked`);

      // If VIP, store the VIP start date for weekly check-ins
      if (matchingOrder.tier === "VIP") {
        const { getRedis } = await import("@/lib/redis");
        const redis = getRedis();
        if (redis) {
          const vipData = {
            refId: matchingOrder.refId,
            name: matchingOrder.name,
            email: matchingOrder.email,
            startDate: new Date().toISOString(),
            weeksSent: 0,
          };
          await redis.set(
            `vip:${matchingOrder.refId}`,
            JSON.stringify(vipData)
          );
          await redis.lpush("vip_active", matchingOrder.refId);
          console.log(`VIP check-in schedule created for ${matchingOrder.refId}`);
        }
      }

      return NextResponse.json({ ok: true, action: "booked" });
    }

    if (event === "MEETING_ENDED") {
      // Send thank you email
      await transporter.sendMail({
        from: '"UmairCrypto" <no-reply@umaircrypto.com>',
        to: matchingOrder.email,
        subject: `Thanks for Your Session! — #${matchingOrder.refId}`,
        html: buildThankYouEmailHtml(
          matchingOrder.name,
          matchingOrder.tier,
          matchingOrder.refId
        ),
      });
      console.log(`Thank you email sent to ${matchingOrder.email}`);

      return NextResponse.json({ ok: true, action: "thankyou_sent" });
    }

    return NextResponse.json({ ok: true, action: "ignored", event });
  } catch (error) {
    console.error("Cal webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}