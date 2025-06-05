import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import luloGetApy from "../tools/luloGetApy";

const luloGetApyAction: Action = {
  name: "LULO_GET_APY",
  similes: [
    "get APY from lulo",
    "what is the lulo APY for USDC?",
    "fetch lulo APY rates",
  ],
  description: "Get current APY rates from Lulo protocol for a given SPL token (defaults to USDC).",
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          apy: 0.15, // Example APY
          mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          message: "Successfully fetched APY for USDC from Lulo: 15%",
        },
        explanation: "Get Lulo APY for default token (USDC)",
      },
    ],
    [
      {
        input: {
          mintAddress: "So11111111111111111111111111111111111111112", // SOL as an example
        },
        output: {
          status: "success",
          apy: 0.12, // Example APY
          mintAddress: "So11111111111111111111111111111111111111112",
          message: "Successfully fetched APY for So11111111111111111111111111111111111111112 from Lulo: 12%",
        },
        explanation: "Get Lulo APY for SOL",
      },
    ],
  ],
  schema: z.object({
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    try {

      const response = await luloGetApy(agent);

      return {
        status: "success",
        apy: response,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Failed to get APY from Lulo: ${error.message}`,
      };
    }
  },
};

export default luloGetApyAction;
