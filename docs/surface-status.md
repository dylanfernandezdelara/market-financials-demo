# Surface status

Which parts of the app are working demo flows and which are placeholder stubs reserved for future product work.

## Legend

| Label | Meaning |
| :--- | :--- |
| **Demo** | Functional surface backed by the mock provider layer. Core demo flow. |
| **Stub** | Route exists with static or no-op content. Represents a future product path. |
| **Infra** | Internal tooling or operational endpoint, not a user-facing product surface. |

## Pages

| Route | Surface | Status | Notes |
| :--- | :--- | :--- | :--- |
| `/` | Dashboard home | Demo | Market snapshot, futures, movers, watchlist strip, sectors, crypto, fixed income. |
| `/portfolio` | Portfolio overview | Demo | Holdings table, sector allocation donut, portfolio trend chart, CSV import panel. |
| `/stocks/[symbol]` | Stock detail | Demo | Price hero, chart, key stats, news timeline, related companies. |
| `/alerts` | Price alerts | Stub | Empty alert list and dialog shell. No persistence or delivery. |
| `/billing` | Billing | Stub | Static "No invoices" text. No payment integration. |
| `/calendar` | Earnings calendar | Stub | Empty table. No earnings data source. |
| `/compare` | Compare symbols | Stub | Displays "not available for this account tier" placeholder. |
| `/export` | Export data | Stub | Button briefly shows "Queued" then resets. No file generation. |
| `/insights` | Insight explorer | Stub | Fetches `/api/insights` and renders raw metric rows. Debug-oriented. |
| `/integrations` | Integrations | Stub | Static "Not connected" list. No broker or feed sync. |
| `/notes` | Notes | Stub | Read-only textarea. No save or load. |
| `/reports` | Reports | Stub | Heading only. No report generation. |
| `/research` | Research hub | Stub | Heading with a loading skeleton placeholder. No content. |
| `/saved` | Saved layouts | Stub | Static "Default layout" text. No layout persistence. |
| `/settings` | Account settings | Stub | Non-functional form with hardcoded "Demo user" value. |
| `/support` | Help center | Stub | Search input with no backend. |
| `/team` | Team | Stub | Non-functional "Invite member" button. |
| `/watchlist/manage` | Manage watchlists | Stub | Static symbol count. No reorder or CRUD. |

## API routes

| Route | Status | Notes |
| :--- | :--- | :--- |
| `GET /api/market/overview` | Demo | Returns full dashboard payload from mock provider. |
| `GET /api/news` | Demo | Returns mock news articles. Supports `?limit=N`. |
| `GET /api/portfolio` | Demo | Returns enriched portfolio snapshot from mock holdings. |
| `GET /api/search` | Demo | Searches the mock stock universe by query string. |
| `GET /api/stocks` | Demo | Lists all stocks in the mock universe. |
| `GET /api/stocks/[symbol]` | Demo | Returns a single stock profile from mock data. |
| `GET /api/batch-quotes` | Demo | Resolves a comma-separated symbol list against the mock universe. |
| `GET /api/benchmarks` | Demo | Returns mock market index data. |
| `GET /api/health` | Infra | Returns uptime and version. Operational healthcheck. |
| `GET /api/insights` | Demo | Runs all insight-slice metric functions and returns rows. |
| `GET /api/alerts` | Stub | Always returns `{ rules: [] }`. |
| `POST /api/alerts` | Stub | Accepts JSON but returns a placeholder id. No persistence. |
| `DELETE /api/alerts` | Stub | No-op. Returns `{ cleared: false }`. |
| `POST /api/export` | Stub | Returns a placeholder URL. PDF format returns 501. |
| `POST /api/integrations/sync` | Stub | Returns `{ status: "pending", lastSync: null }`. No sync logic. |
| `GET /api/notifications` | Stub | Always returns `{ unread: 0, items: [] }`. |
| `PATCH /api/notifications` | Stub | No-op. Returns `{ marked: 0 }`. |
| `GET /api/reports` | Stub | Always returns `{ reports: [], nextRun: null }`. |
| `GET /api/research/summary` | Stub | Returns empty bullets array for any symbol. |
| `GET /api/screeners` | Stub | Always returns `{ results: [], total: 0 }`. |
| `POST /api/screeners` | Stub | No-op. Returns `{ saved: false }`. |
| `POST /api/team/invite` | Stub | Returns placeholder invite id. No email delivery. |
| `GET /api/user/preferences` | Stub | Returns hardcoded defaults. No persistence. |
| `PUT /api/user/preferences` | Stub | Accepts JSON but does not persist. |
| `GET /api/watchlist` | Stub | Returns a single hardcoded list. |
| `POST /api/watchlist` | Stub | Accepts JSON but does not persist. |

## Bridge service

| Surface | Status | Notes |
| :--- | :--- | :--- |
| Gitea-to-Devin bridge (`bridge/`) | Infra | Local webhook relay for the Gitea demo flow. Not a product surface. See `docs/gitea-devin-bridge.md`. |

## Components

A few UI components exist solely to support stub pages. They are functional as isolated widgets but do not connect to any backend or persisted state.

| Component | Location | Status | Notes |
| :--- | :--- | :--- | :--- |
| `PriceAlertDialog` | `components/features/price-alert-dialog.tsx` | Stub | Dialog shell used on `/alerts`. No save action. |
| `ImportCsvPanel` | `components/features/import-csv.tsx` | Stub | CSV upload panel on `/portfolio`. UI only. |
| `NotificationBell` | `components/features/notification-bell.tsx` | Stub | Bell icon widget. Reads from stub notifications API. |
