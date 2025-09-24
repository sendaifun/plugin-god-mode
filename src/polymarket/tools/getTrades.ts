import { SolanaAgentKit } from "solana-agent-kit";
import { POLYMARKET_CLOB_API_BASE_URL, ENDPOINTS, DEFAULT_LIMIT } from "../constants";
import { GetTradesParams, GetTradesResponse } from "../types";

/**
 * Get trades from Polymarket with optional filters
 * @param agent SolanaAgentKit instance
 * @param params Query parameters for filtering trades
 * @returns Trades response with data and cursor
 */
export default async function getTrades(
  agent: SolanaAgentKit,
  params: GetTradesParams = {}
): Promise<GetTradesResponse> {
  const {
    limit = DEFAULT_LIMIT,
    ...otherParams
  } = params;

  // Build query parameters
  const queryParams = new URLSearchParams();
  
  // Add limit
  queryParams.append('limit', Math.min(limit, 100).toString());

  // Add other parameters if provided
  Object.entries(otherParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  try {
    const response = await fetch(
      `${POLYMARKET_CLOB_API_BASE_URL}${ENDPOINTS.TRADES}?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Polymarket CLOB API error: ${response.status} ${response.statusText}`);
    }

    const trades: GetTradesResponse = await response.json();
    return trades;
  } catch (error) {
    throw new Error(`Failed to fetch trades: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
