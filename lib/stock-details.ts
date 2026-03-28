import type { PricePoint, StockProfile } from "@/types/finance";

export function prevClose(stock: StockProfile): number {
  return stock.price - stock.change;
}

export function dayRangeFromChart(chart: PricePoint[]): { low: number; high: number } {
  if (chart.length === 0) {
    return { low: 0, high: 0 };
  }
  const prices = chart.map((point) => point.price);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  return { low, high };
}

export function epsFromPe(stock: StockProfile): number | null {
  if (stock.peRatio <= 0) {
    return null;
  }
  return stock.price / stock.peRatio;
}

/** After-hours quote sourced from the stock profile's mock data layer. */
export function sessionExtension(stock: StockProfile): {
  afterHoursPrice: number;
  afterHoursChange: number;
  afterHoursChangePercent: number;
} {
  return {
    afterHoursPrice: stock.afterHoursPrice,
    afterHoursChange: stock.afterHoursChange,
    afterHoursChangePercent: stock.afterHoursChangePercent,
  };
}

export function formatCompactTraded(value: number): string {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  return value.toFixed(0);
}
