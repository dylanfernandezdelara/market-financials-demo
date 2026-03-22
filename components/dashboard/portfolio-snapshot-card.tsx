import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PortfolioSnapshot } from "@/types/finance";
import { AllocationDonutChart } from "@/components/charts/allocation-donut-chart";
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  formatSignedCurrency,
} from "@/lib/utils";
import { ChangePill } from "@/components/ui/change-pill";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";

type PortfolioSnapshotCardProps = {
  portfolio: PortfolioSnapshot;
};

export function PortfolioSnapshotCard({ portfolio }: PortfolioSnapshotCardProps) {
  const allocationData = portfolio.holdings.map((holding) => ({
    label: holding.symbol,
    value: holding.marketValue,
  }));

  return (
    <SurfaceCard className="h-full bg-[linear-gradient(180deg,rgba(255,248,239,0.95),rgba(241,247,252,0.92))]">
      <SectionHeader
        eyebrow="Portfolio"
        title="Account snapshot"
        description="Sample holdings and rough allocation based on the mock feed."
        action={
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-950"
          >
            Open portfolio
            <ArrowRight className="size-4" />
          </Link>
        }
      />
      <div className="mt-6 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[28px] border border-white/70 bg-white/78 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
            Allocation
          </p>
          <AllocationDonutChart data={allocationData} />
          <div className="grid gap-2">
            {portfolio.holdings.slice(0, 4).map((holding) => (
              <div
                key={holding.symbol}
                className="flex items-center justify-between gap-3 rounded-[18px] bg-slate-50 px-3 py-2.5 text-sm"
              >
                <span className="font-medium text-slate-900">{holding.symbol}</span>
                <span className="text-slate-500">
                  {holding.allocationPercent.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[28px] border border-slate-900/10 bg-[linear-gradient(180deg,#0f172a,#1b2c40)] p-5 text-white shadow-[0_18px_44px_rgba(15,23,42,0.22)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-300">
              Portfolio value
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <p className="text-4xl font-semibold tracking-tight">
                {formatCurrency(portfolio.totalValue)}
              </p>
              <p className="pb-1 text-sm text-emerald-300">
                {formatSignedCurrency(portfolio.dayChange)} ·{" "}
                {formatPercent(portfolio.dayChangePercent)}
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-[22px] bg-white/6 p-4">
                <p className="text-xs text-slate-400">Cash</p>
                <p className="mt-2 text-xl font-semibold">
                  {formatCompactCurrency(portfolio.cashBalance)}
                </p>
              </div>
              <div className="rounded-[22px] bg-white/6 p-4">
                <p className="text-xs text-slate-400">Holdings</p>
                <p className="mt-2 text-xl font-semibold">{portfolio.holdings.length}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {portfolio.holdings.slice(0, 4).map((holding) => (
              <div
                key={holding.symbol}
                className="rounded-[24px] border border-white/75 bg-white/80 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
                      {holding.symbol}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{holding.name}</p>
                  </div>
                  <ChangePill value={holding.gainLossPercent} compact />
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-950">
                  {formatCurrency(holding.marketValue)}
                </p>
                <p className="mt-1 text-xs text-slate-500">{holding.shares} shares</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
