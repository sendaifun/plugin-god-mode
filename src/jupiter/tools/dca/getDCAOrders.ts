import { type SolanaAgentKit } from "solana-agent-kit";

export interface DCATradeRecord {
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

export interface DCAOrder {
  userPubkey: string;
  orderKey: string;
  inputMint: string;
  outputMint: string;
  inDeposited: string;
  inWithdrawn: string;
  rawInDeposited: string;
  rawInWithdrawn: string;
  cycleFrequency: string;
  outWithdrawn: string;
  inAmountPerCycle: string;
  minOutAmount: string;
  maxOutAmount: string;
  inUsed: string;
  outReceived: string;
  rawOutWithdrawn: string;
  rawInAmountPerCycle: string;
  rawMinOutAmount: string;
  rawMaxOutAmount: string;
  rawInUsed: string;
  rawOutReceived: string;
  openTx: string;
  closeTx?: string;
  userClosed: boolean;
  createdAt: string;
  updatedAt: string;
  trades: DCATradeRecord[];
}

export interface JupiterDCAOrdersResponse {
  user: string;
  orderStatus: string;
  time: DCAOrder[];
  totalPages: number;
  totalItems: number;
  page: number;
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
        `https://api.jup.ag/recurring/v1/getRecurringOrders?user=${agent.wallet.publicKey.toString()}&orderStatus=active&recurringType=time&includeFailedTx=false`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': agent.config.OTHER_API_KEYS?.JUPITER_API_KEY || "",
          },
        }
      )
    ).json();

    // The response always includes a time array, even if empty
    return openOrdersResponse.time || [];
  } catch (error) {
    throw new Error(`Failed to get DCA orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
