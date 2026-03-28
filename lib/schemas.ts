import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Primitives / enums                                                */
/* ------------------------------------------------------------------ */

const trendDirection = z.enum(["up", "down", "flat"]);

const newsSentiment = z.enum(["positive", "neutral", "negative"]);

/* ------------------------------------------------------------------ */
/*  Domain schemas – mirrors types/finance.ts                         */
/* ------------------------------------------------------------------ */

export const PricePointSchema = z.object({
  label: z.string(),
  price: z.number(),
  volume: z.number(),
});

export const MarketIndexSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  price: z.number(),
  displayValue: z.string(),
  change: z.number(),
  displayChange: z.string(),
  changePercent: z.number(),
  sessionRange: z.string(),
});

export const StockProfileSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  price: z.number(),
  change: z.number(),
  changePercent: z.number(),
  marketCap: z.number(),
  sector: z.string(),
  industry: z.string(),
  exchange: z.string(),
  peRatio: z.number(),
  dividendYield: z.number(),
  week52Low: z.number(),
  week52High: z.number(),
  volume: z.number(),
  averageVolume: z.number(),
  beta: z.number(),
  description: z.string(),
  thesis: z.string(),
  chart: z.array(PricePointSchema),
});

export const WatchlistEntrySchema = z.object({
  symbol: z.string(),
  name: z.string(),
  price: z.number(),
  change: z.number(),
  changePercent: z.number(),
  sector: z.string(),
  alertPrice: z.number().optional(),
});

export const NewsArticleSchema = z.object({
  id: z.string(),
  headline: z.string(),
  source: z.string(),
  publishedAt: z.string(),
  summary: z.string(),
  url: z.string(),
  relatedSymbols: z.array(z.string()),
  sentiment: newsSentiment,
});

export const TopMoverSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  price: z.number(),
  changePercent: z.number(),
  narrative: z.string(),
});

export const SectorPerformanceSchema = z.object({
  name: z.string(),
  changePercent: z.number(),
  leaders: z.array(z.string()),
});

export const MarketPulseSchema = z.object({
  marketStatus: z.string(),
  advancers: z.number(),
  decliners: z.number(),
  putCallRatio: z.number(),
  fearGreedScore: z.number(),
});

export const SearchResultSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  exchange: z.string(),
  sector: z.string(),
  price: z.number(),
  changePercent: z.number(),
});

export const PortfolioHoldingSchema = z.object({
  symbol: z.string(),
  shares: z.number(),
  averageCost: z.number(),
  name: z.string(),
  sector: z.string(),
  currentPrice: z.number(),
  marketValue: z.number(),
  gainLoss: z.number(),
  gainLossPercent: z.number(),
  allocationPercent: z.number(),
});

export const PortfolioTrendPointSchema = z.object({
  label: z.string(),
  value: z.number(),
});

export const PortfolioSnapshotSchema = z.object({
  totalValue: z.number(),
  totalCost: z.number(),
  cashBalance: z.number(),
  dayChange: z.number(),
  dayChangePercent: z.number(),
  holdings: z.array(PortfolioHoldingSchema),
  trend: z.array(PortfolioTrendPointSchema),
  sectorExposure: z.array(
    z.object({
      sector: z.string(),
      value: z.number(),
    }),
  ),
});

export const FuturesAssetSchema = z.object({
  symbol: z.string(),
  label: z.string(),
  changePercent: z.number(),
  price: z.number(),
  change: z.number(),
  sparkline: z.array(z.number()).min(2),
});

export const MarketSummaryBlockSchema = z.object({
  headline: z.string(),
  bullets: z.array(z.string()),
  sourceCount: z.number(),
  updatedLabel: z.string(),
});

export const RecentDevelopmentSchema = z.object({
  id: z.string(),
  timeAgo: z.string(),
  title: z.string(),
  excerpt: z.string(),
});

export const PopularSpaceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  cta: z.string(),
  href: z.string(),
});

export const StandoutStockSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  exchange: z.string(),
  volume: z.number(),
  marketCap: z.number(),
  peRatio: z.number().nullable(),
  dividendYield: z.number().nullable(),
  narrative: z.string(),
});

export const WatchlistBarEntrySchema = z.object({
  symbol: z.string(),
  name: z.string(),
  price: z.number(),
  changePercent: z.number(),
  exchange: z.string(),
});

export const ListMoverSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  price: z.number(),
  changePercent: z.number(),
  exchange: z.string(),
});

export const SectorEtfRowSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  price: z.number(),
  changePercent: z.number(),
});

export const CryptoQuoteSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  pairLabel: z.string(),
  price: z.number(),
  changePercent: z.number(),
});

export const FixedIncomeRowSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  price: z.number(),
  changePercent: z.number(),
});

export const MarketMoversSchema = z.object({
  gainers: z.array(ListMoverSchema),
  losers: z.array(ListMoverSchema),
  active: z.array(ListMoverSchema),
});

/* ------------------------------------------------------------------ */
/*  Composite response schemas – used by API routes                   */
/* ------------------------------------------------------------------ */

export const StocksListResponseSchema = z.object({
  count: z.number(),
  data: z.array(SearchResultSchema),
});

export const StockDetailResponseSchema = z.object({
  stock: StockProfileSchema,
  news: z.array(NewsArticleSchema),
  relatedStocks: z.array(StockProfileSchema),
});

export const MarketOverviewResponseSchema = z.object({
  sentimentLabel: z.string(),
  riskSentiment: z.string(),
  sessionLabel: z.string(),
  sessionDetail: z.string(),
  topFutures: z.array(FuturesAssetSchema),
  marketSummary: MarketSummaryBlockSchema,
  recentDevelopments: z.array(RecentDevelopmentSchema),
  popularSpaces: z.array(PopularSpaceSchema),
  standouts: z.array(StandoutStockSchema),
  watchlistBar: z.array(WatchlistBarEntrySchema),
  movers: MarketMoversSchema,
  equitySectors: z.array(SectorEtfRowSchema),
  cryptocurrencies: z.array(CryptoQuoteSchema),
  fixedIncome: z.array(FixedIncomeRowSchema),
  indices: z.array(MarketIndexSchema),
  pulse: MarketPulseSchema,
  featuredStock: StockProfileSchema,
  topMovers: z.array(TopMoverSchema),
  sectors: z.array(SectorPerformanceSchema),
});

export const PortfolioResponseSchema = PortfolioSnapshotSchema.extend({
  netLiquidity: z.number(),
});

export const SearchResponseSchema = z.object({
  query: z.string(),
  count: z.number(),
  results: z.array(SearchResultSchema),
});

export const NewsResponseSchema = z.object({
  data: z.array(NewsArticleSchema),
  total: z.number(),
});

export const BenchmarksResponseSchema = z.object({
  benchmarks: z.array(MarketIndexSchema),
});

export const InsightRowSchema = z.object({
  id: z.string(),
  values: z.array(z.number()),
});

export const InsightsResponseSchema = z.object({
  generatedAt: z.string(),
  count: z.number(),
  rows: z.array(InsightRowSchema),
});

export const BatchQuotesResponseSchema = z.object({
  count: z.number(),
  quotes: z.array(
    z.union([
      SearchResultSchema,
      z.object({ symbol: z.string(), price: z.number() }),
    ]),
  ),
});

/* ------------------------------------------------------------------ */
/*  Re-export trendDirection / newsSentiment for potential consumers   */
/* ------------------------------------------------------------------ */

export { trendDirection as TrendDirectionSchema, newsSentiment as NewsSentimentSchema };
