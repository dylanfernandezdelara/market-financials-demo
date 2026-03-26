"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCompactCurrency } from "@/lib/utils";

type AllocationDonutChartProps = {
  data: {
    label: string;
    value: number;
  }[];
  activeLabel?: string | null;
  onHoverLabel?: (label: string | null) => void;
};

const palette = ["#0f172a", "#0f766e", "#eab308", "#dc2626", "#2563eb", "#9333ea"];

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

export { palette as allocationPalette };

export function AllocationDonutChart({ data, activeLabel, onHoverLabel }: AllocationDonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart
        onMouseLeave={() => onHoverLabel?.(null)}
      >
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={54}
          outerRadius={82}
          paddingAngle={3}
          onMouseEnter={(_, index) => onHoverLabel?.(data[index]?.label ?? null)}
          onMouseLeave={() => onHoverLabel?.(null)}
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.label}
              fill={palette[index % palette.length]}
              opacity={activeLabel != null && activeLabel !== entry.label ? 0.3 : 1}
              style={{ transition: "opacity 150ms" }}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [
            formatCompactCurrency(toNumericValue(value)),
            "Exposure",
          ]}
          contentStyle={{
            borderRadius: 18,
            border: "1px solid #dbe4ee",
            backgroundColor: "#ffffff",
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
