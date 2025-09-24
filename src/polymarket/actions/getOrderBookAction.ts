import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getOrderBook from "../tools/getOrderBook";

const getOrderBookAction: Action = {
  name: "GET_POLYMARKET_ORDER_BOOK",
  similes: [
    "get polymarket order book",
    "polymarket order book",
    "market depth",
    "bids and asks",
    "polymarket liquidity",
  ],
  description: `Get the current order book (bids and asks) for a specific Polymarket token/asset.`,
  examples: [
    [
      {
        input: {
          tokenId: "21742633143463906290569050155826241533067272736897614950488156847949938836455",
        },
        output: {
          status: "success",
          message: "Order book fetched successfully",
          orderBook: {
            market: "0x123...",
            asset_id: "21742633143463906290569050155826241533067272736897614950488156847949938836455",
            bids: [
              { price: "0.64", size: "100" },
              { price: "0.63", size: "50" }
            ],
            asks: [
              { price: "0.66", size: "75" },
              { price: "0.67", size: "25" }
            ]
          },
        },
        explanation: "Get order book for a specific token showing current bids and asks",
      },
    ],
  ],
  schema: z.object({
    tokenId: z.string().min(1, "Token ID is required"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    try {
      const orderBook = await getOrderBook(agent, input.tokenId);

      return {
        status: "success",
        message: "Order book fetched successfully",
        orderBook: orderBook,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: error?.message || "Failed to fetch order book",
      };
    }
  },
};

export default getOrderBookAction;
