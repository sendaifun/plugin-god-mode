import axios from "redaxios";

/**
 * Fetches the top 10 LST tokens from Jupiter's token list endpoint, sorted by daily_volume.
 * @returns Array of top 10 LST token objects in the specified format.
 */
export default async function getTopLSTTokens(): Promise<any[]> {
  try {
    const response = await axios.get(
      "https://tokens.jup.ag/tokens?tags=lst"
    );
    const tokens = response.data;
    // Filter out tokens without daily_volume, sort by daily_volume descending, and take top 10
    const topTokens = tokens
      .filter((token: any) => typeof token.daily_volume === 'number')
      .sort((a: any, b: any) => b.daily_volume - a.daily_volume)
      .slice(0, 10);
    return topTokens;
  } catch (error: any) {
    throw new Error(`Failed to fetch LST tokens: ${error.message}`);
  }
}
