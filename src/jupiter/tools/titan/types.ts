export interface TitanSwapRoute {
  inAmount: number;
  outAmount: number;
  slippageBps: number;
  platformFee?: {
    amount: number;
    feeBps: number;
  };
  instructions: any[];
  addressLookupTables: Uint8Array[];
  contextSlot?: number;
  timeTakenNs?: number;
  expiresAtMs?: number;
  computeUnits?: number;
  computeUnitsSafe?: number;
  transaction?: Uint8Array;
  referenceId?: string;
}

export interface TitanSwapQuotes {
  id: string;
  inputMint: Uint8Array;
  outputMint: Uint8Array;
  swapMode: string;
  amount: number;
  quotes: { [key: string]: TitanSwapRoute };
}

export interface TitanQuoteResult {
  success: boolean;
  quotes?: TitanSwapQuotes;
  error?: string;
  bestQuote?: {
    provider: string;
    route: TitanSwapRoute;
  };
}

export interface TitanSwapRequest {
  inputMint: string;
  outputMint: string;
  amount: number;
  userPublicKey: string;
  slippageBps?: number;
  preferredProvider?: string;
}

export interface TitanSwapResult {
  success: boolean;
  transaction?: Uint8Array;
  error?: string;
  quote?: {
    provider: string;
    inputAmount: number;
    outputAmount: number;
    slippageBps: number;
  };
}
