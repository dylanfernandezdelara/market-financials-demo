import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import {
  badgeToneClasses,
  badgeToneClassesDark,
  formatPercent,
  getTrendDirection,
} from "@/lib/utils";

type ChangePillProps = {
  value: number;
  compact?: boolean;
  variant?: "light" | "dark";
};

export function ChangePill({
  value,
  compact = false,
  variant = "light",
}: ChangePillProps) {
  const direction = getTrendDirection(value);
  const tone =
    variant === "dark" ? badgeToneClassesDark(value) : badgeToneClasses(value);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold tracking-[0.08em] ${tone} ${compact ? "" : "sm:px-3.5"}`}
    >
      {direction === "up" ? (
        <ArrowUpRight className="size-3.5" />
      ) : direction === "down" ? (
        <ArrowDownRight className="size-3.5" />
      ) : (
        <Minus className="size-3.5" />
      )}
      {formatPercent(value)}
    </span>
  );
}
