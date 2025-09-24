import { SolanaAgentKit } from "solana-agent-kit";
import { POLYMARKET_CLOB_API_BASE_URL } from "../constants";

export interface OrderBookEntry {
  price: string;
  size: string;
}

export interface OrderBookResponse {
  market: string;
  asset_id: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

/**
 * Get order book data for a specific token/market
 * @param agent SolanaAgentKit instance
 * @param tokenId Token ID to get order book for
 * @returns Order book with bids and asks
 */
export default async function getOrderBook(
  agent: SolanaAgentKit,
  tokenId: string
): Promise<OrderBookResponse> {
  if (!tokenId) {
    throw new Error("Token ID is required");
  }

  try {
    const response = await fetch(
      `${POLYMARKET_CLOB_API_BASE_URL}/book?token_id=${tokenId}`,
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

    const orderBook: OrderBookResponse = await response.json();
    return orderBook;
  } catch (error) {
    throw new Error(`Failed to fetch order book: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
