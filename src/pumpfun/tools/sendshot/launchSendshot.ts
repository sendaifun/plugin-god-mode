import { VersionedTransaction } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";

interface SendShotResponse {
  mint: string;
  tx: string;
  error?: string;
}

export default async function launchSendshot(
  agent: SolanaAgentKit,
  name: string,
  symbol: string,
  description: string,
  imageUrl: string,
  amount: number,
  twitter?: string,
  telegram?: string,
  website?: string
) {
  try {
    const response = await fetch(
      `https://sendhsot-minter-peand.ondigitalocean.app/mint/post-signed-tx`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": agent.config.OTHER_API_KEYS?.SENDSHOT_API_KEY!,
        },
        body: JSON.stringify({
          user: agent.wallet.publicKey.toBase58(),
          name: name,
          symbol: symbol.toUpperCase(),
          description: description,
          imageUrl: imageUrl,
          platform: "meteora",
          amount: amount,
          twitter: twitter,
          telegram: telegram,
          website: website,
        }),
      }
    );

    const responseData: SendShotResponse = await response.json();

    if (!response.ok) {
      console.error("Sendshot API error response:", responseData);

      throw new Error(
        responseData.error ||
          `Sendshot API request failed with status ${response.status}`
      );
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
    let encodedTx;
    try {
      signedTx = await agent.wallet.signTransaction(tx);

      const serializedSignedTx = signedTx.serialize();
      encodedTx = Buffer.from(serializedSignedTx).toString("base64");
      if (!signedTx) {
        throw new Error("Transaction signing was cancelled or failed.");
      }
    } catch (signError: any) {
      console.error("Error signing transaction:", signError);
      throw new Error(
        signError.message || "Failed to sign transaction. Please try again."
      );
    }

    const signTxResponse = await fetch(
      `https://sendhsot-minter-peand.ondigitalocean.app/mint/sign-tx`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": agent.config.OTHER_API_KEYS?.SENDSHOT_API_KEY!,
        },
        body: JSON.stringify({
          mintAddress: responseData.mint,
          tx: encodedTx,
        }),
      }
    );
    const signTxResponseData = await signTxResponse.json();
    return {
      mint: responseData.mint,
      txHash: signTxResponseData.hash,
    };
  } catch (error) {
    console.error("Error calling Sendshot API:", error);
    throw new Error(
      error instanceof Error ? error.message : "Sendshot API request failed"
    );
  }
}
