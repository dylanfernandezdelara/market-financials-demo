import Link from "next/link";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/utils";
import type { StandoutStock } from "@/types/finance";

type StandoutsSectionProps = {
  standouts: StandoutStock[];
};

export function StandoutsSection({ standouts }: StandoutsSectionProps) {
  return (
    <section id="earnings" className="scroll-mt-28" aria-labelledby="standouts-heading">
      <h2 id="standouts-heading" className="mb-3 text-[17px] font-semibold text-neutral-900">
        Standouts
      </h2>
      {standouts.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <p className="text-[15px] font-medium text-neutral-500">No standouts right now</p>
          <p className="mt-1 text-[13px] text-neutral-400">Check back later for noteworthy movers.</p>
        </div>
      ) : (
      <div className="flex flex-col gap-2">
        {standouts.map((stock) => (
          <Link
            key={stock.symbol}
            href={`/stocks/${stock.symbol}`}
            className="grid gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:grid-cols-[auto_1fr]"
          >
            <div className="flex gap-3 sm:flex-col sm:items-start">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-sm font-semibold text-neutral-800">
                {stock.symbol.slice(0, 1)}
              </span>
              <div className="min-w-0 sm:w-full">
                <p className="truncate text-[15px] font-semibold text-neutral-900">{stock.name}</p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {stock.symbol} · {stock.exchange}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-4">
                  <div>
                    <dt className="text-neutral-500">Volume</dt>
                    <dd className="tabular-nums text-neutral-800">{formatCompactNumber(stock.volume)}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">Market Cap</dt>
                    <dd className="tabular-nums text-neutral-800">
                      {formatCompactCurrency(stock.marketCap)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">P/E Ratio</dt>
                    <dd className="tabular-nums text-neutral-800">
                      {stock.peRatio === null ? "—" : stock.peRatio.toFixed(2)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">Dividend Yield</dt>
                    <dd className="tabular-nums text-neutral-800">
                      {stock.dividendYield === null
                        ? "N/A"
                        : `${stock.dividendYield.toFixed(2)}%`}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-neutral-600 sm:col-span-2">{stock.narrative}</p>
          </Link>
        ))}
      </div>
      )}
    </section>
  );
}
