import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { type SolanaAgentKit, signOrSendTX } from "solana-agent-kit";

/**
 * Initiate a withdraw for tokens for yields using Lulo
 * @param agent SolanaAgentKit instance
 * @param mintAddress SPL Mint address
 * @param amount Amount to withdraw
 * @returns Transaction signature
 */
export default async function initiateLuloWithdraw(
  agent: SolanaAgentKit,
  amount: number,
) {
  try {
    const USDC = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
    const owner = agent.wallet.publicKey.toBase58();
    const feePayer = owner;
    const response = await fetch(
      "https://api.lulo.fi/v1/generate.transactions.initiateRegularWithdraw",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.LULO_API_KEY!,
        },
        body: JSON.stringify({
          owner,
          feePayer,
          mintAddress: USDC.toString(),
          amount,
        }),
      },
    );

    const { transaction } = await response.json();

    // Deserialize the transaction
    const luloTxn = VersionedTransaction.deserialize(
      Buffer.from(transaction, "base64"),
    );

    // Get a recent blockhash and set it
    const { blockhash } = await agent.connection.getLatestBlockhash();
    luloTxn.message.recentBlockhash = blockhash;

    return signOrSendTX(agent, luloTxn);
  } catch (error: any) {
    throw new Error(`Withdraw failed: ${error.message}`);
  }
}
