import { NextRequest, NextResponse } from "next/server";
import { getTweetIds, addTweetId, removeTweetId } from "@/lib/tweets";

function isAuthorized(req: NextRequest): boolean {
  const key = req.headers.get("x-admin-key");
  const secret = process.env.ADMIN_TWEETS_KEY;
  return !!secret && key === secret;
}

// GET — fetch current list (used by admin UI to verify key + load list)
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ids = await getTweetIds();
  return NextResponse.json(ids);
}

// POST — add a tweet
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await req.json();
  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // Extract tweet ID from URL: https://x.com/*/status/1234567890
  const match = url.match(/\/status\/(\d+)/);
  if (!match) {
    return NextResponse.json(
      { error: "Could not parse tweet ID from URL" },
      { status: 400 }
    );
  }

  const tweetId = match[1];
  const updated = await addTweetId(tweetId);
  return NextResponse.json({ tweetId, ids: updated });
}

// DELETE — remove a tweet
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tweetId } = await req.json();
  if (!tweetId) {
    return NextResponse.json({ error: "Missing tweetId" }, { status: 400 });
  }

  const updated = await removeTweetId(tweetId);
  return NextResponse.json({ ids: updated });
}
