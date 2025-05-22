import type { BirdeyeTokenOverviewResponse } from "../types";

/**
 * Fetch token overview for a given mint address using the Birdeye public API
 * @param address The mint address of the token
 * @returns Promise resolving to the token overview data as returned by Birdeye
 */
export default async function getToken(address: string): Promise<BirdeyeTokenOverviewResponse> {
  const url = `https://public-api.birdeye.so/defi/token_overview?address=${address}`;
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
      throw new Error(`Failed to fetch token overview: ${response.statusText}`);
    }

    const data: BirdeyeTokenOverviewResponse = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(`Token overview fetch failed: ${error.message}`);
  }
}
