import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getLOs from "../tools/lo/getLOs";

const getLOsAction: Action = {
  name: "GET_LIMIT_ORDERS",
  similes: [
    "get limit orders",
    "list limit orders",
    "show limit orders",
    "view limit orders",
    "check limit orders",
    "fetch limit orders",
    "my limit orders",
    "active limit orders",
    "trigger orders",
    "get los",
    "show los",
  ],
  description: `This tool retrieves all active limit orders for the user. It shows details like order parameters, fill status, and expiry information for each active limit order.`,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          message: "Retrieved 2 active limit orders",
          orders: [
            {
              id: "order_123456",
              maker: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
              inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
              outputMint: "So11111111111111111111111111111111111111112",
              makingAmount: "1000000",
              takingAmount: "300000",
              status: "active",
              createdAt: 1703980800,
              filledMakingAmount: "0",
              filledTakingAmount: "0"
            },
            {
              id: "order_789012",
              maker: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
              inputMint: "So11111111111111111111111111111111111111112",
              outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
              makingAmount: "500000000",
              takingAmount: "120000000",
              status: "active",
              createdAt: 1703462400,
              expiredAt: 1704067200,
              slippageBps: 50,
              filledMakingAmount: "100000000",
              filledTakingAmount: "24000000"
            }
          ]
        },
        explanation: "Retrieve all active limit orders showing order details and fill status",
      },
    ],
    [
      {
        input: {},
        output: {
          status: "success",
          message: "No active limit orders found",
          orders: []
        },
        explanation: "When user has no active limit orders",
      },
    ],
  ],
  schema: z.object({}),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const orders = await getLOs(agent);

    return {
      status: "success",
      message: orders.length > 0 
        ? `Retrieved ${orders.length} active limit order${orders.length === 1 ? '' : 's'}`
        : "No active limit orders found",
      orders: orders,
    };
  },
};

export default getLOsAction; 