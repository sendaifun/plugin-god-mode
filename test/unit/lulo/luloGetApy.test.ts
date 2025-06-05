import { KeypairWallet } from "solana-agent-kit";
import { Connection , Keypair } from "@solana/web3.js";
import luloGetApy from "../../../src/lulo/tools/luloGetApy";
import { SolanaAgentKit } from "solana-agent-kit";
import bs58 from "bs58";

describe("luloGetApy", () => {

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
          LULO_API_KEY: "5a8c4878-349a-4efe-a773-fa611b5b19e5",
        },
      });
      agent.connection = connection; // ensure connection is set
    });

  it("should return lulo apy", async () => {
    const apy = await luloGetApy(agent);
    expect(apy).toBeDefined();
  });
});