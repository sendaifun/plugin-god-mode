import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";


/**
 * Get the token balances of a Solana wallet
 * @param agent - SolanaAgentKit instance
 * @returns Promise resolving to the balance as an object containing sol balance and token balances with their respective mints, symbols, names and decimals
 */
export async function get_sol_balance(
  agent: SolanaAgentKit,
): Promise<number> {
  const lamportsBalance = await agent.connection.getBalance(agent.wallet.publicKey);

  const solBalance = lamportsBalance / LAMPORTS_PER_SOL;

  return solBalance ?? 0;
}
