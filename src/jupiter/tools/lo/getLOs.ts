import { type SolanaAgentKit } from "solana-agent-kit";
import { setCacheValue, getCacheValue } from "../../../helpers/cache";

export interface Trade {
  orderKey: string;
  keeper: string;
  inputMint: string;
  outputMint: string;
  inputAmount: string;
  outputAmount: string;
  rawInputAmount: string;
  rawOutputAmount: string;
  feeMint: string;
  feeAmount: string;
  rawFeeAmount: string;
  txId: string;
  confirmedAt: string;
  action: string;
  productMeta: any;
}

export interface LimitOrder {
  userPubkey: string;
  orderKey: string;
  inputMint: string;
  outputMint: string;
  makingAmount: string;
  takingAmount: string;
  remainingMakingAmount: string;
  remainingTakingAmount: string;
  rawMakingAmount: string;
  rawTakingAmount: string;
  rawRemainingMakingAmount: string;
  rawRemainingTakingAmount: string;
  slippageBps: string;
  expiredAt: number | null;
  createdAt: string;
  updatedAt: string;
  status: string;
  openTx: string;
  closeTx: string;
  programVersion: string;
  trades: Trade[];
}

export interface JupiterLOOrdersResponse {
  user: string;
  orderStatus: string;
  orders: LimitOrder[];
  totalPages: number;
  page: number;
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
    const cacheKey = `jupiter_lo_${agent.wallet.publicKey.toBase58()}`;
    const cachedData = await getCacheValue(agent, cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const openOrdersResponse: JupiterLOOrdersResponse = await (
      await fetch(
        `https://api.jup.ag/trigger/v1/getTriggerOrders?user=${agent.wallet.publicKey.toString()}&orderStatus=active`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': agent.config.OTHER_API_KEYS?.JUPITER_API_KEY || "",
          },
        }
      )
    ).json();

    if (openOrdersResponse.orders) {
      await setCacheValue(agent, cacheKey, openOrdersResponse.orders, 5 * 60);
      return openOrdersResponse.orders;
    } else {
      // No orders found
      return [];
    }
  } catch (error) {
    throw new Error(`Failed to get limit orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
