import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import claimSendshotCreatorFee from "../tools/sendshot/claimSendshotCreatorfee";

const claimCreatorFeeAction: Action = {
  name: "CLAIM_SENDSHOT_CREATOR_FEE",
  similes: [
    "claim sendshot creator fee",
    "collect sendshot creator earnings",
    "get my creator fee from sendshot",
  ],
  description: "Claim the creator fee for tokens.",
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          txHash: "2Nf3g...",
          message: "Successfully claimed creator fee.",
        },
        explanation: "Claim available creator fees.",
      },
    ],
  ],
  schema: z.object({
    mint: z.string(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    try {
      // The input object is not used here as claimCreatorFee only needs the agent
      const result = await claimSendshotCreatorFee(agent, input.mint);

      return {
        status: "success",
        txHash: result.txHash,
        mint: result.mint,
        message: result.message,
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
