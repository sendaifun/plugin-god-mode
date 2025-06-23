import { VersionedTransaction } from "@solana/web3.js";
import { type SolanaAgentKit } from "solana-agent-kit";

export interface JupiterLOCancelOrderResponse {
  status: string;
  requestId?: string;
  transaction?: string;
  error?: string;
}

export interface JupiterLOCancelExecuteResponse {
  status: string;
  signature?: string;
  error?: string;
}

/**
 * Cancel a Limit Order on Jupiter
 * @param agent SolanaAgentKit instance
 * @param orderId The ID of the limit order to cancel
 * @returns Transaction signature or throws error
 */
export default async function cancelLO(
  agent: SolanaAgentKit,
  orderId: string,
): Promise<string> {
  try {
    // Step 1: Cancel the limit order and get transaction to sign
    const cancelOrderResponse: JupiterLOCancelOrderResponse = await (
      await fetch('https://lite-api.jup.ag/trigger/v1/cancelOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maker: agent.wallet.publicKey.toString(),
          computeUnitPrice: "auto",
          order: orderId,
        }),
      })
    ).json();

    if (cancelOrderResponse.status !== "Success" || !cancelOrderResponse.requestId || !cancelOrderResponse.transaction) {
      throw new Error(`Limit order cancellation failed: ${cancelOrderResponse.error || 'Unknown error'}`);
    }

    const requestId = cancelOrderResponse.requestId;
    const cancelTransaction = cancelOrderResponse.transaction;

    // Step 2: Sign the transaction
    const cancelTransactionBuffer = Buffer.from(cancelTransaction, "base64");
    const transaction = VersionedTransaction.deserialize(cancelTransactionBuffer);
    const tx = await agent.wallet.signTransaction(transaction);
    const signedTx = Buffer.from(tx.serialize()).toString("base64");

    // Step 3: Execute the signed transaction
    const executeResponse: JupiterLOCancelExecuteResponse = await (
      await fetch('https://lite-api.jup.ag/trigger/v1/execute', {
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
      throw new Error(`Limit order cancellation execution failed: ${executeResponse.error || 'Unknown error'}`);
    }
  } catch (error) {
    throw new Error(`Failed to cancel limit order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
