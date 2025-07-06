import type { SolanaAgentKit, TokenCheck } from "solana-agent-kit";
import { setCacheValue , getCacheValue} from "../../helpers/cache";

const BASE_URL = "https://api.rugcheck.xyz/v1";

/**
 * Fetches a summary report for a specific token.
 * @async
 * @param {string} mint - The mint address of the token.
 * @returns {Promise<TokenCheck>} The token summary report.
 * @throws {Error} If the API call fails.
 */
export default async function fetchTokenReportSummary(
  _agent: SolanaAgentKit,
  mint: string,
): Promise<TokenCheck> {
  try {

    const cacheKey = `rugcheck_${mint}`;
    const cachedData = await getCacheValue(_agent, cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(`${BASE_URL}/tokens/${mint}/report/summary`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    data.score = data.score == 1 ? "safe" : "unsafe";

    // 7 days
    await setCacheValue(_agent, cacheKey, data, 7 * 24 * 60 * 60);

    return data;
  } catch (error: any) {
    console.error(
      `Error fetching report summary for token ${mint}:`,
      error.message,
    );
    throw new Error(`Failed to fetch report summary for token ${mint}.`);
  }
}

/**
 * Fetches a detailed report for a specific token.
 * @async
 * @param {string} mint - The mint address of the token.
 * @returns {Promise<TokenCheck>} The detailed token report.
 * @throws {Error} If the API call fails.
 */
export async function fetchTokenDetailedReport(
  mint: string,
): Promise<TokenCheck> {
  try {
    const response = await fetch(`${BASE_URL}/tokens/${mint}/report`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error(
      `Error fetching detailed report for token ${mint}:`,
      error.message,
    );
    throw new Error(`Failed to fetch detailed report for token ${mint}.`);
  }
}
