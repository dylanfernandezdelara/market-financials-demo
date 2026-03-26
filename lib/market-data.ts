import { notFound } from "next/navigation";
import {
  DashboardData,
  NewsArticle,
  PortfolioHolding,
  PortfolioSnapshot,
  PricePoint,
  SearchResult,
  StockProfile,
  WatchlistEntry,
} from "@/types/finance";
import {
  cryptoQuotes,
  equitySectorEtfs,
  fixedIncomeRows,
  marketMoversLists,
  marketSummaryBlock,
  popularSpaces,
  recentDevelopments,
  marketIndices,
  marketPulse,
  newsArticles,
  portfolioHoldings,
  portfolioTrend,
  sectorPerformance,
  standouts,
  stockProfiles,
  topFutures,
  topMovers,
  watchlistBarEntries,
  watchlistSymbols,
} from "@/lib/mock-data";


function portfolioHoldingsWithValues(): PortfolioHolding[] {
  const enriched = portfolioHoldings
    .map((holding) => {
      const stock = stockProfiles.find((profile) => profile.symbol === holding.symbol);

      if (!stock) {
        return null;
      }

      const marketValue = stock.price * holding.shares;
      const costBasis = holding.averageCost * holding.shares;
      const gainLoss = marketValue - costBasis;

      return {
        ...holding,
        name: stock.name,
        sector: stock.sector,
        currentPrice: stock.price,
        marketValue,
        gainLoss,
        gainLossPercent: costBasis === 0 ? 0 : (gainLoss / costBasis) * 100,
      };
    })
    .filter((value): value is Omit<PortfolioHolding, "allocationPercent"> => Boolean(value));

  const totalMarketValue = enriched.reduce((sum, holding) => sum + holding.marketValue, 0);

  return enriched.map((holding) => ({
    ...holding,
    allocationPercent: totalMarketValue === 0 ? 0 : (holding.marketValue / totalMarketValue) * 100,
  }));
}

function buildPortfolioSnapshot(): PortfolioSnapshot {
  const holdings = portfolioHoldingsWithValues();
  const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);
  const totalCost = holdings.reduce(
    (sum, holding) => sum + holding.averageCost * holding.shares,
    0,
  );
  const cashBalance = 11_640;
  const dayChange = holdings.reduce(
    (sum, holding) => sum + holding.currentPrice * (holding.gainLossPercent / 100) * 0.09,
    0,
  );
  const sectorMap = new Map<string, number>();

  holdings.forEach((holding) => {
    sectorMap.set(
      holding.sector,
      (sectorMap.get(holding.sector) ?? 0) + holding.marketValue,
    );
  });

  const sectorExposure = Array.from(sectorMap.entries())
    .map(([sector, value]) => ({ sector, value }))
    .sort((left, right) => right.value - left.value);

  return {
    totalValue: totalValue + cashBalance,
    totalCost,
    cashBalance,
    dayChange,
    dayChangePercent: totalValue === 0 ? 0 : (dayChange / totalValue) * 100,
    holdings,
    trend: portfolioTrend,
    sectorExposure,
  };
}

function buildWatchlist(): WatchlistEntry[] {
  return watchlistSymbols
    .map((symbol) => stockProfiles.find((profile) => profile.symbol === symbol))
    .filter((value): value is StockProfile => Boolean(value))
    .map((stock) => ({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      sector: stock.sector,
      alertPrice: stock.price * 1.02,
    }));
}

function sessionClock(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  }).format(new Date());
}

export async function getDashboardData(): Promise<DashboardData> {
  return {
    sentimentLabel: "Bearish Sentiment",
    sessionLabel: "After-hours",
    sessionDetail: sessionClock(),
    topFutures,
    marketSummary: marketSummaryBlock,
    recentDevelopments,
    popularSpaces,
    standouts,
    watchlistBar: watchlistBarEntries,
    movers: marketMoversLists,
    equitySectors: equitySectorEtfs,
    cryptocurrencies: cryptoQuotes,
    fixedIncome: fixedIncomeRows,
    indices: marketIndices,
    pulse: marketPulse,
    featuredStock: stockProfiles.find((stock) => stock.symbol === "NVDA") ?? stockProfiles[0],
    watchlist: buildWatchlist(),
    topMovers,
    sectors: sectorPerformance,
    news: newsArticles,
    portfolio: buildPortfolioSnapshot(),
  };
}

export async function getPortfolioSnapshot() {
  return buildPortfolioSnapshot();
}

export async function getSearchUniverse(): Promise<SearchResult[]> {
  return stockProfiles.map((stock) => ({
    symbol: stock.symbol,
    name: stock.name,
    exchange: stock.exchange,
    sector: stock.sector,
    price: stock.price,
    changePercent: stock.changePercent,
  }));
}

export async function searchSymbols(query?: string): Promise<SearchResult[]> {
  const universe = await getSearchUniverse();
  const normalizedQuery = query?.trim().toLowerCase();

  if (!normalizedQuery) {
    return universe;
  }

  return universe.filter(
    (stock) =>
      stock.symbol.toLowerCase().startsWith(normalizedQuery) ||
      stock.name.toLowerCase().includes(normalizedQuery),
  );
}

export async function getStockProfile(symbol: string) {
  return stockProfiles.find(
    (stock) => stock.symbol.toLowerCase() === symbol.trim().toLowerCase(),
  );
}

/** S&P 500 intra-day drift factors used to synthesize a benchmark overlay. */
const SP500_DRIFT = [0, 0.001, 0.0005, -0.0003, 0.0012, 0.0008, 0.0002, -0.0005, 0.001, 0.0006, 0.0003, 0.0009];

export function enrichChartWithBenchmark(chart: PricePoint[]): PricePoint[] {
  if (chart.length === 0) return chart;
  const basePrice = chart[0].price;
  let cumulativeDrift = 0;
  return chart.map((point, index) => {
    cumulativeDrift += SP500_DRIFT[index % SP500_DRIFT.length];
    return {
      ...point,
      benchmark: Math.round(basePrice * (1 + cumulativeDrift) * 100) / 100,
    };
  });
}

export async function getStockOrThrow(symbol: string) {
  const stock = await getStockProfile(symbol);

  if (!stock) {
    notFound();
  }

  return stock;
}

export async function getNews(limit?: number): Promise<NewsArticle[]> {
  if (limit === undefined || Number.isNaN(limit)) {
    return newsArticles;
  }

  if (limit <= 0) {
    return [];
  }

  return newsArticles.slice(0, limit);
}

export async function getNewsForSymbol(symbol: string) {
  return newsArticles.filter((article) =>
    article.relatedSymbols.some(
      (relatedSymbol) => relatedSymbol.toLowerCase() === symbol.trim().toLowerCase(),
    ),
  );
}

export async function getRelatedStocks(symbol: string) {
  const stock = await getStockProfile(symbol);

  if (!stock) {
    return [];
  }

  return stockProfiles
    .filter(
      (profile) =>
        profile.symbol !== stock.symbol &&
        profile.sector === stock.sector,
    )
    .slice(0, 3);
}
