import type { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getBridgeUrl from "../tools/bridge";

const bridgeAction: Action = {
  name: "GET_BRIDGE_URL",
  similes: [
    "get bridge url",
    "bridge tokens",
    "send tokens cross-chain",
    "bridge assets",
    "cross-chain transfer",
    "bridge to chain",
    "send to another chain",
    "bridge amount",
  ],
  description: `This action/tool generates a URL for bridging a specified amount of tokens to a target chain using the Sendai bridge. The user should visit the generated URL to complete the bridging process.`,
  examples: [
    [
      {
        input: { amount: 100 },
        output: {
          status: "success",
          url: "https://bridge.sendai.fun?amount=100",
        },
        explanation: "Generate a bridge URL for sending 100 tokens to the current chain.",
      },
    ],
  ],
  schema: z.object({
    amount: z.number().describe("The amount of tokens to bridge"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const amount = input.amount as number;
    const url = await getBridgeUrl(agent,amount);
    return {
      status: "success",
      url,
    };
  },
};

export default bridgeAction;
