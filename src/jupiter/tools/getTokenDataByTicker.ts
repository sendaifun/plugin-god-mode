import { SolanaAgentKit } from "solana-agent-kit";
import type { JupiterTokenData } from "../types";
import { setCacheValue, getCacheValue } from "../../helpers/cache";

/**
 * Fetches token data by ticker
 * @param ticker of the token
 */
export default async function fetchPrice(
  _agent: SolanaAgentKit,
  ticker: string,
): Promise<JupiterTokenData> {
  try {
    // Create a cache key based on the ticker
    const cacheKey = `jupiter_token_data_${ticker.toLowerCase()}`;

    // Check if data is cached
    const cachedData = await getCacheValue(_agent, cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(
      "https://api.jup.ag/tokens/v1/tagged/verified",
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': _agent.config.OTHER_API_KEYS?.JUPITER_API_KEY || "",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch price: ${response.statusText}`);
    }

    const data: JupiterTokenData[] = await response.json();

    const tokenData = data
      // sort in decreasing daily volume
      .toSorted((a, b) => (b.daily_volume ?? 0) - (a.daily_volume ?? 0))
      .find(
        (token: JupiterTokenData) =>
          token?.symbol?.toLowerCase() === ticker?.toLowerCase(),
      );

    if (!tokenData) {
      throw new Error("Token data not available for the given ticker.");
    }

    // Cache the result for 10 minutes
    await setCacheValue(_agent, cacheKey, tokenData, 10 * 60);

    return tokenData;
  } catch (e: any) {
    throw new Error(`Token fetch failed: ${e.message}`);
  }
}
