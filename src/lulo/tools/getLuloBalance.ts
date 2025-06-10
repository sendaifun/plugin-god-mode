import { type SolanaAgentKit } from "solana-agent-kit";

/**
 * Get account balance and information from Lulo
 * @param agent SolanaAgentKit instance
 * @returns Account balance data including total USD value, earnings, and withdrawable amounts
 */
export default async function getLuloBalance(agent: SolanaAgentKit) {
  try {
    const response = await fetch(
      `https://api.lulo.fi/v1/account.getAccount?owner=${agent.wallet.publicKey.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": agent.config.OTHER_API_KEYS?.LULO_API_KEY || "",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const accountData = await response.json();

    console.log("Lulo Account Balance:", accountData);

    return accountData;
  } catch (error: any) {
    throw new Error(`Failed to get Lulo balance: ${error.message}`);
  }
}
