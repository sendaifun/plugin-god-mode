import type { Plugin, SolanaAgentKit } from "solana-agent-kit";

// birdeye
import getToken from "./birdeye/tools/getToken";
import getTrendingTokens from "./birdeye/tools/getTrendingTokens";
import getTokenAction from "./birdeye/actions/getTokenAction";
import getTrendingTokensAction from "./birdeye/actions/getTrendingTokensAction";

// debridge
import bridge from "./debridge/tools/bridge";
import bridgeAction from "./debridge/actions/bridgeAction";


// jupiter 
import fetchPriceAction from "./jupiter/actions/fetchPriceAction";
import buyAction from "./jupiter/actions/buyAction";
import sellAction from "./jupiter/actions/sellAction";
import getTokenDataByTickerAction from "./jupiter/actions/getTokenDataByTickerAction";
import fetchPrice from "./jupiter/tools/fetchPrice";
import buy from "./jupiter/tools/buy";
import sell from "./jupiter/tools/sell";
import getTokenDataByTicker from "./jupiter/tools/getTokenDataByTicker";

// lulo
import luloWithdrawAction from "./lulo/actions/luloWithdrawAction";
import initiateLuloWithdraw from "./lulo/tools/initiateLuloWithdraw";
import luloLendAction from "./lulo/actions/luloLendAction";
import luloLend from "./lulo/tools/luloLend";
import luloGetApyAction from "./lulo/actions/luloGetApyAction";
import luloGetApy from "./lulo/tools/luloGetApy";

// pumpfun
import launchPumpFunToken from "./pumpfun/tools/launchPumpfunToken";
import launchPumpfunTokenAction from "./pumpfun/actions/launchPumpfunTokenAction";
import claimCreatorFeeAction from "./pumpfun/actions/claimCreatorFeeAction";
import claimCreatorFee from "./pumpfun/tools/claimCreatorFee";

// rugcheck
import rugcheckAction from "./rugcheck/actions/rugcheckAction";
import rugcheck from "./rugcheck/tools/rugcheck";

// sanctum
import sanctumGetLSTAPY from "./sanctum/tools/sanctumGetLSTAPY";
import sanctumGetLSTAPYAction from "./sanctum/actions/sanctumGetLSTAPYAction";
import getTopLSTAction from "./sanctum/actions/getTopLSTAction";  
import getTopLST from "./sanctum/tools/getTopLST";


// solana
import getPortfolioAction from "./wallet/actions/getPortfolioAction";
import getPortfolio from "./wallet/tools/getPortfolio";

import getSolBalance from "./wallet/tools/getSolBalance";
import getSolBalanceAction from "./wallet/actions/getSolBalanceAction";
import getSolPriceAction from "./wallet/actions/getSolPriceAction";


import getSolPrice from "./wallet/tools/getSolPrice";

import getTokenBalanceAction from "./wallet/actions/getTokenBalanceAction";
import getTokenBalance from "./wallet/tools/getTokenBalance";

import getWalletAddress from "./wallet/tools/getWalletAddress";
import getWalletAddressAction from "./wallet/actions/getWalletAddressAction";

import transferSPLAction from "./wallet/actions/transferSPLAction";
import transferSPL from "./wallet/tools/transferSPL";

import transferAction from "./wallet/actions/transferAction";
import transfer from "./wallet/tools/transfer";

// Define and export the plugin
const GodModePlugin = {
  name: "godmode",

  // Combine all tools
  methods: {
    getToken,
    getTrendingTokens,
    bridge,
    fetchPrice,
    buy,
    sell,
    getTokenDataByTicker,
    initiateLuloWithdraw,
    luloLend,
    getSolBalance,
    getWalletAddress,
    getTokenBalance,
    transferSPL,
    transfer,
    launchPumpFunToken,
    rugcheck,
    sanctumGetLSTAPY,
    getTopLST,
    getPortfolio,
    getSolPrice,
    luloGetApy,
    claimCreatorFee,
  },

  // Combine all actions
  actions: [
    getTokenAction,
    getTrendingTokensAction,
    bridgeAction,
    fetchPriceAction,
    buyAction,
    sellAction,
    getTokenDataByTickerAction,
    luloWithdrawAction,
    luloLendAction,
    getSolBalanceAction,
    getTokenBalanceAction,
    getWalletAddressAction,
    transferSPLAction,
    transferAction,
    launchPumpfunTokenAction,
    rugcheckAction,
    sanctumGetLSTAPYAction,
    getTopLSTAction,
    getPortfolioAction,
    getSolPriceAction,
    luloGetApyAction,
    claimCreatorFeeAction,
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
