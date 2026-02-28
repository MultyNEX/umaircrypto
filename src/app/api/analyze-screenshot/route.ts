import { NextRequest, NextResponse } from "next/server";
import { analyzeScreenshot } from "@/lib/lfgbot";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("screenshot") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { analysis: null, error: "No screenshot provided" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { analysis: null, error: "File too large (max 5MB)" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { analysis: null, error: "Only image files are supported" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const analysis = await analyzeScreenshot(buffer, file.type);

    if (!analysis) {
      return NextResponse.json({
        analysis: null,
        error: "Analysis unavailable",
      });
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Screenshot analysis error:", error);
    return NextResponse.json(
      { analysis: null, error: "Analysis failed" },
      { status: 500 }
    );
  }
}
