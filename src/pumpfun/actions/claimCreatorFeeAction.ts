import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import claimCreatorFee from "../tools/claimCreatorFee";

const claimCreatorFeeAction: Action = {
  name: "CLAIM_PUMPFUN_CREATOR_FEE",
  similes: [
    "claim pumpfun creator fee",
    "collect pumpfun creator earnings",
    "get my creator fee from pumpfun",
  ],
  description:
    "Claim the creator fee for tokens on Pump.fun.",
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          txHash: "2Nf3g...",
          message: "Successfully claimed creator fee on Pump.fun.",
        },
        explanation:
          "Claim available creator fees from Pump.fun.",
      },
    ],
  ],
  schema: z.object({}),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    try {
      // The input object is not used here as claimCreatorFee only needs the agent
      const result = await claimCreatorFee(agent);

      return {
        status: "success",
        txHash: result.txHash,
        message: "Successfully claimed creator fee on Pump.fun. Please note this is an encoded transaction, not a signature. You need to decode and send it.",
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Failed to claim creator fee: ${error.message}`,
      };
    }
  },
};

export default claimCreatorFeeAction;
