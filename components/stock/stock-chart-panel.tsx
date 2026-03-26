"use client";

import { useMemo, useState } from "react";
import { PriceHistoryChart } from "@/components/charts/price-history-chart";
import type { BenchmarkSeries, PricePoint } from "@/types/finance";

const ranges = ["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "MAX"] as const;

type StockChartPanelProps = {
  chart: PricePoint[];
  trendUp: boolean;
  benchmarks?: BenchmarkSeries[];
};

const OVERLAY_COLORS: Record<string, string> = {
  SPX: "#6366f1",
  NDX: "#f59e0b",
  DJI: "#ec4899",
};

export function StockChartPanel({ chart, trendUp, benchmarks = [] }: StockChartPanelProps) {
  const [range, setRange] = useState<(typeof ranges)[number]>("1D");
  const [activeOverlays, setActiveOverlays] = useState<string[]>([]);
  const stroke = trendUp ? "#16a34a" : "#dc2626";

  const series = useMemo(() => {
    // Same intraday series for all ranges in this demo; real data would slice/resample.
    return chart;
  }, [chart]);

  const visibleBenchmarks = useMemo(
    () => benchmarks.filter((bm) => activeOverlays.includes(bm.symbol)),
    [benchmarks, activeOverlays],
  );

  function toggleOverlay(symbol: string) {
    setActiveOverlays((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol],
    );
  }

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
        {benchmarks.length > 0 && (
          <span className="ml-auto flex items-center gap-1.5">
            {benchmarks.map((bm) => {
              const on = activeOverlays.includes(bm.symbol);
              return (
                <button
                  key={bm.symbol}
                  type="button"
                  onClick={() => toggleOverlay(bm.symbol)}
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    on
                      ? "border-neutral-300 bg-neutral-100 text-neutral-900"
                      : "border-transparent text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  <span
                    className="inline-block size-2 rounded-full"
                    style={{ backgroundColor: OVERLAY_COLORS[bm.symbol] ?? "#94a3b8" }}
                  />
                  {bm.symbol}
                </button>
              );
            })}
          </span>
        )}
        {benchmarks.length === 0 && (
          <span className="ml-auto hidden text-[11px] text-neutral-400 sm:inline">{range}</span>
        )}
      </div>
      <div className="p-2">
        <PriceHistoryChart data={series} color={stroke} height={280} benchmarks={visibleBenchmarks} />
      </div>
      <p className="px-3 pb-2 text-center text-[11px] text-neutral-400">
        {range} · last session
      </p>
    </div>
  );
}
