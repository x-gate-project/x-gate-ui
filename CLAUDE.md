# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working rules

- **Do not commit or push automatically.** Leave changes in the working tree and let the user review them. Only run `git commit` / `git push` when the user explicitly asks for it in the current request.

## Commands

```bash
npm install            # needs GitHub Packages auth, see below
npm run dev            # Next.js dev server on http://localhost:3000
npm run build          # production build (also the only type check)
npm run lint           # next lint (eslint flat config, `no-explicit-any` and `no-unused-vars` are off)
npm run wagmi:generate # regenerate src/wagmi/generated.ts from src/abis/*.json
npm run changeset      # add a changeset (.changeset/*.md) describing the change + bump type
```

There is no test suite.

### Private package auth

`@x-gate-project/x-gate-scan-client` is published on GitHub Packages (`npm.pkg.github.com`), which requires a token. Locally, the git-ignored `.npmrc` must map the scope and provide a token with `read:packages`:

```
@x-gate-project:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<token>
```

In CI (`.github/workflows/release.yml`) the same is done with `npm set` and the `READ_NPM_PACKAGES_TOKEN` secret.

### Versioning (Changesets)

Versions and `CHANGELOG.md` are managed by Changesets (`.changeset/config.json`, base branch `release`). Do not bump `package.json` `version` by hand.

- A PR with a user-facing change should include a changeset (`npm run changeset`, choose patch/minor/major, commit the generated file). Changes that need no release can skip it.
- On every push to `release` / `release/v*`, `release.yml` runs `changesets/action`. If changesets are pending, it opens or updates a "chore: release packages" PR (`changeset version` bumps the version, writes `CHANGELOG.md` and deletes the changeset files). Once that PR is merged, the next run calls `npm run release` (`scripts/release.mjs`). The package is private, so nothing goes to npm: the script cuts the `vX.Y.Z` tag and a "Release - vX.Y.Z" GitHub Release with notes from the latest changelog section. It skips a tag whose Release already exists, so it's safe to re-run. `RELEASE_DRY_RUN=1 npm run release` shows what it would do.
- Prereleases use Changesets pre-mode: `npx changeset pre enter beta` (writes `.changeset/pre.json`) gives `-beta.N` versions, released as GitHub prereleases. `npx changeset pre exit` returns to stable versions.
- The setup mirrors `gu-corp/gu-api` (same config, action inputs, and release script, minus its monorepo/SDK parts).

## Architecture

Next.js 15 App Router frontend (React 18, MUI 6 + tss-react, wagmi 2 / viem, ConnectKit) for X-Gate: bridging USDTX / USDCX / JOCX between Ethereum, Japan Open Chain (JOC), Arbitrum, Base and Avalanche using LayerZero V2 OFTs.

### Environment switch

`NEXT_PUBLIC_ENV=production` (`src/utils/system.ts` → `isProduction`) switches every chain in `src/wagmi/config.ts` between mainnet and testnet (Sepolia, JOC testnet, Arbitrum Sepolia, Base Sepolia, Avalanche Fuji), and the LayerZero endpoint IDs and explorer links along with them. Contract addresses come from `NEXT_PUBLIC_*` env vars (see `.env.sample`), mapped per chain in `src/wagmi/config.ts` (`CHAIN_ID_TO_*_ADDRESS_MAP`, `CHAIN_ID_TO_LZ_ENDPOINT_ID_MAP`). The JOCX address vars (`NEXT_PUBLIC_JOCX_*_ADDRESS`) are read there but missing from `.env.sample`. RPC URLs fall back to `api.gu.net` defaults.

### Routing and i18n

- `src/middleware.ts` redirects every path without a locale prefix to `/en/...` or `/ja/...` (negotiated from `Accept-Language`). `next.config.ts` redirects `/` → `/send`.
- When `NEXT_PUBLIC_SWAP_APP_URL` is set, the middleware also reverse-proxies the separate x-swap app: `/swap/*`, `/api/uniswap/*`, `/static/*`, `/fonts/*` and `/images/*` are rewritten to that URL. Avoid adding local routes or public assets under those prefixes.
- All pages live under `src/app/[lang]/`. UI strings come from `src/dicts/{en,ja}.json` through `useDict()` (`src/contexts/DictContext.tsx`). Add every new key to both files.

### Contract layer

ABIs live in `src/abis/*.json`. `wagmi.config.ts` turns them into typed hooks and actions in `src/wagmi/generated.ts` (do not edit it by hand; run `npm run wagmi:generate`). Pages call the generated actions directly, e.g. `readOftxQuoteSend` / `writeOftxSend`, `writeNoftxSend`, `writeNoftxAdapterSend`, `writeOftxMint`, `writeOftxBurn`, `writeOftxHelperMintAndSendOftx`.

### Transaction flows

The three main pages (`send`, `mint`, `burn` under `src/app/[lang]/`) are large self-contained client components with the same shape:

1. Build LayerZero options with `Options.newOptions().addExecutorLzReceiveOption(<GAS_LIMIT>, 0)` (burn also uses `addExecutorComposeOption`). Destination gas limits are constants in `src/consts/gas.ts`. Each one is the measured worst-case gas plus a margin and is documented in a comment; keep the value and the comment in sync. An undersized limit gets the message stuck on the destination chain.
2. Quote the fee (`read*QuoteSend`), then send with the matching `write*` action.
3. Register the tx with `addTransaction(tx, waitForSuccess)` from `src/contexts/TransactionStateContext.tsx`. `waitForSuccess` waits for the source receipt and then for LayerZero delivery via `waitForMessageReceived(srcEid, hash)` from `@x-gate-project/x-gate-scan-client`.

`TransactionStateContext` persists transactions per wallet address in localStorage (`src/services/local-storage.service.ts`). On reload it re-checks transactions that are still pending, and it drives the recent-transactions dialog and the pending badge in the header.

### Amounts

Token decimals are in `TOKEN_TO_DECIMALS_MAP` (`src/utils/token.utils.ts`): 6 for the stablecoins and 9 for JOC/JOCX. `getTokenAddress(token, chain)` resolves addresses. Fraction and amount math lives in `src/utils/fractions` (decimal.js / jsbi).
