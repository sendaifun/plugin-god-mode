import type { BirdeyeTrendingTokensResponse } from "../types";

/**
 * Fetch trending tokens on Solana using the Birdeye public API
 * @returns Promise resolving to the trending tokens data as returned by Birdeye
 */
export default async function getTrendingTokens(): Promise<BirdeyeTrendingTokensResponse> {
  const url =
    "https://public-api.birdeye.so/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=20";
  const apiKey = process.env.BDS_API_KEY || process.env.NEXT_PUBLIC_BDS_API_KEY;

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
    return data;
  } catch (error: any) {
    throw new Error(`Trending tokens fetch failed: ${error.message}`);
  }
}
