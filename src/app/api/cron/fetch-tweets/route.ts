import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

const USERNAME = "Umairorkz";
const HASHTAG = "#MarketUpdate";
const KV_KEY = "tweet_ids";
const MAX_TWEETS = 12;

/**
 * Cron job: fetch latest tweets from @Umairorkz via Twitter's syndication endpoint.
 * Only picks up tweets containing #MarketUpdate.
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

    // Split HTML into individual tweet blocks and only keep ones with #MarketUpdate.
    // The syndication HTML renders each tweet in its own container with a status link.
    // We split on the tweet article/container boundary, then check each block for the hashtag.
    const ids: string[] = [];
    const hashtagLower = HASHTAG.toLowerCase();

    // Each tweet block contains a /status/ID link. Split by those links and check
    // the surrounding content for the hashtag text.
    const blockPattern = /(<[^>]*data-tweet-id[^>]*>[\s\S]*?<\/[^>]*>)|(<article[\s\S]*?<\/article>)/gi;
    const blocks = html.match(blockPattern);

    if (blocks) {
      // Structured HTML — check each block
      for (const block of blocks) {
        if (!block.toLowerCase().includes(hashtagLower)) continue;
        const idMatch = block.match(/\/status\/(\d{15,})/);
        if (idMatch) ids.push(idMatch[1]);
      }
    }

    // Fallback: if no structured blocks found, scan for tweet IDs near the hashtag.
    // The syndication page may use different HTML structures, so we check chunks
    // of ~2000 chars around each status link for the hashtag text.
    if (ids.length === 0) {
      const statusPattern = /\/status\/(\d{15,})/g;
      let m;
      while ((m = statusPattern.exec(html)) !== null) {
        const start = Math.max(0, m.index - 1500);
        const end = Math.min(html.length, m.index + 1500);
        const chunk = html.slice(start, end).toLowerCase();
        if (chunk.includes(hashtagLower)) {
          if (!ids.includes(m[1])) ids.push(m[1]);
        }
      }
    }

    if (ids.length === 0) {
      console.warn("No #MarketUpdate tweets found — keeping existing data");
      return NextResponse.json({ status: "no_matching_tweets" });
    }

    // Deduplicate and sort descending by ID (Snowflake = chronological)
    const unique = Array.from(new Set(ids));
    const sorted = unique.sort((a, b) => {
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
      hashtag: HASHTAG,
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
