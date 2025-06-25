import { KeypairWallet } from "solana-agent-kit";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import getMintInfo from "../../../src/helpers/token/getMint";
import { SolanaAgentKit } from "solana-agent-kit";

describe("getMintInfo", () => {

    let agent;

    beforeAll(() => {

        const rpcUrl = "https://rpc.sendai.fun";
        // Accept both base58 and JSON array formats
        const keypair = Keypair.generate();
        const wallet = new KeypairWallet(keypair, rpcUrl);
        const connection = new Connection(rpcUrl, 'confirmed');
        agent = new SolanaAgentKit(wallet, rpcUrl, {
            OTHER_API_KEYS: {
                JUPITER_API_KEY: process.env.JUPITER_API_KEY || "",
            },
        });
        agent.connection = connection; // ensure connection is set
    });

    it("should return mint info for Token Program", async () => {
        const mintInfo = await getMintInfo(agent, new PublicKey("SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa"));

        console.log(mintInfo);

        expect(mintInfo).toBeDefined();
    });

    it("should return mint info for Token 2022 Program", async () => {
        const mintInfo = await getMintInfo(agent, new PublicKey("HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC"));

        console.log(mintInfo);

        expect(mintInfo).toBeDefined();
    });
});