import type { PricePoint, StockProfile } from "@/types/finance";

export function prevClose(stock: StockProfile): number {
  return stock.price - stock.change;
}

export function dayRangeFromChart(chart: PricePoint[]): { low: number; high: number } {
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

/** Session-style after-hours quote for display (derived, not live). */
export function sessionExtension(stock: StockProfile): {
  afterHoursPrice: number;
  afterHoursChange: number;
  afterHoursChangePercent: number;
} {
  const drift = stock.price * (stock.changePercent >= 0 ? 0.008 : -0.006);
  const afterHoursPrice = Math.round((stock.price + drift) * 100) / 100;
  const afterHoursChange = afterHoursPrice - stock.price;
  const afterHoursChangePercent =
    stock.price === 0 ? 0 : (afterHoursChange / stock.price) * 100;

  return {
    afterHoursPrice,
    afterHoursChange,
    afterHoursChangePercent,
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
