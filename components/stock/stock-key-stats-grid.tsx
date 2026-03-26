import {
  dayRangeFromChart,
  epsFromPe,
  formatCompactTraded,
  prevClose,
} from "@/lib/stock-details";
import type { PricePoint, StockProfile } from "@/types/finance";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

type StockKeyStatsGridProps = {
  stock: StockProfile;
  chart: PricePoint[];
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-[#f0f0f0] py-2.5 sm:border-0 sm:py-0">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className="text-[13px] font-semibold tabular-nums text-[#1a1a1a]">{value}</dd>
    </div>
  );
}

export function StockKeyStatsGrid({ stock, chart }: StockKeyStatsGridProps) {
  const pc = prevClose(stock);
  const { low: dayLow, high: dayHigh } = dayRangeFromChart(chart);
  const eps = epsFromPe(stock);
  const open = chart[0]?.price ?? stock.price;
  const mcap = formatCompactTraded(stock.marketCap);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <dl className="grid gap-0 divide-y divide-[#f0f0f0] rounded-xl border border-[#ebebeb] bg-white px-4 py-1 sm:divide-y-0 sm:py-4">
        <Stat label="Prev close" value={formatCurrency(pc)} />
        <Stat label="P/E ratio" value={stock.peRatio === null ? "—" : stock.peRatio.toFixed(2)} />
        <Stat
          label="52W range"
          value={`${formatCurrency(stock.week52Low, { maximumFractionDigits: 2 })} – ${formatCurrency(stock.week52High, { maximumFractionDigits: 2 })}`}
        />
      </dl>
      <dl className="grid gap-0 divide-y divide-[#f0f0f0] rounded-xl border border-[#ebebeb] bg-white px-4 py-1 sm:divide-y-0 sm:py-4">
        <Stat label="Market cap" value={`$${mcap}`} />
        <Stat
          label="Day range"
          value={`${formatCurrency(dayLow, { maximumFractionDigits: 2 })} – ${formatCurrency(dayHigh, { maximumFractionDigits: 2 })}`}
        />
        <Stat label="EPS (ttm)" value={eps === null ? "—" : eps.toFixed(2)} />
      </dl>
      <dl className="grid gap-0 divide-y divide-[#f0f0f0] rounded-xl border border-[#ebebeb] bg-white px-4 py-1 sm:divide-y-0 sm:py-4">
        <Stat label="Open" value={formatCurrency(open)} />
        <Stat label="Dividend yield" value={stock.dividendYield === null ? "—" : `${stock.dividendYield.toFixed(2)}%`} />
        <Stat label="Volume" value={formatCompactNumber(stock.volume)} />
      </dl>
    </div>
  );
}
