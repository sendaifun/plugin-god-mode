import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getSolPrice from "../tools/getSolPrice";

// TODO: Import or define a function to get SOL price, e.g., getSolPriceFromOracle

const getSolPriceAction: Action = {
  name: "GET_SOL_PRICE",
  similes: [
    "get sol price",
    "check sol price",
    "what is sol price",
    "fetch solana price",
    "current sol value",
  ],
  description: `This action/tool is used to check the current market price of SOL (Solana).
  The price will be returned in USD unless specified otherwise (though currently only USD is supported).
  When using this action, the user is aware that they are checking the market price of SOL.`,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          price: "150.25", // Example price
          currency: "USD",
        },
        explanation: "Get the current SOL price in USD.",
      },
    ],
  ],
  schema: z.object({
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const price = await getSolPrice(agent);

    if (price === undefined) {
      return {
        status: "error",
        message: "Could not fetch SOL price.",
      };
    }

    return {
      status: "success",
      price: price,
      currency: "USD",
    };
  },
};

export default getSolPriceAction;
