import { KeypairWallet } from "solana-agent-kit";
import { Connection , Keypair } from "@solana/web3.js";
import getSolBalance from "../../../src/wallet/tools/getSolBalance";
import { SolanaAgentKit } from "solana-agent-kit";

describe("getSolBalance", () => {

    // Use the real implementation, not a mock
    let agent;

    beforeAll(() => {
  
      const rpcUrl = "https://rpc.sendai.fun";
      // Accept both base58 and JSON array formats
      const keypair = Keypair.generate();
      const wallet = new KeypairWallet(keypair, rpcUrl);
      const connection = new Connection(rpcUrl, 'confirmed');
      agent = new SolanaAgentKit(wallet, rpcUrl, {});
      agent.connection = connection; // ensure connection is set
    });

  it("should return sol balance", async () => {
    const solBalance = await getSolBalance(agent);
    expect(solBalance).toBeGreaterThan(0);
  });
});
