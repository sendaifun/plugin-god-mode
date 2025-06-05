import { KeypairWallet } from "solana-agent-kit";
import { Connection , Keypair } from "@solana/web3.js";
import getPortfolio from "../../../src/wallet/tools/getPortfolio";
import { SolanaAgentKit } from "solana-agent-kit";

describe("getPortfolio", () => {

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

  it("should return portfolio", async () => {
    const portfolio = await getPortfolio(agent);
    expect(portfolio).toBeDefined();
  });
});