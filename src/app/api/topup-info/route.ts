import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }

  const raw = await redis.get<string>(`topup:${token}`);
  if (!raw) {
    return NextResponse.json(
      { error: "This top-up link has expired or is invalid." },
      { status: 404 }
    );
  }

  const data = typeof raw === "string" ? JSON.parse(raw) : raw;

  return NextResponse.json({
    originalRefId: data.originalRefId,
    name: data.name,
    tier: data.tier,
    tierPrice: data.tierPrice,
    amountReceived: data.amountReceived,
    amountRemaining: data.amountRemaining,
    network: data.network,
  });
}
