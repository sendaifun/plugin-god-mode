import { PublicKey } from "@solana/web3.js";
import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import { transfer, transfer_spl } from "../tools";

const transferAction: Action = {
  name: "TRANSFER_SPL_TOKEN",
  similes: [
    "send tokens",
    "transfer tokens",
    "transfer spl token",
    "transfer spl token to another address",
    "transfer spl token to another wallet",
    "transfer spl token to another wallet address",
    "transfer spl token to another wallet address which is a solana public key",
  ],
  description: `This action/tool is used to transfer SPL tokens to another wallet address which is a solana public key.
  This action also handles the creation of a new token account for the recipient if they don't already have one.
  When using this action, the user is aware that they are transferring SPL tokens and not SOL.`,
  examples: [
    [
      {
        input: {
          to: "8x2dR8Mpzuz2YqyZyZjUbYWKSWesBo5jMx2Q9Y86udVk",
          amount: 1,
          mint: "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa",
        },
        output: {
          status: "success",
          message: "Transfer completed successfully",
          amount: 1,
          recipient: "8x2dR8Mpzuz2YqyZyZjUbYWKSWesBo5jMx2Q9Y86udVk",
          token: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          transaction:
            "5UfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
        },
        explanation: "Transfer 1 USDC token to the recipient address",
      },
    ],
    [
      {
        input: {
          to: "8x2dR8Mpzuz2YqyZyZjUbYWKSWesBo5jMx2Q9Y86udVk",
          amount: 100,
          mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        },
        output: {
          status: "success",
          message: "Transfer completed successfully",
          amount: 100,
          recipient: "8x2dR8Mpzuz2YqyZyZjUbYWKSWesBo5jMx2Q9Y86udVk",
          token: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          transaction:
            "4VfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKgvHYmXJgqJKxEqy9k4Rz9LpXrHF9kUZB7",
        },
        explanation: "Transfer 100 USDC tokens to the recipient address",
      },
    ],
  ],
  schema: z.object({
    to: z.string().min(32, "Invalid Solana address"),
    amount: z.number().positive("Amount must be positive"),
    mint: z.string().min(32, "Invalid token address"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const recipient = new PublicKey(input.to);
    const mintAddress = new PublicKey(input.mint);

    const tx = await transfer_spl(agent, recipient, input.amount, mintAddress);

    return {
      status: "success",
      message: "Transfer completed successfully",
      amount: input.amount,
      recipient: input.to,
      token: input.mint || "SOL",
      transaction: tx,
    };
  },
};

export default transferAction;
