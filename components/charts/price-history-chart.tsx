"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PricePoint } from "@/types/finance";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";

type PriceHistoryChartProps = {
  data: PricePoint[];
  color?: string;
  height?: number;
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
}: PriceHistoryChartProps) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
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
            (dataMin: number) => Math.floor(dataMin * 0.985),
            (dataMax: number) => Math.ceil(dataMax * 1.015),
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

            return name === "price"
              ? [formatCurrency(numericValue), "Price"]
              : [formatCompactNumber(numericValue), "Volume"];
          }}
        />
        <Area
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          type="monotone"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
