import { PublicKey } from "@solana/web3.js";
import type { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getTokenBalance from "../tools/getTokenBalance";

const tokenBalancesAction: Action = {
  name: "TOKEN_BALANCE",
  similes: [
    "check token balances",
    "get wallet token balances",
    "view token balances",
    "show token balances",
    "check token balance",
    "get token balance",
    "view token balance",
    "show token balance",
  ],
  description: `This action/tool is used to check the token balances of a the user's wallet.
  The response contains the name, symbol, balance and decimals of the token.
  When using this action, the user is aware that they are checking the token balances of their wallet and not the token balances of a specific token.`,
  examples: [
    [
      {
        input: {
          mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        },
        output: {
          status: "success",
          balance: {
            sol: 100,
            tokens: [
              {
                tokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                name: "USD Coin",
                symbol: "USDC",
                balance: 100,
                decimals: 9,
              },
            ],
          },
        },
        explanation: "Get token balances of the wallet",
      },
    ],
    [
      {
        input: {
          mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        },
        output: {
          status: "success",
          balance: {
            sol: 100,
            tokens: [
              {
                tokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                name: "USD Coin",
                symbol: "USDC",
                balance: 100,
                decimals: 9,
              },
            ],
          },
        },
        explanation: "Get address token balance",
      },
    ],
  ],
  schema: z.object({
    mint: z.string(),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const balance = await getTokenBalance(
      agent,
      new PublicKey(input.mint),
    );

    return {
      status: "success",
      balance: balance,
    };
  },
};

export default tokenBalancesAction;
