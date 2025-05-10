import { Action } from "solana-agent-kit";
import { z } from "zod";
import { rock_paper_scissor } from "../tools";

const rockPaperScissorAction: Action = {
  name: "ROCK_PAPER_SCISSORS",
  similes: [
    "play rock paper scissors",
    "play rps",
    "rock paper scissors game",
    "rps game",
    "play sendarcade rps",
    "rock paper scissors bet",
    "rps bet",
    "rock paper scissors",
  ],
  description: `This action/tool is used to play a game of Rock Paper Scissors on SendArcade with SOL bets.
  When using this action, the user is aware that they are playing a game of Rock Paper Scissors on SendArcade with SOL bets,
  The user is also aware that they are betting SOL and the risk of losing the bet.`,
  examples: [
    [
      {
        input: {
          amount: 0.1,
          choice: "rock",
        },
        output: {
          status: "success",
          message: "You won! Prize claimed successfully",
          signature: "2ZE7Rz...",
        },
        explanation:
          "Play Rock Paper Scissors betting 0.1 SOL and choosing rock",
      },
      {
        input: {
          amount: 0.05,
          choice: "paper",
        },
        output: {
          status: "success",
          message: "You lost! Better luck next time",
          signature: "3YKpM1...",
        },
        explanation:
          "Play Rock Paper Scissors betting 0.05 SOL and choosing paper",
      },
    ],
  ],
  schema: z.object({
    amount: z.number().positive().describe("Amount of SOL to bet"),
    choice: z
      .enum(["rock", "paper", "scissors"])
      .describe("Your choice for the game"),
  }),
  handler: async (agent, input) => {
    try {
      const result = await rock_paper_scissor(
        agent,
        input.amount,
        input.choice,
      );

      // If result is a string starting with "You lost", return loss result
      if (typeof result === "string" && result.startsWith("You lost")) {
        return {
          status: "success",
          message: result,
        };
      }

      // Otherwise return win result
      return {
        status: "success",
        transaction: result,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `Rock Paper Scissors game failed: ${error.message}`,
      };
    }
  },
};

export default rockPaperScissorAction;
