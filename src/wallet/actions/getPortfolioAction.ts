import type { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getPortfolio from "../tools/getPortfolio";
import type { BirdeyePortfolioResponse } from "../types";

const getPortfolioAction: Action = {
  name: "GET_PORTFOLIO",
  similes: [
    "check portfolio",
    "get wallet portfolio",
    "view portfolio",
    "show portfolio",
    "portfolio overview",
    "wallet holdings",
    "get asset list",
    "show wallet assets",
  ],
  description: `This action/tool is used to fetch the full portfolio of the user's wallet using the Birdeye public API. The response contains all tokens, their balances, and USD values. When using this action, the user is aware that they are checking the entire portfolio of their wallet, not just a specific token or SOL balance.`,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          portfolio: {
            success: true,
            data: {
              wallet: "8x2dR8Mpzuz2YqyZyZjUbYWKSWesBo5jMx2Q9Y86udVk",
              totalUsd: 1234.56,
              items: [
                {
                  address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  decimals: 6,
                  balance: 1000000,
                  uiAmount: 1,
                  chainId: "solana",
                  name: "USD Coin",
                  symbol: "USDC",
                  logoURI: "https://...",
                  priceUsd: 1,
                  valueUsd: 1,
                },
                // ... more items ...
              ],
            },
          },
        },
        explanation: "Get the full portfolio of the wallet, including all tokens and their USD values",
      },
    ],
  ],
  schema: z.object({}),
  handler: async (agent: SolanaAgentKit) => {
    const portfolio: BirdeyePortfolioResponse = await getPortfolio(agent);
    return {
      status: "success",
      portfolio,
    };
  },
};

export default getPortfolioAction;
