import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getPendingCreatorFee from "../tools/getPendingCreatorFee";

const getPendingCreatorFeeAction: Action = {
  name: "PUMP_GET_PENDING_CREATOR_FEE",
  similes: [
    "get pending creator fee",
    "check pump creator fee",
    "pump creator balance",
    "pending fee balance",
    "check creator earnings",
  ],
  description: "Get pending creator fee balance on Pump.fun",
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          data: 1.5,
          message: "Successfully retrieved pending creator fee: 1.5 SOL",
        },
        explanation: "Get current pending creator fee balance in lamports",
      },
    ],
  ],
  schema: z.object({}),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    try {
      const response = await getPendingCreatorFee(agent);

      return {
        status: "success",
        data: response,
        message: `Successfully retrieved pending creator fee: ${response} SOL`,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Failed to get pending creator fee: ${error.message}`,
      };
    }
  },
};

export default getPendingCreatorFeeAction;
