"use client";

import Link from "next/link";
import { useState } from "react";
import { changeTextClass, formatCurrency, formatPercent } from "@/lib/utils";
import type { ListMover, MarketMovers } from "@/types/finance";

const tabs = [
  { key: "gainers" as const, label: "Gainers", emptyMessage: "No gainers right now" },
  { key: "losers" as const, label: "Losers", emptyMessage: "No losers right now" },
  { key: "active" as const, label: "Active", emptyMessage: "No active movers right now" },
];

type MoversPanelProps = {
  movers: MarketMovers;
};

export function MoversPanel({ movers }: MoversPanelProps) {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("gainers");

  const rows: ListMover[] = movers[tab];

  return (
    <section id="screener" className="scroll-mt-28" aria-labelledby="movers-heading">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
        <h2 id="movers-heading" className="text-[17px] font-semibold text-neutral-900">
          Movers
        </h2>
        <div className="inline-flex rounded-full border border-neutral-200 bg-neutral-100/80 p-0.5">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                tab === item.key
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {rows.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-white px-3 py-8 text-center shadow-sm">
            <p className="text-[13px] text-neutral-500">
              {tabs.find((t) => t.key === tab)?.emptyMessage}
            </p>
          </div>
        ) : (
          rows.map((row) => (
            <Link
              key={`${tab}-${row.symbol}`}
              href={`/stocks/${row.symbol}`}
              className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-xs font-semibold text-neutral-700">
                  {row.symbol.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-neutral-900">{row.name}</p>
                  <p className="truncate text-xs text-neutral-500">
                    {formatCurrency(row.price)} {row.symbol} · {row.exchange}
                  </p>
                </div>
              </div>
              <span className={`shrink-0 text-[13px] font-semibold tabular-nums ${changeTextClass(row.changePercent)}`}>
                {formatPercent(row.changePercent)}
              </span>
            </Link>
          ))
        )}
      </div>
      <Link
        href="/"
        className="mt-3 inline-block text-[13px] font-medium text-emerald-700 hover:text-emerald-800"
      >
        See all
      </Link>
    </section>
  );
}
