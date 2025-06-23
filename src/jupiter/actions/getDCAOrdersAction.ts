import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getDCAOrders from "../tools/dca/getDCAOrders";

const getDCAOrdersAction: Action = {
  name: "GET_DCA_ORDERS",
  similes: [
    "get dca orders",
    "list dca orders",
    "show dca orders",
    "view dca orders",
    "check dca orders",
    "fetch dca orders",
    "my dca orders",
    "active dca orders",
    "recurring orders",
  ],
  description: `This tool retrieves all active DCA (Dollar Cost Averaging) orders for the user. It shows details like order progress, execution schedule, and settings for each active DCA order.`,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          message: "Retrieved 2 active DCA orders",
          orders: [
            {
              id: "order_123456",
              user: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
              inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
              outputMint: "So11111111111111111111111111111111111111112",
              inAmount: 100000000,
              numberOfOrders: 4,
              interval: 86400,
              ordersExecuted: 1,
              nextExecutionAt: 1704067200,
              status: "active",
              createdAt: 1703980800
            },
            {
              id: "order_789012",
              user: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
              inputMint: "So11111111111111111111111111111111111111112",
              outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
              inAmount: 1000000000,
              numberOfOrders: 7,
              interval: 604800,
              ordersExecuted: 2,
              nextExecutionAt: 1704672000,
              status: "active",
              createdAt: 1703462400,
              minPrice: 150,
              maxPrice: 200
            }
          ]
        },
        explanation: "Retrieve all active DCA orders showing progress and details",
      },
    ],
    [
      {
        input: {},
        output: {
          status: "success",
          message: "No active DCA orders found",
          orders: []
        },
        explanation: "When user has no active DCA orders",
      },
    ],
  ],
  schema: z.object({}),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const orders = await getDCAOrders(agent);

    return {
      status: "success",
      message: orders.length > 0 
        ? `Retrieved ${orders.length} active DCA order${orders.length === 1 ? '' : 's'}`
        : "No active DCA orders found",
      orders: orders,
    };
  },
};

export default getDCAOrdersAction;
