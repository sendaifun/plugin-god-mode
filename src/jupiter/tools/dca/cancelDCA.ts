import { VersionedTransaction } from "@solana/web3.js";
import { type SolanaAgentKit } from "solana-agent-kit";

// Success response format
export interface JupiterDCACancelOrderSuccessResponse {
  requestId: string;
  transaction: string;
}

// Error response format
export interface JupiterDCACancelOrderErrorResponse {
  code: number;
  error: string;
  status: string;
}

export interface JupiterDCACancelExecuteResponse {
  status: string;
  signature?: string;
  error?: string;
}

/**
 * Cancel a DCA (Dollar Cost Averaging) order on Jupiter
 * @param agent SolanaAgentKit instance
 * @param orderId The ID of the DCA order to cancel
 * @returns Transaction signature or throws error
 */
export default async function cancelDCA(
  agent: SolanaAgentKit,
  orderId: string,
): Promise<string> {
  try {
    // Step 1: Cancel the DCA order and get transaction to sign
    const cancelOrderResponse: JupiterDCACancelOrderSuccessResponse | JupiterDCACancelOrderErrorResponse = await (
      await fetch('https://api.jup.ag/recurring/v1/cancelOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': agent.config.OTHER_API_KEYS?.JUPITER_API_KEY || "",
        },
        body: JSON.stringify({
          order: orderId,
          user: agent.wallet.publicKey.toString(),
          recurringType: "time",
        }),
      })
    ).json();

    // Check if the response is an error response
    if ('code' in cancelOrderResponse && 'error' in cancelOrderResponse) {
      throw new Error(`DCA order cancellation failed: ${cancelOrderResponse.error}`);
    }

    // Check if the response is a success response with required fields
    if (!('requestId' in cancelOrderResponse) || !('transaction' in cancelOrderResponse)) {
      throw new Error('DCA order cancellation failed: Invalid response format');
    }

    const requestId = cancelOrderResponse.requestId;
    const cancelTransaction = cancelOrderResponse.transaction;

    // Step 2: Sign the transaction
    const cancelTransactionBuffer = Buffer.from(cancelTransaction, "base64");
    const transaction = VersionedTransaction.deserialize(cancelTransactionBuffer);
    const tx = await agent.wallet.signTransaction(transaction);
    const signedTx = Buffer.from(tx.serialize()).toString("base64");

    // Step 3: Execute the signed transaction
    const executeResponse: JupiterDCACancelExecuteResponse = await (
      await fetch('https://api.jup.ag/recurring/v1/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': agent.config.OTHER_API_KEYS?.JUPITER_API_KEY || "",
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
      throw new Error(`DCA order cancellation execution failed: ${executeResponse.error || 'Unknown error'}`);
    }
  } catch (error) {
    throw new Error(`Failed to cancel DCA order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
