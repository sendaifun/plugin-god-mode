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
import getMintInfo from "src/helpers/token/getMint";

/**
 * Sell tokens using Jupiter Exchange
 * @param agent SolanaAgentKit instance
 * @param inputAmount Amount to swap (in token decimals)
 * @param inputMint Source token mint address (defaults to USDC)
 * @returns Transaction signature
 */

export default async function sell(
  agent: SolanaAgentKit,
  inputAmount: number,
  inputMint: PublicKey,
) {
  const inputDecimals = (await getMintInfo(agent, inputMint)).decimals;
  const scaledAmount = inputAmount * Math.pow(10, inputDecimals);

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
        "x-api-key": agent.config.OTHER_API_KEYS?.JUPITER_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signedTransaction: signedTx,
        requestId: requestId,
      }),
    })
  ).json();

  if (executeResponse.status === "Success") {
    return executeResponse.signature;
  } else {
    throw new Error(`Swap failed: ${executeResponse.error}`);
  }
}
