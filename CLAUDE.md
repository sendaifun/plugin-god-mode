# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build and Package
- `pnpm run build` - Build the plugin using tsup (outputs to `dist/` with both CJS and ESM formats)
- `pnpm run clean` - Remove dist, .turbo, and node_modules directories

### Testing
- `pnpm test` or `jest` - Run all unit tests using Jest with ts-jest transformer
- Individual test files are in `test/unit/` organized by module (e.g., `test/unit/jupiter/buy.test.ts`)

### Package Management
- Uses `pnpm` as package manager (see `packageManager` field in package.json)
- `pnpm install` - Install dependencies

## Code Architecture

This is a Solana Agent Kit plugin that provides comprehensive DeFi and blockchain functionality. The codebase follows a modular architecture:

### Core Structure
- **Actions**: User-facing functions with error handling and validation (in `*/actions/` directories)
- **Tools**: Core business logic implementations (in `*/tools/` directories)
- **Types**: TypeScript type definitions (in `*/types/` directories)

### Module Organization
Each feature is organized into self-contained modules:

- `birdeye/` - Token data and trending analysis
- `crossmint/` - NFT checkout and order confirmation
- `debridge/` - Cross-chain bridging
- `drift/` - Perpetuals trading and vault operations
- `jupiter/` - Token swapping, DCA, and limit orders
- `lulo/` - USDC lending platform integration
- `meteora/` - Token launching and creator fees
- `pumpfun/` - Memecoin launching (currently commented out)
- `rugcheck/` - Token security analysis
- `sanctum/` - Liquid staking token operations
- `tensor/` - NFT marketplace trading
- `wallet/` - Portfolio management, transfers, balances

### Key Files
- `src/index.ts` - Main plugin definition, exports all actions and tools
- `src/tracing/wrapActionsWithTracing.ts` - Sentry integration for error tracking
- `src/global/constant.ts` - Global constants
- `src/helpers/` - Shared utilities (caching, token metadata)

### Plugin Pattern
The main export follows the Solana Agent Kit plugin interface:
- `methods` - Direct tool functions bound to agent instance
- `actions` - Wrapped actions with tracing for AI agent use
- `initialize` - Binds all methods to the agent instance

### Dependencies
- Built on `@solana/web3.js` and `solana-agent-kit`
- Uses various Solana ecosystem SDKs (Anchor, SPL Token, etc.)
- Includes specialized SDKs for each protocol integration
- Error tracking via Sentry
- Caching with LRU cache and Redis support

### Testing Strategy
- Unit tests for each module in corresponding `test/unit/` directories
- Tests use Jest with TypeScript support
- Focus on testing individual tools and actions

### Build System
- Uses `tsup` for building with dual CJS/ESM output
- TypeScript configuration supports ESNext with strict mode
- Generates declaration files and source maps