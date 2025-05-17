import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import luloLend from "../tools/luloLend";

const luloLendAction: Action = {
  name: "LULO_LEND",
  similes: [
    "lend USDC with lulo",
  ],
  description: "Lend SPL tokens using Lulo protocol",
  examples: [
    [
      {
        input: {
          mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          amount: 100,
        },
        output: {
          status: "success",
          signature: "4xKpN2...",
          message: "Successfully lend 100 USDC",
        },
        explanation: "Lend 100 USDC on Lulo",
      },
    ],
  ],
  schema: z.object({
    amount: z.number().positive().describe("Amount to lend"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    try {
      const amount = input.amount as number;

      const response = await luloLend(agent, amount);

      return {
        status: "success",
        transaction: response,
        message: `Successfully lend ${amount} of token`,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Lend failed: ${error.message}`,
      };
    }
  },
};

export default luloLendAction;
