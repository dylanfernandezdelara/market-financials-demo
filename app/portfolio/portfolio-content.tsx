"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TrendingUp, Wallet, Clock, BarChart3, ArrowUpDown, Briefcase } from "lucide-react";
import { AllocationDonutChart, allocationPalette } from "@/components/charts/allocation-donut-chart";
import { PortfolioTrendChart } from "@/components/charts/portfolio-trend-chart";
import { ChangePill } from "@/components/ui/change-pill";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { ImportCsvPanel } from "@/components/features/import-csv";
import type { PortfolioSnapshot, PortfolioHolding } from "@/types/finance";
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  formatSignedCurrency,
} from "@/lib/utils";

type SortKey =
  | "symbol"
  | "shares"
  | "averageCost"
  | "currentPrice"
  | "marketValue"
  | "gainLoss"
  | "allocationPercent";

type SortDir = "asc" | "desc";

type PortfolioContentProps = {
  portfolio: PortfolioSnapshot;
  asOfTimestamp: string;
};

function sortHoldings(
  holdings: PortfolioHolding[],
  key: SortKey,
  dir: SortDir,
): PortfolioHolding[] {
  return [...holdings].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (typeof av === "string" && typeof bv === "string") {
      return dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return dir === "asc" ? Number(av) - Number(bv) : Number(bv) - Number(av);
  });
}

function SortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 font-medium"
    >
      {label}
      <ArrowUpDown
        className={`size-3 ${active ? "text-neutral-900" : "text-neutral-400"}`}
      />
      {active && (
        <span className="text-[10px] text-neutral-400">
          {dir === "asc" ? "\u2191" : "\u2193"}
        </span>
      )}
    </button>
  );
}

