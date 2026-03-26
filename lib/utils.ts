import { TrendDirection } from "@/types/finance";

export function formatCurrency(
  value: number,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1_000_000 ? 0 : 2,
    ...options,
  }).format(value);
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

export function formatPercent(value: number, fractionDigits = 2) {
  const abs = Math.abs(value);

  return `${value >= 0 ? "+" : "-"}${abs.toFixed(fractionDigits)}%`;
}

export function formatSignedCurrency(value: number) {
  return `${value >= 0 ? "+" : "-"}${formatCurrency(Math.abs(value))}`;
}

export function getTrendDirection(value: number): TrendDirection {
  if (value > 0) {
    return "up";
  }

  if (value < 0) {
    return "down";
  }

  return "flat";
}

export function changeToneClasses(value: number) {
  const direction = getTrendDirection(value);

  if (direction === "up") {
    return "text-emerald-600";
  }

  if (direction === "down") {
    return "text-rose-600";
  }

  return "text-slate-500";
}

export function badgeToneClasses(value: number) {
  const direction = getTrendDirection(value);

  if (direction === "up") {
    return "border-emerald-300 bg-emerald-50 text-emerald-700";
  }

  if (direction === "down") {
    return "border-rose-300 bg-rose-50 text-rose-700";
  }

  return "border-slate-300 bg-slate-100 text-slate-600";
}

export function badgeToneClassesDark(value: number) {
  const direction = getTrendDirection(value);

  if (direction === "up") {
    return "border-emerald-500/35 bg-emerald-500/10 text-emerald-400";
  }

  if (direction === "down") {
    return "border-rose-500/35 bg-rose-500/10 text-rose-400";
  }

  return "border-zinc-600 bg-zinc-800/80 text-zinc-400";
}

export function changeTextClass(value: number) {
  const direction = getTrendDirection(value);

  if (direction === "up") {
    return "text-emerald-600";
  }

  if (direction === "down") {
    return "text-red-600";
  }

  return "text-neutral-500";
}
