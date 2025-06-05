import { SolanaAgentKit } from "solana-agent-kit";
import type { BirdeyeTokenOverviewResponse } from "../types";

/**
 * Fetch token overview for a given mint address using the Birdeye public API
 * @param address The mint address of the token
 * @returns Promise resolving to the token overview data as returned by Birdeye
 */
export default async function getToken(agent: SolanaAgentKit, address: string): Promise<any> {
  const url = `https://public-api.birdeye.so/defi/token_overview?address=${address}`;
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
      throw new Error(`Failed to fetch token overview: ${response.statusText}`);
    }

    const { data }: BirdeyeTokenOverviewResponse = await response.json();

    const formattedData = {
      name: data.name,
      decimals: data.decimals,
      symbol: data.symbol,
      address: data.marketCap,
      marketCap: data.marketCap,
      fdv: data.fdv,
      price: data.price,
      holder: data.holder,
      website: data.extensions?.website,
      twitter: data.extensions?.twitter,
      image: data.logoURI,
      liquidity: data.liquidity,
      priceChange: {
        "1 minute": data.priceChange1mPercent,
        "1 hour": data.priceChange1hPercent,
        "6 hours": data.priceChange6hPercent,
        "30 minutes": data.priceChange30mPercent,
        "12 hours": data.priceChange12hPercent,
        "24 hours": data.priceChange24hPercent,
      }
    };

    return formattedData;
  } catch (error: any) {
    throw new Error(`Token overview fetch failed: ${error.message}`);
  }
}
