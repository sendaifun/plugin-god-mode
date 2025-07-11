import { KeypairWallet } from "solana-agent-kit";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import transferSPL from "../../../src/wallet/tools/transferSPL";
import { SolanaAgentKit } from "solana-agent-kit";
import bs58 from "bs58";

describe("transferSPL", () => {

    let agent;

    beforeAll(async () => {

        const rpcUrl = "https://mainnet.helius-rpc.com/?api-key=a844f64d-a834-41be-ba2f-81e856982c89";
        // Accept both base58 and JSON array formats
        const keypair = Keypair.fromSecretKey(bs58.decode("KMyr6XXTuAoYaXDuNFb9RYoT9yT2v2gb5f4QBRpUWhEQMSGDmadF9jCDFiZK5dyofPQsg8kFGhJ1uBVZJyrxC97"))
        console.log(keypair.publicKey.toBase58());
        const wallet = new KeypairWallet(keypair, rpcUrl);
        const connection = new Connection(rpcUrl, 'confirmed');


        agent = new SolanaAgentKit(wallet, rpcUrl, {});
        agent.connection = connection; // ensure connection is set
    });

    // it("should transfer token owned by TOKEN PROGRAM", async () => {
    //     const toKeypair = Keypair.generate();
    //     const toPublicKey = toKeypair.publicKey;
    //     // SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa is mint address of SEND token
    //     const tx = await transferSPL(agent, toPublicKey, 0.1, new PublicKey("SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa"));
    //     expect(tx).toBeDefined();
    //     console.log(tx);
    // });

    it("should transfer token owned by TOKEN 2022 PROGRAM", async () => {
        const toKeypair = Keypair.generate();
        const toPublicKey = toKeypair.publicKey;
        // HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC is mint address of ai16z token
        const tx = await transferSPL(agent, toPublicKey, 0.1, new PublicKey("HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC"));
        expect(tx).toBeDefined();
        console.log(tx);
    });
});