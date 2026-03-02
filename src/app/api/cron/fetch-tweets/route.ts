import { NextRequest, NextResponse } from "next/server";
import { refreshTweetsFromTwitter } from "@/lib/tweets";

/**
 * Cron job: fetch latest #MarketUpdate tweets from @Umairorkz.
 * Runs daily on Hobby plan (or every 30 min on Pro).
 * Acts as a backup — the homepage also refreshes on visitor traffic.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const ids = await refreshTweetsFromTwitter();
    return NextResponse.json({ status: "ok", count: ids.length, ids });
  } catch (e) {
    console.error("Tweet fetch cron failed:", e);
    return NextResponse.json(
      { status: "error", message: String(e) },
      { status: 500 }
    );
  }
}
