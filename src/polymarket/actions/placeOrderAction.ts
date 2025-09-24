import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import placeOrder from "../tools/placeOrder";
import { PlaceOrderParams } from "../types";

const placeOrderAction: Action = {
  name: "PLACE_POLYMARKET_ORDER",
  similes: [
    "place polymarket order",
    "create polymarket order",
    "buy polymarket token",
    "sell polymarket token",
    "polymarket trade",
  ],
  description: `Place an order on Polymarket to buy or sell prediction market tokens. Requires an EVM wallet to be connected.`,
  examples: [
    [
      {
        input: {
          tokenId: "21742633143463906290569050155826241533067272736897614950488156847949938836455",
          price: 0.65,
          side: "BUY",
          size: 10,
          orderType: "GTC",
        },
        output: {
          status: "success",
          message: "Order placed successfully",
          orderId: "0x123...",
          orderStatus: "live",
        },
        explanation: "Place a buy order for 10 tokens at $0.65 each",
      },
    ],
    [
      {
        input: {
          tokenId: "21742633143463906290569050155826241533067272736897614950488156847949938836455",
          price: 0.45,
          side: "SELL",
          size: 5,
          orderType: "FOK",
        },
        output: {
          status: "success",
          message: "Order placed successfully",
          orderId: "0x456...",
          orderStatus: "matched",
        },
        explanation: "Place a sell order for 5 tokens at $0.45 each (fill or kill)",
      },
    ],
  ],
  schema: z.object({
    tokenId: z.string().min(1, "Token ID is required"),
    price: z.number().min(0.01).max(0.99).describe("Price between 0.01 and 0.99"),
    side: z.enum(['BUY', 'SELL']).describe("Order side: BUY or SELL"),
    size: z.number().positive("Size must be positive"),
    orderType: z.enum(['GTC', 'FOK', 'FAK', 'GTD']).optional().default('GTC').describe("Order type (default: GTC)"),
    feeRateBps: z.number().optional().describe("Fee rate in basis points (optional)"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    try {
      const result = await placeOrder(agent, input as PlaceOrderParams);

      return {
        status: "success",
        message: "Order placed successfully",
        orderId: result.orderId,
        orderStatus: result.status,
        orderHashes: result.orderHashes,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: error?.message || "Failed to place order",
      };
    }
  },
};

export default placeOrderAction;
