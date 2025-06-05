import buy from '../../../src/jupiter/tools/buy';
import { SolanaAgentKit, KeypairWallet } from 'solana-agent-kit';
import { Keypair, Connection, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';
import { TOKENS } from '../../../src/jupiter/tools/utils/constants';

dotenv.config();

describe('buyAction', () => {
  let agent: SolanaAgentKit;

  beforeAll(() => {
    const rpcUrl = process.env.RPC_URL || "https://api.mainnet-beta.solana.com"; // Default to mainnet if no RPC_URL
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
      throw new Error('PRIVATE_KEY environment variable is not set. Please set it in your .env file.');
    }

    // Accept both base58 and JSON array formats for the private key
    let keypair: Keypair;
    try {
      if (privateKey.startsWith('[')) {
        keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(privateKey)));
      } else {
        keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
      }
    } catch (error) {
      console.error("Failed to create Keypair from private key:", error);
      throw new Error('Invalid PRIVATE_KEY format. Ensure it is a valid base58 string or a JSON array of numbers.');
    }
    
    const wallet = new KeypairWallet(keypair, rpcUrl);
    const connection = new Connection(rpcUrl, 'confirmed');
    agent = new SolanaAgentKit(wallet, rpcUrl, {});
    agent.connection = connection; // ensure connection is set
  });

  it('should successfully buy tokens (real agent)', async () => {
    if (!agent) {
      console.warn('Agent not initialized, skipping test.');
      return;
    }

    // Example: Buy USDC with SOL
    // You might want to use a less valuable token for actual testing or a specific test token if available
    const outputMint = TOKENS.USDC; // Using USDC as an example output token
    const inputAmount = 0.0001; // Amount of SOL to spend, e.g., 0.0001 SOL

    try {
      const resultSignature = await buy(agent, outputMint, inputAmount);
      
      expect(resultSignature).toBeDefined();
      expect(typeof resultSignature).toBe('string');
      console.log('Real buyAction result (transaction signature):', resultSignature);
      console.log(`https://solscan.io/tx/${resultSignature}`);

      // Add a small delay to allow the transaction to be processed if needed for subsequent checks,
      // though for a simple signature check, it's often not necessary.
      // await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay

    } catch (error) {
      console.error("Buy action failed during test:", error);
      // Depending on the expected behavior for certain errors, you might want to adjust assertions.
      // For instance, if some failures are expected under certain conditions (e.g. insufficient funds),
      // you could specifically test for those.
      // For a general success test, any error would be a test failure.
      throw error; // Re-throw to fail the test
    }
  }, 60000); // Increase timeout for on-chain transactions
});
