// AI Screenshot Analysis via Google Gemini Flash (free tier)
// Extracts transaction details from payment screenshots

export interface ScreenshotAnalysis {
  amountSent: string | null;
  currency: string | null;
  receivingAddress: string | null;
  txHash: string | null;
  network: string | null;
  exchange: string | null;
  status: string | null;
  confidence: "high" | "medium" | "low";
  summary: string;
  warnings: string[];
}

const PROMPT = `You are a crypto payment verification assistant. Analyze this screenshot of a crypto transaction (likely from an exchange like Binance, OKX, Bybit, Trust Wallet, etc.) and extract the following details.

Return ONLY a valid JSON object with these fields:
{
  "amountSent": "the amount sent (number only, e.g. '397.00')" or null,
  "currency": "the token/currency (e.g. 'USDT', 'ETH', 'BTC')" or null,
  "receivingAddress": "the destination wallet address" or null,
  "txHash": "the transaction hash/ID" or null,
  "network": "the blockchain network (e.g. 'TRC20', 'ERC20', 'Solana', 'BEP20')" or null,
  "exchange": "the exchange or wallet app name" or null,
  "status": "transaction status (e.g. 'Completed', 'Pending', 'Processing')" or null,
  "confidence": "high" if most fields are clearly readable, "medium" if some are unclear, "low" if the image is hard to read,
  "summary": "A brief 1-2 sentence summary of what you see",
  "warnings": ["list of any concerns, e.g. 'Amount appears to be less than expected', 'Screenshot may be edited', 'Transaction status shows pending not completed', 'Cannot read the destination address clearly'"]
}

Important rules:
- Return ONLY the JSON object, no markdown, no backticks, no explanation
- If you cannot read a field, set it to null
- Be extra careful with wallet addresses — they must be exact
- Flag any signs of image manipulation or editing
- Note if the transaction status is anything other than completed/successful
- If the screenshot doesn't appear to be a crypto transaction at all, set confidence to "low" and explain in summary`;

export async function analyzeScreenshot(
  imageBuffer: Buffer,
  mimeType: string
): Promise<ScreenshotAnalysis | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not set — skipping AI analysis");
    return null;
  }

  try {
    const base64Image = imageBuffer.toString("base64");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType || "image/jpeg",
                    data: base64Image,
                  },
                },
                { text: PROMPT },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    
    // Extract text from all parts, filtering out any thinking parts
    const text = data?.candidates?.[0]?.content?.parts
      ?.filter((p: { text?: string }) => p.text)
      .map((p: { text?: string }) => p.text || "")
      .join("")
      .trim();

    if (!text) {
      console.error("LFGbot: No text in response. Full response:", JSON.stringify(data).slice(0, 500));
      return null;
    }

    // Clean up — remove markdown fences, leading/trailing whitespace, any preamble before JSON
    let cleaned = text
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();
    
    // Find the first { and last } to extract JSON even if there's surrounding text
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(cleaned) as ScreenshotAnalysis;
    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("LFGbot JSON parse failed. Raw text (first 300 chars):", 
        (error as Error).message);
      // Return a minimal fallback analysis
      return {
        amountSent: null,
        currency: null,
        receivingAddress: null,
        txHash: null,
        network: null,
        exchange: null,
        status: null,
        confidence: "low" as const,
        summary: "LFGbot could not fully parse this screenshot. Please verify manually.",
        warnings: ["Analysis was incomplete — manual review required"],
      };
    }
    console.error("LFGbot screenshot analysis error:", error instanceof Error ? error.message : error);
    return null;
  }
}

// Build HTML block for the admin email
export function buildAnalysisEmailBlock(
  analysis: ScreenshotAnalysis,
  expectedAmount: string,
  expectedNetwork: string
): string {
  const checks: string[] = [];
  const issues: string[] = [];

  // Amount check
  if (analysis.amountSent) {
    const sent = parseFloat(analysis.amountSent);
    const expected = parseFloat(expectedAmount.replace(/[^0-9.]/g, ""));
    if (!isNaN(sent) && !isNaN(expected)) {
      if (sent >= expected) {
        checks.push(`✅ Amount: $${analysis.amountSent} ${analysis.currency || ""} (matches or exceeds $${expected})`);
      } else {
        issues.push(`⚠️ Amount: $${analysis.amountSent} ${analysis.currency || ""} — short by $${(expected - sent).toFixed(2)}`);
      }
    } else {
      checks.push(`📊 Amount detected: $${analysis.amountSent} ${analysis.currency || ""}`);
    }
  } else {
    issues.push("❓ Could not read the amount from screenshot");
  }

  // Network check
  if (analysis.network) {
    const normalizedDetected = analysis.network.toLowerCase().replace(/[\s()-]/g, "");
    const normalizedExpected = expectedNetwork.toLowerCase().replace(/[\s()-]/g, "");
    if (normalizedDetected.includes(normalizedExpected) || normalizedExpected.includes(normalizedDetected)) {
      checks.push(`✅ Network: ${analysis.network} (matches)`);
    } else {
      issues.push(`⚠️ Network: ${analysis.network} detected (client selected ${expectedNetwork})`);
    }
  }

  // Address
  if (analysis.receivingAddress) {
    const short = `${analysis.receivingAddress.slice(0, 6)}...${analysis.receivingAddress.slice(-6)}`;
    checks.push(`📬 To: ${short}`);
  }

  // TX Hash
  if (analysis.txHash) {
    const short = `${analysis.txHash.slice(0, 8)}...${analysis.txHash.slice(-8)}`;
    checks.push(`🔗 TX: ${short}`);
  }

  // Exchange
  if (analysis.exchange) {
    checks.push(`🏦 Via: ${analysis.exchange}`);
  }

  // Status
  if (analysis.status) {
    const lower = analysis.status.toLowerCase();
    if (lower.includes("complet") || lower.includes("success") || lower.includes("confirm")) {
      checks.push(`✅ Status: ${analysis.status}`);
    } else {
      issues.push(`⚠️ Status: ${analysis.status}`);
    }
  }

  // Warnings from AI
  if (analysis.warnings && analysis.warnings.length > 0) {
    for (const w of analysis.warnings) {
      issues.push(`⚠️ ${w}`);
    }
  }

  const confidenceColors: Record<string, string> = {
    high: "#22c55e",
    medium: "#F59E0B",
    low: "#ef4444",
  };
  const confColor = confidenceColors[analysis.confidence] || "#94a3b8";
  const confLabel = analysis.confidence.charAt(0).toUpperCase() + analysis.confidence.slice(1);

  const allItems = [...checks, ...issues];

  return `
    <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 16px; margin: 16px 0;">
      <p style="color: #38BDF8; font-weight: bold; font-size: 14px; margin: 0 0 4px;">
        🤖 LFGbot Screenshot Analysis
        <span style="color: ${confColor}; font-size: 12px; font-weight: normal; margin-left: 8px;">
          (${confLabel} confidence)
        </span>
      </p>
      <p style="color: #64748b; font-size: 12px; margin: 0 0 12px;">Automated verification — always confirm manually before approving</p>
      ${allItems.map((item) => `<p style="color: #cbd5e1; font-size: 13px; margin: 4px 0; line-height: 1.5;">${item}</p>`).join("")}
      ${analysis.summary ? `<p style="color: #94a3b8; font-size: 12px; margin: 12px 0 0; font-style: italic;">"${analysis.summary}"</p>` : ""}
    </div>
  `;
}