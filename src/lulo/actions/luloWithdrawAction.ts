import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import initiateLuloWithdraw from "../tools/initiateLuloWithdraw";

const luloWithdrawAction: Action = {
  name: "LULO_WITHDRAW",
  similes: [
    "withdraw USDC with lulo",
    "withdraw PYUSD with lulo",
    "withdraw USDS with lulo",
    "withdraw USDT with lulo",
    "withdraw SQL with lulo",
    "withdraw jitoSQL with lulo",
    "withdraw bSQL with lulo",
    "withdraw mSQL with lulo",
    "withdraw BONK with lulo",
    "withdraw JUP with lulo",
  ],
  description: "Withdraw SPL tokens using Lulo protocol",
  examples: [
    [
      {
        input: {
          amount: 100,
        },
        output: {
          status: "success",
          signature: "4xKpN2...",
          message: "Successfully withdraw 100 USDC",
        },
        explanation: "Withdraw 100 USDC on Lulo",
      },
    ],
  ],
  schema: z.object({
    amount: z.number().positive().describe("Amount to lend"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    try {
      const amount = input.amount as number;

      const response = await initiateLuloWithdraw(agent, amount);

      return {
        status: "success",
        transaction: response,
        message: `Successfully withdraw ${amount} of token USDC`,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Withdraw failed: ${error.message}`,
      };
    }
  },
};

export default luloWithdrawAction;
