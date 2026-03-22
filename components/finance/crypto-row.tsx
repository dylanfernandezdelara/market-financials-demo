import Link from "next/link";
import { changeTextClass, formatCurrency, formatPercent } from "@/lib/utils";
import type { CryptoQuote } from "@/types/finance";

type CryptoRowProps = {
  quotes: CryptoQuote[];
};

export function CryptoRow({ quotes }: CryptoRowProps) {
  return (
    <section id="crypto" className="scroll-mt-28" aria-labelledby="crypto-heading">
      <h2 id="crypto-heading" className="mb-3 text-[17px] font-semibold text-neutral-900">
        Popular Cryptocurrencies
      </h2>
      <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
        {quotes.map((quote) => (
          <Link
            key={quote.symbol}
            href={`/stocks/${quote.symbol}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-neutral-900">{quote.name}</p>
              <p className="truncate text-xs text-neutral-500">{quote.pairLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-[13px] tabular-nums text-neutral-800">
                {formatCurrency(quote.price, {
                  maximumFractionDigits: quote.price < 100 ? 2 : 0,
                })}
              </p>
              <p className={`text-xs font-semibold tabular-nums ${changeTextClass(quote.changePercent)}`}>
                {formatPercent(quote.changePercent)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
