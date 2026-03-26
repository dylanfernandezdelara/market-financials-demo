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
import { HomeLayoutShell } from "@/components/dashboard/home-layout-shell";
import { getDashboardData, getSearchUniverse } from "@/lib/market-data";
import type { HomeSectionId } from "@/lib/home-layout";

export default async function Home() {
  const [dashboard, searchOptions] = await Promise.all([
    getDashboardData(),
    getSearchUniverse(),
  ]);

  const sectionMap: Record<HomeSectionId, React.ReactNode> = {
    "top-futures": <TopFutures futures={dashboard.topFutures} sentimentLabel={dashboard.sentimentLabel} />,
    "market-summary": <MarketSummaryAccordion summary={dashboard.marketSummary} />,
    "recent-developments": <RecentDevelopments developments={dashboard.recentDevelopments} />,
    "popular-spaces": <PopularSpaces spaces={dashboard.popularSpaces} />,
    standouts: <StandoutsSection standouts={dashboard.standouts} />,
    watchlist: <WatchlistStrip entries={dashboard.watchlistBar} />,
    movers: <MoversPanel movers={dashboard.movers} />,
    "equity-sectors": <EquitySectors sectors={dashboard.equitySectors} />,
    crypto: <CryptoRow quotes={dashboard.cryptocurrencies} />,
    "fixed-income": <FixedIncomeRow rows={dashboard.fixedIncome} />,
    "quick-links": <QuickLinksRow />,
  };

  return (
    <FinanceShell searchOptions={searchOptions}>
      <HomeLayoutShell sectionMap={sectionMap} />
    </FinanceShell>
  );
}
