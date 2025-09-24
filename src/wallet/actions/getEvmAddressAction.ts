import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getEvmAddress from "../tools/getEvmAddress";

const getEvmAddressAction: Action = {
  name: "EVM_WALLET_ADDRESS",
  similes: [
    "get evm wallet address",
    "get ethereum address",
    "show evm address",
    "my evm address",
    "my ethereum address",
  ],
  description: `Return the connected EVM wallet address if available. If the agent was not initialized with an EVM wallet, returns an error message explaining how to provide one.`,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          message: "EVM wallet address retrieved successfully",
          address: "0x1234567890abcdef1234567890abcdef12345678",
        },
        explanation: "Get your EVM wallet address",
      },
    ],
  ],
  schema: z.object({}),
  handler: async (agent: SolanaAgentKit) => {
    try {
      const address = getEvmAddress(agent);
      return {
        status: "success",
        message: "EVM wallet address retrieved successfully",
        address,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: error?.message || "EVM wallet not available",
      };
    }
  },
};

export default getEvmAddressAction;
