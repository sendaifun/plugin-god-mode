import { SolanaAgentKit } from "solana-agent-kit";

export default async function evmSignMessage(
  agent: SolanaAgentKit,
  message: string | Uint8Array
): Promise<string> {
  const evmWallet = (agent as unknown as { evmWallet?: { signMessage?: (message: string | Uint8Array) => Promise<string> } }).evmWallet;
  
  if (!evmWallet || !evmWallet.signMessage) {
    throw new Error("EVM wallet not available or does not support message signing. Please initialize agent with an evmWallet.");
  }
  
  return await evmWallet.signMessage(message);
}
