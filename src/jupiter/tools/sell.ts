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
import { executeTitanSwap } from "./titan";

/**
 * Sell tokens for SOL with Titan as primary and Jupiter as fallback
 * @param agent SolanaAgentKit instance
 * @param inputAmount Amount to swap (in token decimals)
 * @param inputMint Source token mint address
 * @returns Transaction signature
 */
export default async function sell(
  agent: SolanaAgentKit,
  inputAmount: number,
  inputMint: PublicKey,
) {
  const inputDecimals = (await getMint(agent.connection, inputMint)).decimals;
  const scaledAmount = inputAmount * Math.pow(10, inputDecimals);

  // Try Titan first
  const titanApiKey = agent.config.OTHER_API_KEYS?.TITAN_API_KEY;
  if (titanApiKey) {
    try {
      console.log("Attempting sell via Titan...");
      
      const titanResult = await executeTitanSwap({
        inputMint: inputMint.toString(),
        outputMint: TOKENS.SOL.toString(),
        amount: scaledAmount,
        userPublicKey: agent.wallet.publicKey.toString(),
        slippageBps: 300, // 3% slippage
      }, titanApiKey);

      if (titanResult.success && titanResult.transaction) {
        console.log("Titan sell successful, executing transaction...");
        
        // Deserialize the transaction
        const transaction = VersionedTransaction.deserialize(titanResult.transaction);
        
        // Get a fresh blockhash
        console.log("🔄 Getting fresh blockhash...");
        const { blockhash } = await agent.connection.getLatestBlockhash('confirmed');
        
        // Update the transaction with the fresh blockhash
        transaction.message.recentBlockhash = blockhash;
        
        // Sign the transaction
        const signedTx = await agent.wallet.signTransaction(transaction);
        
        // Send the transaction
        const signature = await agent.connection.sendTransaction(signedTx, {
          maxRetries: 3,
          preflightCommitment: 'confirmed',
        });
        
        console.log(`Titan sell completed with signature: ${signature}`);
        return signature;
      } else {
        console.log(`Titan sell failed: ${titanResult.error}, falling back to Jupiter...`);
      }
    } catch (error) {
      console.log(`Titan sell error: ${error instanceof Error ? error.message : 'Unknown error'}, falling back to Jupiter...`);
    }
  } else {
    console.log("Titan API key not found, using Jupiter...");
  }

  // Fallback to Jupiter
  console.log("Executing sell via Jupiter...");
  
  const response = await fetch(
    `${JUP_ULTRA_API}/order?` +
      `inputMint=${inputMint.toString()}` +
      `&outputMint=${TOKENS.SOL.toString()}` +
      `&amount=${scaledAmount}` +
      `&taker=${agent.wallet.publicKey.toString()}`  + 
      `&referralAccount=${JUP_REFERRAL_ADDRESS}` + 
      `&referralFee=100`,
      {
        headers: {
          'x-api-key': agent.config.OTHER_API_KEYS?.JUPITER_API_KEY || "",
        },
      }
  );

  // if jup api throws 400, then route not found error
  if (response.status === 400) {
    throw new Error("Route not found");
  }

  const orderResponse: JupiterUltraOrderResponse = await response.json();

  // Check for insufficient funds error
  if (orderResponse.errorMessage === "Taker has insufficient input") {
    throw new Error("You have insufficient funds");
  } else if (orderResponse.errorMessage) {
    throw new Error(orderResponse.errorMessage);
  }

  const requestId = orderResponse.requestId;
  const swapTransaction = orderResponse.transaction;

  if (!swapTransaction) {
    throw new Error("Swap transaction not found");
  }

  const swapTransactionBuffer = Buffer.from(swapTransaction, "base64");
  const transaction = VersionedTransaction.deserialize(swapTransactionBuffer);
  const tx = await agent.wallet.signTransaction(transaction);
  const signedTx = Buffer.from(tx.serialize()).toString("base64");

  // Execute the signed transaction via Jupiter Ultra API
  const executeResponse = await (
    await fetch(`${JUP_ULTRA_API}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signedTransaction: signedTx,
        requestId: requestId,
      }),
    })
  ).json();

  if (executeResponse.status === "Success") {
    console.log(`Jupiter sell completed with signature: ${executeResponse.signature}`);
    return executeResponse.signature;
  } else {
    throw new Error(`Swap failed: ${executeResponse.error}`);
  }
}
