import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import cancelLO from "../tools/lo/cancelLO";

const cancelLOAction: Action = {
  name: "CANCEL_LIMIT_ORDER",
  similes: [
    "cancel limit order",
    "cancel lo",
    "stop limit order",
    "cancel trigger order",
    "remove limit order",
    "delete limit order",
    "terminate limit order",
    "end limit order",
    "cancel order",
  ],
  description: `This tool can be used to cancel an active limit order on Jupiter. Once cancelled, the order will no longer execute even if the target price is reached.`,
  examples: [
    [
      {
        input: {
          orderId: "order_123456789",
        },
        output: {
          status: "success",
          message: "Limit order cancelled successfully",
          signature: "5UfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
          orderId: "order_123456789",
        },
        explanation: "Cancel a specific limit order by its ID",
      },
    ],
    [
      {
        input: {
          orderId: "3g2jF8txqXPp6GUStwtXMrWydeYWxU4qoBA8UDLoTnK7",
        },
        output: {
          status: "success",
          message: "Limit order cancelled successfully",
          signature: "4VfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
          orderId: "3g2jF8txqXPp6GUStwtXMrWydeYWxU4qoBA8UDLoTnK7",
        },
        explanation: "Cancel another limit order with a different order ID format",
      },
    ],
  ],
  schema: z.object({
    orderId: z.string().min(1, "Order ID is required").describe("The unique identifier of the limit order to cancel (can be obtained from GET_LIMIT_ORDERS)"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const signature = await cancelLO(
      agent,
      input.orderId,
    );

    return {
      status: "success",
      message: "Limit order cancelled successfully",
      signature: signature,
      orderId: input.orderId,
    };
  },
};

export default cancelLOAction; 