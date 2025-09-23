import { SolanaAgentKit } from "solana-agent-kit";

export default function getEvmAddress(agent: SolanaAgentKit): string {
  const evmWallet = (agent as unknown as { evmWallet?: { address?: string } }).evmWallet;
  if (!evmWallet || !evmWallet.address) {
    throw new Error("EVM wallet not available. Please initialize agent with an evmWallet.");
    }
  return evmWallet.address;
}
