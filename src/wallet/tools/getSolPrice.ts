import { SolanaAgentKit } from "solana-agent-kit";

/**
 * Fetches the current price of SOL from the Jupiter API.
 * @returns Promise resolving to the SOL price as a number.
 */
export default async function getSolPrice(_agent: SolanaAgentKit): Promise<number> {
  const response = await fetch('https://lite-api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112');
  if (!response.ok) {
    throw new Error(`Failed to fetch SOL price: ${response.statusText}`);
  }
  const data = await response.json();
  
  // The API returns a nested object structure.
  // The SOL mint address is "So11111111111111111111111111111111111111112".
  const solMint = "So11111111111111111111111111111111111111112";
  const priceString = data?.data?.[solMint]?.price;

  if (priceString === undefined) {
    throw new Error('SOL price not found in API response');
  }

  const price = parseFloat(priceString);

  if (isNaN(price)) {
    throw new Error('Failed to parse SOL price from API response');
  }

  return price;
}
