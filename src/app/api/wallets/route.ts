import { NextResponse } from "next/server";

export async function GET() {
  const wallets: Record<string, string> = {};

  const trc20 = process.env.WALLET_USDT_TRC20;
  const sol = process.env.WALLET_USDT_SOL;
  const erc20 = process.env.WALLET_USDT_ERC20;

  if (trc20) wallets.trc20 = trc20;
  if (sol) wallets.sol = sol;
  if (erc20) wallets.erc20 = erc20;

  return NextResponse.json(
    { wallets },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
