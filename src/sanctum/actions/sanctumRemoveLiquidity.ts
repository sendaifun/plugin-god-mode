import type { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import { sanctumRemoveLiquidity } from "../tools";

export const sanctumRemoveLiquidityAction: Action = {
  name: "SANCTUM_REMOVE_LIQUIDITY",
  similes: ["remove liquidity from sanctum pool", "withdraw from sanctum pool"],
  description: "Remove liquidity from a Sanctum pool with specified parameters",
  examples: [
    [
      {
        input: {
          lstMint: "So11111111111111111111111111111111111111112",
          amount: "1000000000",
          quotedAmount: "900000000",
          priorityFee: 5000,
        },
        output: {
          status: "success",
          message: "Liquidity removed successfully",
          txId: "2FqduazbmVrYAs6VMj7whKvFhEJnCyCvm7GiX4xCj1FSVr4CquPqFoCPDokUuJJ3T24EpXLPxrJWmGq6EnpsrJWf",
        },
        explanation: "Remove liquidity from a Sanctum pool",
      },
    ],
  ],
  schema: z.object({
    lstMint: z.string(),
    amount: z.string(),
    quotedAmount: z.string(),
    priorityFee: z.number(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    try {
      const result = await sanctumRemoveLiquidity(
        agent,
        input.lstMint,
        input.amount,
        input.quotedAmount,
        input.priorityFee,
      );

      return {
        status: "success",
        message:
          typeof result === "string"
            ? "Liquidity removed successfully"
            : "Liquidity removal transaction generated and signed successfully. Please send it to the network.",
        transaction: result,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Removing liquidity from Sanctum pool failed: ${error.message}`,
      };
    }
  },
};
