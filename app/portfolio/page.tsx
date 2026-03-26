import { TrendingUp, Wallet } from "lucide-react";
import { AllocationDonutChart } from "@/components/charts/allocation-donut-chart";
import { PortfolioTrendChart } from "@/components/charts/portfolio-trend-chart";
import { ChangePill } from "@/components/ui/change-pill";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SiteHeader } from "@/components/site-header";
import { ImportCsvPanel } from "@/components/features/import-csv";
import {
  getPortfolioSnapshot,
  getSearchUniverse,
  getTransactionLedger,
} from "@/lib/market-data";
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  formatSignedCurrency,
} from "@/lib/utils";
import type { TransactionType } from "@/types/finance";

const txnTypeLabels: Record<TransactionType, string> = {
  buy: "Buy",
  sell: "Sell",
  dividend: "Dividend",
  deposit: "Deposit",
  withdrawal: "Withdrawal",
};

const txnTypeBadgeClasses: Record<TransactionType, string> = {
  buy: "border-emerald-300 bg-emerald-50 text-emerald-700",
  sell: "border-rose-300 bg-rose-50 text-rose-700",
  dividend: "border-amber-300 bg-amber-50 text-amber-700",
  deposit: "border-sky-300 bg-sky-50 text-sky-700",
  withdrawal: "border-slate-300 bg-slate-100 text-slate-600",
};

export default async function PortfolioPage() {
  const [portfolio, searchOptions, transactions] = await Promise.all([
    getPortfolioSnapshot(),
    getSearchUniverse(),
    getTransactionLedger(),
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
          <div className="mb-6">
            <ImportCsvPanel />
          </div>
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

        <SurfaceCard>
          <SectionHeader
            eyebrow="Ledger"
            title="Transaction history"
            description="Full record of buys, sells, dividends, and cash movements for performance and tax reporting."
          />
          <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-200">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <thead className="bg-neutral-50">
                <tr className="text-left text-neutral-500">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Symbol</th>
                  <th className="px-4 py-3 font-medium">Shares</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td className="px-4 py-4 font-mono text-neutral-600">
                      {txn.date}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold tracking-[0.08em] ${txnTypeBadgeClasses[txn.type]}`}
                      >
                        {txnTypeLabels[txn.type]}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono font-semibold text-neutral-900">
                      {txn.symbol ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-neutral-600">
                      {txn.shares ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-neutral-600">
                      {txn.pricePerShare !== null
                        ? formatCurrency(txn.pricePerShare)
                        : "—"}
                    </td>
                    <td className="px-4 py-4 font-medium text-neutral-900">
                      {txn.type === "withdrawal"
                        ? `-${formatCurrency(txn.totalAmount)}`
                        : formatCurrency(txn.totalAmount)}
                    </td>
                    <td className="px-4 py-4 text-neutral-500">
                      {txn.notes}
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
