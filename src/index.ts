import type { Plugin, SolanaAgentKit } from "solana-agent-kit";


import fetchPriceAction from "./jupiter/actions/fetchPrice";
import buyAction from "./jupiter/actions/buy";
import sellAction from "./jupiter/actions/sell";


// solana
import balanceAction from "./wallet/actions/balance";
import tokenBalancesAction from "./wallet/actions/tokenBalances";
import transferAction from "./wallet/actions/transfer";
import transferSplAction from "./wallet/actions/transfer_spl";
import walletAddressAction from "./wallet/actions/walletAddress";


// pumpfun
import launchPumpfunTokenAction from "./pumpfun/actions/launchPumpfunToken";


import {
  fetchPrice,
  buy,
  sell,
} from "./jupiter/tools";

import { launchPumpFunToken } from "./pumpfun/tools";
import { fetchTokenDetailedReport, fetchTokenReportSummary } from "./rugcheck";


import {
  getWalletAddress,
  get_sol_balance,
  get_token_balance,
  transfer_spl,
  transfer,
} from "./wallet/tools";

// Define and export the plugin
const GodModePlugin = {
  name: "godmode",

  // Combine all tools
  methods: {
    fetchPrice,
    buy,
    sell,
    get_sol_balance,
    getWalletAddress,
    get_token_balance,
    transfer_spl,
    transfer,
    launchPumpFunToken,
    fetchTokenDetailedReport,
    fetchTokenReportSummary,
  },

  // Combine all actions
  actions: [
    fetchPriceAction,
    buyAction,
    sellAction,
    balanceAction,
    tokenBalancesAction,
    transferAction,
    transferSplAction,
    launchPumpfunTokenAction,
    walletAddressAction,
  ],

  // Initialize function
  initialize: function (agent: SolanaAgentKit): void {
    // Initialize all methods with the agent instance
    for (const [methodName, method] of Object.entries(this.methods)) {
      if (typeof method === "function") {
        this.methods[methodName] = method.bind(null, agent);
      }
    }
  },
} satisfies Plugin;

// Default export for convenience
export default GodModePlugin;
