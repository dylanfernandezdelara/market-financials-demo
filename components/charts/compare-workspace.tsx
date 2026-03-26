"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BenchmarkSeries, PricePoint, SearchResult } from "@/types/finance";
import { formatPercent } from "@/lib/utils";

const STOCK_COLORS = ["#0f766e", "#2563eb", "#dc2626", "#9333ea", "#ea580c"] as const;
const BENCHMARK_COLORS: Record<string, string> = {
  SPX: "#6366f1",
  NDX: "#f59e0b",
  DJI: "#ec4899",
};

type CompareStock = {
  symbol: string;
  name: string;
  chart: PricePoint[];
  changePercent: number;
};

type CompareWorkspaceProps = {
  stocks: CompareStock[];
  benchmarks: BenchmarkSeries[];
  allSymbols: SearchResult[];
};

function normalizeToPercent(chart: PricePoint[]): number[] {
  const base = chart[0]?.price ?? 1;
  return chart.map((p) => ((p.price - base) / base) * 100);
}

function toNumericValue(
  value: number | string | ReadonlyArray<number | string> | undefined,
) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (Array.isArray(value)) return Number(value[0] ?? 0);
  return 0;
}

export function CompareWorkspace({
  stocks,
  benchmarks,
}: CompareWorkspaceProps) {
  const [activeStocks] = useState<CompareStock[]>(stocks);
  const [activeBenchmarks, setActiveBenchmarks] = useState<string[]>(["SPX"]);

  const visibleBenchmarks = useMemo(
    () => benchmarks.filter((bm) => activeBenchmarks.includes(bm.symbol)),
    [benchmarks, activeBenchmarks],
  );

  function toggleBenchmark(symbol: string) {
    setActiveBenchmarks((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol],
    );
  }

  const chartData = useMemo(() => {
    if (activeStocks.length === 0) return [];

    const labels = activeStocks[0].chart.map((p) => p.label);
    const stockSeries = activeStocks.map((s) => normalizeToPercent(s.chart));

    return labels.map((label, i) => {
      const record: Record<string, number | string> = { label };

      activeStocks.forEach((s, si) => {
        record[s.symbol] = Number((stockSeries[si][i] ?? 0).toFixed(4));
      });

      for (const bm of visibleBenchmarks) {
        record[bm.symbol] = bm.series[i]?.pctChange ?? 0;
      }

      return record;
    });
  }, [activeStocks, visibleBenchmarks]);

  return (
    <div className="space-y-4">
      {/* Benchmark toggles */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-medium text-neutral-500">Benchmarks:</span>
        {benchmarks.map((bm) => {
          const on = activeBenchmarks.includes(bm.symbol);
          return (
            <button
              key={bm.symbol}
              type="button"
              onClick={() => toggleBenchmark(bm.symbol)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors ${
                on
                  ? "border-neutral-300 bg-neutral-100 text-neutral-900"
                  : "border-transparent text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: BENCHMARK_COLORS[bm.symbol] ?? "#94a3b8" }}
              />
              {bm.name}
            </button>
          );
        })}
      </div>

      {/* Normalized % change chart */}
      <div className="rounded-xl border border-[#ebebeb] bg-white p-4">
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={chartData} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 8" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`}
              width={52}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #ebebeb",
                backgroundColor: "#ffffff",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
              }}
              formatter={(value, name) => {
                const v = toNumericValue(value);
                const bm = benchmarks.find((b) => b.symbol === name);
                const displayName = bm?.name ?? String(name);
                return [formatPercent(v), displayName];
              }}
            />
            <Legend
              verticalAlign="top"
              height={32}
              iconType="line"
              wrapperStyle={{ fontSize: 12 }}
            />
            {activeStocks.map((s, idx) => (
              <Line
                key={s.symbol}
                dataKey={s.symbol}
                name={s.symbol}
                stroke={STOCK_COLORS[idx % STOCK_COLORS.length]}
                strokeWidth={2}
                dot={false}
                type="monotone"
              />
            ))}
            {visibleBenchmarks.map((bm) => (
              <Line
                key={bm.symbol}
                dataKey={bm.symbol}
                name={bm.name}
                stroke={BENCHMARK_COLORS[bm.symbol] ?? "#94a3b8"}
                strokeWidth={1.5}
                strokeDasharray="6 3"
                dot={false}
                type="monotone"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stock summary cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {activeStocks.map((s, idx) => (
          <div
            key={s.symbol}
            className="rounded-xl border border-[#ebebeb] bg-white px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block size-2.5 rounded-full"
                style={{ backgroundColor: STOCK_COLORS[idx % STOCK_COLORS.length] }}
              />
              <span className="text-[14px] font-semibold text-[#1a1a1a]">{s.symbol}</span>
            </div>
            <p className="mt-0.5 text-[12px] text-neutral-500">{s.name}</p>
            <p
              className={`mt-1 text-[13px] font-medium ${
                s.changePercent >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {formatPercent(s.changePercent)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
