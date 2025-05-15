// Types for Birdeye portfolio API response

export interface BirdeyePortfolioItem {
  address: string;
  decimals: number;
  balance: number;
  uiAmount: number;
  chainId: string;
  name: string;
  symbol: string;
  logoURI: string;
  priceUsd: number;
  valueUsd: number;
}

export interface BirdeyePortfolioData {
  wallet: string;
  totalUsd: number;
  items: BirdeyePortfolioItem[];
}

export interface BirdeyePortfolioResponse {
  success: boolean;
  data: BirdeyePortfolioData;
}
