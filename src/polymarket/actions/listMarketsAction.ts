import { Action, SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import listMarkets from "../tools/listMarkets";

const listMarketsAction: Action = {
  name: "LIST_MARKETS",
  similes: [
    "list markets",
    "get markets",
    "fetch markets",
    "show markets",
    "polymarket markets",
  ],
  description: `This tool can be used to list markets from Polymarket with configurable filters. You can filter by volume, liquidity, dates, categories, and more.`,
  examples: [
    [
      {
        input: {
          limit: 10,
          order: "volume_num",
          ascending: false,
        },
        output: {
          status: "success",
          message: "Markets fetched successfully",
          markets: [
            {
              id: "0x123...",
              question: "Will Bitcoin reach $100k by end of 2024?",
              volume: "1000000",
              liquidity: "500000",
              active: true,
            }
          ],
          count: 10,
        },
        explanation: "Get top 10 markets by volume",
      },
    ],
    [
      {
        input: {
          limit: 5,
          volume_num_min: 100000,
          category: "crypto",
        },
        output: {
          status: "success",
          message: "Markets fetched successfully",
          markets: [
            {
              id: "0x456...",
              question: "Will Ethereum reach $5000?",
              volume: "500000",
              liquidity: "250000",
              active: true,
            }
          ],
          count: 5,
        },
        explanation: "Get 5 crypto markets with volume > 100k",
      },
    ],
  ],
  schema: z.object({
    limit: z.number().min(1).max(100).optional().describe("Number of markets to return (1-100, default: 20)"),
    offset: z.number().min(0).optional().describe("Number of markets to skip (default: 0)"),
    order: z.string().optional().describe("Field to order by (e.g., 'volume_num', 'liquidity_num', 'created_at')"),
    ascending: z.boolean().optional().describe("Sort order (default: false for descending)"),
    id: z.array(z.number()).optional().describe("Filter by market IDs"),
    slug: z.array(z.string()).optional().describe("Filter by market slugs"),
    clob_token_ids: z.array(z.string()).optional().describe("Filter by CLOB token IDs"),
    condition_ids: z.array(z.string()).optional().describe("Filter by condition IDs"),
    market_maker_address: z.array(z.string()).optional().describe("Filter by market maker addresses"),
    liquidity_num_min: z.number().optional().describe("Minimum liquidity filter"),
    liquidity_num_max: z.number().optional().describe("Maximum liquidity filter"),
    volume_num_min: z.number().optional().describe("Minimum volume filter"),
    volume_num_max: z.number().optional().describe("Maximum volume filter"),
    start_date_min: z.string().optional().describe("Minimum start date (ISO string)"),
    start_date_max: z.string().optional().describe("Maximum start date (ISO string)"),
    end_date_min: z.string().optional().describe("Minimum end date (ISO string)"),
    end_date_max: z.string().optional().describe("Maximum end date (ISO string)"),
    tag_id: z.number().optional().describe("Filter by tag ID"),
    related_tags: z.boolean().optional().describe("Include related tags"),
    cyom: z.boolean().optional().describe("Create your own market filter"),
    uma_resolution_status: z.string().optional().describe("UMA resolution status filter"),
    game_id: z.string().optional().describe("Filter by game ID"),
    sports_market_types: z.array(z.string()).optional().describe("Filter by sports market types"),
    rewards_min_size: z.number().optional().describe("Minimum rewards size"),
    question_ids: z.array(z.string()).optional().describe("Filter by question IDs"),
    include_tag: z.boolean().optional().describe("Include tag information"),
    closed: z.boolean().optional().describe("Filter by closed status"),
  }),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const markets = await listMarkets(agent, input);

    return {
      status: "success",
      message: "Markets fetched successfully",
      markets: markets,
      count: markets.length,
    };
  },
};

export default listMarketsAction;
