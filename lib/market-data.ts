import { notFound } from "next/navigation";
import {
  AlertSuggestion,
  DashboardData,
  NewsArticle,
  PortfolioHolding,
  PortfolioSnapshot,
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

const CONCENTRATION_THRESHOLD = 25;
const FAST_MOVER_THRESHOLD = 3;

export async function getAlertSuggestions(): Promise<AlertSuggestion[]> {
  const holdings = portfolioHoldingsWithValues();
  const suggestions: AlertSuggestion[] = [];

  for (const holding of holdings) {
    if (holding.allocationPercent >= CONCENTRATION_THRESHOLD) {
      suggestions.push({
        symbol: holding.symbol,
        name: holding.name,
        reason: "concentration",
        headline: `${holding.symbol} is ${holding.allocationPercent.toFixed(1)}% of your portfolio`,
        detail: `Consider a rebalance alert — this position exceeds the ${CONCENTRATION_THRESHOLD}% concentration threshold.`,
      });
    }

    const stock = stockProfiles.find((p) => p.symbol === holding.symbol);
    if (stock && Math.abs(stock.changePercent) >= FAST_MOVER_THRESHOLD) {
      const direction = stock.changePercent > 0 ? "up" : "down";
      suggestions.push({
        symbol: holding.symbol,
        name: holding.name,
        reason: "fast_mover",
        headline: `${holding.symbol} moved ${direction} ${Math.abs(stock.changePercent).toFixed(2)}% today`,
        detail: `Set a trailing-stop or price-cross alert to protect against further ${direction === "down" ? "downside" : "reversal"}.`,
      });
    }
  }

  return suggestions;
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
