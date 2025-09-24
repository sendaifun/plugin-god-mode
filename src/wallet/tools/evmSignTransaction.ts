import { SolanaAgentKit } from "solana-agent-kit";

export default async function evmSignTransaction(
  agent: SolanaAgentKit,
  transaction: Record<string, any>
): Promise<string> {
  const evmWallet = (agent as unknown as { 
    evmWallet?: { 
      signTransaction?: (tx: Record<string, any>) => Promise<string> 
    } 
  }).evmWallet;
  
  if (!evmWallet || !evmWallet.signTransaction) {
    throw new Error("EVM wallet not available or does not support transaction signing. Please initialize agent with an evmWallet that supports signTransaction.");
  }
  
  return await evmWallet.signTransaction(transaction);
}
