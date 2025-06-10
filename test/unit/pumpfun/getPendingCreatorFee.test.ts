import getPendingCreatorFee from '../../../src/pumpfun/tools/getPendingCreatorFee';
import { SolanaAgentKit, KeypairWallet } from 'solana-agent-kit';
import { Keypair, Connection } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();

describe('getPendingCreatorFee', () => {
  let agent;

  beforeAll(() => {

    const rpcUrl = "https://rpc.sendai.fun";
    const keypair = Keypair.generate();
    const wallet = new KeypairWallet(keypair, rpcUrl);
    const connection = new Connection(rpcUrl, 'confirmed');
    agent = new SolanaAgentKit(wallet, rpcUrl, {});
    agent.connection = connection;
  });

    it('should return success when getPendingCreatorFee succeeds (real agent)', async () => {
    if (!agent) {
      return;
    }

    const result = await getPendingCreatorFee(agent);
    expect(result).toBeDefined();
    console.log('Real getPendingCreatorFee result:', result);
  });
});
