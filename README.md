# @solana-agent-kit/plugin-god-mode

Just like the legendary cheat code, GOD Mode gives you access to every essential Solana action in one place. Whether you're trading, launching tokens, analyzing security, or managing your portfolio, this plugin is designed to be the only toolkit you'll ever need for Solana.


## Features (as available)

1. **Transfer** — Instantly transfer SOL and SPL tokens (**0% fees**) 
2. **Buy action, from SOL** — Buy tokens using SOL via JUP ultra API (**0.5% fees**) 
3. **Sell action, to SOL** — Sell tokens for SOL via JUP ultra API (**0.5% fees**) 
4. **Portfolio** — View your portfolio and balances via RPC (**read-only, no fees**) 
5. **Stake via Sanctum** — Stake SOL and interact with LSTs via Sanctum (Blinks or Direct API) (**0.1% + read**) 
6. **Play RPS game** — Play Rock-Paper-Scissors via SendArcade (Blinks) 
7. **Lend / Withdraw USDC** — Lend or withdraw USDC via Lulo (**0.1% fee**) 
8. **Bridge** — Bridge assets with referral fees via de-bridge (redirect to website with prefilled details) 
9. **Pump.fun launch** — Launch new tokens on pump.fun 
10. **Token info** — Get token information via Birdeye 
11. **Perpetuals** — Trade perps via Drift or Ranger 
12. **Mint and trade NFT** — Mint new NFTs (Metaplex) and buy from marketplace (Tensor) 
13. **Messari context** — Get token/project context via Messari AI 
14. **Jito Bundles** — Interact with Jito bundles 
15. **Onramp** — Using Moonpay

---

## Tools Available (with Fees)

### Transfers & Portfolio
- `transfer` — Transfer SOL or SPL tokens (**0% fees**)
- `portfolio` — View your portfolio and balances (**read-only, no fees**)

### Jupiter (JUP Ultra API)
- `buy` — Buy tokens using SOL (**0.5% fees**)
- `sell` — Sell tokens for SOL (**0.5% fees**)

### Sanctum
- `stake` — Stake SOL and interact with LSTs (**0.1% + read**)

### SendArcade
- `playRPS` — Play Rock-Paper-Scissors game

### Lulo
- `lendUSDC` — Lend USDC (**0.1% fee**)
- `withdrawUSDC` — Withdraw USDC (**0.1% fee**)

### De-bridge
- `bridge` — Bridge assets (referral fees, redirects to website)

### Pump.fun
- `launchPumpFunToken` — Launch new tokens

### Birdeye
- `getTokenInfo` — Get token information

### Drift / Ranger
- `tradePerps` — Trade perpetuals

### Metaplex / Tensor
- `mintNFT` — Mint new NFTs
- `buyNFT` — Buy NFTs from marketplace

### Messari AI
- `getContext` — Get token/project context

### Jito
- `jitoBundles` — Interact with Jito bundles


For more detailed information about each action and its parameters, check the individual action files in the source code or refer to the official documentation at [docs.sendai.fun](https://docs.sendai.fun).
