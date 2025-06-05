import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";
/**
 * Get token accounts by mint address for a specific owner.
 * @param mintAddress - The mint address of the token (string).
 * @param ownerAddress - The owner's wallet address (string).
 * @returns Promise resolving to the token accounts data from Helius.
 */
export default async function getTokenBalance(
  agent: SolanaAgentKit,
  mintAddress: PublicKey,
): Promise<any> {
  const rpcUrl = agent.connection.rpcEndpoint;

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: '1',
      method: 'getTokenAccountsByOwner',
      params: [
        agent.wallet.publicKey.toBase58(),
        {
          mint: mintAddress.toString()
        },
        {
          encoding: 'jsonParsed'
        }
      ]
    })
  });
    
  const data = await response.json();

  return data.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount ?? 0
}
