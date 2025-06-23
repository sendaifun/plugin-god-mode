import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import cancelDCA from "../tools/dca/cancelDCA";

const cancelDCAAction: Action = {
  name: "CANCEL_DCA",
  similes: [
    "cancel dca",
    "cancel dca order",
    "stop dca",
    "stop dca order",
    "cancel recurring order",
    "stop recurring buy",
    "terminate dca",
    "end dca order",
    "cancel dollar cost averaging",
  ],
  description: `This tool can be used to cancel an active DCA (Dollar Cost Averaging) order on Jupiter. Once cancelled, no more recurring purchases will be executed for that order.`,
  examples: [
    [
      {
        input: {
          orderId: "order_123456789",
        },
        output: {
          status: "success",
          message: "DCA order cancelled successfully",
          signature: "5UfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
          orderId: "order_123456789",
        },
        explanation: "Cancel a specific DCA order by its ID",
      },
    ],
    [
      {
        input: {
          orderId: "4DWzP4TdTsuwvYMaMWrRqzya4UTFKFoVjfUWNWh8zhzd",
        },
        output: {
          status: "success",
          message: "DCA order cancelled successfully",
          signature: "4VfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
          orderId: "4DWzP4TdTsuwvYMaMWrRqzya4UTFKFoVjfUWNWh8zhzd",
        },
        explanation: "Cancel another DCA order with a different order ID format",
      },
    ],
  ],
  schema: z.object({
    orderId: z.string().min(1, "Order ID is required").describe("The unique identifier of the DCA order to cancel (can be obtained from GET_DCA_ORDERS)"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const signature = await cancelDCA(
      agent,
      input.orderId,
    );

    return {
      status: "success",
      message: "DCA order cancelled successfully",
      signature: signature,
      orderId: input.orderId,
    };
  },
};

export default cancelDCAAction; 