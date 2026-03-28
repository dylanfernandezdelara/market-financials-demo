import { CryptoRow } from "@/components/finance/crypto-row";
import { EquitySectors } from "@/components/finance/equity-sectors";
import { FinanceShell } from "@/components/finance/finance-shell";
import { FixedIncomeRow } from "@/components/finance/fixed-income-row";
import { MarketSummaryAccordion } from "@/components/finance/market-summary-accordion";
import { MoversPanel } from "@/components/finance/movers-panel";
import { PopularSpaces } from "@/components/finance/popular-spaces";
import { RecentDevelopments } from "@/components/finance/recent-developments";
import { StandoutsSection } from "@/components/finance/standouts-section";
import { TopFutures } from "@/components/finance/top-futures";
import { WatchlistStrip } from "@/components/finance/watchlist-strip";
import { QuickLinksRow } from "@/components/explore/quick-links";
import { getDashboardData, getRecentSymbols, getSearchUniverse, getWatchlistShortcuts } from "@/lib/market-data";

export default async function Home() {
  const [dashboard, searchOptions, recentSymbols, watchlistShortcuts] = await Promise.all([
    getDashboardData(),
    getSearchUniverse(),
    getRecentSymbols(),
    getWatchlistShortcuts(),
  ]);

  return (
    <FinanceShell searchOptions={searchOptions} recentSymbols={recentSymbols} watchlistShortcuts={watchlistShortcuts}>
      <div className="space-y-8">
        <TopFutures futures={dashboard.topFutures} sentimentLabel={dashboard.sentimentLabel} />
        <MarketSummaryAccordion summary={dashboard.marketSummary} />
        <RecentDevelopments developments={dashboard.recentDevelopments} />
        <PopularSpaces spaces={dashboard.popularSpaces} />
        <StandoutsSection standouts={dashboard.standouts} />
        <WatchlistStrip entries={dashboard.watchlistBar} />
        <MoversPanel movers={dashboard.movers} />
        <EquitySectors sectors={dashboard.equitySectors} />
        <CryptoRow quotes={dashboard.cryptocurrencies} />
        <FixedIncomeRow rows={dashboard.fixedIncome} />
        <QuickLinksRow />
      </div>
    </FinanceShell>
  );
}
