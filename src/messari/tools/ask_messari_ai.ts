import { SolanaAgentKit } from "solana-agent-kit";
import { MessariAPIResponse } from "../types";

export async function askMessariAi(
  agent: SolanaAgentKit,
  question: string,
): Promise<any> {
  try {
    const apiKey = agent.config?.MESSARI_API_KEY;
    if (!apiKey) {
      throw new Error("No Messari API Key provided");
    }

    const url = `https://api.messari.io/ai/v1/chat/completions`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-messari-api-key": apiKey,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
      }),
    });

    const data = (await response.json()) as MessariAPIResponse;
    const result = data.data.messages[0].content;
    return result;
  } catch (error: any) {
    const errorMessage =
      error?.errorResponse?.error || error?.message || "Unknown error occurred";
    console.error("Error retrieving assets: ", errorMessage);
    throw new Error(`Error fetching data from Messari: ${errorMessage}`);
  }
}
