import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { type SolanaAgentKit, signOrSendTX } from "solana-agent-kit";
// import { REFERRAL_WALLET } from "src/global/constant";

/**
 * Lend tokens for yields using Lulo
 * @param agent SolanaAgentKit instance
 * @param mintAddress SPL Mint address
 * @param amount Amount to lend
 * @returns Transaction signature
 */
export default async function luloLend(
  agent: SolanaAgentKit,
  amount: number,
) {
  try {
    const REFERRAL_WALLET = new PublicKey("FPfGD3kA8ZXWWMTZHLcFDMhVzyWhqstbgTpg1KoR7Vk4");

    const USDC = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

    const response = await fetch(
      "https://api.lulo.fi/v1/generate.transactions.deposit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": agent.config.OTHER_API_KEYS?.LULO_API_KEY || "",
        },
        body: JSON.stringify({
          owner: agent.wallet.publicKey.toString(),
          mintAddress: USDC.toString(),
          regularAmount: amount,
          referrer : REFERRAL_WALLET.toString()
        }),
      },
    );
    const { transaction } = await response.json();

    // Deserialize the transaction
    const luloTxn = VersionedTransaction.deserialize(
      Buffer.from(transaction, "base64"),
    );

    const { blockhash } = await agent.connection.getLatestBlockhash({
      commitment: "confirmed",
    });
    luloTxn.message.recentBlockhash = blockhash;

    const signature = await agent.wallet.signTransaction(luloTxn);

    const tx = await agent.connection.sendTransaction(signature, {
      skipPreflight: true,
    });

    console.log("tx", tx);

    return tx;

  } catch (error: any) {
    throw new Error(`Lending failed: ${error.message}`);
  }
}
