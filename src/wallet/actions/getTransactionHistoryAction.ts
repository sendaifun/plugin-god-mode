import { SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getTransactionHistory from "../tools/getTransactionHistory";

const getTransactionHistoryAction = {
  name: "GET_TRANSACTION_HISTORY",
  similes: [
    "get transaction history",
    "show transaction history",
    "display transaction history",
    "my transaction history",
  ],

  description:
    "Get the last 20 transactions for a Solana wallet, focusing on swaps and transfers in human-readable format",
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          message: "Transaction history retrieved successfully",
          data: {
            transactions: [
              {
                signature: "1234567890",
                timestamp: 1714953600,
                type: "swap",
                amount: 0.0001,
                token: "SOL",
                from: "8x2dR8Mpzuz2YqyZyZjUbYWKSWesBo5jMx2Q9Y86udVk",
                to: "8x2dR8Mpzuz2YqyZyZjUbYWKSWesBo5jMx2Q9Y86udVk",
                fee: 0.000001,
                status: "success",
              },
            ],
          },
        },
        explanation: "Get transaction history",
      },
    ],
  ],
  schema: z.object({}),
  handler: async (agent: SolanaAgentKit) => {
    try {
      const transactions = await getTransactionHistory(agent);

      return {
        success: true,
        message: "Transaction history retrieved successfully",
        data: {
          transactions,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to get transaction history: ${error}`,
        data: null,
      };
    }
  },
};

export default getTransactionHistoryAction;
