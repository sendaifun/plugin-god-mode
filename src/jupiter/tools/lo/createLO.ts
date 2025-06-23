import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { type SolanaAgentKit } from "solana-agent-kit";

export interface LOParams {
  makingAmount: string; // Amount of input token to sell (in raw token units)
  takingAmount: string; // Amount of output token to receive (in raw token units)
  slippageBps?: number; // Optional slippage in basis points
  expiredAt?: number; // Optional expiry time in unix seconds
  feeBps?: number; // Optional fee in basis points
}

export interface JupiterLOCreateOrderResponse {
  status: string;
  requestId?: string;
  transaction?: string;
  error?: string;
}

export interface JupiterLOExecuteResponse {
  status: string;
  signature?: string;
  error?: string;
}

/**
 * Create a Limit Order on Jupiter
 * @param agent SolanaAgentKit instance
 * @param inputMint Input token mint address
 * @param outputMint Output token mint address
 * @param params Limit order parameters including making/taking amounts
 * @returns Transaction signature or throws error
 */
export default async function createLO(
  agent: SolanaAgentKit,
  inputMint: PublicKey,
  outputMint: PublicKey,
  params: LOParams,
): Promise<string> {
  try {
    // Step 1: Create the limit order and get transaction to sign
    const createOrderResponse: JupiterLOCreateOrderResponse = await (
      await fetch('https://api.jup.ag/trigger/v1/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputMint: inputMint.toString(),
          outputMint: outputMint.toString(),
          maker: agent.wallet.publicKey.toString(),
          payer: agent.wallet.publicKey.toString(),
          params: {
            makingAmount: params.makingAmount,
            takingAmount: params.takingAmount,
            ...(params.slippageBps && { slippageBps: params.slippageBps.toString() }),
            ...(params.expiredAt && { expiredAt: params.expiredAt.toString() }),
            ...(params.feeBps && { feeBps: params.feeBps.toString() }),
          },
          computeUnitPrice: "auto",
          wrapAndUnwrapSol: true,
        }),
      })
    ).json();

    if (createOrderResponse.status !== "Success" || !createOrderResponse.requestId || !createOrderResponse.transaction) {
      throw new Error(`Limit order creation failed: ${createOrderResponse.error || 'Unknown error'}`);
    }

    const requestId = createOrderResponse.requestId;
    const loTransaction = createOrderResponse.transaction;

    // Step 2: Sign the transaction
    const loTransactionBuffer = Buffer.from(loTransaction, "base64");
    const transaction = VersionedTransaction.deserialize(loTransactionBuffer);
    const tx = await agent.wallet.signTransaction(transaction);
    const signedTx = Buffer.from(tx.serialize()).toString("base64");

    // Step 3: Execute the signed transaction
    const executeResponse: JupiterLOExecuteResponse = await (
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
      throw new Error(`Limit order execution failed: ${executeResponse.error || 'Unknown error'}`);
    }
  } catch (error) {
    throw new Error(`Failed to create limit order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
