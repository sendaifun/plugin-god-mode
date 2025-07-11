import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { type PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { type SolanaAgentKit, signOrSendTX } from "solana-agent-kit";
import getMintInfo from "../../helpers/token/getMint";

/**
 * Transfer SOL or SPL tokens to a recipient
 * @param agent SolanaAgentKit instance
 * @param to Recipient's public key
 * @param amount Amount to transfer
 * @param mint Optional mint address for SPL tokens
 * @returns Transaction signature
 */
export default async function transfer_spl(
  agent: SolanaAgentKit,
  to: PublicKey,
  amount: number,
  mint: PublicKey,
) {
  try {

    const transaction = new Transaction();
    
    // Get mint info to determine if it's a Token-2022 mint
    const mintInfo = await getMintInfo(agent, mint);
    const isToken2022 = mintInfo.standard === "token-2022";
    const tokenProgramId = isToken2022 ? TOKEN_2022_PROGRAM_ID : undefined;
    
    // Transfer SPL token
    const fromAta = await getAssociatedTokenAddress(
      mint,
      agent.wallet.publicKey,
      false,
      tokenProgramId,
    );
    const toAta = await getAssociatedTokenAddress(
      mint, 
      to,
      false,
      tokenProgramId,
    );

    try {
      await getAccount(agent.connection, toAta, "confirmed", tokenProgramId);
    } catch {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          agent.wallet.publicKey,
          toAta,
          to,
          mint,
          tokenProgramId,
        ),
      );
    }

    // Use the mint info we already retrieved
    const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);

    transaction.add(
      createTransferInstruction(
        fromAta,
        toAta,
        agent.wallet.publicKey,
        adjustedAmount,
        [],
        tokenProgramId,
      ),
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
    throw new Error(`Transfer failed: ${error.message}`);
  }
}
