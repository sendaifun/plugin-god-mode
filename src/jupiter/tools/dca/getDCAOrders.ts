import { type SolanaAgentKit } from "solana-agent-kit";

export interface DCAOrder {
  id: string;
  user: string;
  inputMint: string;
  outputMint: string;
  inAmount: number;
  numberOfOrders: number;
  interval: number;
  minPrice?: number | null;
  maxPrice?: number | null;
  startAt?: number | null;
  createdAt: number;
  status: string;
  ordersExecuted: number;
  nextExecutionAt?: number | null;
}

export interface JupiterDCAOrdersResponse {
  status: string;
  orders?: DCAOrder[];
  error?: string;
}

/**
 * Get active DCA orders for the user
 * @param agent SolanaAgentKit instance
 * @returns Array of active DCA orders or throws error
 */
export default async function getDCAOrders(
  agent: SolanaAgentKit,
): Promise<DCAOrder[]> {
  try {
    const openOrdersResponse: JupiterDCAOrdersResponse = await (
      await fetch(
        `https://lite-api.jup.ag/recurring/v1/getRecurringOrders?user=${agent.wallet.publicKey.toString()}&orderStatus=active&recurringType=time`
      )
    ).json();

    if (openOrdersResponse.status === "Success" && openOrdersResponse.orders) {
      return openOrdersResponse.orders;
    } else if (openOrdersResponse.status === "Success" && !openOrdersResponse.orders) {
      // No orders found is still a success case
      return [];
    } else {
      throw new Error(`Failed to fetch DCA orders: ${openOrdersResponse.error || 'Unknown error'}`);
    }
  } catch (error) {
    throw new Error(`Failed to get DCA orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
