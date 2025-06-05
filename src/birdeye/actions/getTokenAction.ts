import type { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getTokenOverview from "../tools/getToken";

const getTokenAction: Action = {
  name: "GET_TOKEN_OVERVIEW",
  similes: [
    "get token info",
    "fetch token overview",
    "show token details",
    "token stats",
    "token analytics",
    "token data",
    "get token analytics",
    "token overview",
  ],
  description: `This action/tool fetches the overview and analytics for a specific token (by mint address) using the Birdeye public API. The response contains all available stats, price, market cap, and more for the token.`,
  examples: [
    [
      {
        input: { address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
        output: {
          status: "success",
          token: {
            success: true,
            data: {
              address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
              symbol: "USDC",
              name: "USD Coin",
              price: 1,
              marketCap: 1000000000,
              // ... more fields ...
            },
          },
        },
        explanation: "Get the overview and analytics for the USDC token by its mint address",
      },
    ],
  ],
  schema: z.object({
    address: z.string().describe("The mint address of the token to fetch"),
  }),
  handler: async (_agent: SolanaAgentKit, input: Record<string, any>) => {
    const address = input.address as string;
    const token: any = await getTokenOverview(_agent, address);
    return {
      status: "success",
      token,
    };
  },
};

export default getTokenAction;
