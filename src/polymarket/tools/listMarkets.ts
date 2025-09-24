import { SolanaAgentKit } from "solana-agent-kit";
import { POLYMARKET_GAMMA_API_BASE_URL, ENDPOINTS, DEFAULT_LIMIT, MAX_LIMIT } from "../constants";
import { ListMarketsParams, ListMarketsResponse } from "../types";

/**
 * List markets from Polymarket with configurable filters
 * @param agent SolanaAgentKit instance
 * @param params Query parameters for filtering markets
 * @returns Array of markets
 */
export default async function listMarkets(
  agent: SolanaAgentKit,
  params: ListMarketsParams = {}
): Promise<ListMarketsResponse> {
  // Set default values
  const {
    limit = DEFAULT_LIMIT,
    offset = 0,
    order = "volume_num",
    ascending = false,
    ...otherParams
  } = params;

  // Validate limit
  const validatedLimit = Math.min(Math.max(limit, 1), MAX_LIMIT);

  // Build query parameters
  const queryParams = new URLSearchParams();
  
  // Add pagination
  queryParams.append('limit', validatedLimit.toString());
  queryParams.append('offset', offset.toString());
  
  // Add sorting
  queryParams.append('order', order);
  queryParams.append('ascending', ascending.toString());

  // Add other parameters if provided
  Object.entries(otherParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        // Handle array parameters
        value.forEach(item => queryParams.append(key, item.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  try {
    const response = await fetch(
      `${POLYMARKET_GAMMA_API_BASE_URL}${ENDPOINTS.MARKETS}?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status} ${response.statusText}`);
    }

    const markets: ListMarketsResponse = await response.json();
    return markets;
  } catch (error) {
    throw new Error(`Failed to fetch markets: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
