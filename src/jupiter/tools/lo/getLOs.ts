import { type SolanaAgentKit } from "solana-agent-kit";

export interface LimitOrder {
  id: string;
  maker: string;
  inputMint: string;
  outputMint: string;
  makingAmount: string;
  takingAmount: string;
  status: string;
  createdAt: number;
  expiredAt?: number | null;
  feeBps?: number | null;
  slippageBps?: number | null;
  filledMakingAmount?: string;
  filledTakingAmount?: string;
}

export interface JupiterLOOrdersResponse {
  status: string;
  orders?: LimitOrder[];
  error?: string;
}

/**
 * Get active limit orders for the user
 * @param agent SolanaAgentKit instance
 * @returns Array of active limit orders or throws error
 */
export default async function getLOs(
  agent: SolanaAgentKit,
): Promise<LimitOrder[]> {
  try {
    const openOrdersResponse: JupiterLOOrdersResponse = await (
      await fetch(
        `https://lite-api.jup.ag/trigger/v1/getTriggerOrders?user=${agent.wallet.publicKey.toString()}&orderStatus=active`
      )
    ).json();

    if (openOrdersResponse.status === "Success" && openOrdersResponse.orders) {
      return openOrdersResponse.orders;
    } else if (openOrdersResponse.status === "Success" && !openOrdersResponse.orders) {
      // No orders found is still a success case
      return [];
    } else {
      throw new Error(`Failed to fetch limit orders: ${openOrdersResponse.error || 'Unknown error'}`);
    }
  } catch (error) {
    throw new Error(`Failed to get limit orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
