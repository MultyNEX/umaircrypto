import { getRedis } from "./redis";

// Fallback tweet IDs used when Redis is not configured (local dev or before KV setup)
const FALLBACK_IDS = [
  "2020463178292044032", // $AVAX analysis
  "2009563387626397774", // $LTC chart analysis
  "2000994564291879021", // $HYPE chart analysis
  "1990233276880232572", // $USDT.D divergence
  "1986007555374788967", // $ETH.D levels
  "1960727761305145400", // $BTC $125K shorts
];

const USERNAME = "Umairorkz";
const HASHTAGS = ["#MarketUpdate", "#MARKET"];
const KV_KEY = "tweet_ids";
const KV_LAST_FETCH = "tweet_ids_last_fetch";
const MAX_TWEETS = 12;
const STALE_MS = 5 * 60 * 1000; // 5 minutes

export async function getTweetIds(): Promise<string[]> {
  try {
    const redis = getRedis();
    if (!redis) return FALLBACK_IDS;
    const ids = (await redis.get(KV_KEY)) as string[] | null;
    return ids && ids.length > 0 ? ids : FALLBACK_IDS;
  } catch {
    return FALLBACK_IDS;
  }
}

/**
 * Returns cached tweet IDs but triggers a background refresh from Twitter
 * if the cache is older than 5 minutes. This way every visitor gets a fast
 * response, and tweets stay fresh without needing a Pro-plan cron.
 */
export async function getTweetIdsFresh(): Promise<string[]> {
  const redis = getRedis();
  if (!redis) return FALLBACK_IDS;

  // Check when we last fetched
  const lastFetch = (await redis.get(KV_LAST_FETCH)) as number | null;
  const isStale = !lastFetch || Date.now() - lastFetch > STALE_MS;

  if (isStale) {
    // Fire-and-forget: refresh in background, don't block the response
    refreshTweetsFromTwitter().catch((e) =>
      console.error("Background tweet refresh failed:", e)
    );
  }

  return getTweetIds();
}

/**
 * Fetch latest #MarketUpdate tweets from @Umairorkz via Twitter syndication.
 * Used by both the cron job and the stale-while-revalidate mechanism.
 */
export async function refreshTweetsFromTwitter(): Promise<string[]> {
  const redis = getRedis();
  if (!redis) return FALLBACK_IDS;

  // Mark fetch time immediately to prevent concurrent fetches
  await redis.set(KV_LAST_FETCH, Date.now());

  const res = await fetch(
    `https://syndication.twitter.com/srv/timeline-profile/screen-name/${USERNAME}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; UmairCrypto/1.0; +https://umaircrypto.com)",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error(`Twitter syndication returned ${res.status}`);
    return getTweetIds(); // return existing data
  }

  const html = await res.text();
  const hashtagsLower = HASHTAGS.map((h) => h.toLowerCase());
  const ids: string[] = [];

  function matchesAnyHashtag(text: string): boolean {
    const lower = text.toLowerCase();
    return hashtagsLower.some((h) => lower.includes(h));
  }

  // Try structured blocks first (article or data-tweet-id elements)
  const blockPattern =
    /(<[^>]*data-tweet-id[^>]*>[\s\S]*?<\/[^>]*>)|(<article[\s\S]*?<\/article>)/gi;
  const blocks = html.match(blockPattern);

  if (blocks) {
    for (const block of blocks) {
      if (!matchesAnyHashtag(block)) continue;
      const idMatch = block.match(/\/status\/(\d{15,})/);
      if (idMatch && !ids.includes(idMatch[1])) ids.push(idMatch[1]);
    }
  }

  // Fallback: scan chunks around each status link for the hashtag
  if (ids.length === 0) {
    const statusPattern = /\/status\/(\d{15,})/g;
    let m;
    while ((m = statusPattern.exec(html)) !== null) {
      const start = Math.max(0, m.index - 1500);
      const end = Math.min(html.length, m.index + 1500);
      const chunk = html.slice(start, end);
      if (matchesAnyHashtag(chunk) && !ids.includes(m[1])) {
        ids.push(m[1]);
      }
    }
  }

  // If no matching tweets found, keep existing data
  if (ids.length === 0) {
    console.warn("No matching hashtag tweets found — keeping existing data");
    return getTweetIds();
  }

  // Sort descending by ID (Snowflake = chronological)
  ids.sort((a, b) => {
    if (a.length !== b.length) return b.length - a.length;
    return b.localeCompare(a);
  });

  const final = ids.slice(0, MAX_TWEETS);
  await redis.set(KV_KEY, final);
  return final;
}

export async function addTweetId(id: string): Promise<string[]> {
  const redis = getRedis();
  if (!redis) throw new Error("Redis not configured");
  const current = await getTweetIds();
  // Remove if already exists, then prepend
  const filtered = current.filter((existing) => existing !== id);
  const updated = [id, ...filtered].slice(0, MAX_TWEETS);
  await redis.set(KV_KEY, updated);
  return updated;
}

export async function removeTweetId(id: string): Promise<string[]> {
  const redis = getRedis();
  if (!redis) throw new Error("Redis not configured");
  const current = await getTweetIds();
  const updated = current.filter((existing) => existing !== id);
  // If all removed, reset to fallback so site isn't empty
  await redis.set(KV_KEY, updated.length > 0 ? updated : FALLBACK_IDS);
  return updated.length > 0 ? updated : FALLBACK_IDS;
}
