import { getMint } from "@solana/spl-token";
import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { type SolanaAgentKit, signOrSendTX } from "solana-agent-kit";
import {
  JUP_ULTRA_API,
  JUP_API,
  JUP_REFERRAL_ADDRESS,
  TOKENS,
} from "./utils/constants";
import { type JupiterUltraOrderResponse } from "../types";

/**
 * Sell tokens using Jupiter Exchange
 * @param agent SolanaAgentKit instance
 * @param inputAmount Amount to swap (in token decimals)
 * @param inputMint Source token mint address (defaults to USDC)
 * @returns Transaction signature
 */

export async function sell(
  agent: SolanaAgentKit,
  inputAmount: number,
  inputMint: PublicKey,
) {
  try {
    const inputDecimals = (await getMint(agent.connection, inputMint)).decimals;
    const scaledAmount = inputAmount * Math.pow(10, inputDecimals);

    const orderResponse: JupiterUltraOrderResponse = await (
      await fetch(
        `${JUP_ULTRA_API}/order?` +
          `inputMint=${inputMint.toString()}` +
          `&outputMint=${TOKENS.SOL.toString()}` +
          `&amount=${scaledAmount}` +
          `&taker=${agent.wallet.publicKey.toString()}` 
      )
    ).json();

    const requestId = orderResponse.requestId;
    const swapTransaction = orderResponse.transaction;

    const swapTransactionBuffer = Buffer.from(swapTransaction, "base64");
    const transaction = VersionedTransaction.deserialize(swapTransactionBuffer);
    const tx = await agent.wallet.signTransaction(transaction);
    const signedTx = Buffer.from(tx.serialize()).toString('base64');

    // Execute the signed transaction via Jupiter Ultra API
    const executeResponse = await (
      await fetch(`${JUP_ULTRA_API}/execute`, {
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

    if (executeResponse.status === "Success") {
      console.log('Swap successful:', JSON.stringify(executeResponse, null, 2));
      console.log(`https://solscan.io/tx/${executeResponse.signature}`);
    } else {
      console.error('Swap failed:', JSON.stringify(executeResponse, null, 2));
      console.log(`https://solscan.io/tx/${executeResponse.signature}`);
    }

    return executeResponse;
  } catch (error: any) {
    throw new Error(`Swap failed: ${error.message}`);
  }
}
