import { SolanaAgentKit } from "solana-agent-kit";
import type { BirdeyeTrendingTokensResponse } from "../types";

/**
 * Fetch trending tokens on Solana using the Birdeye public API
 * @returns Promise resolving to the trending tokens data as returned by Birdeye
 */
export default async function getTrendingTokens(agent: SolanaAgentKit): Promise<BirdeyeTrendingTokensResponse["data"]["tokens"]> {
  const url =
    "https://public-api.birdeye.so/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=20";
  const apiKey = agent.config.OTHER_API_KEYS?.BIRDEYE_API_KEY;

  if (!apiKey) {
    throw new Error("BDS_API_KEY environment variable is not set.");
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-chain": "solana",
        "X-API-KEY": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trending tokens: ${response.statusText}`);
    }

    const data: BirdeyeTrendingTokensResponse = await response.json();

    const formattedData = data.data.tokens

    return formattedData;
  } catch (error: any) {
    throw new Error(`Trending tokens fetch failed: ${error.message}`);
  }
}
