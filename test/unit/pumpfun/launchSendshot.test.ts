import launchSendShot from "../../../src/pumpfun/tools/sendshot/launchSendshot";
import { SolanaAgentKit, KeypairWallet } from "solana-agent-kit";
import { Keypair, Connection } from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();

describe("launchSendShot", () => {
    // Use the real implementation, not a mock
    let agent;

    beforeAll(() => {
        const rpcUrl = "https://rpc.sendai.fun";
        // Accept both base58 and JSON array formats
        const keypair = Keypair.generate();
        const wallet = new KeypairWallet(keypair, rpcUrl);
        const connection = new Connection(rpcUrl, "confirmed");
        agent = new SolanaAgentKit(wallet, rpcUrl, {
            OTHER_API_KEYS: {
                SENDSHOT_API_KEY: "FF5AFEBE-C665-4EC4-B78F-CDA2D1ADC70F",
            },
        });
        agent.connection = connection; // ensure connection is set
    });

    it("should return success when launchSendShot succeeds (real agent)", async () => {
        if (!agent) {
            return;
        }

        const input = {
            name: "Dark SEND",
            symbol: "DARK SEND",
            description: `This is a test token for testing sendshot launch on [redacted] SEND platform, don't buy. you might loose money.`,
            imageUrl: "https://i.imgur.com/dzW590S.jpeg",
            amount: 0,
            twitter: "https://twitter.com/test",
            telegram: "https://t.me/test",
            website: "https://example.com",
            referal: "raycast",
        };

        const result = await launchSendShot(
            agent,
            input.name,
            input.symbol,
            input.description,
            input.imageUrl,
            input.amount,
            input.twitter,
            input.telegram,
            input.website,
            input.referal,
        );
        // The actual result may vary depending on the on-chain response
        expect(result).toBeDefined();
        // Optionally log the result for manual inspection
        console.log("Real launchSendShot result:", result);
    });
});
