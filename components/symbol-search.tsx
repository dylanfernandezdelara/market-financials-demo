"use client";

import { startTransition, useEffect, useDeferredValue, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Search, Sparkles, Star } from "lucide-react";
import { SearchResult } from "@/types/finance";
import { ChangePill } from "@/components/ui/change-pill";
import { formatCurrency, changeTextClass, formatPercent } from "@/lib/utils";

type SymbolSearchProps = {
  options: SearchResult[];
  variant?: "full" | "toolbar" | "header";
  recentSymbols?: SearchResult[];
  watchlistShortcuts?: SearchResult[];
};

export function SymbolSearch({ options, variant = "full", recentSymbols, watchlistShortcuts }: SymbolSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const matches = (normalizedQuery
    ? options.filter(
        (option) =>
          option.symbol.toLowerCase().includes(normalizedQuery) ||
          option.name.toLowerCase().includes(normalizedQuery),
      )
    : options
  ).slice(0, 5);

  const goToSymbol = (symbol: string) => {
    startTransition(() => {
      router.push(`/stocks/${symbol}`);
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const q = query.trim().toLowerCase();
    if (!q) {
      return;
    }

    // Use the current query only — do not rely on `matches` from useDeferredValue,
    // or Enter can fire before deferred state updates and navigate to the wrong symbol.
    const exactMatch = options.find(
      (option) =>
        option.symbol.toLowerCase() === q ||
        option.name.toLowerCase() === q,
    );

    const filtered = options.filter(
      (option) =>
        option.symbol.toLowerCase().includes(q) ||
        option.name.toLowerCase().includes(q),
    );

    const target = exactMatch ?? filtered[0];

    if (!target) {
      return;
    }

    goToSymbol(target.symbol);
  };

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasShortcuts =
    (recentSymbols && recentSymbols.length > 0) ||
    (watchlistShortcuts && watchlistShortcuts.length > 0);
  const showDropdown = variant === "header" && open && !normalizedQuery && hasShortcuts;

  if (variant === "header") {
    return (
      <div ref={containerRef} className="relative w-full">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex w-full items-center gap-2 rounded-full border border-[#e5e5e5] bg-[#fafafa] px-3 py-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
            <Search className="size-4 shrink-0 text-neutral-400" aria-hidden />
            <input
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setOpen(true)}
              placeholder="Search for stocks, crypto, and more"
              autoComplete="off"
              enterKeyHint="search"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-[#1a1a1a] outline-none placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-neutral-800"
              aria-label="Search"
            >
              <ArrowRight className="size-4" strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        </form>

        {showDropdown ? (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
            {recentSymbols && recentSymbols.length > 0 ? (
              <div className="border-b border-neutral-100 px-3 py-2.5">
                <div className="mb-2 flex items-center gap-1.5">
                  <Clock className="size-3.5 text-neutral-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                    Recent
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {recentSymbols.map((item) => (
                    <button
                      key={item.symbol}
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        goToSymbol(item.symbol);
                      }}
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-neutral-50"
                    >
                      <div className="min-w-0">
                        <span className="text-[13px] font-semibold text-neutral-900">
                          {item.symbol}
                        </span>
                        <span className="ml-2 text-[12px] text-neutral-500">
                          {item.name}
                        </span>
                      </div>
                      <span className={`shrink-0 text-[12px] font-medium tabular-nums ${changeTextClass(item.changePercent)}`}>
                        {formatPercent(item.changePercent)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {watchlistShortcuts && watchlistShortcuts.length > 0 ? (
              <div className="px-3 py-2.5">
                <div className="mb-2 flex items-center gap-1.5">
                  <Star className="size-3.5 text-neutral-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                    Watchlist
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {watchlistShortcuts.map((item) => (
                    <button
                      key={item.symbol}
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        goToSymbol(item.symbol);
                      }}
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-neutral-50"
                    >
                      <div className="min-w-0">
                        <span className="text-[13px] font-semibold text-neutral-900">
                          {item.symbol}
                        </span>
                        <span className="ml-2 text-[12px] text-neutral-500">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-[12px] tabular-nums text-neutral-500">
                          {formatCurrency(item.price)}
                        </span>
                        <span className={`text-[12px] font-medium tabular-nums ${changeTextClass(item.changePercent)}`}>
                          {formatPercent(item.changePercent)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  if (variant === "toolbar") {
    return (
      <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2">
          <Search className="size-4 shrink-0 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tickers, companies…"
            className="w-full bg-transparent text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </div>
        <button
          type="submit"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-950 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800"
        >
          <Sparkles className="size-3.5 text-amber-300" />
          Go
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-[28px] border border-white/70 bg-white/94 p-3 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:flex-row sm:items-center"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[22px] border border-slate-200/90 bg-slate-50/90 px-4 py-3.5">
          <Search className="size-4 shrink-0 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search stocks, ETFs, sectors..."
            className="w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-slate-950 px-5 py-3.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <Sparkles className="size-4 text-amber-300" />
          Open symbol
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {["Mega-cap", "Semiconductors", "Financials", "AI leaders"].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/70 bg-white/65 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {matches.map((option) => (
          <button
            key={option.symbol}
            type="button"
            onClick={() => goToSymbol(option.symbol)}
            className="group flex items-center justify-between rounded-[24px] border border-white/70 bg-white/75 px-4 py-3.5 text-left shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-0.5 hover:border-slate-300"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                {option.symbol}
              </p>
              <p className="text-sm font-medium text-slate-900 group-hover:text-slate-700">
                {option.name}
              </p>
            </div>
            <ChangePill value={option.changePercent} compact />
          </button>
        ))}
      </div>
    </div>
  );
}
