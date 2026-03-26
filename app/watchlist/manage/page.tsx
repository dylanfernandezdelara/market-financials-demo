"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useTransition } from "react";
import { Eye, ChevronUp, ChevronDown, Trash2, Plus, Check } from "lucide-react";
import { formatCurrency, formatPercent, changeTextClass } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type WatchlistList = {
  id: string;
  name: string;
  symbols: string[];
};

type AlertRule = {
  symbol?: string;
  [key: string]: unknown;
};

type StockQuote = {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  sector: string;
  exchange: string;
};

type EnrichedEntry = StockQuote & {
  hasAlert: boolean;
  originalIndex: number;
};

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const MAX_VISIBLE = 50;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

async function fetchWatchlists(): Promise<WatchlistList[]> {
  const res = await fetch("/api/watchlist");
  const data = await res.json();
  return data.lists ?? [];
}

async function fetchAlertRules(): Promise<AlertRule[]> {
  const res = await fetch("/api/alerts");
  const data = await res.json();
  return data.rules ?? [];
}

async function fetchQuotes(): Promise<StockQuote[]> {
  const res = await fetch("/api/stocks");
  const data = await res.json();
  return (data.data ?? data.stocks ?? data) as StockQuote[];
}

async function persistWatchlist(lists: WatchlistList[]): Promise<void> {
  await fetch("/api/watchlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lists }),
  });
}

