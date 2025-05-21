import { PublicKey } from "@solana/web3.js";
import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import sell from "../tools/sell";

const sellAction: Action = {
  name: "SELL",
  similes: [
    "sell tokens",
    "sell sol",
  ],
  description: `This tool can be used to sell tokens. This sells tokens for SOL. User is aware that they are selling tokens for SOL and don't need to be told that.`,
  examples: [
    [
      {
        input: {
          outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          inputAmount: 1,
        },
        output: {
          status: "success",
          message: "Trade executed successfully",
          transaction:
            "5UfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
          inputAmount: 1,
          inputToken: "SOL",
          outputToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        },
        explanation: "Swap 1 SOL for USDC",
      },
    ],
    [
      {
        input: {
          outputMint: "So11111111111111111111111111111111111111112",
          inputAmount: 100,
          inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          slippageBps: 100,
        },
        output: {
          status: "success",
          message: "Trade executed successfully",
          transaction:
            "4VfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
          inputAmount: 100,
          inputToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          outputToken: "So11111111111111111111111111111111111111112",
        },
        explanation: "Swap 100 USDC for SOL with 1% slippage",
      },
    ],
  ],
  schema: z.object({
    outputMint: z.string().min(32, "Invalid output mint address"),
    inputAmount: z.number().positive("Input amount must be positive"),
    inputMint: z.string().min(32, "Invalid input mint address").optional(),
    slippageBps: z.number().min(0).max(10000).optional(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const tx = await sell(
      agent,
      input.inputAmount,
      new PublicKey(input.inputMint)
    );

    return {
      status: "success",
      message: "Trade executed successfully",
      transaction: tx,
      inputAmount: input.inputAmount,
      inputToken: input.inputMint || "SOL",
      outputToken: input.outputMint,
    };
  },
};

export default sellAction;
