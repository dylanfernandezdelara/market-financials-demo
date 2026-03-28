"use client";

import type { StockProfile } from "@/types/finance";

/* FDL-615 / SD07 – Typed tab-labels constant */
export const STOCK_DETAIL_TABS = [
  "Overview",
  "Financials",
  "Holders",
  "Predictions",
  "Historical Data",
  "Analysis",
] as const;

export type StockDetailTab = (typeof STOCK_DETAIL_TABS)[number];

/* FDL-679 / SD16 – Compute a simple consensus from stock data */
function computeConsensus(stock?: StockProfile) {
  if (!stock) return { bullish: 34, hold: 33, bearish: 33, label: "N/A", badgeClass: "bg-neutral-100 text-neutral-600" };
  const score = stock.changePercent + (stock.peRatio > 0 ? 10 : -5) + (stock.dividendYield > 0 ? 5 : 0);
  if (score > 10) return { bullish: 65, hold: 25, bearish: 10, label: "Buy lean", badgeClass: "bg-emerald-50 text-emerald-800" };
  if (score > 0) return { bullish: 45, hold: 35, bearish: 20, label: "Hold", badgeClass: "bg-amber-50 text-amber-800" };
  return { bullish: 20, hold: 30, bearish: 50, label: "Sell lean", badgeClass: "bg-red-50 text-red-800" };
}

/* FDL-607 / SD11 – Check if a metric is applicable */
function metricClass(applicable: boolean): string {
  return applicable ? "" : "opacity-40";
}

type StockOverviewTabsProps = {
  stock?: StockProfile;
  peApplicable?: boolean;
  dividendApplicable?: boolean;
};

export function StockOverviewTabs({ stock, peApplicable = true, dividendApplicable = true }: StockOverviewTabsProps) {
  const consensus = computeConsensus(stock);

  return (
    <div>
      {/* FDL-614 / SD05 – ARIA tab attributes */}
      <div className="border-b border-border-card">
        <nav className="flex flex-wrap gap-1" role="tablist" aria-label="Stock sections">
          {STOCK_DETAIL_TABS.map((label) => {
            const active = label === "Overview";
            return (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                className={`relative px-3 pb-2.5 pt-1 text-[13px] font-medium transition-colors ${
                  active ? "text-heading" : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {label}
                {active ? (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-heading" />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* FDL-679 / SD16 – Computed consensus (replaces fictional ratings) */}
      {stock ? (
        <div className="mt-6 rounded-xl border border-border-card bg-white p-4">
          <h3 className="text-[15px] font-semibold text-heading">Analyst consensus</h3>
          <p className="mt-1 text-[12px] text-neutral-500">Computed from available metrics</p>
          <div className="mt-4 flex items-center gap-2">
            <span className={`rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${consensus.badgeClass}`}>
              {consensus.label}
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex h-2 overflow-hidden rounded-full bg-neutral-100">
              <span className="bg-red-400" style={{ width: `${consensus.bearish}%` }} title="Bearish" />
              <span className="bg-amber-400" style={{ width: `${consensus.hold}%` }} title="Hold" />
              <span className="bg-emerald-500" style={{ width: `${consensus.bullish}%` }} title="Bullish" />
            </div>
            <div className="flex justify-between text-[11px] text-neutral-500">
              <span>Bearish {consensus.bearish}%</span>
              <span>Hold {consensus.hold}%</span>
              <span>Bullish {consensus.bullish}%</span>
            </div>
          </div>

          {/* FDL-607 / SD11 – Grey-out N/A metrics */}
          <div className="mt-4 space-y-1 text-[12px] text-neutral-600">
            <p className={metricClass(peApplicable)}>P/E ratio: {stock.peRatio > 0 ? stock.peRatio.toFixed(2) : "N/A"}</p>
            <p className={metricClass(dividendApplicable)}>Dividend yield: {stock.dividendYield > 0 ? `${stock.dividendYield.toFixed(2)}%` : "N/A"}</p>
          </div>

          {/* FDL-600 / SD10 – Disclaimer footer */}
          <p className="mt-4 border-t border-border-rule pt-3 text-[11px] leading-relaxed text-neutral-400">
            Analyst ratings are for informational purposes only and do not constitute investment
            advice. Data is derived from available metrics and may not reflect real-time coverage.
          </p>
        </div>
      ) : null}
    </div>
  );
}
