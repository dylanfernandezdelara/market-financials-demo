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

  /* FDL-622 / FDL-629: normalise zero / negative / missing fundamentals */
  const peValue = stock.peRatio === 0 ? "—" : stock.peRatio.toFixed(2);
  const epsValue = eps === null ? "—" : `$${eps.toFixed(2)}`;
  const mcapValue =
    stock.marketCap === 0 ? "—" : `$${formatCompactTraded(stock.marketCap)}`;
  const volumeValue =
    stock.volume === 0 ? "—" : formatCompactNumber(stock.volume);
  const divYieldValue =
    stock.dividendYield === 0 ? "—" : `${stock.dividendYield.toFixed(2)}%`;
  const dayRangeValue =
    dayLow === 0 && dayHigh === 0
      ? "—"
      : `${formatCurrency(dayLow, { maximumFractionDigits: 2 })} – ${formatCurrency(dayHigh, { maximumFractionDigits: 2 })}`;
  const week52Value =
    stock.week52Low === 0 && stock.week52High === 0
      ? "—"
      : `${formatCurrency(stock.week52Low, { maximumFractionDigits: 2 })} – ${formatCurrency(stock.week52High, { maximumFractionDigits: 2 })}`;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <dl className="grid gap-0 divide-y divide-[#f0f0f0] rounded-xl border border-[#ebebeb] bg-white px-4 py-1 sm:divide-y-0 sm:py-4">
        <Stat label="Prev close" value={formatCurrency(pc)} />
        <Stat label="P/E ratio" value={peValue} />
        <Stat label="52W range" value={week52Value} />
      </dl>
      <dl className="grid gap-0 divide-y divide-[#f0f0f0] rounded-xl border border-[#ebebeb] bg-white px-4 py-1 sm:divide-y-0 sm:py-4">
        <Stat label="Market cap" value={mcapValue} />
        <Stat label="Day range" value={dayRangeValue} />
        <Stat label="EPS (ttm)" value={epsValue} />
      </dl>
      <dl className="grid gap-0 divide-y divide-[#f0f0f0] rounded-xl border border-[#ebebeb] bg-white px-4 py-1 sm:divide-y-0 sm:py-4">
        <Stat label="Open" value={formatCurrency(open)} />
        <Stat label="Dividend yield" value={divYieldValue} />
        <Stat label="Volume" value={volumeValue} />
        <Stat label="Analyst rating" value="—" />
      </dl>
    </div>
  );
}
