import { NextRequest, NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/verify-tx";

export async function POST(req: NextRequest) {
  try {
    const { txHash, network } = await req.json();

    if (!txHash || !network) {
      return NextResponse.json(
        { error: "Missing txHash or network" },
        { status: 400 }
      );
    }

    const result = await verifyTransaction(txHash, network);
    return NextResponse.json(result);
  } catch (error) {
    console.error("TX verification error:", error);
    return NextResponse.json(
      {
        verified: false,
        amount: null,
        toAddress: null,
        fromAddress: null,
        status: "not_found",
        network: "",
        error: "Verification failed",
      },
      { status: 500 }
    );
  }
}
