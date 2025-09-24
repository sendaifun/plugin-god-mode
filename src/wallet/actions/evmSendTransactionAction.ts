import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import evmSendTransaction from "../tools/evmSendTransaction";

const evmSendTransactionAction: Action = {
  name: "EVM_SEND_TRANSACTION",
  similes: [
    "send evm transaction",
    "send ethereum transaction",
    "broadcast evm transaction",
    "ethereum send transaction",
  ],
  description: `Send a raw signed EVM transaction to the network. Returns the transaction hash.`,
  examples: [
    [
      {
        input: {
          rawSignedTransaction: "0xf86c808509184e72a0008252089412345...",
        },
        output: {
          status: "success",
          message: "Transaction sent successfully",
          transactionHash: "0xabcdef1234567890abcdef1234567890abcdef12...",
        },
        explanation: "Send a signed EVM transaction",
      },
    ],
  ],
  schema: z.object({
    rawSignedTransaction: z
      .string()
      .min(1, "Raw signed transaction cannot be empty")
      .describe("Raw signed transaction as hex string"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    try {
      const transactionHash = await evmSendTransaction(
        agent,
        input.rawSignedTransaction
      );
      return {
        status: "success",
        message: "Transaction sent successfully",
        transactionHash,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: error?.message || "Failed to send transaction",
      };
    }
  },
};

export default evmSendTransactionAction;
