# @solana-agent-kit/plugin-god-mode

Just like the legendary cheat code, GOD Mode gives you access to every essential Solana action in one place. Whether you're trading, launching tokens, analyzing security, or managing your portfolio, this plugin is designed to be the only toolkit you'll ever need for Solana.

## Features (as available)

1. **Transfer** — Instantly transfer SOL and SPL tokens (**0% fees**) 
2. **Buy/Sell** — Trade tokens using SOL via Jupiter Ultra API (**0.5% fees**) 
3. **Portfolio Management** — View your portfolio, balances, and SOL price via RPC (**read-only, no fees**) 
4. **Token Information** — Get token data, trending tokens, and price information via Birdeye 
5. **Lending** — Lend/withdraw USDC via Lulo with APY tracking (**0.1% fee**) 
6. **Pump.fun** — Launch new tokens and manage creator fees on pump.fun 
7. **Security Analysis** — Check token security via Rugcheck 
8. **Staking** — Get LST APY and top LST information via Sanctum (**0.1% + read**) 
9. **Bridge** — Bridge assets with referral fees via DeBridge (redirect to website with prefilled details) 
10. **Onramp** — Fiat-to-crypto onramp functionality 

---

## Tools Available (with Fees)

### Wallet & Portfolio Management
- `transfer` — Transfer SOL between wallets (**0% fees**)
- `transferSPL` — Transfer SPL tokens (**0% fees**)
- `getPortfolio` — View your complete portfolio (**read-only, no fees**)
- `getSolBalance` — Get SOL balance for any wallet (**read-only, no fees**)
- `getTokenBalance` — Get SPL token balance (**read-only, no fees**)
- `getWalletAddress` — Get your wallet address (**read-only, no fees**)
- `getSolPrice` — Get current SOL price (**read-only, no fees**)
- `onramp` — Fiat-to-crypto onramp

### Jupiter Trading
- `buy` — Buy tokens using SOL (**0.5% fees**)
- `sell` — Sell tokens for SOL (**0.5% fees**)
- `fetchPrice` — Get token price information (**read-only, no fees**)
- `getTokenDataByTicker` — Get token data by ticker symbol (**read-only, no fees**)

### Birdeye Token Intelligence
- `getToken` — Get comprehensive token information
- `getTrendingTokens` — Get currently trending tokens

### Lulo Lending
- `luloLend` — Lend USDC (**0.1% fee**)
- `initiateLuloWithdraw` — Withdraw USDC (**0.1% fee**)
- `getLuloBalance` — Check your Lulo balance (**read-only, no fees**)
- `luloGetApy` — Get current lending APY (**read-only, no fees**)

### Pump.fun Token Launch
- `launchPumpFunToken` — Launch new tokens on pump.fun
- `claimCreatorFee` — Claim creator fees from launched tokens
- `getPendingCreatorFee` — Check pending creator fees (**read-only, no fees**)

### Security & Analysis
- `rugcheck` — Analyze token security and potential risks (**read-only, no fees**)

### Sanctum LST Operations
- `sanctumGetLSTAPY` — Get LST APY information (**read-only, no fees**)
- `getTopLST` — Get top performing LSTs (**read-only, no fees**)

### DeBridge Cross-Chain
- `bridge` — Bridge assets cross-chain (referral fees, redirects to website)

## Available Modules (Future Integration)

The following modules are present in the codebase and may be integrated in future versions:

- **Metaplex** — NFT minting, collection deployment, and asset management
- **Tensor** — NFT marketplace trading
- **Messari** — Token and project context via Messari AI
- **Drift** — Perpetuals trading and vault operations

## Installation & Usage

For detailed information about each action and its parameters, check the individual action files in the source code or refer to the official documentation at [docs.sendai.fun](https://docs.sendai.fun).

---

**Note**: Fees mentioned are indicative and may vary. Always check current fee structures before executing transactions.
