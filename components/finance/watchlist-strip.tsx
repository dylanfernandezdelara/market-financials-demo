import Link from "next/link";
import { Eye } from "lucide-react";
import { changeTextClass, formatCurrency, formatPercent } from "@/lib/utils";
import type { WatchlistBarEntry } from "@/types/finance";

type WatchlistStripProps = {
  entries: WatchlistBarEntry[];
};

export function WatchlistStrip({ entries }: WatchlistStripProps) {
  return (
    <section id="watchlist" className="scroll-mt-28" aria-labelledby="watchlist-heading">
      <h2 id="watchlist-heading" className="mb-3 text-[17px] font-semibold text-neutral-900">
        Create Watchlist
      </h2>
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center">
          <Eye className="mb-3 size-8 text-neutral-400" />
          <p className="text-sm font-medium text-neutral-700">No watchlists yet</p>
          <p className="mt-1 text-xs text-neutral-500">
            Search for a symbol above and add it to start tracking.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {entries.map((entry) => (
            <Link
              key={entry.symbol}
              href={`/stocks/${entry.symbol}`}
              className="inline-flex min-w-[200px] flex-1 items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-neutral-900">{entry.name}</p>
                <p className="truncate text-xs text-neutral-500">
                  {formatCurrency(entry.price)} {entry.symbol} · {entry.exchange}
                </p>
              </div>
              <span className={`shrink-0 text-[13px] font-semibold tabular-nums ${changeTextClass(entry.changePercent)}`}>
                {formatPercent(entry.changePercent)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
