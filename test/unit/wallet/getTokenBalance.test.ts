import { KeypairWallet } from "solana-agent-kit";
import { Connection , Keypair, PublicKey } from "@solana/web3.js";
import getTokenBalance from "../../../src/wallet/tools/getTokenBalance";
import { SolanaAgentKit } from "solana-agent-kit";

describe("getTokenBalance", () => {

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

  it("should return token balance", async () => {
    const tokenBalance = await getTokenBalance(agent, new PublicKey("STREAMribRwybYpMmSYoCsQUdr6MZNXEqHgm7p1gu9M"));
    expect(tokenBalance).toBeDefined();
  });
});