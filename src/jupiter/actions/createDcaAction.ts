import { PublicKey } from "@solana/web3.js";
import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import createDCA from "../tools/dca/createDCA";

const createDcaAction: Action = {
  name: "CREATE_DCA",
  similes: [
    "create dca",
    "create dca order",
    "dollar cost average",
    "setup recurring buy",
    "schedule recurring trade",
    "automate buying",
  ],
  description: `This tool can be used to create Dollar Cost Averaging (DCA) orders on Jupiter. DCA allows you to automatically buy tokens at regular intervals over time to reduce the impact of volatility.`,
  examples: [
    [
      {
        input: {
          inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          outputMint: "So11111111111111111111111111111111111111112",
          inAmount: 100000000,
          numberOfOrders: 4,
          interval: 86400,
        },
        output: {
          status: "success",
          message: "DCA order created successfully",
          signature: "5UfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
          inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          outputMint: "So11111111111111111111111111111111111111112",
          inAmount: 100000000,
          numberOfOrders: 4,
          interval: 86400,
        },
        explanation: "Create a DCA order to buy SOL with 100 USDC every 24 hours for 4 orders",
      },
    ],
    [
      {
        input: {
          inputMint: "So11111111111111111111111111111111111111112",
          outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          inAmount: 1000000000,
          numberOfOrders: 7,
          interval: 604800,
          minPrice: 150,
          maxPrice: 200,
        },
        output: {
          status: "success",
          message: "DCA order created successfully",
          signature: "4VfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
          inputMint: "So11111111111111111111111111111111111111112",
          outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          inAmount: 1000000000,
          numberOfOrders: 7,
          interval: 604800,
          minPrice: 150,
          maxPrice: 200,
        },
        explanation: "Create a DCA order to buy USDC with 1 SOL weekly for 7 weeks, only if SOL price is between $150-$200",
      },
    ],
  ],
  schema: z.object({
    inputMint: z.string().min(32, "Invalid input mint address").describe("The mint address of the token you want to spend/sell (e.g., So11111111111111111111111111111111111111112, EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v)"),
    outputMint: z.string().min(32, "Invalid output mint address").describe("The mint address of the token you want to receive/buy (e.g., So11111111111111111111111111111111111111112, EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v)"),
    inAmount: z.string().min(1, "Input amount is required").describe("Amount of input token to spend per order"),
    numberOfOrders: z.string().min(1, "Number of orders is required").describe("Total number of DCA orders to execute over time"),
    interval: z.string().min(1, "Interval is required").describe("Time between each DCA order in seconds (e.g., 86400 for daily, 604800 for weekly)"),
    minPrice: z.string().optional().describe("Optional minimum price threshold - orders won't execute if price is below this"),
    maxPrice: z.string().optional().describe("Optional maximum price threshold - orders won't execute if price is above this"),
    startAt: z.string().optional().describe("Optional Unix timestamp when to start the DCA orders (null/undefined starts immediately)"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const signature = await createDCA(
      agent,
      new PublicKey(input.inputMint),
      new PublicKey(input.outputMint),
      Number(input.inAmount),
      Number(input.interval),
      input.numberOfOrders,
      input.minPrice || null,
      input.maxPrice || null,
      input.startAt || null
    );

    return {
      status: "success",
      message: "DCA order created successfully",
      signature: signature,
      inputMint: input.inputMint,
      outputMint: input.outputMint,
      inAmount: input.inAmount,
      numberOfOrders: input.numberOfOrders,
      interval: input.interval,
      minPrice: input.minPrice,
      maxPrice: input.maxPrice,
      startAt: input.startAt,
    };
  },
};

export default createDcaAction;
