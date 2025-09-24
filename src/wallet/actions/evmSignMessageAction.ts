import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import evmSignMessage from "../tools/evmSignMessage";

const evmSignMessageAction: Action = {
  name: "EVM_SIGN_MESSAGE",
  similes: [
    "sign evm message",
    "sign ethereum message",
    "evm message signature",
    "ethereum sign message",
  ],
  description: `Sign an arbitrary message using the connected EVM wallet. Returns the signature as a hex string.`,
  examples: [
    [
      {
        input: {
          message: "Hello, Ethereum!",
        },
        output: {
          status: "success",
          message: "Message signed successfully",
          signature: "0x1234567890abcdef...",
        },
        explanation: "Sign a simple text message",
      },
    ],
  ],
  schema: z.object({
    message: z.string().min(1, "Message cannot be empty"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    try {
      const signature = await evmSignMessage(agent, input.message);
      return {
        status: "success",
        message: "Message signed successfully",
        signature,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: error?.message || "Failed to sign message",
      };
    }
  },
};

export default evmSignMessageAction;
