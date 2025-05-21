import { VersionedTransaction, TransactionMessage } from "@solana/web3.js";
import {
  SolanaAgentKit,
} from "solana-agent-kit";
import { REFERRAL_WALLET } from "../../global/constant";
import { PumpSdk } from "@pump-fun/pump-sdk"
import bs58 from "bs58";  

/**
 * Claim creator fee on Pump.fun
 * @param agent - SolanaAgentKit instance
 * @returns - Signature of the transaction, mint address and metadata URI, if successful, else error
 */
export default async function claimCreatorFee(
  agent: SolanaAgentKit,
) {
  try {
    const pumpSdk = new PumpSdk(agent.connection);
    const ix = await pumpSdk.collectCoinCreatorFeeInstructions(REFERRAL_WALLET);

  const { blockhash } = await agent.connection.getLatestBlockhash();

    const messageV0 = new TransactionMessage({
      payerKey: REFERRAL_WALLET,
      recentBlockhash: blockhash,
      instructions: [...ix],
    }).compileToV0Message()

    const tx = new VersionedTransaction(messageV0);

    const serializedTx = tx.serialize()
    const base64Tx = Buffer.from(serializedTx).toString('base64');
    const encodedTx = bs58.encode(serializedTx);
    console.log('base64 encoded transaction:', base64Tx);
    console.log('bs58 encoded transaction:', encodedTx);
    // const txHash = await agent.connection.sendTransaction(tx);
    // console.log('Transaction hash:', txHash);

    return {
      txHash: encodedTx,
    };
  } catch (error) {
    console.error("Error in claimCreatorFee:", error);
    if (error instanceof Error && "logs" in error) {
      console.error("Transaction logs:", (error as any).logs);
    }
    throw error;
  }
}