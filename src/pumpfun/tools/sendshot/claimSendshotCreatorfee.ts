import { VersionedTransaction } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";

interface ClaimSendshotCreatorfeeResponse {
  tx: string;
  error?: string;
}

/**
 * Claim creator fee on Sendshot
 * @param agent - SolanaAgentKit instance
 * @returns - Signature of the transaction, mint address and metadata URI, if successful, else error
 */
export default async function claimSendshotCreatorFee(
  agent: SolanaAgentKit,
  mintAddress: string
) {
  try {
    const response = await fetch(
      `https://sendhsot-minter-peand.ondigitalocean.app/mint/claim-creator-fee`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": agent.config.OTHER_API_KEYS?.SENDSHOT_API_KEY!,
        },
        body: JSON.stringify({
          tokenMint: mintAddress,
          claimer: agent.wallet.publicKey.toBase58(),
        }),
      }
    );
    const responseData: ClaimSendshotCreatorfeeResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error);
    }

    const serializedTx = responseData.tx;
    if (!serializedTx) {
      throw new Error("No transaction data received from API");
    }

    const tx = VersionedTransaction.deserialize(
      Buffer.from(serializedTx, "base64")
    );
    tx.message.recentBlockhash = (
      await agent.connection.getLatestBlockhash({
        commitment: "confirmed",
      })
    ).blockhash;

    let signedTx;
    // Sign the transaction
    try {
      signedTx = await agent.wallet.signTransaction(tx);
      if (!signedTx) {
        throw new Error("Transaction signing was cancelled or failed.");
      }
    } catch (signError: any) {
      console.error("Error signing transaction:", signError);
      throw new Error(
        signError.message || "Failed to sign transaction. Please try again."
      );
    }
    return {
      txHash: signedTx,
      mint: mintAddress,
      message: `Successfully claimed creator fee for token ${mintAddress}`,
    };
  } catch (error) {
    console.error("Error in claimSendshotCreatorFee:", error);
    throw error;
  }
}
