"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PortfolioTrendPoint } from "@/types/finance";
import { formatCompactCurrency } from "@/lib/utils";

type PortfolioTrendChartProps = {
  data: PortfolioTrendPoint[];
  showBenchmark?: boolean;
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

export function PortfolioTrendChart({ data, showBenchmark = false }: PortfolioTrendChartProps) {
  const hasBenchmark = showBenchmark && data.some((point) => point.benchmark != null);
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 6, right: 6, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="portfolio-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#0f172a" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#dbe4ee" vertical={false} strokeDasharray="4 8" />
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
          tickFormatter={(value: number) => formatCompactCurrency(value)}
          width={64}
          domain={[
            (dataMin: number) => Math.floor(dataMin * 0.98),
            (dataMax: number) => Math.ceil(dataMax * 1.02),
          ]}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 18,
            border: "1px solid #dbe4ee",
            backgroundColor: "#ffffff",
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
          }}
          formatter={(value, name) => [
            formatCompactCurrency(toNumericValue(value)),
            name === "benchmark" ? "S&P 500" : "Portfolio",
          ]}
        />
        {hasBenchmark && (
          <Legend
            verticalAlign="top"
            height={28}
            formatter={(value: string) => (value === "benchmark" ? "S&P 500" : "Portfolio")}
          />
        )}
        <Area
          dataKey="value"
          stroke="#0f172a"
          strokeWidth={3}
          fill="url(#portfolio-fill)"
          type="monotone"
          name="value"
        />
        {hasBenchmark && (
          <Line
            dataKey="benchmark"
            stroke="#6366f1"
            strokeWidth={1.5}
            strokeDasharray="6 3"
            dot={false}
            type="monotone"
            name="benchmark"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
