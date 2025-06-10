import { KeypairWallet } from "solana-agent-kit";
import { Connection , Keypair } from "@solana/web3.js";
import getLuloBalance from "../../../src/lulo/tools/getLuloBalance";
import { SolanaAgentKit } from "solana-agent-kit";

describe("getLuloBalance", () => {

    let agent;

    beforeAll(() => {
  
      const rpcUrl = "https://rpc.sendai.fun";
      let keypair = Keypair.fromSecretKey(Keypair.generate().secretKey)
      console.log(keypair.publicKey.toString())
      const wallet = new KeypairWallet(keypair, rpcUrl);
      const connection = new Connection(rpcUrl, 'confirmed');
      agent = new SolanaAgentKit(wallet, rpcUrl, {
        OTHER_API_KEYS: {
          LULO_API_KEY: "5",
        },
      });
      agent.connection = connection;
    });

  it("should return lulo balance", async () => {
    const balance = await getLuloBalance(agent);
    expect(balance).toBeDefined();
  });
});