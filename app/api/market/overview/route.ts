import { getDashboardData } from "@/lib/market-data";
import { MarketOverviewResponseSchema } from "@/lib/schemas";
import { validatedResponse } from "@/lib/validate";

export async function GET() {
  const dashboard = await getDashboardData();

  return validatedResponse(MarketOverviewResponseSchema, {
    sentimentLabel: dashboard.sentimentLabel,
    sessionLabel: dashboard.sessionLabel,
    sessionDetail: dashboard.sessionDetail,
    topFutures: dashboard.topFutures,
    marketSummary: dashboard.marketSummary,
    recentDevelopments: dashboard.recentDevelopments,
    popularSpaces: dashboard.popularSpaces,
    standouts: dashboard.standouts,
    watchlistBar: dashboard.watchlistBar,
    movers: dashboard.movers,
    equitySectors: dashboard.equitySectors,
    cryptocurrencies: dashboard.cryptocurrencies,
    fixedIncome: dashboard.fixedIncome,
    indices: dashboard.indices,
    pulse: dashboard.pulse,
    featuredStock: dashboard.featuredStock,
    topMovers: dashboard.topMovers,
    sectors: dashboard.sectors,
  });
}
