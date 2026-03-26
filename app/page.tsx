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
import { saveLayout } from "@/app/saved/actions";

export default async function Home() {
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
        <form action={saveLayout} className="flex items-center gap-3">
          <input
            type="text"
            name="name"
            placeholder="Layout name"
            required
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
          >
            Save layout
          </button>
        </form>
      </div>
    </FinanceShell>
  );
}
