import { NextResponse } from "next/server";
import { getTweetIds } from "@/lib/tweets";

export async function GET() {
  const ids = await getTweetIds();
  return NextResponse.json(ids);
}
