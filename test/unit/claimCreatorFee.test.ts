import claimCreatorFee from '../../src/pumpfun/tools/claimCreatorFee';
import * as tools from '../../src/pumpfun/tools';
import { SolanaAgentKit, KeypairWallet } from 'solana-agent-kit';
import { Keypair, Connection } from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';

dotenv.config();

describe('launchPumpfunTokenAction', () => {
  // Use the real implementation, not a mock
  let agent;

  beforeAll(() => {

    const rpcUrl = "https://rpc.sendai.fun";
    // Accept both base58 and JSON array formats
    let keypair = Keypair.fromSecretKey(bs58.decode("48YuhkArpAaQA1FiyoaiXSvPst8C65rU5bikeWAK8uXCKrihSLVHruihtup5ppasR3nkmAvhae5mqokQ6MRpn33"))
    const wallet = new KeypairWallet(keypair, rpcUrl);
    const connection = new Connection(rpcUrl, 'confirmed');
    agent = new SolanaAgentKit(wallet, rpcUrl, {});
    agent.connection = connection; // ensure connection is set
  });

    it('should return success when claimCreatorFee succeeds (real agent)', async () => {
    if (!agent) {
      return;
    }

    const result = await claimCreatorFee(agent);
    // The actual result may vary depending on the on-chain response
    expect(result.txHash).toBeDefined();
    // Optionally log the result for manual inspection
    console.log('Real claimCreatorFee result:', result);
  });
});
