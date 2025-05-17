import { SolanaAgentKit } from "solana-agent-kit";

export default function getWalletAddress(agent: SolanaAgentKit): string {
  return agent.wallet.publicKey.toBase58();
}
