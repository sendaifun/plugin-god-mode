import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";
import { type PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { type SolanaAgentKit, signOrSendTX } from "solana-agent-kit";

/**
 * Transfer SOL or SPL tokens to a recipient
 * @param agent SolanaAgentKit instance
 * @param to Recipient's public key
 * @param amount Amount to transfer
 * @param mint Optional mint address for SPL tokens
 * @returns Transaction signature
 */
export async function transfer_spl(
  agent: SolanaAgentKit,
  to: PublicKey,
  amount: number,
  mint: PublicKey,
) {
  try {

    const transaction = new Transaction();
    // Transfer SPL token
    const fromAta = await getAssociatedTokenAddress(
      mint,
      agent.wallet.publicKey,
    );
    const toAta = await getAssociatedTokenAddress(mint, to);

    try {
      await getAccount(agent.connection, toAta);
    } catch {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          agent.wallet.publicKey,
          toAta,
          to,
          mint,
        ),
      );
    }

    // Get mint info to determine decimals
    const mintInfo = await getMint(agent.connection, mint);
    const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);

    transaction.add(
      createTransferInstruction(
        fromAta,
        toAta,
        agent.wallet.publicKey,
        adjustedAmount,
      ),
    );

    const { blockhash } = await agent.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    const tx = await agent.wallet.signAndSendTransaction(transaction);

    return tx;
  } catch (error: any) {
    throw new Error(`Transfer failed: ${error.message}`);
  }
}
