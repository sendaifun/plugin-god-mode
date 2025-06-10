import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getLuloBalance from "../tools/getLuloBalance";

const luloGetBalanceAction: Action = {
  name: "LULO_GET_BALANCE",
  similes: [
    "get lulo balance",
    "check lulo account",
    "lulo account balance",
    "show lulo earnings",
  ],
  description: "Get account balance and earnings information from Lulo protocol",
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          data: {
            totalUsdValue: 42614.01905759553,
            lusdUsdBalance: 402.9785937189397,
            pusdUsdBalance: 42211.04046387659,
            totalInterestEarned: 236.5542541100902,
          },
          message: "Successfully retrieved Lulo account balance",
        },
        explanation: "Get current account balance and earnings from Lulo",
      },
    ],
  ],
  schema: z.object({}),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    try {
      const response = await getLuloBalance(agent);

      return {
        status: "success",
        data: response,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Failed to get Lulo balance: ${error.message}`,
      };
    }
  },
};

export default luloGetBalanceAction;
