import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

const USERNAME = "Umairorkz";
const KV_KEY = "tweet_ids";
const MAX_TWEETS = 12;

/**
 * Cron job: fetch latest tweets from @Umairorkz via Twitter's syndication endpoint.
 * Runs every 30 minutes on Vercel Cron. Falls back to existing Redis data on failure.
 */
export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(
      `https://syndication.twitter.com/srv/timeline-profile/screen-name/${USERNAME}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; UmairCrypto/1.0; +https://umaircrypto.com)",
        },
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) {
      console.error(`Twitter syndication returned ${res.status}`);
      return NextResponse.json(
        { status: "error", message: `Syndication returned ${res.status}` },
        { status: 502 }
      );
    }

    const html = await res.text();

    // Extract tweet IDs from status URLs in the syndication HTML
    const tweetIdPattern = /\/status\/(\d{15,})/g;
    const ids = new Set<string>();
    let match;
    while ((match = tweetIdPattern.exec(html)) !== null) {
      ids.add(match[1]);
    }

    if (ids.size === 0) {
      console.warn("No tweet IDs found in syndication response");
      return NextResponse.json({ status: "no_tweets_found" });
    }

    // Sort descending by ID (Snowflake = chronological)
    const sorted = Array.from(ids).sort((a, b) => {
      if (a.length !== b.length) return b.length - a.length;
      return b.localeCompare(a);
    });

    const final = sorted.slice(0, MAX_TWEETS);

    const redis = getRedis();
    if (redis) {
      await redis.set(KV_KEY, final);
    }

    return NextResponse.json({
      status: "ok",
      count: final.length,
      ids: final,
    });
  } catch (e) {
    console.error("Tweet fetch cron failed:", e);
    return NextResponse.json(
      { status: "error", message: String(e) },
      { status: 500 }
    );
  }
}
