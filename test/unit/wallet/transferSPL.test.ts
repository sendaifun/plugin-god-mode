import { KeypairWallet } from "solana-agent-kit";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import transferSPL from "../../../src/wallet/tools/transferSPL";
import { SolanaAgentKit } from "solana-agent-kit";
import bs58 from "bs58";

describe("transferSPL", () => {

    let agent;

    beforeAll(async () => {

        const rpcUrl = "https://devnet.helius-rpc.com/?api-key=a844f64d-a834-41be-ba2f-81e856982c89";
        // Accept both base58 and JSON array formats
        const keypair = Keypair.fromSecretKey(bs58.decode("KMyr6XXTuAoYaXDuNFb9RYoT9yT2v2gb5f4QBRpUWhEQMSGDmadF9jCDFiZK5dyofPQsg8kFGhJ1uBVZJyrxC97"))

        const wallet = new KeypairWallet(keypair, rpcUrl);
        const connection = new Connection(rpcUrl, 'confirmed');


        agent = new SolanaAgentKit(wallet, rpcUrl, {});
        agent.connection = connection; // ensure connection is set
    });

    it("should return wallet address", async () => {
        const toKeypair = Keypair.generate();
        const toPublicKey = toKeypair.publicKey;
        const tx = await transferSPL(agent, toPublicKey, 0.1, new PublicKey("3odhfo8SMsS6e5mHXLLBcCqYptmMKfpVsdTLxs2oh58v"));
        expect(tx).toBeDefined();
        console.log(tx);
    });
});