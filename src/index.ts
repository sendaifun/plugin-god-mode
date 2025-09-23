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
// import launchPumpFunToken from "./pumpfun/tools/launchPumpfunToken";
// import launchPumpfunTokenAction from "./pumpfun/actions/launchPumpfunTokenAction";
// import claimCreatorFeeAction from "./pumpfun/actions/claimCreatorFeeAction";
// import claimCreatorFee from "./pumpfun/tools/claimCreatorFee";
// import getPendingCreatorFeeAction from "./pumpfun/actions/getPendingCreatorFeeAction";
// import getPendingCreatorFee from "./pumpfun/tools/getPendingCreatorFee";

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
import getEvmAddress from "./wallet/tools/getEvmAddress";
import getEvmAddressAction from "./wallet/actions/getEvmAddressAction";

import transferSPLAction from "./wallet/actions/transferSPLAction";
import transferSPL from "./wallet/tools/transferSPL";

import transferAction from "./wallet/actions/transferAction";
import transfer from "./wallet/tools/transfer";

import getTransactionHistoryAction from "./wallet/actions/getTransactionHistoryAction";
import getTransactionHistory from "./wallet/tools/getTransactionHistory";

// onramp
import onramp from "./wallet/tools/onramp";
import onrampAction from "./wallet/actions/onrampAction";

// tracing
import { wrapActionsWithTracing } from "./tracing/wrapActionsWithTracing";

// meteora
import launchMeteoraToken from "./meteora/tools/launchMeteoraToken";
import launchMeteoraTokenAction from "./meteora/action/launchMeteoraTokenAction";
import claimMeteoraCreatorFee from "./meteora/tools/claimMeteoraCreatorFee";
import claimMeteoraCreatorFeeAction from "./meteora/action/claimMeteoraCreateFeeAction";

// crossmint
import checkout from "./crossmint/tools/checkout";
import confirmOrder from "./crossmint/tools/confirm-order";
import confirmOrderAction from "./crossmint/actions/confirmOrderAction";
import checkoutAction from "./crossmint/actions/checkoutAction";

// polymarket
import listMarkets from "./polymarket/tools/listMarkets";
import listMarketsAction from "./polymarket/actions/listMarketsAction";

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
    getEvmAddress,
    getTokenBalance,
    transferSPL,
    transfer,
    rugcheck,
    sanctumGetLSTAPY,
    getTopLST,
    getPortfolio,
    getSolPrice,
    luloGetApy,
    claimMeteoraCreatorFee,
    onramp,
    createDCA,
    cancelDCA,
    getDCAOrders,
    createLO,
    cancelLO,
    getLOs,
    launchMeteoraToken,
    getTransactionHistory,
    checkout,
    confirmOrder,
    listMarkets,
  },

  // Combine all actions
  actions: wrapActionsWithTracing(
    [
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
      getEvmAddressAction,
      transferSPLAction,
      transferAction,
      rugcheckAction,
      sanctumGetLSTAPYAction,
      getTopLSTAction,
      getPortfolioAction,
      getSolPriceAction,
      luloGetApyAction,
      claimMeteoraCreatorFeeAction,
      onrampAction,
      createDCAAction,
      cancelDCAAction,
      getDCAOrdersAction,
      createLOAction,
      cancelLOAction,
      getLOsAction,
      getTransactionHistoryAction,
      launchMeteoraTokenAction,
      checkoutAction,
      confirmOrderAction,
      listMarketsAction,
    ],
    "godmode"
  ),

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
