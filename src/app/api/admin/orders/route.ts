import { NextRequest, NextResponse } from "next/server";
import { getAllOrders } from "@/lib/orders";

function isAuthorized(req: NextRequest): boolean {
  const key = req.headers.get("x-admin-key");
  const secret = process.env.ADMIN_TWEETS_KEY;
  return !!secret && key === secret;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get("status");
  let orders = await getAllOrders();

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    orders = orders.filter((o) => o.status === status);
  }

  return NextResponse.json({ orders });
}
