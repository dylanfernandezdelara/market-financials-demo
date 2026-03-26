"use client";

import { useDeferredValue, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { ChangePill } from "@/components/ui/change-pill";
import { formatCurrency } from "@/lib/utils";
import type { SearchResult, WatchlistEntry } from "@/types/finance";

type WatchlistManagerProps = {
  searchOptions: SearchResult[];
  initialEntries: WatchlistEntry[];
};

export function WatchlistManager({
  searchOptions,
  initialEntries,
}: WatchlistManagerProps) {
  const [entries, setEntries] = useState<WatchlistEntry[]>(initialEntries);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const watchedSymbols = new Set(entries.map((e) => e.symbol));

  const matches = normalizedQuery
    ? searchOptions
        .filter(
          (option) =>
            !watchedSymbols.has(option.symbol) &&
            (option.symbol.toLowerCase().includes(normalizedQuery) ||
              option.name.toLowerCase().includes(normalizedQuery)),
        )
        .slice(0, 6)
    : [];

  const addSymbol = (result: SearchResult) => {
    const entry: WatchlistEntry = {
      symbol: result.symbol,
      name: result.name,
      price: result.price,
      change: (result.price * result.changePercent) / 100,
      changePercent: result.changePercent,
      sector: result.sector,
      alertPrice: result.price * 1.02,
    };
    setEntries((prev) => {
      if (prev.some((e) => e.symbol === result.symbol)) return prev;
      return [...prev, entry];
    });
    setQuery("");
  };

  const removeSymbol = (symbol: string) => {
    setEntries((prev) => prev.filter((e) => e.symbol !== symbol));
  };

  return (
    <div className="space-y-8">
      {/* Search to add */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-neutral-700">Add symbol</h2>
        <div className="relative">
          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5">
            <Search className="size-4 shrink-0 text-neutral-400" aria-hidden />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tickers or company names…"
              autoComplete="off"
              className="w-full bg-transparent text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </div>

          {matches.length > 0 && (
            <ul className="absolute inset-x-0 top-full z-10 mt-1 max-h-72 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
              {matches.map((result) => (
                <li key={result.symbol}>
                  <button
                    type="button"
                    onClick={() => addSymbol(result)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-neutral-900">
                        {result.symbol}
                        <span className="ml-2 font-normal text-neutral-500">
                          {result.name}
                        </span>
                      </p>
                      <p className="text-xs text-neutral-400">
                        {result.exchange} · {result.sector}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <ChangePill value={result.changePercent} compact />
                      <Plus className="size-4 text-neutral-400" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Current watchlist */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-neutral-700">
          Your watchlist · {entries.length} symbol{entries.length !== 1 ? "s" : ""}
        </h2>

        {entries.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500">
            No symbols yet. Use the search above to add some.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-neutral-200">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <thead className="bg-neutral-50">
                <tr className="text-left text-neutral-500">
                  <th className="px-4 py-2.5 font-medium">Symbol</th>
                  <th className="px-4 py-2.5 font-medium">Price</th>
                  <th className="px-4 py-2.5 font-medium">Sector</th>
                  <th className="px-4 py-2.5 font-medium">Change</th>
                  <th className="px-4 py-2.5 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {entries.map((entry) => (
                  <tr key={entry.symbol} className="group">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-neutral-900">{entry.symbol}</p>
                      <p className="text-xs text-neutral-500">{entry.name}</p>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-neutral-900">
                      {formatCurrency(entry.price)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{entry.sector}</td>
                    <td className="px-4 py-3">
                      <ChangePill value={entry.changePercent} compact />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeSymbol(entry.symbol)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove ${entry.symbol}`}
                      >
                        <Trash2 className="size-3.5" />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
