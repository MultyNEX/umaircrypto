import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getOrder, updateOrder } from "@/lib/orders";
import { buildThankYouEmailHtml } from "@/lib/email-templates";

function isAuthorized(req: NextRequest): boolean {
  const key = req.headers.get("x-admin-key");
  const secret = process.env.ADMIN_TWEETS_KEY;
  return !!secret && key === secret;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status !== "approved" && order.status !== "booked") {
    return NextResponse.json(
      { error: "Can only send thank you for approved/booked orders" },
      { status: 400 }
    );
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

  await transporter.sendMail({
    from: '"UmairCrypto" <noreply@umaircrypto.com>',
    to: order.email,
    subject: `Thanks for Your Session! — #${order.refId}`,
    html: buildThankYouEmailHtml(order.name, order.tier, order.refId),
  });

  // Mark that thank you was sent
  await updateOrder(id, { thankyouSent: true });

  return NextResponse.json({ success: true });
}
