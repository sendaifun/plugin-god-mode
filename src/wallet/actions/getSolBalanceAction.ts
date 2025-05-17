import { PublicKey } from "@solana/web3.js";
import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getSolBalance from "../tools/getSolBalance";

const getSolBalanceAction: Action = {
  name: "SOLANA_BALANCE",
  similes: [
    "check balance",
    "check solana balance",
    "get wallet balance",
    "view balance",
    "show balance",
  ],
  description: `This action/tool is used to check the balance of a the user's wallet.
  The balance is in SOL, the native token of Solana.
  When using this action, the user is aware that they are checking the balance of their wallet and not the balance of a specific token.`,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          balance: "100",
          token: "SOL",
        },
        explanation: "Get SOL balance of the wallet",
      },
    ],
  ],
  schema: z.object({}),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const balance = await getSolBalance(
      agent,
    );

    return {
      status: "success",
      balance: balance,
      token: "SOL",
    };
  },
};

export default getSolBalanceAction;