function enrichEntries(
  symbols: string[],
  quotes: StockQuote[],
  alertRules: AlertRule[],
): EnrichedEntry[] {
  const alertSymbols = new Set(
    alertRules
      .map((r) => r.symbol?.toUpperCase())
      .filter((s): s is string => Boolean(s)),
  );

  return symbols
    .map((sym, idx) => {
      const quote = quotes.find(
        (q) => q.symbol.toUpperCase() === sym.toUpperCase(),
      );
      if (!quote) return null;
      return {
        ...quote,
        hasAlert: alertSymbols.has(sym.toUpperCase()),
        originalIndex: idx,
      };
    })
    .filter((e): e is EnrichedEntry => e !== null);
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function WatchlistManagePage() {
  const [lists, setLists] = useState<WatchlistList[]>([]);
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  /* New-list form state */
  const [newListName, setNewListName] = useState("");
  const [newListSymbols, setNewListSymbols] = useState("");

  /* Search / highlight for FDL-693 */
  const [searchSymbol, setSearchSymbol] = useState("");

  /* Virtualization expand toggle */
  const [expandedListId, setExpandedListId] = useState<string | null>(null);

  /* ---- initial data load ---- */
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [wl, al, qt] = await Promise.all([
        fetchWatchlists(),
        fetchAlertRules(),
        fetchQuotes(),
      ]);
      if (!cancelled) {
        setLists(wl);
        setAlertRules(al);
        setQuotes(qt);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---- persist helper ---- */
  const persist = useCallback(
    (updated: WatchlistList[]) => {
      setLists(updated);
      startTransition(() => {
        persistWatchlist(updated);
      });
    },
    [],
  );

  /* ---- FDL-682: create watchlist ---- */
  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const name = newListName.trim();
    if (!name) return;

    const symbols = newListSymbols
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    const id = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const updated = [...lists, { id, name, symbols }];
    persist(updated);
    setNewListName("");
    setNewListSymbols("");
  }

  /* ---- FDL-683: reorder ---- */
  function moveEntry(listId: string, index: number, direction: "up" | "down") {
    const updated = lists.map((list) => {
      if (list.id !== listId) return list;
      const syms = [...list.symbols];
      const swapIdx = direction === "up" ? index - 1 : index + 1;
      if (swapIdx < 0 || swapIdx >= syms.length) return list;
      [syms[index], syms[swapIdx]] = [syms[swapIdx], syms[index]];
      return { ...list, symbols: syms };
    });
    persist(updated);
  }

  /* ---- FDL-683: remove ---- */
  function removeEntry(listId: string, symbol: string) {
    const updated = lists.map((list) => {
      if (list.id !== listId) return list;
      return { ...list, symbols: list.symbols.filter((s) => s !== symbol) };
    });
    persist(updated);
  }

  /* ---- FDL-693: check if symbol is on any watchlist ---- */
  const normalizedSearch = searchSymbol.trim().toUpperCase();
  const matchedLists = normalizedSearch
    ? lists.filter((l) =>
        l.symbols.some((s) => s.toUpperCase() === normalizedSearch),
      )
    : [];

  /* ---- render ---- */
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Manage watchlists
        </h1>
        <p className="mt-4 text-sm text-neutral-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">
        Manage watchlists
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Create lists, reorder symbols, and track alerts.
      </p>

      {/* FDL-693 — symbol search */}
      <div className="mt-6">
        <label
          htmlFor="symbol-search"
          className="block text-xs font-medium text-neutral-700"
        >
          Check if a symbol is on a watchlist
        </label>
        <input
          id="symbol-search"
          type="text"
          placeholder="e.g. AAPL"
          value={searchSymbol}
          onChange={(e) => setSearchSymbol(e.target.value)}
          className="mt-1 w-48 rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
        />
        {normalizedSearch.length > 0 && (
          <p className="mt-1.5 text-sm text-neutral-600">
            {matchedLists.length > 0 ? (
              <>
                <Check className="mr-1 inline size-3.5 text-emerald-600" />
                <span className="font-medium text-emerald-700">
                  {normalizedSearch}
                </span>{" "}
                is on:{" "}
                {matchedLists.map((l) => l.name).join(", ")}
              </>
            ) : (
              <>
                <span className="font-medium">{normalizedSearch}</span> is not
                on any watchlist.
              </>
            )}
          </p>
        )}
      </div>

      {/* FDL-682 — create-watchlist form */}
      <form
        onSubmit={handleCreate}
        className="mt-8 rounded-lg border border-neutral-200 bg-neutral-50 p-4"
      >
        <h2 className="text-sm font-semibold text-neutral-900">
          <Plus className="mr-1 inline size-4" />
          Create a new watchlist
        </h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="List name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            required
            className="flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Symbols (comma-separated)"
            value={newListSymbols}
            onChange={(e) => setNewListSymbols(e.target.value)}
            className="flex-[2] rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Create
          </button>
        </div>
      </form>

      {/* FDL-681 — render current watchlist contents */}
      {lists.length === 0 && (
        <p className="mt-8 text-sm text-neutral-500">
          No watchlists yet. Create one above.
        </p>
      )}

      <div className="mt-8 space-y-8">
        {lists.map((list) => {
          const enriched = enrichEntries(list.symbols, quotes, alertRules);

          /* FDL-691 — virtualization / size limit */
          const isExpanded = expandedListId === list.id;
          const visibleEntries =
            enriched.length > MAX_VISIBLE && !isExpanded
              ? enriched.slice(0, MAX_VISIBLE)
              : enriched;
          const hasMore = enriched.length > MAX_VISIBLE && !isExpanded;

          return (
            <section
              key={list.id}
              className="rounded-lg border border-neutral-200 bg-white"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    {list.name}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {list.symbols.length}{" "}
                    {list.symbols.length === 1 ? "symbol" : "symbols"}
                  </p>
                </div>
                {isPending && (
                  <span className="text-xs text-neutral-400">Saving…</span>
                )}
              </div>

              {enriched.length === 0 ? (
                <p className="px-4 py-4 text-sm text-neutral-500">
                  No symbols in this list.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-neutral-50 text-left text-neutral-500">
                      <tr>
                        <th className="px-4 py-2 font-medium">Symbol</th>
                        <th className="px-4 py-2 font-medium">Price</th>
                        <th className="px-4 py-2 font-medium">Change</th>
                        <th className="px-4 py-2 font-medium">Sector</th>
                        {/* FDL-692 — alert column */}
                        <th className="px-4 py-2 font-medium">Alert</th>
                        {/* FDL-683 — controls column */}
                        <th className="px-4 py-2 font-medium sr-only">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {visibleEntries.map((entry) => {
                        const originalIdx = entry.originalIndex;
                        const isHighlighted =
                          normalizedSearch.length > 0 &&
                          entry.symbol.toUpperCase() === normalizedSearch;

                        return (
                          <tr
                            key={entry.symbol}
                            className={
                              isHighlighted ? "bg-amber-50" : "bg-white"
                            }
                          >
                            <td className="px-4 py-3">
                              <Link
                                href={`/stocks/${entry.symbol}`}
                                className="font-medium text-neutral-900 hover:text-neutral-700"
                              >
                                {entry.symbol}
                              </Link>
                              <span className="ml-2 text-xs text-neutral-500">
                                {entry.name}
                              </span>
                            </td>
                            <td className="px-4 py-3 tabular-nums text-neutral-900">
                              {formatCurrency(entry.price)}
                            </td>
                            <td
                              className={`px-4 py-3 tabular-nums font-medium ${changeTextClass(entry.changePercent)}`}
                            >
                              {formatPercent(entry.changePercent)}
                            </td>
                            <td className="px-4 py-3 text-neutral-600">
                              {entry.sector}
                            </td>
                            {/* FDL-692 — alert association */}
                            <td className="px-4 py-3">
                              {entry.hasAlert ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                                  <Eye className="size-3" />
                                  Active
                                </span>
                              ) : (
                                <span className="text-xs text-neutral-400">
                                  —
                                </span>
                              )}
                            </td>
                            {/* FDL-683 — reorder & remove */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  aria-label={`Move ${entry.symbol} up`}
                                  disabled={originalIdx === 0}
                                  onClick={() =>
                                    moveEntry(list.id, originalIdx, "up")
                                  }
                                  className="rounded p-0.5 text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                                >
                                  <ChevronUp className="size-4" />
                                </button>
                                <button
                                  type="button"
                                  aria-label={`Move ${entry.symbol} down`}
                                  disabled={
                                    originalIdx === list.symbols.length - 1
                                  }
                                  onClick={() =>
                                    moveEntry(list.id, originalIdx, "down")
                                  }
                                  className="rounded p-0.5 text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                                >
                                  <ChevronDown className="size-4" />
                                </button>
                                <button
                                  type="button"
                                  aria-label={`Remove ${entry.symbol}`}
                                  onClick={() =>
                                    removeEntry(list.id, entry.symbol)
                                  }
                                  className="ml-1 rounded p-0.5 text-neutral-400 hover:text-rose-600"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* FDL-691 — expand toggle for large lists */}
                  {hasMore && (
                    <button
                      type="button"
                      onClick={() => setExpandedListId(list.id)}
                      className="w-full border-t border-neutral-100 py-2 text-center text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                    >
                      Show all {enriched.length} entries (showing first{" "}
                      {MAX_VISIBLE})
                    </button>
                  )}
                  {enriched.length > MAX_VISIBLE && isExpanded && (
                    <button
                      type="button"
                      onClick={() => setExpandedListId(null)}
                      className="w-full border-t border-neutral-100 py-2 text-center text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                    >
                      Collapse to first {MAX_VISIBLE}
                    </button>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <Link
        href="/"
        className="mt-8 inline-block text-sm text-neutral-900 underline"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
