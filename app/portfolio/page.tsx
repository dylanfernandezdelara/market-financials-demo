import { TrendingUp, Wallet } from "lucide-react";
import { AllocationDonutChart } from "@/components/charts/allocation-donut-chart";
import { PortfolioTrendChart } from "@/components/charts/portfolio-trend-chart";
import { ChangePill } from "@/components/ui/change-pill";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SiteHeader } from "@/components/site-header";
import { getPortfolioSnapshot, getSearchUniverse } from "@/lib/market-data";
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  formatSignedCurrency,
} from "@/lib/utils";

export default async function PortfolioPage() {
  const [portfolio, searchOptions] = await Promise.all([
    getPortfolioSnapshot(),
    getSearchUniverse(),
  ]);
  const allocationData = portfolio.sectorExposure.map((entry) => ({
    label: entry.sector,
    value: entry.value,
  }));

  return (
    <SiteHeader searchOptions={searchOptions}>
      <div className="flex flex-col gap-6 pb-8">
        <SurfaceCard className="overflow-hidden">
          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                Portfolio overview
              </p>
              <div className="space-y-2">
                <h2 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                  Account summary and holdings
                </h2>
                <p className="max-w-2xl text-base leading-7 text-neutral-600">
                  Track positions, sector exposure, and recent performance in one place.
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
                    portfolio.dayChange < 0 ? "text-emerald-600" : "text-red-600"
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

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <SurfaceCard>
            <SectionHeader
              eyebrow="Performance"
              title="Portfolio trend"
              description="Trailing balance history across recent months."
            />
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <PortfolioTrendChart data={portfolio.trend} />
            </div>
          </SurfaceCard>
          <SurfaceCard>
            <SectionHeader
              eyebrow="Exposure"
              title="Sector allocation"
              description="Where portfolio risk is concentrated by sector."
            />
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <AllocationDonutChart data={allocationData} />
            </div>
            <div className="mt-4 grid gap-2">
              {portfolio.sectorExposure.map((entry) => (
                <div
                  key={entry.sector}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm"
                >
                  <span className="font-medium text-neutral-900">{entry.sector}</span>
                  <span className="text-neutral-500">{formatCompactCurrency(entry.value)}</span>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </section>

        <SurfaceCard>
          <SectionHeader
            eyebrow="Holdings"
            title="Current positions"
            description="Positions with cost basis and unrealized performance."
          />
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
                {portfolio.holdings.map((holding) => (
                  <tr key={holding.symbol}>
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
        </SurfaceCard>
      </div>
    </SiteHeader>
  );
}
