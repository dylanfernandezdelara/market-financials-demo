import type { Metadata } from "next";
import { Suspense } from "react";
import { Briefcase, TrendingUp, Wallet } from "lucide-react";
import { AllocationDonutChart } from "@/components/charts/allocation-donut-chart";
import { PortfolioTrendChart } from "@/components/charts/portfolio-trend-chart";
import { ChangePill } from "@/components/ui/change-pill";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SiteHeader } from "@/components/site-header";
import { ImportCsvPanel } from "@/components/features/import-csv";
import { getPortfolioSnapshot, getSearchUniverse } from "@/lib/market-data";
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  formatSignedCurrency,
} from "@/lib/utils";

/* FDL-652 -- shared constant map for portfolio section headings */
const SECTION_HEADINGS = {
  overview: {
    eyebrow: "Portfolio overview",
    title: "Account summary and holdings",
    description:
      "Track positions, sector exposure, and recent performance in one place.",
  },
  trend: {
    eyebrow: "Performance",
    title: "Portfolio trend",
    description: "Trailing balance history across recent months.",
  },
  exposure: {
    eyebrow: "Exposure",
    title: "Sector allocation",
    description: "Where portfolio risk is concentrated by sector.",
  },
  holdings: {
    eyebrow: "Holdings",
    title: "Current positions",
    description: "Positions with cost basis and unrealized performance.",
  },
} as const;

/* FDL-883 -- normalised metadata for the portfolio page */
export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "View your portfolio holdings, sector exposure, and performance trends.",
};

/* FDL-661 -- page-size constant for holdings pagination */
const HOLDINGS_PAGE_SIZE = 10;

type PortfolioPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default function PortfolioPage({
  searchParams,
}: PortfolioPageProps) {
  return (
    <Suspense fallback={<PortfolioPageFallback />}>
      <PortfolioPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function PortfolioPageContent({
  searchParams,
}: PortfolioPageProps) {
  const [portfolio, searchOptions, resolvedSearchParams] = await Promise.all([
    getPortfolioSnapshot(),
    getSearchUniverse(),
    searchParams,
  ]);

  /* FDL-656 -- sector-exposure chart driven by actual portfolio data */
  const allocationData = portfolio.sectorExposure.map((entry) => ({
    label: entry.sector,
    value: entry.value,
  }));

  /* FDL-658 -- total unrealised gain computed dynamically */
  const totalUnrealizedGain = portfolio.totalValue - portfolio.totalCost - portfolio.cashBalance;
  const totalUnrealizedGainPercent =
    portfolio.totalCost === 0
      ? 0
      : (totalUnrealizedGain / portfolio.totalCost) * 100;

  /* FDL-657 -- auto-sort holdings by absolute unrealised gain descending */
  const sortedHoldings = [...portfolio.holdings].sort(
    (a, b) => Math.abs(b.gainLoss) - Math.abs(a.gainLoss),
  );

  /* FDL-661 -- paginate holdings */
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);
  const totalPages = Math.max(1, Math.ceil(sortedHoldings.length / HOLDINGS_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * HOLDINGS_PAGE_SIZE;
  const paginatedHoldings = sortedHoldings.slice(
    startIndex,
    startIndex + HOLDINGS_PAGE_SIZE,
  );

  return (
    <SiteHeader searchOptions={searchOptions}>
      <div className="flex flex-col gap-6 pb-8">
        <SurfaceCard className="overflow-hidden">
          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                {SECTION_HEADINGS.overview.eyebrow}
              </p>
              <div className="space-y-2">
                <h2 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                  {SECTION_HEADINGS.overview.title}
                </h2>
                <p className="max-w-2xl text-base leading-7 text-neutral-600">
                  {SECTION_HEADINGS.overview.description}
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Wallet className="size-4 text-emerald-600" />
                  Account value
                </div>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
                  {formatCurrency(portfolio.totalValue)}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <TrendingUp className="size-4 text-emerald-600" />
                  Day change
                </div>
                <p
                  className={`mt-3 text-3xl font-semibold tracking-tight ${
                    portfolio.dayChange < 0 ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {formatSignedCurrency(portfolio.dayChange)}
                </p>
                <p className="mt-2 text-sm text-neutral-600">
                  {formatPercent(portfolio.dayChangePercent)}
                </p>
              </div>
            </div>
          </div>
        </SurfaceCard>

        {/* FDL-660 -- total unrealised gain card */}
        <SurfaceCard>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Briefcase className="size-4 text-emerald-600" />
            Total unrealised gain
          </div>
          <p
            className={`mt-3 text-3xl font-semibold tracking-tight ${
              totalUnrealizedGain < 0 ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {formatSignedCurrency(totalUnrealizedGain)}
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            {formatPercent(totalUnrealizedGainPercent)}
          </p>
        </SurfaceCard>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <SurfaceCard>
            <SectionHeader
              eyebrow={SECTION_HEADINGS.trend.eyebrow}
              title={SECTION_HEADINGS.trend.title}
              description={SECTION_HEADINGS.trend.description}
            />
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <PortfolioTrendChart data={portfolio.trend} />
            </div>
          </SurfaceCard>
          <SurfaceCard>
            <SectionHeader
              eyebrow={SECTION_HEADINGS.exposure.eyebrow}
              title={SECTION_HEADINGS.exposure.title}
              description={SECTION_HEADINGS.exposure.description}
            />
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <AllocationDonutChart data={allocationData} />
            </div>
            {/* FDL-659 -- ARIA list with keyboard-navigable sector rows */}
            <ul
              role="list"
              aria-label="Sector exposure breakdown"
              className="mt-4 grid gap-2"
            >
              {portfolio.sectorExposure.map((entry) => (
                <li
                  key={entry.sector}
                  tabIndex={0}
                  role="listitem"
                  aria-label={`${entry.sector}: ${formatCompactCurrency(entry.value)}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <span className="font-medium text-neutral-900">{entry.sector}</span>
                  <span className="text-neutral-500">{formatCompactCurrency(entry.value)}</span>
                </li>
              ))}
            </ul>
          </SurfaceCard>
        </section>

        <SurfaceCard>
          <div className="mb-6">
            <ImportCsvPanel />
          </div>
          <SectionHeader
            eyebrow={SECTION_HEADINGS.holdings.eyebrow}
            title={SECTION_HEADINGS.holdings.title}
            description={SECTION_HEADINGS.holdings.description}
          />

          {/* FDL-654 -- empty-state illustration */}
          {sortedHoldings.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
              <Briefcase className="size-12 text-neutral-300" aria-hidden />
              <p className="mt-4 text-lg font-medium text-neutral-700">
                No holdings yet
              </p>
              <p className="mt-1 max-w-sm text-sm text-neutral-500">
                Import a CSV or add positions to see your portfolio here.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-200">
                <table className="min-w-full divide-y divide-neutral-200 text-sm">
                  <thead className="bg-neutral-50">
                    <tr className="text-left text-neutral-500">
                      <th className="px-4 py-3 font-medium">Symbol</th>
                      <th className="px-4 py-3 font-medium">Shares</th>
                      <th className="px-4 py-3 font-medium">Avg cost</th>
                      <th className="px-4 py-3 font-medium">Current</th>
                      <th className="px-4 py-3 font-medium">Market value</th>
                      <th className="px-4 py-3 font-medium">Gain / loss</th>
                      <th className="px-4 py-3 font-medium">Allocation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 bg-white">
                    {paginatedHoldings.map((holding) => (
                      <tr
                        key={holding.symbol}
                        className={
                          /* FDL-655 -- colour-code rows by gain/loss */
                          holding.gainLoss > 0
                            ? "bg-emerald-50/40"
                            : holding.gainLoss < 0
                              ? "bg-rose-50/40"
                              : ""
                        }
                      >
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-mono font-semibold text-neutral-900">{holding.symbol}</p>
                            <p className="text-xs text-neutral-500">{holding.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-neutral-600">{holding.shares}</td>
                        <td className="px-4 py-4 text-neutral-600">
                          {formatCurrency(holding.averageCost)}
                        </td>
                        <td className="px-4 py-4 text-neutral-600">
                          {formatCurrency(holding.currentPrice)}
                        </td>
                        <td className="px-4 py-4 font-medium text-neutral-900">
                          {formatCurrency(holding.marketValue)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-neutral-900">
                              {formatSignedCurrency(holding.gainLoss)}
                            </span>
                            <ChangePill value={holding.gainLossPercent} compact />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-neutral-600">
                          {holding.allocationPercent.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* FDL-661 -- pagination controls */}
              {totalPages > 1 && (
                <nav
                  aria-label="Holdings pagination"
                  className="mt-4 flex items-center justify-center gap-2"
                >
                  {safePage > 1 && (
                    <a
                      href={`/portfolio?page=${safePage - 1}`}
                      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      Previous
                    </a>
                  )}
                  <span className="text-sm text-neutral-500">
                    Page {safePage} of {totalPages}
                  </span>
                  {safePage < totalPages && (
                    <a
                      href={`/portfolio?page=${safePage + 1}`}
                      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      Next
                    </a>
                  )}
                </nav>
              )}
            </>
          )}
        </SurfaceCard>
      </div>
    </SiteHeader>
  );
}

function PortfolioPageFallback() {
  return (
    <SiteHeader searchOptions={[]}>
      <div className="px-6 py-10 text-sm text-neutral-500">Loading portfolio...</div>
    </SiteHeader>
  );
}
