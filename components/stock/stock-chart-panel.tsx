"use client";

import { useMemo } from "react";
import { PriceHistoryChart } from "@/components/charts/price-history-chart";
import { useQueryState } from "@/lib/use-query-state";
import type { PricePoint } from "@/types/finance";

const ranges = ["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "MAX"] as const;

type StockChartPanelProps = {
  chart: PricePoint[];
  trendUp: boolean;
};

export function StockChartPanel({ chart, trendUp }: StockChartPanelProps) {
  const [range, setRange] = useQueryState<(typeof ranges)[number]>("range", "1D", ranges);
  const stroke = trendUp ? "#16a34a" : "#dc2626";

  const series = useMemo(() => {
    // Same intraday series for all ranges in this demo; real data would slice/resample.
    return chart;
  }, [chart]);

  return (
    <div className="rounded-xl border border-[#ebebeb] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#f0f0f0] px-3 py-2">
        {ranges.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setRange(label)}
            className={`rounded-md px-2.5 py-1 text-[12px] font-medium ${
              range === label
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto hidden text-[11px] text-neutral-400 sm:inline">{range}</span>
      </div>
      <div className="p-2">
        <PriceHistoryChart data={series} color={stroke} height={280} />
      </div>
      <p className="px-3 pb-2 text-center text-[11px] text-neutral-400">
        {range} · last session
      </p>
    </div>
  );
}
