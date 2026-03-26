import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { FuturesMiniSparkline } from "@/components/finance/futures-mini-sparkline";
import {
  changeTextClass,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatSignedCurrency,
} from "@/lib/utils";
import type { FuturesAsset } from "@/types/finance";

type TopFuturesProps = {
  futures: FuturesAsset[];
  sentimentLabel: string;
};

export function TopFutures({ futures, sentimentLabel }: TopFuturesProps) {
  return (
    <section aria-labelledby="top-assets-heading">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 id="top-assets-heading" className="text-[17px] font-semibold text-[#1a1a1a]">
          Top Assets
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-red-600">{sentimentLabel}</span>
            <span className="flex h-4 items-end gap-0.5" aria-hidden>
              <span className="w-0.5 rounded-sm bg-red-200" style={{ height: "40%" }} />
              <span className="w-0.5 rounded-sm bg-red-400" style={{ height: "70%" }} />
              <span className="w-0.5 rounded-sm bg-red-600" style={{ height: "100%" }} />
            </span>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-[#e5e5e5] bg-white px-2.5 py-1 text-[12px] font-medium text-neutral-700 shadow-sm"
          >
            US
            <ChevronDown className="size-3.5 text-neutral-400" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {futures.map((item) => {
          const positive = item.changePercent >= 0;
          return (
            <Link
              key={item.symbol}
              href={`/stocks/${item.symbol}`}
              className="flex flex-col rounded-lg border border-[#ebebeb] bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-semibold text-[#1a1a1a]">{item.label}</p>
                <div className="text-right">
                  <p className={`text-[13px] font-semibold tabular-nums ${changeTextClass(item.changePercent)}`}>
                    {formatPercent(item.changePercent)}
                  </p>
                  <p className="text-[11px] font-medium tabular-nums text-neutral-500">
                    {item.symbol === "VIX"
                      ? `${item.change >= 0 ? "+" : ""}${formatNumber(item.change)}`
                      : formatSignedCurrency(item.change)}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-lg font-semibold tabular-nums text-[#1a1a1a]">
                {item.symbol === "VIX"
                  ? formatNumber(item.price)
                  : formatCurrency(item.price)}
              </p>
              <div className="mt-3 -mx-1">
                <FuturesMiniSparkline
                  gradientId={item.symbol}
                  values={item.sparkline}
                  positive={positive}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
