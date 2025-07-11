export interface JupiterTokenData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  tags: string[];
  logoURI: string;
  daily_volume: number;
  freeze_authority: string | null;
  mint_authority: string | null;
  permanent_delegate: string | null;
  extensions: {
    coingeckoId?: string;
  };
}

export interface CreateJupiterOrderRequest {
  maker?: string;
  payer?: string;
  inputMint: string;
  outputMint: string;
  params: {
    makingAmount: string;
    takingAmount: string;
    expiredAt?: string | undefined;
    feeBps?: string;
  };
  computeUnitPrice?: string | "auto";
  referral?: string;
  wrapAndUnwrapSol?: boolean;
}

export interface CreateJupiterOrderResponse {
  order: string;
  tx: string;
}

export interface OpenJupiterOrderAccount {
  borrowMakingAmount: string;
  createdAt: string;
  expiredAt: string | null;
  makingAmount: string;
  oriMakingAmount: string;
  oriTakingAmount: string;
  takingAmount: string;
  uniqueId: string;
  updatedAt: string;
  feeAccount: string;
  inputMint: string;
  inputMintReserve: string;
  inputTokenProgram: string;
  maker: string;
  outputMint: string;
  outputTokenProgram: string;
  feeBps: number;
  bump: number;
}

export interface OpenJupiterOrderResponse {
  account: OpenJupiterOrderAccount;
  publicKey: string;
}

export interface CancelJupiterOrderRequest {
  maker?: string;
  computeUnitPrice?: string | "auto";
  orders?: string[];
}

export interface CancelJupiterOrderResponse {
  txs: string[];
}

export interface JupiterTrade {
  amount: string;
  price: string;
  timestamp: string;
}

export interface JupiterOrderHistoryItem {
  userPubkey: string;
  orderKey: string;
  inputMint: string;
  outputMint: string;
  makingAmount: string;
  takingAmount: string;
  remainingMakingAmount: string;
  remainingTakingAmount: string;
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string;
  status: "Open" | "Completed" | "Cancelled";
  openTx: string;
  closeTx: string;
  programVersion: string;
  trades: JupiterTrade[];
}

export interface JupiterOrderHistoryResponse {
  orders: JupiterOrderHistoryItem[];
  hasMoreData: boolean;
  page: number;
}

export interface JupiterUltraOrderResponse {
  mode?: string;
  swapType: string;
  router?: string;
  requestId: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: Array<{
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }>;
  inputMint: string;
  outputMint: string;
  feeMint: string;
  feeBps: number;
  taker?: string;
  gasless: boolean;
  transaction?: string;
  prioritizationFeeLamports: number;
  totalTime: number;
  quoteId: string;
  maker: string;
  expireAt: string;
  platformFee: {
    amount: string;
    feeBps: number;
  };
  errorMessage?: string;
  dynamicSlippageReport: {
    slippageBps: number;
    categoryName: string;
    heuristicMaxSlippageBps: number;
  };
}
