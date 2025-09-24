import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import evmSignTransaction from "../tools/evmSignTransaction";

const evmSignTransactionAction: Action = {
  name: "EVM_SIGN_TRANSACTION",
  similes: [
    "sign evm transaction",
    "sign ethereum transaction",
    "evm transaction signature",
    "ethereum sign transaction",
  ],
  description: `Sign an EVM transaction using the connected EVM wallet. Returns the raw signed transaction as a hex string.`,
  examples: [
    [
      {
        input: {
          transaction: {
            to: "0x1234567890abcdef1234567890abcdef12345678",
            value: "0x16345785d8a0000",
            gas: "0x5208",
            gasPrice: "0x9184e72a000",
            nonce: "0x0",
          },
        },
        output: {
          status: "success",
          message: "Transaction signed successfully",
          rawSignedTransaction: "0xf86c808509184e72a0008252089412345...",
        },
        explanation: "Sign an EVM transaction",
      },
    ],
  ],
  schema: z.object({
    transaction: z.record(z.any()).describe("EVM transaction object to sign"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    try {
      const rawSignedTransaction = await evmSignTransaction(
        agent,
        input.transaction
      );
      return {
        status: "success",
        message: "Transaction signed successfully",
        rawSignedTransaction,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: error?.message || "Failed to sign transaction",
      };
    }
  },
};

export default evmSignTransactionAction;
