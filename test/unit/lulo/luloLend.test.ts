import { KeypairWallet } from "solana-agent-kit";
import { Connection , Keypair } from "@solana/web3.js";
import luloLend from "../../../src/lulo/tools/luloLend";
import { SolanaAgentKit } from "solana-agent-kit";
import bs58 from "bs58";

describe("luloLend", () => {

    // Use the real implementation, not a mock
    let agent;

    beforeAll(() => {
  
      const rpcUrl = "https://rpc.sendai.fun";
      // Accept both base58 and JSON array formats
      let keypair = Keypair.fromSecretKey(bs58.decode(""))
      const wallet = new KeypairWallet(keypair, rpcUrl);
      const connection = new Connection(rpcUrl, 'confirmed');
      agent = new SolanaAgentKit(wallet, rpcUrl, {
        OTHER_API_KEYS: {
          LULO_API_KEY: "5",
        },
      });
      agent.connection = connection; // ensure connection is set
    });

  it("should return lulo lend txn", async () => {
    const txn = await luloLend(agent, 100);
    expect(txn).toBeDefined();
  });
});