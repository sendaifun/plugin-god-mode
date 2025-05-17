import { SolanaAgentKit } from "solana-agent-kit";
import type { BirdeyePortfolioResponse } from "../types";

/**
 * Fetch the portfolio of a Solana wallet using the Birdeye public API
 * @param agent - SolanaAgentKit instance
 * @returns Promise resolving to the portfolio data as returned by Birdeye
 */
export default async function getPortfolio(
  agent: SolanaAgentKit,
): Promise<BirdeyePortfolioResponse> {
  const walletAddress = agent.wallet.publicKey.toBase58();
  const url = `https://public-api.birdeye.so/v1/wallet/token_list?wallet=${walletAddress}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-chain": "solana",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch portfolio: ${response.statusText}`);
    }

    const data: BirdeyePortfolioResponse = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(`Portfolio fetch failed: ${error.message}`);
  }
}
