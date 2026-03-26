import { IntegrationCard } from "@/components/features/integration-card";

const integrations = [
  {
    id: "broker-sync",
    name: "Broker sync",
    description: "Sync positions and balances from your brokerage account.",
    connected: true,
    connectedAt: "Mar 12, 2026",
    scopes: [
      {
        id: "read-positions",
        label: "Read positions",
        description: "View current holdings and open orders.",
        enabled: true,
      },
      {
        id: "read-balances",
        label: "Read balances",
        description: "View cash balances and buying power.",
        enabled: true,
      },
      {
        id: "place-orders",
        label: "Place orders",
        description: "Submit and cancel trade orders on your behalf.",
        enabled: false,
      },
    ],
  },
  {
    id: "news-wire",
    name: "News wire",
    description: "Stream headlines and sentiment from financial news sources.",
    connected: false,
    connectedAt: null,
    scopes: [
      {
        id: "read-headlines",
        label: "Read headlines",
        description: "Access real-time news headlines and summaries.",
        enabled: true,
      },
      {
        id: "read-sentiment",
        label: "Read sentiment",
        description: "Access article-level sentiment scores.",
        enabled: true,
      },
    ],
  },
  {
    id: "market-data",
    name: "Market data feed",
    description: "Real-time and historical price data from exchanges.",
    connected: true,
    connectedAt: "Feb 28, 2026",
    scopes: [
      {
        id: "realtime-quotes",
        label: "Real-time quotes",
        description: "Stream live bid/ask and last-sale prices.",
        enabled: true,
      },
      {
        id: "historical-ohlcv",
        label: "Historical OHLCV",
        description: "Fetch daily and intraday candlestick data.",
        enabled: true,
      },
      {
        id: "level2-depth",
        label: "Level II depth",
        description: "Access full order-book depth of market.",
        enabled: false,
      },
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Integrations</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Connect brokerage and data feeds. Manage permission scopes or revoke
        access for each integration.
      </p>
      <div className="mt-6 space-y-4">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
    </div>
  );
}
