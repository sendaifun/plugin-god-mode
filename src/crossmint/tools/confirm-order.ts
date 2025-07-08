import { Order } from "../types";
import confirmOrderTool from "./utils/confirm-order";
import { SolanaAgentKit } from "solana-agent-kit";

export default async function confirmOrder(
  agent: SolanaAgentKit,
  orderId: string,
  retryUptoConfirmation: boolean = false
): Promise<{
  order?: Order;
  success: boolean;
  error?: string;
  status?: string;
}> {
  return await confirmOrderTool(agent, orderId, retryUptoConfirmation);
}
