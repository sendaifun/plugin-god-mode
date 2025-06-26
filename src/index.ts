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
import createDCAAction from "./jupiter/actions/createDcaAction";
import cancelDCAAction from "./jupiter/actions/cancelDCAAction";
import getDCAOrdersAction from "./jupiter/actions/getDCAOrdersAction";
import createLOAction from "./jupiter/actions/createLOAction";
import cancelLOAction from "./jupiter/actions/cancelLOAction";
import getLOsAction from "./jupiter/actions/getLOsAction";
import fetchPrice from "./jupiter/tools/fetchPrice";
import buy from "./jupiter/tools/buy";
import sell from "./jupiter/tools/sell";
import getTokenDataByTicker from "./jupiter/tools/getTokenDataByTicker";
import createDCA from "./jupiter/tools/dca/createDCA";
import cancelDCA from "./jupiter/tools/dca/cancelDCA";
import getDCAOrders from "./jupiter/tools/dca/getDCAOrders";
import createLO from "./jupiter/tools/lo/createLO";
import cancelLO from "./jupiter/tools/lo/cancelLO";
import getLOs from "./jupiter/tools/lo/getLOs";

// lulo
import luloWithdrawAction from "./lulo/actions/luloWithdrawAction";
import initiateLuloWithdraw from "./lulo/tools/initiateLuloWithdraw";
import luloLendAction from "./lulo/actions/luloLendAction";
import luloLend from "./lulo/tools/luloLend";
import luloGetApyAction from "./lulo/actions/luloGetApyAction";
import luloGetApy from "./lulo/tools/luloGetApy";
import luloGetBalanceAction from "./lulo/actions/luloGetBalanceAction";
import getLuloBalance from "./lulo/tools/getLuloBalance";

// pumpfun
import launchPumpFunToken from "./pumpfun/tools/launchPumpfunToken";
import launchPumpfunTokenAction from "./pumpfun/actions/launchPumpfunTokenAction";
import claimCreatorFeeAction from "./pumpfun/actions/claimCreatorFeeAction";
import claimCreatorFee from "./pumpfun/tools/claimCreatorFee";
import getPendingCreatorFeeAction from "./pumpfun/actions/getPendingCreatorFeeAction";
import getPendingCreatorFee from "./pumpfun/tools/getPendingCreatorFee";

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

// onramp
import onramp from "./wallet/tools/onramp";
import onrampAction from "./wallet/actions/onrampAction";

// tracing
import { wrapActionsWithTracing } from "./tracing/wrapActionsWithTracing";


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
    getLuloBalance,
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
    getPendingCreatorFee,
    onramp,
    createDCA,
    cancelDCA,
    getDCAOrders,
    createLO,
    cancelLO,
    getLOs,
  },

  // Combine all actions
  actions: wrapActionsWithTracing([
    getTokenAction,
    getTrendingTokensAction,
    bridgeAction,
    fetchPriceAction,
    buyAction,
    sellAction,
    getTokenDataByTickerAction,
    luloWithdrawAction,
    luloLendAction,
    luloGetBalanceAction,
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
    getPendingCreatorFeeAction,
    onrampAction,
    createDCAAction,
    cancelDCAAction,
    getDCAOrdersAction,
    createLOAction,
    cancelLOAction,
    getLOsAction,
  ], "godmode"),

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
