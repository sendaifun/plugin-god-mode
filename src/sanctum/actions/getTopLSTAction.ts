import type { Action, SolanaAgentKit } from "solana-agent-kit";
import getTopLSTTokens from "../tools/getTopLST";
import { z } from "zod";
import type { JupiterTokenData } from "../../jupiter/types";

const getTopLSTAction: Action = {
  name: "GET_TOP_LST_TOKENS",
  similes: [
    "get top LST tokens",
    "fetch top LSTs",
    "top liquid staking tokens",
    "top LSTs by volume",
    "top 10 LST tokens",
    "top LST tokens by daily volume",
  ],
  description:
    "Fetch the top 10 Liquid Staking Tokens (LSTs) by daily trading volume from Jupiter's token list.",
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          tokens: [
            {
              address: "...",
              name: "...",
              symbol: "...",
              decimals: 9,
              tags: ["lst"],
              logoURI: "...",
              daily_volume: 123456,
              freeze_authority: null,
              mint_authority: null,
              permanent_delegate: null,
              extensions: { coingeckoId: "..." },
            },
            // ...more tokens
          ],
        },
        explanation: "Fetch the top 10 LST tokens by daily trading volume.",
      },
    ],
  ],
  schema: z.object({}),
  handler: async (_agent: SolanaAgentKit, _input: Record<string, any>) => {
    try {
      const tokens: JupiterTokenData[] = await getTopLSTTokens(_agent);
      return {
        status: "success",
        tokens,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Failed to fetch top LST tokens: ${error.message}`,
      };
    }
  },
};


export default getTopLSTAction;