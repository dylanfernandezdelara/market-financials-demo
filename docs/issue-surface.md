# Issue Surface

This codebase is intentionally scoped to be useful now while still leaving enough unbuilt surface area for a very large issue backlog.

## Strong issue categories

### Product and feature work

- Authentication and user accounts
- Editable watchlists
- Alerts and notification rules
- Advanced search and stock screener workflows
- Transaction history and portfolio rebalancing tools
- Dividend tracking, income projections, and tax views
- AI research assistant, summaries, and chat workflows
- Saved layouts and dashboard customization

### Data and integrations

- Real market data providers
- News provider integrations
- Background refresh and caching
- Rate limiting, retries, and stale-data handling
- Provider failover and data validation
- Better API contracts and pagination

### Frontend quality

- Accessibility improvements
- Mobile layout refinements
- Empty states, error states, and loading states
- Chart interaction improvements
- Table sorting, filtering, and virtualization
- Design system extraction

### Platform and engineering

- Unit, integration, and end-to-end tests
- CI pipelines
- Logging and observability
- Security hardening
- Database and persistence layer
- Admin and content workflows

## Why this can grow past 300 issues

The current app deliberately stops at the first useful layer:

- Single demo user
- Mock-only data
- Minimal route coverage
- No persistence
- No testing
- Limited symbol coverage
- No operational tooling

That means the repo can support a large mix of issue types:

- Bugs caused by edge cases and missing validation
- UI and responsiveness defects
- Data-layer enhancements
- Platform requests
- Performance work
- Feature requests across portfolio, research, alerts, and collaboration

## Sensible next steps

If you want to start generating issues later, the highest-yield clusters are:

1. Portfolio transactions and persistence
2. Real market/news provider integration
3. Search, screener, and watchlist management
4. Test coverage and CI
5. Accessibility and mobile polish
