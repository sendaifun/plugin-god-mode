import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { Keypair } from '@solana/web3.js';
import { SolanaAgentKit } from 'solana-agent-kit';
import { KeypairWallet } from 'solana-agent-kit';
import { getBridgeUrl } from '../../src/debridge/tools/bridge';
import { Connection } from '@solana/web3.js';

describe('getBridgeUrl', () => {
  it('should generate the correct bridge URL with amount and address', async () => {
    // Mock publicKey with a toString method
    const mockPublicKey = {
      toString: () => 'FakePublicKey123',
    };
    // Mock wallet with publicKey
    const mockWallet = {
      publicKey: mockPublicKey,
    };
    // Mock agent with wallet
    const mockAgent = {
      wallet: mockWallet,
    };

    const rpcUrl = "https://api.devnet.solana.com";
    let keypair = Keypair.fromSecretKey(bs58.decode("48YuhkArpAaQA1FiyoaiXSvPst8C65rU5bikeWAK8uXCKrihSLVHruihtup5ppasR3nkmAvhae5mqokQ6MRpn33"))
    const wallet = new KeypairWallet(keypair, rpcUrl);
    const connection = new Connection(rpcUrl, 'confirmed');
    const agent = new SolanaAgentKit(wallet, rpcUrl, {});
    
    const amount = 42.5;
    const expectedUrl = `https://mcp.sendai.fun/bridge?amount=42.5&address=${wallet.publicKey.toString()}`;
    const url = await getBridgeUrl(agent, amount);
    console.log(url);
    expect(url).toBe(expectedUrl);
  });
});
