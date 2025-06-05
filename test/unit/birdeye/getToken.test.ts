import { KeypairWallet } from "solana-agent-kit";
import { Connection , Keypair } from "@solana/web3.js";
import getToken from "../../../src/birdeye/tools/getToken";
import { SolanaAgentKit } from "solana-agent-kit";

describe("getToken", () => {

    // Use the real implementation, not a mock
    let agent;

    beforeAll(() => {
  
      const rpcUrl = "https://rpc.sendai.fun";
      // Accept both base58 and JSON array formats
      const keypair = Keypair.generate();
      const wallet = new KeypairWallet(keypair, rpcUrl);
      const connection = new Connection(rpcUrl, 'confirmed');
      agent = new SolanaAgentKit(wallet, rpcUrl, {
        OTHER_API_KEYS: {
          BIRDEYE_API_KEY: "3c184d521c014fceb1fa6e17da7edee7",
        },
      });
      agent.connection = connection; // ensure connection is set
    });

  it("should return token overview", async () => {
    const token = await getToken(agent, "So11111111111111111111111111111111111111112");
    expect(token).toBeDefined();
  });
});