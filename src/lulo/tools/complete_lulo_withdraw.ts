import { VersionedTransaction } from "@solana/web3.js";
import { type SolanaAgentKit, signOrSendTX } from "solana-agent-kit";

/**
 * Fetch pending withdrawals for a user from Lulo
 * @param agent SolanaAgentKit instance
 * @returns Array of pending withdrawals
 */
export async function fetchPendingLuloWithdrawals(agent: SolanaAgentKit) {
  const owner = agent.wallet.publicKey.toBase58();
  const response = await fetch(
    `https://api.lulo.fi/v1/account.withdrawals.listPendingWithdrawals?owner=${owner}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": agent.config.OTHER_API_KEYS?.LULO_API_KEY || "",
      },
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch pending withdrawals: ${response.statusText}`);
  }
  const data = await response.json();
  return data.pendingWithdrawals || [];
}

/**
 * Complete the first pending withdrawal for a user using Lulo
 * @param agent SolanaAgentKit instance
 * @returns Transaction signature or null if no pending withdrawals
 */
export async function completeLuloWithdraw(agent: SolanaAgentKit) {
  const owner = agent.wallet.publicKey.toBase58();
  const feePayer = owner;
  const pendingWithdrawals = await fetchPendingLuloWithdrawals(agent);
  if (!pendingWithdrawals.length) {
    return null;
  }
  const first = pendingWithdrawals[0];
  const response = await fetch(
    "https://api.lulo.fi/v1/generate.transactions.completeRegularWithdrawal",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": agent.config.OTHER_API_KEYS?.LULO_API_KEY || "",
      },
      body: JSON.stringify({
        owner,
        pendingWithdrawalId: first.withdrawalId,
        feePayer,
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to complete withdrawal: ${response.statusText}`);
  }
  const { transaction } = await response.json();
  const luloTxn = VersionedTransaction.deserialize(
    Buffer.from(transaction, "base64"),
  );
  const { blockhash } = await agent.connection.getLatestBlockhash();
  luloTxn.message.recentBlockhash = blockhash;
  return signOrSendTX(agent, luloTxn);
}
