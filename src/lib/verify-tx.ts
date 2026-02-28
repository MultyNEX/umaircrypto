// On-chain transaction verification for TRC20, ERC20, and Solana
// Confirms TX hash is real and extracts amount, to-address, status

export interface TxVerification {
  verified: boolean;
  amount: number | null;       // in token units (e.g. 200.00 USDT)
  toAddress: string | null;
  fromAddress: string | null;
  status: "confirmed" | "pending" | "failed" | "not_found";
  network: string;
  error?: string;
}

// ── TRON (TRC20) via TronGrid ──────────────────────────────────
// USDT contract: TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

async function verifyTrc20(txHash: string): Promise<TxVerification> {
  const apiKey = process.env.TRONGRID_API_KEY;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) headers["TRON-PRO-API-KEY"] = apiKey;

  try {
    // Use the events endpoint — cleanest way to get TRC20 transfer details
    const res = await fetch(
      `https://api.trongrid.io/v1/transactions/${txHash}/events`,
      { headers }
    );

    if (!res.ok) {
      if (res.status === 404) return { verified: false, amount: null, toAddress: null, fromAddress: null, status: "not_found", network: "TRC20" };
      return { verified: false, amount: null, toAddress: null, fromAddress: null, status: "not_found", network: "TRC20", error: `TronGrid ${res.status}` };
    }

    const data = await res.json();
    if (!data.data || data.data.length === 0) {
      // Transaction exists but no events — check if it's a native TRX transfer or still pending
      // Fall back to the basic transaction info
      const txRes = await fetch(
        "https://api.trongrid.io/wallet/gettransactioninfobyid",
        {
          method: "POST",
          headers,
          body: JSON.stringify({ value: txHash }),
        }
      );
      const txData = await txRes.json();
      if (!txData.id) {
        return { verified: false, amount: null, toAddress: null, fromAddress: null, status: "not_found", network: "TRC20" };
      }
      const status = txData.receipt?.result === "SUCCESS" ? "confirmed" : "pending";
      return { verified: status === "confirmed", amount: null, toAddress: null, fromAddress: null, status, network: "TRC20" };
    }

    // Find the Transfer event from USDT contract
    const usdtContract = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
    const transferEvent = data.data.find(
      (e: { contract_address: string; event_name: string }) =>
        e.event_name === "Transfer" &&
        e.contract_address === usdtContract
    ) || data.data.find(
      (e: { event_name: string }) => e.event_name === "Transfer"
    );

    if (!transferEvent) {
      return { verified: true, amount: null, toAddress: null, fromAddress: null, status: "confirmed", network: "TRC20" };
    }

    const result = transferEvent.result || {};
    const rawAmount = result.value || result._value || "0";
    const amount = parseInt(rawAmount) / 1e6; // USDT has 6 decimals
    const toAddress = result.to || result._to || null;
    const fromAddress = result.from || result._from || null;

    return {
      verified: true,
      amount,
      toAddress,
      fromAddress,
      status: "confirmed",
      network: "TRC20",
    };
  } catch (e) {
    return {
      verified: false,
      amount: null,
      toAddress: null,
      fromAddress: null,
      status: "not_found",
      network: "TRC20",
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

// ── Solana via public RPC ──────────────────────────────────────
// USDT mint: Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB

async function verifySolana(txHash: string): Promise<TxVerification> {
  const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

  try {
    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTransaction",
        params: [txHash, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }],
      }),
    });

    const data = await res.json();
    if (!data.result) {
      return { verified: false, amount: null, toAddress: null, fromAddress: null, status: "not_found", network: "Solana" };
    }

    const tx = data.result;
    const status = tx.meta?.err === null ? "confirmed" : "failed";

    // Look for SPL token transfers in the parsed instructions
    const instructions = tx.transaction?.message?.instructions || [];
    let amount: number | null = null;
    let toAddress: string | null = null;
    let fromAddress: string | null = null;

    for (const ix of instructions) {
      if (ix.parsed?.type === "transferChecked" || ix.parsed?.type === "transfer") {
        const info = ix.parsed.info;
        amount = info.tokenAmount?.uiAmount || (info.amount ? parseInt(info.amount) / 1e6 : null);
        toAddress = info.destination || null;
        fromAddress = info.source || null;
        break;
      }
    }

    // Also check inner instructions
    if (!amount && tx.meta?.innerInstructions) {
      for (const inner of tx.meta.innerInstructions) {
        for (const ix of inner.instructions || []) {
          if (ix.parsed?.type === "transferChecked" || ix.parsed?.type === "transfer") {
            const info = ix.parsed.info;
            amount = info.tokenAmount?.uiAmount || (info.amount ? parseInt(info.amount) / 1e6 : null);
            toAddress = info.destination || null;
            fromAddress = info.source || null;
            break;
          }
        }
        if (amount) break;
      }
    }

    // If no token transfer found, check for native SOL transfer
    if (!amount) {
      const preBalances = tx.meta?.preBalances || [];
      const postBalances = tx.meta?.postBalances || [];
      if (preBalances.length >= 2 && postBalances.length >= 2) {
        const diff = (postBalances[1] - preBalances[1]) / 1e9; // lamports to SOL
        if (diff > 0) amount = diff;
      }
    }

    return { verified: status === "confirmed", amount, toAddress, fromAddress, status, network: "Solana" };
  } catch (e) {
    return {
      verified: false,
      amount: null,
      toAddress: null,
      fromAddress: null,
      status: "not_found",
      network: "Solana",
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

// ── Ethereum (ERC20) via Etherscan ─────────────────────────────
// USDT contract: 0xdAC17F958D2ee523a2206206994597C13D831ec7

async function verifyErc20(txHash: string): Promise<TxVerification> {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  if (!apiKey) {
    return {
      verified: false,
      amount: null,
      toAddress: null,
      fromAddress: null,
      status: "not_found",
      network: "ERC20",
      error: "ETHERSCAN_API_KEY not set",
    };
  }

  try {
    const res = await fetch(
      `https://api.etherscan.io/v2/api?chainid=1&module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${apiKey}`
    );
    const data = await res.json();

    if (!data.result || data.result === "0x") {
      return { verified: false, amount: null, toAddress: null, fromAddress: null, status: "not_found", network: "ERC20" };
    }

    const receipt = data.result;
    const status = receipt.status === "0x1" ? "confirmed" : "failed";

    // Find ERC20 Transfer event in logs
    const transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
    const transferLog = receipt.logs?.find(
      (log: { topics: string[] }) => log.topics?.[0] === transferTopic
    );

    let amount: number | null = null;
    let toAddress: string | null = null;
    let fromAddress: string | null = null;

    if (transferLog) {
      // Decode from/to from topics (strip leading zeros, add 0x)
      fromAddress = "0x" + transferLog.topics[1].slice(26);
      toAddress = "0x" + transferLog.topics[2].slice(26);
      // Decode amount from data (USDT has 6 decimals)
      const rawAmount = parseInt(transferLog.data, 16);
      amount = rawAmount / 1e6;
    }

    return { verified: status === "confirmed", amount, toAddress, fromAddress, status, network: "ERC20" };
  } catch (e) {
    return {
      verified: false,
      amount: null,
      toAddress: null,
      fromAddress: null,
      status: "not_found",
      network: "ERC20",
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

// ── Main dispatcher ────────────────────────────────────────────

const NETWORK_ALIASES: Record<string, string> = {
  trc20: "tron", "trc-20": "tron", tron: "tron", trx: "tron", tronnetwork: "tron",
  erc20: "ethereum", "erc-20": "ethereum", ethereum: "ethereum", eth: "ethereum", ethereumnetwork: "ethereum",
  solana: "solana", sol: "solana", spl: "solana", solananetwork: "solana",
};

function resolveNetwork(network: string): string {
  const n = network.toLowerCase().replace(/[\s()\-\/]/g, "");
  for (const [alias, canonical] of Object.entries(NETWORK_ALIASES)) {
    if (n.includes(alias) || alias.includes(n)) return canonical;
  }
  return n;
}

export async function verifyTransaction(
  txHash: string,
  network: string
): Promise<TxVerification> {
  const canonical = resolveNetwork(network);

  switch (canonical) {
    case "tron":
      return verifyTrc20(txHash);
    case "solana":
      return verifySolana(txHash);
    case "ethereum":
      return verifyErc20(txHash);
    default:
      return {
        verified: false,
        amount: null,
        toAddress: null,
        fromAddress: null,
        status: "not_found",
        network,
        error: `Unsupported network: ${network}`,
      };
  }
}
