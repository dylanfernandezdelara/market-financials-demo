import { cacheLife } from "next/cache";
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
import { getDashboardData, getSearchUniverse } from "@/lib/market-data";

export default async function Home() {
  "use cache";
  cacheLife("seconds");
  const [dashboard, searchOptions] = await Promise.all([
    getDashboardData(),
    getSearchUniverse(),
  ]);

  return (
    <FinanceShell searchOptions={searchOptions}>
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
