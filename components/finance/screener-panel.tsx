"use client";

import Link from "next/link";
import { useState } from "react";
import {
  changeTextClass,
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from "@/lib/utils";
import type { ScreenerResult } from "@/types/finance";

type SortKey = "changePercent" | "marketCap" | "price" | "volume";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "changePercent", label: "% Change" },
  { key: "marketCap", label: "Market Cap" },
  { key: "price", label: "Price" },
  { key: "volume", label: "Volume" },
];

type ScreenerPanelProps = {
  results: ScreenerResult[];
  sectors: string[];
};

export function ScreenerPanel({ results, sectors }: ScreenerPanelProps) {
  const [activeSector, setActiveSector] = useState("any");
  const [sortBy, setSortBy] = useState<SortKey>("marketCap");

  const filtered =
    activeSector === "any"
      ? results
      : results.filter(
          (r) => r.sector.toLowerCase() === activeSector.toLowerCase(),
        );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "changePercent") return Math.abs(b.changePercent) - Math.abs(a.changePercent);
    return b[sortBy] - a[sortBy];
  });

  return (
    <section id="screener" className="scroll-mt-28" aria-labelledby="screener-heading">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
        <h2 id="screener-heading" className="text-[17px] font-semibold text-neutral-900">
          Screener
        </h2>
        <div className="inline-flex rounded-full border border-neutral-200 bg-neutral-100/80 p-0.5">
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSortBy(opt.key)}
              className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                sortBy === opt.key
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveSector("any")}
          className={`rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors ${
            activeSector === "any"
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
          }`}
        >
          All Sectors
        </button>
        {sectors.map((sector) => (
          <button
            key={sector}
            type="button"
            onClick={() => setActiveSector(sector)}
            className={`rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors ${
              activeSector === sector
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
            }`}
          >
            {sector}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50 text-xs font-medium text-neutral-500">
              <th className="px-3 py-2">Symbol</th>
              <th className="hidden px-3 py-2 sm:table-cell">Sector</th>
              <th className="px-3 py-2 text-right">Price</th>
              <th className="px-3 py-2 text-right">Change</th>
              <th className="hidden px-3 py-2 text-right md:table-cell">Mkt Cap</th>
              <th className="hidden px-3 py-2 text-right lg:table-cell">P/E</th>
              <th className="hidden px-3 py-2 text-right lg:table-cell">Div Yield</th>
              <th className="hidden px-3 py-2 text-right md:table-cell">Volume</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.symbol}
                className="border-b border-neutral-100 last:border-b-0 transition-colors hover:bg-neutral-50"
              >
                <td className="px-3 py-2.5">
                  <Link href={`/stocks/${row.symbol}`} className="hover:underline">
                    <span className="font-semibold text-neutral-900">{row.symbol}</span>
                    <span className="ml-1.5 text-xs text-neutral-500">{row.name}</span>
                  </Link>
                </td>
                <td className="hidden px-3 py-2.5 text-neutral-600 sm:table-cell">{row.sector}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-neutral-800">
                  {formatCurrency(row.price)}
                </td>
                <td className={`px-3 py-2.5 text-right tabular-nums font-semibold ${changeTextClass(row.changePercent)}`}>
                  {formatPercent(row.changePercent)}
                </td>
                <td className="hidden px-3 py-2.5 text-right tabular-nums text-neutral-600 md:table-cell">
                  {row.marketCap > 0 ? formatCompactCurrency(row.marketCap) : "—"}
                </td>
                <td className="hidden px-3 py-2.5 text-right tabular-nums text-neutral-600 lg:table-cell">
                  {row.peRatio > 0 ? row.peRatio.toFixed(1) : "—"}
                </td>
                <td className="hidden px-3 py-2.5 text-right tabular-nums text-neutral-600 lg:table-cell">
                  {row.dividendYield > 0 ? `${row.dividendYield.toFixed(2)}%` : "—"}
                </td>
                <td className="hidden px-3 py-2.5 text-right tabular-nums text-neutral-600 md:table-cell">
                  {formatCompactNumber(row.volume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-neutral-400">
        {sorted.length} result{sorted.length === 1 ? "" : "s"}
      </p>
    </section>
  );
}
