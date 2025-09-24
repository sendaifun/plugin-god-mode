import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import getTrades from "../tools/getTrades";

const getTradesAction: Action = {
  name: "GET_POLYMARKET_TRADES",
  similes: [
    "get polymarket trades",
    "fetch polymarket trades",
    "polymarket trade history",
    "show trades",
    "list trades",
  ],
  description: `Get trade history from Polymarket with optional filters for market, asset, maker, taker, and time range.`,
  examples: [
    [
      {
        input: {
          limit: 10,
        },
        output: {
          status: "success",
          message: "Trades fetched successfully",
          trades: [
            {
              id: "0x123...",
              market: "0xabc...",
              side: "BUY",
              price: "0.65",
              size: "100",
              timestamp: "2024-01-15T10:30:00Z"
            }
          ],
          next_cursor: "cursor_123",
          count: 10,
        },
        explanation: "Get the latest 10 trades",
      },
    ],
    [
      {
        input: {
          market: "0x1234567890abcdef",
          limit: 5,
          start_ts: "2024-01-01T00:00:00Z",
        },
        output: {
          status: "success",
          message: "Trades fetched successfully",
          trades: [
            {
              id: "0x456...",
              market: "0x1234567890abcdef",
              side: "SELL",
              price: "0.35",
              size: "50",
              timestamp: "2024-01-02T14:20:00Z"
            }
          ],
          next_cursor: "cursor_456",
          count: 5,
        },
        explanation: "Get 5 trades for a specific market from a start date",
      },
    ],
  ],
  schema: z.object({
    next_cursor: z.string().optional().describe("Pagination cursor for next set of results"),
    market: z.string().optional().describe("Filter by market ID"),
    asset_id: z.string().optional().describe("Filter by asset/token ID"),
    maker: z.string().optional().describe("Filter by maker address"),
    taker: z.string().optional().describe("Filter by taker address"),
    start_ts: z.string().optional().describe("Start timestamp filter (ISO string)"),
    end_ts: z.string().optional().describe("End timestamp filter (ISO string)"),
    limit: z.number().min(1).max(100).optional().describe("Number of trades to return (1-100, default: 20)"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await getTrades(agent, input);

    return {
      status: "success",
      message: "Trades fetched successfully",
      trades: result.data,
      next_cursor: result.next_cursor,
      count: result.data.length,
    };
  },
};

export default getTradesAction;
