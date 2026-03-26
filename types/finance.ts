export type TrendDirection = "up" | "down" | "flat";

export type PricePoint = {
  label: string;
  price: number;
  volume: number;
};

export type MarketIndex = {
  symbol: string;
  name: string;
  price: number;
  displayValue: string;
  change: number;
  displayChange: string;
  changePercent: number;
  sessionRange: string;
};

export type StockProfile = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  sector: string;
  industry: string;
  exchange: string;
  peRatio: number;
  dividendYield: number;
  week52Low: number;
  week52High: number;
  volume: number;
  averageVolume: number;
  beta: number;
  description: string;
  thesis: string;
  chart: PricePoint[];
};

export type WatchlistEntry = Pick<
  StockProfile,
  "symbol" | "name" | "price" | "change" | "changePercent" | "sector"
> & {
  alertPrice?: number;
};

export type NewsSentiment = "positive" | "neutral" | "negative";

export type NewsArticle = {
  id: string;
  headline: string;
  source: string;
  publishedAt: string;
  summary: string;
  url: string;
  relatedSymbols: string[];
  sentiment: NewsSentiment;
};

export type TopMover = {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  narrative: string;
};

export type SectorPerformance = {
  name: string;
  changePercent: number;
  leaders: string[];
};

export type MarketPulse = {
  marketStatus: string;
  advancers: number;
  decliners: number;
  putCallRatio: number;
  fearGreedScore: number;
};

export type SearchResult = Pick<
  StockProfile,
  "symbol" | "name" | "exchange" | "sector" | "price" | "changePercent"
>;

export type Holding = {
  symbol: string;
  shares: number;
  averageCost: number;
};

export type PortfolioHolding = Holding & {
  name: string;
  sector: string;
  currentPrice: number;
  marketValue: number;
  gainLoss: number;
  gainLossPercent: number;
  allocationPercent: number;
};

export type PortfolioTrendPoint = {
  label: string;
  value: number;
};

export type PortfolioSnapshot = {
  totalValue: number;
  totalCost: number;
  cashBalance: number;
  dayChange: number;
  dayChangePercent: number;
  holdings: PortfolioHolding[];
  trend: PortfolioTrendPoint[];
  sectorExposure: {
    sector: string;
    value: number;
  }[];
};

export type FuturesAsset = {
  symbol: string;
  label: string;
  changePercent: number;
  price: number;
  change: number;
  /** Normalized 0–1 series for mini chart (length ≥ 2). */
  sparkline: number[];
};

export type MarketSummaryBlock = {
  headline: string;
  bullets: string[];
  sourceCount: number;
  updatedLabel: string;
};

export type RecentDevelopment = {
  id: string;
  timeAgo: string;
  title: string;
  excerpt: string;
};

export type PopularSpace = {
  id: string;
  title: string;
  description: string;
  cta: string;
  href: string;
};

export type StandoutStock = {
  symbol: string;
  name: string;
  exchange: string;
  volume: number;
  marketCap: number;
  peRatio: number | null;
  dividendYield: number | null;
  narrative: string;
};

export type WatchlistBarEntry = {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  exchange: string;
};

export type ListMover = {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  exchange: string;
};

export type SectorEtfRow = {
  name: string;
  symbol: string;
  price: number;
  changePercent: number;
};

export type CryptoQuote = {
  name: string;
  symbol: string;
  pairLabel: string;
  price: number;
  changePercent: number;
};

export type FixedIncomeRow = {
  name: string;
  symbol: string;
  price: number;
  changePercent: number;
};

export type MarketMovers = {
  gainers: ListMover[];
  losers: ListMover[];
  active: ListMover[];
};

export type PoliticianTrade = {
  id: string;
  politician: string;
  party: "D" | "R" | "I";
  chamber: "Senate" | "House";
  symbol: string;
  companyName: string;
  tradeType: "Buy" | "Sell";
  estimatedAmount: string;
  filedDate: string;
  daysAgo: number;
};

export type DashboardData = {
  sentimentLabel: string;
  sessionLabel: string;
  /** Filled at request time (e.g. Eastern session clock). */
  sessionDetail: string;
  topFutures: FuturesAsset[];
  marketSummary: MarketSummaryBlock;
  recentDevelopments: RecentDevelopment[];
  popularSpaces: PopularSpace[];
  standouts: StandoutStock[];
  watchlistBar: WatchlistBarEntry[];
  movers: MarketMovers;
  equitySectors: SectorEtfRow[];
  cryptocurrencies: CryptoQuote[];
  fixedIncome: FixedIncomeRow[];
  indices: MarketIndex[];
  pulse: MarketPulse;
  featuredStock: StockProfile;
  watchlist: WatchlistEntry[];
  topMovers: TopMover[];
  sectors: SectorPerformance[];
  news: NewsArticle[];
  portfolio: PortfolioSnapshot;
  politicianTrades: PoliticianTrade[];
};
