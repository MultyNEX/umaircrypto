import { Redis } from "@upstash/redis";

// Fallback tweet IDs used when Redis is not configured (local dev or before KV setup)
const FALLBACK_IDS = [
  "2020463178292044032", // $AVAX analysis
  "2009563387626397774", // $LTC chart analysis
  "2000994564291879021", // $HYPE chart analysis
  "1990233276880232572", // $USDT.D divergence
  "1986007555374788967", // $ETH.D levels
  "1960727761305145400", // $BTC $125K shorts
];

const KV_KEY = "tweet_ids";
const MAX_TWEETS = 12;

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

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
