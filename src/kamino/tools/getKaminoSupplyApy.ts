import axios from "redaxios";
import type { SolanaAgentKit } from "solana-agent-kit";

const DEFAULT_MARKET = "7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF";

export interface KaminoSupplyMetric {
  reserve: string;
  liquidityToken: string;
  liquidityTokenMint: string;
  maxLtv: string;
  borrowApy: string;
  supplyApy: string;
  totalSupply: string;
  totalBorrow: string;
  totalBorrowUsd: string;
  totalSupplyUsd: string;
}

export default async function getKaminoSupplyApy(
  _agent: SolanaAgentKit,
  marketPubkey?: string
): Promise<{ marketPubkey: string; metrics: KaminoSupplyMetric[] }> {
  const market = (marketPubkey || DEFAULT_MARKET).trim();
  const url = `https://api.kamino.finance/kamino-market/${market}/reserves/metrics`;

  const res = await axios.get(url);
  if (res.status !== 200) {
    throw new Error(`Failed to fetch Kamino supply APY: ${res.status} ${res.statusText}`);
  }

  return {
    marketPubkey: market,
    metrics: res.data as KaminoSupplyMetric[],
  };
}
