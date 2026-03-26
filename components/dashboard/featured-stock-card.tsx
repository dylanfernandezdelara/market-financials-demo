import Link from "next/link";
import { ArrowRight, LineChart } from "lucide-react";
import { StockProfile } from "@/types/finance";
import {
  changeToneClasses,
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  formatPercent,
  formatSignedCurrency,
} from "@/lib/utils";
import { PriceHistoryChart } from "@/components/charts/price-history-chart";
import { ChangePill } from "@/components/ui/change-pill";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";

type FeaturedStockCardProps = {
  stock: StockProfile;
};

export function FeaturedStockCard({ stock }: FeaturedStockCardProps) {
  return (
    <SurfaceCard className="h-full bg-[linear-gradient(180deg,rgba(255,250,243,0.92),rgba(247,251,255,0.9))]">
      <SectionHeader
        eyebrow="Spotlight"
        title={`${stock.name} (${stock.symbol})`}
        description={stock.thesis}
        action={
          <Link
            href={`/stocks/${stock.symbol}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-950"
          >
            View details
            <ArrowRight className="size-4" />
          </Link>
        }
      />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-[28px] border border-slate-900/10 bg-[linear-gradient(180deg,#fffefb,#eff5fb)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                Intraday trend
              </p>
              <div className="mt-3 flex items-end gap-3">
                <p className="text-4xl font-semibold tracking-tight text-slate-950">
                  {formatCurrency(stock.price)}
                </p>
                <p
                  className={`pb-1 text-sm font-medium ${changeToneClasses(stock.changePercent)}`}
                >
                  {formatSignedCurrency(stock.change)} · {formatPercent(stock.changePercent)}
                </p>
              </div>
            </div>
            <ChangePill value={stock.changePercent} />
          </div>
          <div className="rounded-[24px] border border-white/70 bg-white/70 p-2">
            <PriceHistoryChart data={stock.chart} color="#0f766e" />
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[28px] border border-white/70 bg-white/86 p-5">
            <div className="flex items-center gap-2">
              <LineChart className="size-4 text-amber-600" />
              <p className="text-sm font-medium text-slate-900">Signal stack</p>
            </div>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-3 rounded-[18px] bg-slate-50 px-4 py-3">
                <dt className="text-slate-500">Market cap</dt>
                <dd className="font-medium text-slate-900">
                  {formatCompactCurrency(stock.marketCap)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[18px] bg-slate-50 px-4 py-3">
                <dt className="text-slate-500">Volume</dt>
                <dd className="font-medium text-slate-900">{formatCompactNumber(stock.volume)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[18px] bg-slate-50 px-4 py-3">
                <dt className="text-slate-500">P/E</dt>
                <dd className="font-medium text-slate-900">{stock.peRatio ?? "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[18px] bg-slate-50 px-4 py-3">
                <dt className="text-slate-500">Sector</dt>
                <dd className="font-medium text-slate-900">{stock.sector}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-[28px] border border-slate-900/10 bg-[linear-gradient(180deg,#0f172a,#18283a)] p-5 text-white shadow-[0_16px_40px_rgba(15,23,42,0.22)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-amber-200/80">
              Why it matters
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-200">{stock.description}</p>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
