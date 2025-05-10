import { SolanaAgentKit } from "solana-agent-kit";

export function getWalletAddress(agent: SolanaAgentKit): string {
  return agent.wallet.publicKey.toBase58();
}
