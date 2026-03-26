"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PriceHistoryChart } from "@/components/charts/price-history-chart";
import type { PricePoint } from "@/types/finance";

const ranges = ["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "MAX"] as const;

type Range = (typeof ranges)[number];

const rangeLabels: Record<Range, string> = {
  "1D": "Intraday",
  "5D": "Past 5 days",
  "1M": "Past month",
  "6M": "Past 6 months",
  YTD: "Year to date",
  "1Y": "Past year",
  "5Y": "Past 5 years",
  MAX: "All time",
};

function rangePointLabel(range: Range, index: number, count: number): string {
  const t = index / Math.max(count - 1, 1);

  switch (range) {
    case "1D": {
      const totalMinutes = Math.round(t * 390);
      const hour = 9 + Math.floor((30 + totalMinutes) / 60);
      const min = (30 + totalMinutes) % 60;
      return `${hour}:${String(min).padStart(2, "0")}`;
    }
    case "5D": {
      const d = new Date();
      d.setDate(d.getDate() - Math.round((1 - t) * 4));
      return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    }
    case "1M": {
      const d = new Date();
      d.setDate(d.getDate() - Math.round((1 - t) * 29));
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    case "6M": {
      const d = new Date();
      d.setMonth(d.getMonth() - Math.round((1 - t) * 5));
      return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    }
    case "YTD": {
      const now = new Date();
      const jan1 = new Date(now.getFullYear(), 0, 1);
      const daysSoFar = Math.floor((now.getTime() - jan1.getTime()) / 86_400_000);
      const d = new Date(jan1);
      d.setDate(d.getDate() + Math.round(t * daysSoFar));
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    case "1Y": {
      const d = new Date();
      d.setMonth(d.getMonth() - Math.round((1 - t) * 11));
      return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    }
    case "5Y": {
      const d = new Date();
      d.setMonth(d.getMonth() - Math.round((1 - t) * 59));
      return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    }
    case "MAX": {
      const d = new Date();
      d.setFullYear(d.getFullYear() - Math.round((1 - t) * 9));
      return d.toLocaleDateString("en-US", { year: "numeric" });
    }
  }
}

/** Deterministic seeds per range to produce visually distinct series. */
const rangeSeeds: Record<Range, { scale: number; drift: number; volatility: number }> = {
  "1D": { scale: 1, drift: 0, volatility: 0.002 },
  "5D": { scale: 1.02, drift: -0.005, volatility: 0.006 },
  "1M": { scale: 1.05, drift: -0.02, volatility: 0.012 },
  "6M": { scale: 1.12, drift: -0.06, volatility: 0.025 },
  YTD: { scale: 1.08, drift: -0.04, volatility: 0.018 },
  "1Y": { scale: 1.18, drift: -0.1, volatility: 0.035 },
  "5Y": { scale: 1.45, drift: -0.25, volatility: 0.06 },
  MAX: { scale: 1.65, drift: -0.35, volatility: 0.08 },
};

function buildSeries(chart: PricePoint[], range: Range): PricePoint[] {
  if (chart.length === 0) return [];

  if (range === "1D") return chart;

  const { scale, drift, volatility } = rangeSeeds[range];
  const basePrice = chart[0].price;
  const finalPrice = chart[chart.length - 1].price;
  const count = chart.length;

  return chart.map((point, index) => {
    const t = index / Math.max(count - 1, 1);
    const seed = ((index * 7 + 13) % 17) / 17 - 0.5;
    const price =
      basePrice * scale +
      (finalPrice - basePrice * scale) * t +
      drift * basePrice * (1 - t) +
      volatility * basePrice * seed;
    return {
      label: rangePointLabel(range, index, count),
      price: Math.round(price * 100) / 100,
      volume: point.volume + index * 50_000 * (ranges.indexOf(range) + 1),
    };
  });
}

function isValidRange(value: string | null): value is Range {
  return value !== null && (ranges as readonly string[]).includes(value);
}

type StockChartPanelProps = {
  chart: PricePoint[];
  trendUp: boolean;
};

export function StockChartPanel({ chart, trendUp }: StockChartPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramRange = searchParams?.get("range") ?? null;
  const range: Range = isValidRange(paramRange) ? paramRange : "1D";

  const setRange = useCallback(
    (newRange: Range) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.set("range", newRange);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const stroke = trendUp ? "#16a34a" : "#dc2626";

  const series = useMemo(() => buildSeries(chart, range), [chart, range]);

  const tooltipLabelFormatter = useCallback(
    (label: React.ReactNode) => `${String(label)} · ${rangeLabels[range]}`,
    [range],
  );

  if (!chart.length) {
    return (
      <div className="rounded-xl border border-[#ebebeb] bg-white">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#f0f0f0] px-3 py-2">
          {ranges.map((label) => (
            <button
              key={label}
              type="button"
              disabled
              className="rounded-md px-2.5 py-1 text-[12px] font-medium text-neutral-300"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center p-10">
          <p className="text-[13px] text-neutral-400">No chart data available</p>
        </div>
      </div>
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
            className={`rounded-md px-2.5 py-1 text-[12px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-1 ${
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
        <PriceHistoryChart data={series} color={stroke} height={280} tooltipLabelFormatter={tooltipLabelFormatter} />
      </div>
      <p className="px-3 pb-2 text-center text-[11px] text-neutral-400">
        {range} &middot; {rangeLabels[range]}
      </p>
    </div>
  );
}
