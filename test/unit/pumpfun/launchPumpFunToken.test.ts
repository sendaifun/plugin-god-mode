import launchPumpfunTokenAction from '../../../src/pumpfun/tools/launchPumpfunToken';
import { SolanaAgentKit, KeypairWallet } from 'solana-agent-kit';
import { Keypair, Connection } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();

describe('launchPumpFunToken', () => {
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

  it('should return success when launchPumpFunToken succeeds (real agent)', async () => {
    if (!agent) {
      return;
    }

    const input = {
      tokenName: 'Dark SEND',
      tokenTicker: 'DARK SEND',
      description: `This is a test token for testing pumpfun launch on [redacted] SEND platform, don't buy. you might loose money.`,
      imageUrl: 'https://i.imgur.com/dzW590S.jpeg',
      amount: 0,
    };

    const result = await launchPumpfunTokenAction(agent, input.tokenName, input.tokenTicker, input.description, input.imageUrl, input.amount);
    // The actual result may vary depending on the on-chain response
    expect(result.mint).toBeDefined();
    // Optionally log the result for manual inspection
    console.log('Real launchPumpfunTokenAction result:', result);
  });
});
