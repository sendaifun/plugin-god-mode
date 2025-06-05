import { KeypairWallet } from "solana-agent-kit";
import { Connection , Keypair } from "@solana/web3.js";
import getTrendingTokens from "../../../src/birdeye/tools/getTrendingTokens";
import { SolanaAgentKit } from "solana-agent-kit";
import bs58 from "bs58";

describe("getToken", () => {

    // Use the real implementation, not a mock
    let agent;

    beforeAll(() => {
  
      const rpcUrl = "https://rpc.sendai.fun";
      // Accept both base58 and JSON array formats
      let keypair = Keypair.fromSecretKey(bs58.decode("48YuhkArpAaQA1FiyoaiXSvPst8C65rU5bikeWAK8uXCKrihSLVHruihtup5ppasR3nkmAvhae5mqokQ6MRpn33"))
      const wallet = new KeypairWallet(keypair, rpcUrl);
      const connection = new Connection(rpcUrl, 'confirmed');
      agent = new SolanaAgentKit(wallet, rpcUrl, {
        OTHER_API_KEYS: {
          BIRDEYE_API_KEY: "3c184d521c014fceb1fa6e17da7edee7",
        },
      });
      agent.connection = connection; // ensure connection is set
    });

  it("should return trending tokens", async () => {
    const trendingTokens = await getTrendingTokens(agent);
    expect(trendingTokens).toBeDefined();
  });
});