export function PortfolioContent({ portfolio, asOfTimestamp }: PortfolioContentProps) {
  const [sortKey, setSortKey] = useState<SortKey>("marketValue");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [activeSectorFilter, setActiveSectorFilter] = useState<string | null>(null);

  const unrealizedGainLoss = portfolio.totalValue - portfolio.totalCost - portfolio.cashBalance;
  const unrealizedPercent =
    portfolio.totalCost === 0 ? 0 : (unrealizedGainLoss / portfolio.totalCost) * 100;

  const allocationData = portfolio.sectorExposure.map((entry) => ({
    label: entry.sector,
    value: entry.value,
  }));

  const filteredHoldings = useMemo(() => {
    const base = activeSectorFilter
      ? portfolio.holdings.filter((h) => h.sector === activeSectorFilter)
      : portfolio.holdings;
    return sortHoldings(base, sortKey, sortDir);
  }, [portfolio.holdings, activeSectorFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const hasHoldings = portfolio.holdings.length > 0;
  const hasSectors = portfolio.sectorExposure.length > 0;

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Hero: Account summary */}
      <SurfaceCard className="overflow-hidden">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-500">
              Portfolio overview
            </p>
            <div className="space-y-2">
              <h2 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                Account summary and holdings
              </h2>
              <p className="max-w-2xl text-base leading-7 text-neutral-600">
                Track positions, sector exposure, and recent performance in one place.
              </p>
            </div>
            {/* FDL-647: as-of timestamp */}
            <p className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Clock className="size-3" />
              As of {asOfTimestamp}
            </p>
          </div>
          {/* FDL-646: separate intraday from unrealized */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Wallet className="size-4 text-emerald-600" />
                Account value
              </div>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
                {formatCurrency(portfolio.totalValue)}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <TrendingUp className="size-4 text-emerald-600" />
                Intraday P&amp;L
              </div>
              <p
                className={`mt-3 text-3xl font-semibold tracking-tight ${
                  portfolio.dayChange < 0 ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {formatSignedCurrency(portfolio.dayChange)}
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                {formatPercent(portfolio.dayChangePercent)}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:col-span-2 xl:col-span-1">
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <BarChart3 className="size-4 text-emerald-600" />
                Unrealized gain / loss
              </div>
              <p
                className={`mt-3 text-3xl font-semibold tracking-tight ${
                  unrealizedGainLoss < 0 ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {formatSignedCurrency(unrealizedGainLoss)}
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                {formatPercent(unrealizedPercent)}
              </p>
            </div>
          </div>
        </div>
      </SurfaceCard>

      {/* Performance + Sector allocation */}
      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <SurfaceCard>
          <SectionHeader
            eyebrow="Performance"
            title="Portfolio trend"
            description="Trailing balance history across recent months."
          />
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <PortfolioTrendChart data={portfolio.trend} />
          </div>
        </SurfaceCard>
        <SurfaceCard>
          <SectionHeader
            eyebrow="Exposure"
            title="Sector allocation"
            description="Where portfolio risk is concentrated by sector."
          />
          {/* FDL-648: empty state for sector allocation */}
          {hasSectors ? (
            <>
              <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <AllocationDonutChart
                  data={allocationData}
                  activeLabel={hoveredSector}
                  onHoverLabel={setHoveredSector}
                />
              </div>
              {/* FDL-649 & FDL-650: legend rows synced with donut + drill-down */}
              <div className="mt-4 grid gap-2">
                {portfolio.sectorExposure.map((entry, index) => (
                  <button
                    key={entry.sector}
                    type="button"
                    onClick={() =>
                      setActiveSectorFilter((prev) =>
                        prev === entry.sector ? null : entry.sector,
                      )
                    }
                    onMouseEnter={() => setHoveredSector(entry.sector)}
                    onMouseLeave={() => setHoveredSector(null)}
                    className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors text-left ${
                      activeSectorFilter === entry.sector
                        ? "border-neutral-400 bg-neutral-100"
                        : hoveredSector === entry.sector
                          ? "border-neutral-300 bg-neutral-100"
                          : "border-neutral-100 bg-neutral-50"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-medium text-neutral-900">
                      <span
                        className="inline-block size-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            allocationPalette[index % allocationPalette.length],
                        }}
                      />
                      {entry.sector}
                    </span>
                    <span className="text-neutral-500">
                      {formatCompactCurrency(entry.value)}
                    </span>
                  </button>
                ))}
                {activeSectorFilter && (
                  <button
                    type="button"
                    onClick={() => setActiveSectorFilter(null)}
                    className="mt-1 text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-700"
                  >
                    Clear sector filter
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-10 text-center">
              <Briefcase className="size-8 text-neutral-300" />
              <p className="mt-3 text-sm font-medium text-neutral-500">
                No sector data available
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Import holdings to see sector allocation.
              </p>
            </div>
          )}
        </SurfaceCard>
      </section>

      {/* Holdings table */}
      <SurfaceCard>
        <div className="mb-6">
          <ImportCsvPanel />
        </div>
        <SectionHeader
          eyebrow="Holdings"
          title="Current positions"
          description="Positions with cost basis and unrealized performance."
        />

        {/* FDL-634: empty state when no holdings */}
        {hasHoldings ? (
          <>
            {activeSectorFilter && (
              <p className="mt-4 text-xs text-neutral-500">
                Filtered by sector:{" "}
                <span className="font-semibold text-neutral-700">
                  {activeSectorFilter}
                </span>
              </p>
            )}
            {/* FDL-651: horizontal scroll wrapper for mobile */}
            <div className="mt-5 overflow-x-auto rounded-2xl border border-neutral-200">
              <table className="min-w-[700px] w-full divide-y divide-neutral-200 text-sm">
                <thead className="bg-neutral-50">
                  <tr className="text-left text-neutral-500">
                    <th className="px-4 py-3">
                      <SortButton
                        label="Symbol"
                        active={sortKey === "symbol"}
                        dir={sortDir}
                        onClick={() => toggleSort("symbol")}
                      />
                    </th>
                    <th className="hidden px-4 py-3 sm:table-cell">
                      <SortButton
                        label="Shares"
                        active={sortKey === "shares"}
                        dir={sortDir}
                        onClick={() => toggleSort("shares")}
                      />
                    </th>
                    <th className="hidden px-4 py-3 sm:table-cell">
                      <SortButton
                        label="Avg cost"
                        active={sortKey === "averageCost"}
                        dir={sortDir}
                        onClick={() => toggleSort("averageCost")}
                      />
                    </th>
                    <th className="px-4 py-3">
                      <SortButton
                        label="Current"
                        active={sortKey === "currentPrice"}
                        dir={sortDir}
                        onClick={() => toggleSort("currentPrice")}
                      />
                    </th>
                    <th className="px-4 py-3">
                      <SortButton
                        label="Market value"
                        active={sortKey === "marketValue"}
                        dir={sortDir}
                        onClick={() => toggleSort("marketValue")}
                      />
                    </th>
                    <th className="px-4 py-3">
                      <SortButton
                        label="Gain / loss"
                        active={sortKey === "gainLoss"}
                        dir={sortDir}
                        onClick={() => toggleSort("gainLoss")}
                      />
                    </th>
                    <th className="hidden px-4 py-3 md:table-cell">
                      <SortButton
                        label="Allocation"
                        active={sortKey === "allocationPercent"}
                        dir={sortDir}
                        onClick={() => toggleSort("allocationPercent")}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {filteredHoldings.map((holding) => (
                    <tr
                      key={holding.symbol}
                      className="group cursor-pointer transition-colors hover:bg-neutral-50"
                    >
                      {/* FDL-643: navigate to stock detail */}
                      <td className="px-4 py-4">
                        <Link
                          href={`/stocks/${holding.symbol}`}
                          className="block"
                        >
                          <p className="font-mono font-semibold text-neutral-900 group-hover:text-blue-700">
                            {holding.symbol}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {holding.name}
                          </p>
                        </Link>
                      </td>
                      <td className="hidden px-4 py-4 text-neutral-600 sm:table-cell">
                        {holding.shares}
                      </td>
                      <td className="hidden px-4 py-4 text-neutral-600 sm:table-cell">
                        {formatCurrency(holding.averageCost)}
                      </td>
                      <td className="px-4 py-4 text-neutral-600">
                        {formatCurrency(holding.currentPrice)}
                      </td>
                      <td className="px-4 py-4 font-medium text-neutral-900">
                        {formatCurrency(holding.marketValue)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-neutral-900">
                            {formatSignedCurrency(holding.gainLoss)}
                          </span>
                          <ChangePill value={holding.gainLossPercent} compact />
                        </div>
                      </td>
                      <td className="hidden px-4 py-4 text-neutral-600 md:table-cell">
                        {holding.allocationPercent.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-12 text-center">
            <Briefcase className="size-10 text-neutral-300" />
            <p className="mt-4 text-base font-medium text-neutral-600">
              No holdings yet
            </p>
            <p className="mt-1 max-w-sm text-sm text-neutral-400">
              Import a CSV file above to populate your portfolio with positions.
            </p>
          </div>
        )}
      </SurfaceCard>
    </div>
  );
}
