import type { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import onramp from "../tools/onramp";

const onrampAction: Action = {
  name: "ONRAMP",
  similes: [
    "buy crypto",
    "buy sol",
    "buy solana",
    "onramp",
    "purchase crypto",
    "add funds",
    "fund wallet",
    "moonpay",
    "buy tokens",
    "deposit crypto",
  ],
  description: `This action/tool is used to generate a MoonPay onramp URL for purchasing SOL directly to the user's wallet. The user can optionally specify an amount to purchase. The generated URL will redirect to MoonPay's interface where they can complete the purchase using fiat currency.`,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          url: "https://buy.moonpay.com/...",
          message: "MoonPay onramp URL generated successfully",
        },
        explanation: "Generate a MoonPay onramp URL without specifying an amount",
      },
    ],
    [
      {
        input: { amount: 100 },
        output: {
          status: "success",
          url: "https://buy.moonpay.com/...",
          message: "MoonPay onramp URL generated successfully for $100 worth of SOL",
        },
        explanation: "Generate a MoonPay onramp URL with a specific amount",
      },
    ],
  ],
  schema: z.object({
    amount: z.number().positive().optional().describe("The amount in USD to purchase (optional)"),
  }),
  handler: async (agent: SolanaAgentKit, input: { amount?: number }) => {
    try {
      const url = onramp(agent, input.amount);
      
      return {
        status: "success",
        url,
        message: input.amount 
          ? `Onramp URL generated successfully for $${input.amount} worth of SOL`
          : "Onramp URL generated successfully",
      };
    } catch (error: any) {  
      return {
        status: "error",
        message: `Failed to generate onramp URL: ${error.message}`,
      };
    }
  },
};

export default onrampAction;
