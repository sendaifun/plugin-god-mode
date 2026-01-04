import type { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getKaminoSupplyApy from "../tools/getKaminoSupplyApy";

const getKaminoSupplyApyAction: Action = {
  name: "GET_KAMINO_SUPPLY_APY",
  similes: ["get kamino supply apy", "fetch kamino supply apy", "kamino reserve apy"],
  description: "Fetch Kamino reserve supply APYs for a given market (defaults to main market).",
  examples: [
    [
      {
        input: {
          marketPubkey: "7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF",
        },
        output: {
          status: "success",
          marketPubkey: "7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF",
          metrics: [
            {
              reserve: "64AZMUHLB6NYvQSt41JTer4v8NAFDCz5sUPb7dYpCxa",
              liquidityToken: "adraSOL",
              liquidityTokenMint: "sctmY8fJucsJatwHz6P48RuWBBkdBMNmSMuBYrWFdrw",
              maxLtv: "0.45",
              borrowApy: "0.012932792149291661",
              supplyApy: "0",
              totalSupply: "126.232745140959613696322920819818669269",
              totalBorrow: "0.0000000000000004611460232900252420584763513033976778388",
              totalBorrowUsd: "0.00000000000006276697113213256774478494572112985292952",
              totalSupplyUsd: "17181.64457684014138540137194663503557959",
            },
          ],
        },
        explanation: "Fetches Kamino supply APYs for the given market.",
      },
    ],
  ],
  schema: z.object({
    marketPubkey: z.string().optional(),
  }),
  handler: async (_agent: SolanaAgentKit, input: Record<string, any>) => {
    try {
      const result = await getKaminoSupplyApy(_agent, input.marketPubkey);
      return {
        status: "success",
        ...result,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Failed to fetch Kamino supply APY: ${error.message}`,
      };
    }
  },
};

export default getKaminoSupplyApyAction;
