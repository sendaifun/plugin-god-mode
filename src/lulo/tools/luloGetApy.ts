import { type SolanaAgentKit } from "solana-agent-kit";

/**
 * Interface for APY rates over different time periods.
 */
export interface LuloTimePeriodRates {
  CURRENT: number;
  "1HR": number;
  "1YR": number;
  "24HR": number;
  "30DAY": number;
  "7DAY": number;
}

/**
 * Interface for the overall APY rates structure returned by Lulo API,
 * including regular and protected rates.
 */
export interface LuloApyRates {
  regular: LuloTimePeriodRates;
  protected: LuloTimePeriodRates;
}

/**
 * Fetches APY rates from the Lulo Finance API.
 * @param agent SolanaAgentKit instance, used to access configurations like API keys.
 * @returns A promise that resolves to an LuloApyRates object.
 * @throws Error if the API key is missing, if the request fails, or if parsing the response fails.
 */
export default async function luloGetApy(
  agent: SolanaAgentKit,
): Promise<LuloApyRates> {
  try {
    const apiKey = agent.config.OTHER_API_KEYS?.LULO_API_KEY;

    if (!apiKey) {
      throw new Error(
        "Lulo API key is not configured. Please set it in agent.config.OTHER_API_KEYS.LULO_API_KEY",
      );
    }

    const response = await fetch(
      "https://api.lulo.fi/v1/rates.getRates",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      },
    );

    if (!response.ok) {
      let errorBody = "";
      try {
        errorBody = await response.text();
      } catch (e) {
        // Failed to read error body, but still proceed with throwing based on status
        console.warn("Failed to read error body from Lulo API:", e);
      }
      throw new Error(
        `Failed to fetch APY rates from Lulo API: ${response.status} ${response.statusText}. ${errorBody ? `Details: ${errorBody}` : ""}`,
      );
    }

    const data = await response.json();

    return data as LuloApyRates;
    
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(`Fetching Lulo APY rates failed: ${error.message}`);
    }
    throw new Error(`Fetching Lulo APY rates failed with an unknown error: ${String(error)}`);
  }
}
