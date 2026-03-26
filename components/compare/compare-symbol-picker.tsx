"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useDeferredValue, useCallback } from "react";
import { Search, X } from "lucide-react";
import type { SearchResult } from "@/types/finance";
import { ChangePill } from "@/components/ui/change-pill";

type CompareSymbolPickerProps = {
  options: SearchResult[];
  selected: string[];
};

export function CompareSymbolPicker({ options, selected }: CompareSymbolPickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const matches = normalizedQuery
    ? options
        .filter(
          (option) =>
            !selected.includes(option.symbol) &&
            (option.symbol.toLowerCase().includes(normalizedQuery) ||
              option.name.toLowerCase().includes(normalizedQuery)),
        )
        .slice(0, 5)
    : [];

  const updateSymbols = useCallback(
    (symbols: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (symbols.length > 0) {
        params.set("symbols", symbols.join(","));
      } else {
        params.delete("symbols");
      }
      router.push(pathname + "?" + params.toString());
    },
    [router, pathname, searchParams],
  );

  const addSymbol = (symbol: string) => {
    if (selected.length >= 5 || selected.includes(symbol)) return;
    updateSymbols([...selected, symbol]);
    setQuery("");
  };

  const removeSymbol = (symbol: string) => {
    updateSymbols(selected.filter((s) => s !== symbol));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {selected.map((symbol) => (
          <span
            key={symbol}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e5e5] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#1a1a1a] shadow-sm"
          >
            {symbol}
            <button
              type="button"
              onClick={() => removeSymbol(symbol)}
              className="rounded-full p-0.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              aria-label={`Remove ${symbol}`}
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
        {selected.length < 5 && (
          <div className="relative">
            <div className="flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-[#fafafa] px-3 py-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
              <Search className="size-3.5 shrink-0 text-neutral-400" aria-hidden />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={selected.length === 0 ? "Add a symbol to compare..." : "Add another..."}
                autoComplete="off"
                className="min-w-[140px] bg-transparent text-[13px] text-[#1a1a1a] outline-none placeholder:text-neutral-400"
              />
            </div>
            {matches.length > 0 && (
              <div className="absolute left-0 top-full z-20 mt-1.5 w-72 overflow-hidden rounded-xl border border-[#ebebeb] bg-white shadow-lg">
                {matches.map((option) => (
                  <button
                    key={option.symbol}
                    type="button"
                    onClick={() => addSymbol(option.symbol)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-neutral-50"
                  >
                    <div>
                      <span className="text-[13px] font-semibold text-[#1a1a1a]">{option.symbol}</span>
                      <span className="ml-2 text-[12px] text-neutral-500">{option.name}</span>
                    </div>
                    <ChangePill value={option.changePercent} compact />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {selected.length === 0 && (
        <p className="text-[12px] text-neutral-400">
          Search and select up to five symbols to compare side-by-side.
        </p>
      )}
    </div>
  );
}
