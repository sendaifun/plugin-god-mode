import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, type PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";
import { getTokenMetadata } from "./utils/tokenMetadata";

/**
 * Get the token balances of a Solana wallet
 * @param agent - SolanaAgentKit instance
 * @param token_address -  SPL token mint address. If not provided, returns SOL balance
 * @returns Promise resolving to the balance as an object containing sol balance and token balances with their respective mints, symbols, names and decimals
 */
export default async function getTokenBalance(
  agent: SolanaAgentKit,
  mint: PublicKey,
): Promise<Array<{
    tokenAddress: string;
    name: string;
    symbol: string;
    balance: number;
    decimals: number;
  }>> {
  // Fetch only token accounts for the provided mint
  const tokenAccounts = await agent.connection.getTokenAccountsByOwner(
    agent.wallet.publicKey,
    { mint },
  );

  if (tokenAccounts.value.length === 0) {
    return [];
  }

  const tokenBalances = await Promise.all(
    tokenAccounts.value
      .filter((v: any) => v.account.data.parsed.info.tokenAmount.uiAmount !== 0)
      .map(async (v: any) => {
        const mintAddress = v.account.data.parsed.info.mint;
        const mintInfo = await getTokenMetadata(agent.connection, mintAddress);
        return {
          tokenAddress: mintAddress,
          name: mintInfo.name ?? "",
          symbol: mintInfo.symbol ?? "",
          balance: v.account.data.parsed.info.tokenAmount.uiAmount as number,
          decimals: v.account.data.parsed.info.tokenAmount.decimals as number,
        };
      }),
  );

  return tokenBalances;
}
