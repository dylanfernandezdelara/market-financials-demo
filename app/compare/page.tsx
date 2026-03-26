import { Suspense } from "react";
import Link from "next/link";
import { getSearchUniverse, getStockProfile } from "@/lib/market-data";
import { SiteHeader } from "@/components/site-header";
import { CompareSymbolPicker } from "@/components/compare/compare-symbol-picker";
import { CompareMetricsTable } from "@/components/compare/compare-metrics-table";
import type { StockProfile } from "@/types/finance";

type ComparePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { symbols: rawSymbols } = await searchParams;
  const searchOptions = await getSearchUniverse();

  const symbolList: string[] = typeof rawSymbols === "string"
    ? rawSymbols.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean).slice(0, 5)
    : [];

  const stocks: StockProfile[] = (
    await Promise.all(symbolList.map((s) => getStockProfile(s)))
  ).filter((s): s is StockProfile => s !== undefined);

  return (
    <SiteHeader searchOptions={searchOptions} showMarketTabs={false} contentMaxWidthClass="max-w-5xl">
      <div className="pb-10">
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Compare symbols</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Side-by-side fundamentals and price action for up to five tickers.
        </p>

        <div className="mt-6">
          <Suspense fallback={null}>
            <CompareSymbolPicker options={searchOptions} selected={symbolList} />
          </Suspense>
        </div>

        {stocks.length >= 2 ? (
          <div className="mt-8 rounded-xl border border-[#ebebeb] bg-white p-6 shadow-sm">
            <CompareMetricsTable stocks={stocks} />
          </div>
        ) : stocks.length === 1 ? (
          <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
            Add at least one more symbol to see a side-by-side comparison.
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
            Select two or more symbols above to compare their key metrics.
          </div>
        )}

        <Link href="/" className="mt-6 inline-block text-sm text-neutral-900 underline">
          Return home
        </Link>
      </div>
    </SiteHeader>
  );
}
