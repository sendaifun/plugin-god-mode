import { PublicKey } from "@solana/web3.js";
import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import buy from "../tools/buy";

const buyAction: Action = {
  name: "BUY",
  similes: [
    "buy tokens",
    "buy sol",
  ],
  description: `This tool can be used to buy tokens using SOL.`,
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
    slippageBps: z.number().min(0).max(10000).optional(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const tx = await buy(
      agent,
      new PublicKey(input.outputMint),
      input.inputAmount,
    );

    return {
      status: "success",
      message: "Trade executed successfully",
      transaction: tx,
      inputAmount: input.inputAmount,
      inputToken: "SOL",
      outputToken: input.outputMint,
    };
  },
};

export default buyAction;
