import { SolanaAgentKit } from "solana-agent-kit";

export default async function evmSendTransaction(
  agent: SolanaAgentKit,
  rawSignedTransaction: string
): Promise<string> {
  const evmWallet = (agent as unknown as { 
    evmWallet?: { 
      sendTransaction?: (rawSignedTx: string) => Promise<string> 
    } 
  }).evmWallet;
  
  if (!evmWallet || !evmWallet.sendTransaction) {
    throw new Error("EVM wallet not available or does not support transaction sending. Please initialize agent with an evmWallet that supports sendTransaction.");
  }
  
  return await evmWallet.sendTransaction(rawSignedTransaction);
}
