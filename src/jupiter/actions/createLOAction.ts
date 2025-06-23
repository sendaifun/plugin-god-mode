import { PublicKey } from "@solana/web3.js";
import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import createLO from "../tools/lo/createLO";

const createLOAction: Action = {
  name: "CREATE_LIMIT_ORDER",
  similes: [
    "create limit order",
    "create lo",
    "set limit order",
    "place limit order",
    "limit buy",
    "limit sell",
    "create trigger order",
    "set price target",
  ],
  description: `This tool can be used to create limit orders on Jupiter. Limit orders allow you to buy or sell tokens at a specific price or better, and will only execute when the market reaches your target price.`,
  examples: [
    [
      {
        input: {
          inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          outputMint: "So11111111111111111111111111111111111111112",
          makingAmount: "1000000",
          takingAmount: "300000",
        },
        output: {
          status: "success",
          message: "Limit order created successfully",
          signature: "5UfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
          inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          outputMint: "So11111111111111111111111111111111111111112",
          makingAmount: "1000000",
          takingAmount: "300000",
        },
        explanation: "Create a limit order to sell 1 USDC for 0.3 SOL",
      },
    ],
    [
      {
        input: {
          inputMint: "So11111111111111111111111111111111111111112",
          outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          makingAmount: "500000000",
          takingAmount: "120000000",
          expiredAt: 1704067200,
          slippageBps: 50,
        },
        output: {
          status: "success",
          message: "Limit order created successfully",
          signature: "4VfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
          inputMint: "So11111111111111111111111111111111111111112",
          outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          makingAmount: "500000000",
          takingAmount: "120000000",
          expiredAt: 1704067200,
          slippageBps: 50,
        },
        explanation: "Create a limit order to sell 0.5 SOL for 120 USDC with expiry and slippage tolerance",
      },
    ],
  ],
  schema: z.object({
    inputMint: z.string().min(32, "Invalid input mint address").describe("The mint address of the token you want to sell (e.g., So11111111111111111111111111111111111111112, EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v)"),
    outputMint: z.string().min(32, "Invalid output mint address").describe("The mint address of the token you want to receive (e.g., So11111111111111111111111111111111111111112, EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v)"),
    makingAmount: z.string().min(1, "Making amount is required").describe("Amount of input token to sell (in raw token units, accounting for decimals)"),
    takingAmount: z.string().min(1, "Taking amount is required").describe("Amount of output token to receive (in raw token units, accounting for decimals)"),
    slippageBps: z.number().int().min(0).max(10000).optional().describe("Optional slippage tolerance in basis points (e.g., 50 = 0.5%)"),
    expiredAt: z.number().int().positive().optional().describe("Optional Unix timestamp when the order expires (null/undefined = no expiry)"),
    feeBps: z.number().int().min(0).max(10000).optional().describe("Optional fee in basis points (requires referral account)"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const signature = await createLO(
      agent,
      new PublicKey(input.inputMint),
      new PublicKey(input.outputMint),
      {
        makingAmount: input.makingAmount,
        takingAmount: input.takingAmount,
        slippageBps: input.slippageBps,
        expiredAt: input.expiredAt,
        feeBps: input.feeBps,
      }
    );

    return {
      status: "success",
      message: "Limit order created successfully",
      signature: signature,
      inputMint: input.inputMint,
      outputMint: input.outputMint,
      makingAmount: input.makingAmount,
      takingAmount: input.takingAmount,
      slippageBps: input.slippageBps,
      expiredAt: input.expiredAt,
      feeBps: input.feeBps,
    };
  },
};

export default createLOAction; 