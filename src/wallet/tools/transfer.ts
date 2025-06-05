import { type PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import type { SolanaAgentKit } from "solana-agent-kit";

/**
 * Transfer SOL to a recipient
 * @param agent SolanaAgentKit instance
 * @param to Recipient's public key
 * @param amount Amount to transfer
 * @returns Transaction signature
 */
export default async function transfer(
  agent: SolanaAgentKit,
  to: PublicKey,
  amount: number,
) {
  try {

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: agent.wallet.publicKey,
        toPubkey: to,
        lamports: amount * LAMPORTS_PER_SOL,
      }),
    );

    const { blockhash } = await agent.connection.getLatestBlockhash({
      commitment: "confirmed",
    });
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = agent.wallet.publicKey;

    const tx = await agent.wallet.signAndSendTransaction(transaction , {
      skipPreflight: true,
    });

    return tx;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Transfer failed: ${error.message}`);
  }
}
