import Link from "next/link";
import { getCompareSets } from "@/lib/market-data";
import { changeTextClass, formatCompactCurrency, formatCurrency, formatPercent } from "@/lib/utils";
import type { CompareSet } from "@/types/finance";

function CompareSetCard({ set }: { set: CompareSet }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 px-4 py-3">
        <h3 className="text-[15px] font-semibold text-neutral-900">{set.name}</h3>
        <p className="mt-0.5 text-xs text-neutral-500">{set.description}</p>
      </div>
      <div className="divide-y divide-neutral-100">
        {set.members.map((member) => (
          <Link
            key={member.symbol}
            href={`/stocks/${member.symbol}`}
            className="flex items-center justify-between gap-4 px-4 py-2.5 transition-colors hover:bg-neutral-50"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-xs font-semibold text-neutral-700">
                {member.symbol.slice(0, 2)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-neutral-900">{member.symbol}</p>
                <p className="truncate text-xs text-neutral-500">{member.name}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4 text-right">
              <div>
                <p className="text-[13px] font-medium tabular-nums text-neutral-900">
                  {formatCurrency(member.price)}
                </p>
                <p className={`text-xs font-medium tabular-nums ${changeTextClass(member.changePercent)}`}>
                  {formatPercent(member.changePercent)}
                </p>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs tabular-nums text-neutral-500">
                  MCap {formatCompactCurrency(member.marketCap)}
                </p>
                <p className="text-xs tabular-nums text-neutral-500">
                  P/E {member.peRatio > 0 ? member.peRatio.toFixed(1) : "—"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function ComparePage() {
  const { saved, watchlistBasket } = await getCompareSets();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Compare symbols</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Side-by-side fundamentals and price action for up to five tickers.
      </p>

      <section className="mt-8">
        <h2 className="mb-3 text-[17px] font-semibold text-neutral-900">Watchlist basket</h2>
        <p className="mb-4 text-xs text-neutral-500">
          Auto-generated from your current watchlist symbols.
        </p>
        <CompareSetCard set={watchlistBasket} />
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-[17px] font-semibold text-neutral-900">Saved compare sets</h2>
        <p className="mb-4 text-xs text-neutral-500">
          Curated groups for quick side-by-side analysis.
        </p>
        <div className="space-y-4">
          {saved.map((set) => (
            <CompareSetCard key={set.id} set={set} />
          ))}
        </div>
      </section>

      <Link href="/" className="mt-8 inline-block text-sm text-neutral-900 underline">
        Return home
      </Link>
    </div>
  );
}
