import { Keypair } from '@solana/web3.js';
import { SolanaAgentKit } from 'solana-agent-kit';
import { KeypairWallet } from 'solana-agent-kit';
import getBridgeUrl from '../../../src/debridge/tools/bridge';
import { Connection } from '@solana/web3.js';

describe('getBridgeUrl', () => {
  it('should generate the correct bridge URL with amount and address', async () => {
    const rpcUrl = "https://rpc.sendai.fun";
    const keypair = Keypair.generate();
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
