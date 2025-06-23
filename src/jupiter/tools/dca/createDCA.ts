import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { type SolanaAgentKit } from "solana-agent-kit";

export interface DCAParams {
  inAmount: number; // Raw amount of input token to deposit now (before decimals)
  numberOfOrders: number; // Total number of orders to execute
  interval: number; // Time between each order in unix seconds
  minPrice?: number | null; // Minimum price or null
  maxPrice?: number | null; // Maximum price or null
  startAt?: number | null; // Unix timestamp of start time or null - null starts immediately
}

export interface JupiterDCACreateOrderResponse {
  status: string;
  requestId?: string;
  transaction?: string;
  error?: string;
}

export interface JupiterDCAExecuteResponse {
  status: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

/**
 * Create a DCA (Dollar Cost Averaging) order on Jupiter
 * @param agent SolanaAgentKit instance
 * @param inputMint Input token mint address
 * @param outputMint Output token mint address
 * @param params DCA parameters including amount, number of orders, interval, etc.
 * @returns Transaction signature or throws error
 */
export default async function createDCA(
  agent: SolanaAgentKit,
  inputMint: PublicKey,
  outputMint: PublicKey,
  params: DCAParams,
): Promise<string> {
  try {
    // Step 1: Create the DCA order and get transaction to sign
    const createOrderResponse: JupiterDCACreateOrderResponse = await (
      await fetch('https://lite-api.jup.ag/recurring/v1/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: agent.wallet.publicKey.toString(),
          inputMint: inputMint.toString(),
          outputMint: outputMint.toString(),
          params: {
            time: {
              inAmount: params.inAmount,
              numberOfOrders: params.numberOfOrders,
              interval: params.interval,
              minPrice: params.minPrice || null,
              maxPrice: params.maxPrice || null,
              startAt: params.startAt || null,
            },
          },
        }),
      })
    ).json();

    if (createOrderResponse.status !== "Success" || !createOrderResponse.requestId || !createOrderResponse.transaction) {
      throw new Error(`DCA order creation failed: ${createOrderResponse.error || 'Unknown error'}`);
    }

    const requestId = createOrderResponse.requestId;
    const dcaTransaction = createOrderResponse.transaction;

    // Step 2: Sign the transaction
    const dcaTransactionBuffer = Buffer.from(dcaTransaction, "base64");
    const transaction = VersionedTransaction.deserialize(dcaTransactionBuffer);
    const tx = await agent.wallet.signTransaction(transaction);
    const signedTx = Buffer.from(tx.serialize()).toString("base64");

    // Step 3: Execute the signed transaction
    const executeResponse: JupiterDCAExecuteResponse = await (
      await fetch('https://lite-api.jup.ag/recurring/v1/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signedTransaction: signedTx,
          requestId: requestId,
        }),
      })
    ).json();

    if (executeResponse.status === "Success" && executeResponse.signature) {
      return executeResponse.signature;
    } else {
      throw new Error(`DCA order execution failed: ${executeResponse.error || 'Unknown error'}`);
    }
  } catch (error) {
    throw new Error(`Failed to create DCA order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
