import { SolanaAgentKit } from "solana-agent-kit";

const HELIUS_BASE_URL = "https://api.helius.xyz/v0";

export interface HeliusTransaction {
  description: string;
  type: string;
  source: string;
  fee: number;
  feePayer: string;
  signature: string;
  slot: number;
  timestamp: number;
  tokenTransfers: TokenTransfer[];
  nativeTransfers: NativeTransfer[];
  accountData: AccountData[];
  transactionError: any;
  instructions: HeliusInstruction[];
  events: any;
}

export interface TokenTransfer {
  fromTokenAccount: string;
  toTokenAccount: string;
  fromUserAccount: string;
  toUserAccount: string;
  tokenAmount: number;
  mint: string;
  tokenStandard: string;
}

export interface NativeTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
}

export interface AccountData {
  account: string;
  nativeBalanceChange: number;
  tokenBalanceChanges: TokenBalanceChange[];
}

export interface TokenBalanceChange {
  userAccount: string;
  tokenAccount: string;
  rawTokenAmount: {
    tokenAmount: string;
    decimals: number;
  };
  mint: string;
}

export interface HeliusInstruction {
  accounts: string[];
  data: string;
  programId: string;
  innerInstructions: HeliusInstruction[];
}

export interface TransactionData {
  signature: string;
  timestamp: number;
  slot: number;
  type: string;
  status: string;
  fee: number;
  amount?: number;
  tokenSymbol?: string;
  tokenMint?: string;
  from?: string;
  to?: string;
  description: string;
  source: string;
}

function extractTransactionAmount(transaction: HeliusTransaction): {
  amount: number;
  tokenSymbol?: string;
  tokenMint?: string;
} {
  // Check for token transfers first
  if (transaction.tokenTransfers && transaction.tokenTransfers.length > 0) {
    const tokenTransfer = transaction.tokenTransfers[0];
    return {
      amount: tokenTransfer.tokenAmount, // Assuming 6 decimals for most tokens
      tokenMint: tokenTransfer.mint,
    };
  }

  // Check for native (SOL) transfers
  if (transaction.nativeTransfers && transaction.nativeTransfers.length > 0) {
    const nativeTransfer = transaction.nativeTransfers[0];
    return {
      amount: nativeTransfer.amount / 1e9, // Convert lamports to SOL
      tokenSymbol: "SOL",
    };
  }

  return { amount: 0, tokenSymbol: "SOL" };
}

function getTransactionAddresses(transaction: HeliusTransaction): {
  from?: string;
  to?: string;
} {
  // Check for token transfers first
  if (transaction.tokenTransfers && transaction.tokenTransfers.length > 0) {
    const tokenTransfer = transaction.tokenTransfers[0];
    return {
      from: tokenTransfer.fromUserAccount,
      to: tokenTransfer.toUserAccount,
    };
  }

  // Check for native (SOL) transfers
  if (transaction.nativeTransfers && transaction.nativeTransfers.length > 0) {
    const nativeTransfer = transaction.nativeTransfers[0];
    return {
      from: nativeTransfer.fromUserAccount,
      to: nativeTransfer.toUserAccount,
    };
  }

  return {};
}

const deflowProgramId = "DF1ow4tspfHX9JwWJsAb9epbkA8hmpSEAtxXy1V27QBH";

const parseMissedSwapTransaction = (transaction: HeliusTransaction) => {
  const totalFrom = transaction.tokenTransfers.reduce((acc, transfer) => {
    if (transfer.fromUserAccount === transaction.feePayer) {
      return acc + transfer.tokenAmount;
    }
    return acc;
  }, 0);
  const totalTo = transaction.tokenTransfers.reduce((acc, transfer) => {
    if (transfer.toUserAccount === transaction.feePayer) {
      return acc + transfer.tokenAmount;
    }
    return acc;
  }, 0);
  const initialToken = transaction.tokenTransfers[0];
  const finalToken =
    transaction.tokenTransfers[transaction.tokenTransfers.length - 1];
  return {
    signature: transaction.signature,
    timestamp: transaction.timestamp,
    slot: transaction.slot,
    status: transaction.transactionError ? "failed" : "success",
    fee: transaction.fee / 1e9, // Convert lamports to SOL
    type: "SWAP",
    amount: totalFrom,
    tokenMint: transaction.tokenTransfers[0].mint,
    from: transaction.feePayer,
    to: transaction.feePayer,
    description: `Swapped ${totalFrom} ${initialToken.mint} for ${totalTo} ${finalToken.mint}`,
    source: transaction.source,
  };
};

const checkMissedSwap = (transaction: HeliusTransaction) => {
  if (transaction.tokenTransfers?.length > 0 && !transaction.description) {
    const missedSwap = transaction.instructions.find(instruction => {
      if (instruction.programId === deflowProgramId) return true;
    });
    return missedSwap;
  }
  return false;
};

const DEFAULT_LIMIT = 50;
export default async function getTransactionHistory(
  agent: SolanaAgentKit
): Promise<TransactionData[]> {
  try {
    const walletAddress = agent.wallet.publicKey.toString();
    const heliusApiKey = agent.config.OTHER_API_KEYS?.HELIUS_API_KEY;
    if (!heliusApiKey) {
      throw new Error("Helius API key is not set");
    }
    // Construct Helius API URL
    const url = `${HELIUS_BASE_URL}/addresses/${walletAddress}/transactions?api-key=${heliusApiKey}&limit=${DEFAULT_LIMIT}`;

    // Fetch transactions from Helius API
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Helius API error: ${response.status} ${response.statusText}`
      );
    }

    const heliusTransactions: HeliusTransaction[] = await response.json();

    if (!Array.isArray(heliusTransactions)) {
      throw new Error("Invalid response format from Helius API");
    }

    const transactionHistory: TransactionData[] = [];

    for (const transaction of heliusTransactions) {
      // remove dust transactions
      if (transaction.source === "SYSTEM_PROGRAM") {
        if (
          transaction.nativeTransfers?.length > 0 &&
          transaction.nativeTransfers[0].amount < 1000
        ) {
          continue;
        }
      }

      // check if the transaction is a swap and missed by helius
      const missedSwap = checkMissedSwap(transaction);
      if (missedSwap) {
        const missedSwapTransaction = parseMissedSwapTransaction(transaction);
        transactionHistory.push(missedSwapTransaction);
        continue;
      }

      const { amount, tokenSymbol, tokenMint } =
        extractTransactionAmount(transaction);
      const { from, to } = getTransactionAddresses(transaction);

      transactionHistory.push({
        signature: transaction.signature,
        timestamp: transaction.timestamp,
        slot: transaction.slot,
        type: transaction.type,
        status: transaction.transactionError ? "failed" : "success",
        fee: transaction.fee / 1e9, // Convert lamports to SOL
        amount,
        tokenSymbol,
        tokenMint,
        from,
        to,
        description: transaction.description,
        source: transaction.source,
      });
    }

    return transactionHistory;
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    throw new Error(`Failed to fetch transaction history: ${error}`);
  }
}
