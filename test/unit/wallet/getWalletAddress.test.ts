import { KeypairWallet } from "solana-agent-kit";
import { Connection , Keypair, PublicKey } from "@solana/web3.js";
import getWalletAddress from "../../../src/wallet/tools/getWalletAddress";
import { SolanaAgentKit } from "solana-agent-kit";

describe("getWalletAddress", () => {

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

  it("should return wallet address", async () => {
    const walletAddress = await getWalletAddress(agent);
    expect(walletAddress).toBe(agent.wallet.publicKey.toBase58());
  });
});