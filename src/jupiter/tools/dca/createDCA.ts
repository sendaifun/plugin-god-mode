import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { type SolanaAgentKit } from "solana-agent-kit";
import getMintInfo from "../../../helpers/token/getMint";
import { clearCacheValue } from "../../../helpers/cache";

export interface JupiterDCACreateOrderResponse {
  // Success response
  requestId?: string;
  transaction?: string;
  // Error response
  code?: number;
  error?: string;
  status?: string;
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
 * @param params DCA parameters object
 * @param params.inputAmountAllocated input token to deposit now with decimals
 * @param params.everyTime Time between each order in unix seconds
 * @param params.everyUnit Time between each order in unix seconds
 * @param params.overOrders Total number of orders to execute
 * @param params.minPrice Optional minimum price threshold (null for no limit)
 * @param params.maxPrice Optional maximum price threshold (null for no limit)
 * @returns Transaction signature or throws error
 */
export default async function createDCA(
  agent: SolanaAgentKit,
  inputMint: PublicKey,
  outputMint: PublicKey,
  inputAmountAllocated: number,
  everyTime: number,
  everyUnit: "minute" | "hour" | "day" | "week" | "month", 
  overOrders: number,
  minPrice: number | null,
  maxPrice: number | null
): Promise<string> {
  try {

    const tokenMint = await getMintInfo(agent, inputMint);
    const inputDecimals = tokenMint.decimals;
    const inputAmountAllocatedDecimals = inputAmountAllocated * Math.pow(10, inputDecimals);

    // Convert the time unit to unix seconds
    const everyAmount = everyTime * (everyUnit === "minute" ? 60 : everyUnit === "hour" ? 3600 : everyUnit === "day" ? 86400 : everyUnit === "week" ? 604800 : 2592000);

    // Step 1: Create the DCA order and get transaction to sign
    const createOrderResponse: JupiterDCACreateOrderResponse = await (
      await fetch('https://api.jup.ag/recurring/v1/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': agent.config.OTHER_API_KEYS?.JUPITER_API_KEY || "",
        },
        body: JSON.stringify({
          user: agent.wallet.publicKey.toString(),
          inputMint: inputMint.toString(),
          outputMint: outputMint.toString(),
          params: {
            time: {
              inAmount: inputAmountAllocatedDecimals,
              numberOfOrders: overOrders,
              interval: everyAmount,
              minPrice: minPrice || null,
              maxPrice: maxPrice || null,
              startAt: null,
            },
          },
        }),
      })
    ).json();

    // Check if this is an error response (has code and error fields)
    if (createOrderResponse.code || createOrderResponse.error) {
      throw new Error(`DCA order creation failed: ${createOrderResponse.error || 'Unknown error'}`);
    }

    // Check if this is a successful response (has requestId and transaction)
    if (!createOrderResponse.requestId || !createOrderResponse.transaction) {
      throw new Error(`DCA order creation failed: Missing requestId or transaction in response`);
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
      await clearCacheValue(agent, `jupiter_dca_${agent.wallet.publicKey.toBase58()}`);
      return executeResponse.signature;
    } else {
      throw new Error(`DCA order execution failed: ${executeResponse.error || 'Unknown error'}`);
    }
  } catch (error) {
    throw new Error(`Failed to create DCA order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
