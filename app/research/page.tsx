import Link from "next/link";
import { StickyNote } from "lucide-react";
import { getSearchUniverse } from "@/lib/market-data";

export default async function ResearchHubPage() {
  const stocks = await getSearchUniverse();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Research hub</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Filings, transcripts, and third-party notes in one stream.
      </p>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-[#1a1a1a]">Notes</h2>
          <Link
            href="/notes"
            className="text-[13px] font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            Open notes
          </Link>
        </div>
        <p className="mt-1 text-[13px] text-neutral-500">
          Attach research notes to any stock from its detail page.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {stocks.slice(0, 6).map((stock) => (
            <Link
              key={stock.symbol}
              href={`/notes?symbol=${stock.symbol}`}
              className="flex items-center gap-3 rounded-xl border border-[#ebebeb] bg-white px-4 py-3 shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50"
            >
              <StickyNote className="size-4 shrink-0 text-neutral-400" />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#1a1a1a]">{stock.symbol}</p>
                <p className="truncate text-[12px] text-neutral-500">{stock.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 h-48 animate-pulse rounded-xl bg-neutral-100" />
    </div>
  );
}
