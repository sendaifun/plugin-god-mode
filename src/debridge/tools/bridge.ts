import { SolanaAgentKit } from "solana-agent-kit";

/**
 * Generate a Sendai bridge URL for a given amount and chain
 * @param amount The amount to bridge
 * @param address The address to bridge to
 * @returns The URL to use for bridging
 */
export async function getBridgeUrl(agent: SolanaAgentKit, amount: number): Promise<string> {
  const url = `https://mcp.sendai.fun/bridge?amount=${encodeURIComponent(amount)}&address=${encodeURIComponent(agent.wallet.publicKey.toString())}`;
  return url;
}
