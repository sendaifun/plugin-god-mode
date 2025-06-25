import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { type SolanaAgentKit } from "solana-agent-kit";
import getMintInfo from "../../../helpers/token/getMint";

export interface LOParams {
  makingAmount: string; // Amount of input token to sell (in raw token units)
  takingAmount: string; // Amount of output token to receive (in raw token units)
  slippageBps?: number; // Optional slippage in basis points
  expiredAt?: number; // Optional expiry time in unix seconds
  feeBps?: number; // Optional fee in basis points
}

export interface JupiterLOCreateOrderResponse {
  // Success response fields
  order?: string;
  transaction?: string;
  requestId?: string;
  // Error response fields
  error?: string;
  cause?: string;
  code?: number;
}

export interface JupiterLOExecuteResponse {
  status: string;
  signature?: string;
  error?: string;
  code?: number;
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
  makingAmount: number,
  takingAmount: number,
  expiryAt?: "10m" | "1h" | "1d" | "3d" | "7d" | "30d",
): Promise<string> {
  try {

    const expiredAt = expiryAt === "10m" ? 600 : expiryAt === "1h" ? 3600 : expiryAt === "1d" ? 86400 : expiryAt === "3d" ? 259200 : expiryAt === "7d" ? 604800 : null; // null -> never expires


    const inputMintInfo = await getMintInfo(agent, inputMint);
    const outputMintInfo = await getMintInfo(agent, outputMint);
    const inputDecimals = inputMintInfo.decimals;
    const outputDecimals = outputMintInfo.decimals;
    const makingAmountDecimals = (makingAmount * Math.pow(10, inputDecimals)).toFixed(0);
    const takingAmountDecimals = (takingAmount * Math.pow(10, outputDecimals)).toFixed(0);

    // Step 1: Create the limit order and get transaction to sign
    const createOrderResponse: JupiterLOCreateOrderResponse = await (
      await fetch('https://api.jup.ag/trigger/v1/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': agent.config.OTHER_API_KEYS?.JUPITER_API_KEY || "",
        },
        body: JSON.stringify({
          inputMint: inputMint.toString(),
          outputMint: outputMint.toString(),
          maker: agent.wallet.publicKey.toString(),
          payer: agent.wallet.publicKey.toString(),
          params: {
            makingAmount: makingAmountDecimals.toString(),
            takingAmount: takingAmountDecimals.toString(),  
            ...(expiredAt && { expiredAt: (Date.now() + expiredAt * 1000).toString() }),
          },
          computeUnitPrice: "auto",
          wrapAndUnwrapSol: true,
        }),
      })
    ).json();

    // Check for error response
    if (createOrderResponse.error) {
      throw new Error(`Limit order creation failed: ${createOrderResponse.error}${createOrderResponse.cause ? ` - ${createOrderResponse.cause}` : ''}`);
    }

    // Check for successful response
    if (!createOrderResponse.requestId || !createOrderResponse.transaction) {
      throw new Error('Limit order creation failed: Missing requestId or transaction in response');
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
      await fetch('https://api.jup.ag/trigger/v1/execute', {
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
      const errorMessage = executeResponse.error || `Execution failed with status: ${executeResponse.status}`;
      throw new Error(`Limit order execution failed: ${errorMessage}`);
    }
  } catch (error) {
    throw new Error(`Failed to create limit order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
