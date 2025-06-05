import type { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getTrendingTokens  from "../tools/getTrendingTokens";
import type { BirdeyeTrendingTokensResponse } from "../types";

const getTrendingTokensAction: Action = {
  name: "GET_TRENDING_TOKENS",
  similes: [
    "get trending tokens",
    "fetch trending tokens",
    "show trending tokens",
    "trending tokens list",
    "top tokens",
    "hot tokens",
    "popular tokens",
    "token leaderboard",
  ],
  description: `This action/tool fetches the list of trending tokens on Solana using the Birdeye public API. The response contains the top trending tokens, their stats, price, market cap, and more.`,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          tokens: {
            success: true,
            data: {
              updateUnixTime: 1710000000,
              updateTime: "2024-03-09T12:00:00Z",
              tokens: [
                {
                  address: "So11111111111111111111111111111111111111112",
                  symbol: "SOL",
                  name: "Solana",
                  price: 150,
                  marketcap: 10000000000,
                  // ... more fields ...
                },
                // ... more tokens ...
              ],
              total: 20,
            },
          },
        },
        explanation: "Get the list of trending tokens on Solana",
      },
    ],
  ],
  schema: z.object({}),
  handler: async (_agent: SolanaAgentKit, _input: Record<string, any>) => {
    const tokens: BirdeyeTrendingTokensResponse["data"]["tokens"] = await getTrendingTokens(_agent);
    return {
      status: "success",
      tokens,
    };
  },
};

export default getTrendingTokensAction;
