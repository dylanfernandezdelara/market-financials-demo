# Market Financials Demo

Local-first finance dashboard demo built with Next.js, TypeScript, Tailwind CSS, and mock market data. Core flows work; broader product and platform features are not implemented yet.

**Repository:** [github.com/dylanfernandezdelara/market-financials-demo](https://github.com/dylanfernandezdelara/market-financials-demo)

## What is included

- Dashboard home page with market snapshot cards, featured stock chart, top movers, watchlist, portfolio summary, and stock news
- Stock detail pages under `/stocks/[symbol]`
- Portfolio page under `/portfolio`
- JSON routes under `/api/*` backed by the same mock provider layer as the UI
- Seeded data for indices, stocks, news, and holdings

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Recharts for charts
- Lucide icons

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
npm run lint
npm run build
```

## API routes

- `/api/market/overview`
- `/api/news`
- `/api/news?limit=3`
- `/api/portfolio`
- `/api/search?q=nvda`
- `/api/stocks`
- `/api/stocks/NVDA`

## Project structure

- `app/`: pages and route handlers
- `components/`: reusable dashboard, chart, and UI components
- `lib/`: mock datasets and provider functions
- `types/`: finance domain types

## Current limitations

The demo omits several production concerns by design. Notable gaps:

- No auth, accounts, or multi-user state
- No real market or news APIs
- No persistent database
- No transaction ledger or broker sync
- No alerts, screeners, or real-time streaming
- No test suite yet
- No accessibility audit or performance hardening pass yet

## Notes

- All data is mocked and local.
- The stock universe is intentionally small.
- The portfolio model is deliberately simple and does not track historical transactions.
