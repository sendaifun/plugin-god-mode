import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import launchMeteoraToken from "../tools/launchMeteoraToken";

const launchMeteoraTokenAction: Action = {
    name: "LAUNCH_METEORA_TOKEN",
    similes: [
        "create meteora token",
        "launch token on meteora",
        "deploy meteora token",
        "create meme token",
        "launch memecoin",
        "create meteora token",
    ],
    description: "Launch a new token on Meteora with customizable metadata and initial liquidity",
    examples: [
        [
            {
                input: {
                    tokenName: "Sample Token",
                    tokenTicker: "SMPL",
                    description: "A sample token for demonstration",
                    imageUrl: "https://example.com/token.png",
                    twitter: "@sampletoken",
                    telegram: "t.me/sampletoken",
                    website: "https://sampletoken.com",
                },
                output: {
                    status: "success",
                    tokenAddress: "7nxQB...",
                    txHash: "2ZE7Rz...",
                    message: "Successfully launched token on Meteora",
                },
                explanation: "Launch a new token with custom metadata",
            },
        ],
    ],
    schema: z.object({
        tokenName: z.string().min(1).max(32).describe("Name of the token"),
        tokenTicker: z.string().min(2).max(10).describe("Ticker symbol of the token"),
        description: z.string().min(1).max(1000).describe("Description of the token"),
        imageUrl: z.string().url().describe("URL of the token image"),
        twitter: z.string().optional().describe("Twitter handle (optional)"),
        telegram: z.string().optional().describe("Telegram group link (optional)"),
        website: z.string().url().optional().describe("Website URL (optional)"),
        amount: z.number().optional().describe("Amount of SOL to buy tokens (optional)"),
        referal: z.string().optional().describe("Platform of token launch (optional)")
    }),
    handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
        try {
            const { tokenName, tokenTicker, description, imageUrl, twitter, telegram, website, amount, referal } =
                input;


            if (agent.config.OTHER_API_KEYS?.SENDSHOT_API_KEY) {
                throw new Error("SENDSHOT_API_KEY is not set");
            }

            const result = await launchMeteoraToken(
                agent,
                tokenName,
                tokenTicker,
                description,
                imageUrl,
                amount,
                twitter,
                telegram,
                website,
                referal
            );

            return {
                status: "success",
                message: "Successfully launched token on Meteora",
                tokenAddress: result.mint,
                txHash: result.txHash,
            };
        } catch (error: any) {
            return {
                status: "error",
                message: `Failed to launch token: ${error.message}`,
            };
        }
    },
};

export default launchMeteoraTokenAction;
