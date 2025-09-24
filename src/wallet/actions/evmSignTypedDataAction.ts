import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import evmSignTypedData from "../tools/evmSignTypedData";

const evmSignTypedDataAction: Action = {
  name: "EVM_SIGN_TYPED_DATA",
  similes: [
    "sign evm typed data",
    "sign ethereum typed data",
    "eip712 signature",
    "ethereum sign typed data",
  ],
  description: `Sign EIP-712 typed data using the connected EVM wallet. Requires domain, types, and message objects.`,
  examples: [
    [
      {
        input: {
          domain: {
            name: "MyDApp",
            version: "1",
            chainId: 1,
            verifyingContract: "0x1234567890abcdef1234567890abcdef12345678",
          },
          types: {
            Person: [
              { name: "name", type: "string" },
              { name: "wallet", type: "address" },
            ],
          },
          message: {
            name: "Alice",
            wallet: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
          },
        },
        output: {
          status: "success",
          message: "Typed data signed successfully",
          signature: "0x1234567890abcdef...",
        },
        explanation: "Sign EIP-712 typed data",
      },
    ],
  ],
  schema: z.object({
    domain: z.record(z.any()).describe("EIP-712 domain object"),
    types: z.record(z.any()).describe("EIP-712 types definition"),
    message: z.record(z.any()).describe("Message to sign"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    try {
      const signature = await evmSignTypedData(
        agent,
        input.domain,
        input.types,
        input.message
      );
      return {
        status: "success",
        message: "Typed data signed successfully",
        signature,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: error?.message || "Failed to sign typed data",
      };
    }
  },
};

export default evmSignTypedDataAction;
