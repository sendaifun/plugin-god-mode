import { getMint, Mint, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { SolanaAgentKit } from "solana-agent-kit";
import cache from "../cache";

export interface MintInfo extends Mint {
  standard: string;
}

export default async function getMintInfo(
  agent: SolanaAgentKit,
  mint: PublicKey
): Promise<MintInfo> {
  const cacheKey = `mintInfo:${mint.toString()}`;
  const cachedValue = await cache.getCacheValue(agent, cacheKey);
  if (cachedValue) {
    return cachedValue;
  }

  try {
    const mintInfo = await getMint(agent.connection, mint);
    const mintInfoWithStandard: MintInfo = {
      ...mintInfo,
      standard: "token",
    };
    await cache.setCacheValue(agent, cacheKey, mintInfoWithStandard);
    return mintInfoWithStandard;
  } catch (error) {
    if (error && error.toString().includes("TokenInvalidAccountOwnerError")) {
      const mintInfo = await getMint(agent.connection, mint, "confirmed", TOKEN_2022_PROGRAM_ID);
      const mintInfoWithStandard: MintInfo = {
        ...mintInfo,
        standard: "token-2022",
      };
      await cache.setCacheValue(agent, cacheKey, mintInfoWithStandard);
      return mintInfoWithStandard;
    }

    console.error("Error getting mint info", error);
    throw error;
  }
}
