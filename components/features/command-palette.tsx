"use client";

import { startTransition, useCallback, useDeferredValue, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  FileText,
  LayoutDashboard,
  Search,
  Settings,
  Star,
} from "lucide-react";
import type { SearchResult } from "@/types/finance";
import { ChangePill } from "@/components/ui/change-pill";

type CommandPaletteProps = {
  options: SearchResult[];
};

type QuickAction = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const quickActions: QuickAction[] = [
  { label: "Dashboard", href: "/", icon: <LayoutDashboard className="size-4" /> },
  { label: "Portfolio", href: "/portfolio", icon: <Briefcase className="size-4" /> },
  { label: "Insights", href: "/insights", icon: <BarChart3 className="size-4" /> },
  { label: "Watchlist", href: "/watchlist", icon: <Star className="size-4" /> },
  { label: "Reports", href: "/reports", icon: <FileText className="size-4" /> },
  { label: "Settings", href: "/settings", icon: <Settings className="size-4" /> },
];

export function CommandPalette({ options }: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const symbolMatches = normalizedQuery
    ? options
        .filter(
          (option) =>
            option.symbol.toLowerCase().includes(normalizedQuery) ||
            option.name.toLowerCase().includes(normalizedQuery),
        )
        .slice(0, 8)
    : [];

  const pageMatches = normalizedQuery
    ? quickActions.filter((action) =>
        action.label.toLowerCase().includes(normalizedQuery),
      )
    : quickActions;

  const totalResults = symbolMatches.length + pageMatches.length;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      close();
      startTransition(() => {
        router.push(href);
      });
    },
    [close, router],
  );

  // Open / close on Cmd+K or Ctrl+K
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }

      if (event.key === "Escape") {
        close();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      // Small delay to let the dialog mount
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [deferredQuery]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector("[data-active='true']");
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  function handleKeyNavigation(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % totalResults);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + totalResults) % totalResults);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex < pageMatches.length) {
        navigate(pageMatches[activeIndex].href);
      } else {
        const symbolIndex = activeIndex - pageMatches.length;
        if (symbolMatches[symbolIndex]) {
          navigate(`/stocks/${symbolMatches[symbolIndex].symbol}`);
        }
      }
    }
  }

  if (!open) return null;

  let runningIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />
      {/* Palette */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3">
          <Search className="size-4 shrink-0 text-neutral-400" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyNavigation}
            placeholder="Search symbols, pages..."
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
          <kbd className="hidden rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[11px] text-neutral-400 sm:inline-block">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[360px] overflow-y-auto p-2">
          {/* Pages / quick actions */}
          {pageMatches.length > 0 && (
            <div>
              <p className="px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                {normalizedQuery ? "Pages" : "Quick actions"}
              </p>
              {pageMatches.map((action) => {
                const index = runningIndex++;
                return (
                  <button
                    key={action.href}
                    type="button"
                    data-active={index === activeIndex}
                    onClick={() => navigate(action.href)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      index === activeIndex
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <span className="shrink-0 text-neutral-400">{action.icon}</span>
                    <span className="font-medium">{action.label}</span>
                    {index === activeIndex && (
                      <ArrowRight className="ml-auto size-3.5 text-neutral-400" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Symbol results */}
          {symbolMatches.length > 0 && (
            <div>
              <p className="px-2 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                Symbols
              </p>
              {symbolMatches.map((option) => {
                const index = runningIndex++;
                return (
                  <button
                    key={option.symbol}
                    type="button"
                    data-active={index === activeIndex}
                    onClick={() => navigate(`/stocks/${option.symbol}`)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      index === activeIndex
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <span className="shrink-0 font-mono text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {option.symbol}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {option.name}
                    </span>
                    <ChangePill value={option.changePercent} compact />
                    {index === activeIndex && (
                      <ArrowRight className="ml-1 size-3.5 shrink-0 text-neutral-400" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* No results */}
          {totalResults === 0 && normalizedQuery && (
            <p className="px-3 py-6 text-center text-sm text-neutral-400">
              No results for &ldquo;{deferredQuery.trim()}&rdquo;
            </p>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-neutral-100 px-4 py-2.5 text-[11px] text-neutral-400">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1 py-0.5 font-mono text-[10px]">
              &uarr;
            </kbd>
            <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1 py-0.5 font-mono text-[10px]">
              &darr;
            </kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono text-[10px]">
              &crarr;
            </kbd>
            open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono text-[10px]">
              esc
            </kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
