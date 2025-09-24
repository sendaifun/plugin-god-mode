import { SolanaAgentKit } from "solana-agent-kit";

export default async function evmSignTypedData(
  agent: SolanaAgentKit,
  domain: Record<string, any>,
  types: Record<string, any>,
  message: Record<string, any>
): Promise<string> {
  const evmWallet = (agent as unknown as { 
    evmWallet?: { 
      signTypedData?: (
        domain: Record<string, any>,
        types: Record<string, any>,
        message: Record<string, any>
      ) => Promise<string> 
    } 
  }).evmWallet;
  
  if (!evmWallet || !evmWallet.signTypedData) {
    throw new Error("EVM wallet not available or does not support typed data signing. Please initialize agent with an evmWallet that supports signTypedData.");
  }
  
  return await evmWallet.signTypedData(domain, types, message);
}
