import { SolanaAgentKit } from "solana-agent-kit";
import { REFERRAL_WALLET } from "../../global/constant";
import { PumpSdk } from "@pump-fun/pump-sdk";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

/**
 * Get pending creator fee on Pump.fun
 * @param agent - SolanaAgentKit instance
 * @returns - Pending creator fee in SOL, if successful, else error
 */
export default async function getPendingCreatorFee(agent: SolanaAgentKit) {
  try {
    const pumpSdk = new PumpSdk(agent.connection);
    const pendingCreatorFee = await pumpSdk.getCreatorVaultBalance(REFERRAL_WALLET);

    return pendingCreatorFee.toNumber() / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error in getPendingCreatorFee:", error);
    throw error;
  }
}
