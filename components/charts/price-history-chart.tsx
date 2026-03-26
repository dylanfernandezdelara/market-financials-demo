"use client";

import { useId, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BenchmarkSeries, PricePoint } from "@/types/finance";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";

const BENCHMARK_COLORS = ["#6366f1", "#f59e0b", "#ec4899"] as const;

type PriceHistoryChartProps = {
  data: PricePoint[];
  color?: string;
  height?: number;
  benchmarks?: BenchmarkSeries[];
};

function toNumericValue(
  value: number | string | ReadonlyArray<number | string> | undefined,
) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  if (Array.isArray(value)) {
    return Number(value[0] ?? 0);
  }

  return 0;
}

export function PriceHistoryChart({
  data,
  color = "#0f766e",
  height = 320,
  benchmarks = [],
}: PriceHistoryChartProps) {
  const gradientId = useId().replace(/:/g, "");

  const merged = useMemo(() => {
    if (benchmarks.length === 0) return data;

    const basePrice = data[0]?.price ?? 1;

    return data.map((point, i) => {
      const record: Record<string, number | string> = {
        label: point.label,
        price: point.price,
        volume: point.volume,
      };

      for (const bm of benchmarks) {
        const pct = bm.series[i]?.pctChange ?? 0;
        record[bm.symbol] = basePrice * (1 + pct / 100);
      }

      return record;
    });
  }, [data, benchmarks]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={merged} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.32} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
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
          tickFormatter={(value: number) => `$${value}`}
          width={56}
          domain={[
            (dataMin: number) => Math.floor(dataMin * 0.995),
            (dataMax: number) => Math.ceil(dataMax * 1.005),
          ]}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #ebebeb",
            backgroundColor: "#ffffff",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
          }}
          formatter={(value, name) => {
            const numericValue = toNumericValue(value);

            if (name === "price") {
              return [formatCurrency(numericValue), "Price"];
            }

            const bm = benchmarks.find((b) => b.symbol === name);
            if (bm) {
              return [formatCurrency(numericValue), bm.name];
            }

            return [formatCompactNumber(numericValue), "Volume"];
          }}
        />
        <Area
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          type="monotone"
        />
        {benchmarks.map((bm, idx) => (
          <Line
            key={bm.symbol}
            dataKey={bm.symbol}
            stroke={BENCHMARK_COLORS[idx % BENCHMARK_COLORS.length]}
            strokeWidth={1.5}
            strokeDasharray="6 3"
            dot={false}
            type="monotone"
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
