import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { CompareWorkspace } from "@/components/charts/compare-workspace";
import { getBenchmarks, getSearchUniverse } from "@/lib/market-data";
import { stockProfiles } from "@/lib/mock-data";

export default async function ComparePage() {
  const searchOptions = await getSearchUniverse();

  const defaultSymbols = ["AAPL", "MSFT", "NVDA"];
  const defaultStocks = defaultSymbols
    .map((sym) => stockProfiles.find((p) => p.symbol === sym))
    .filter(Boolean);
  const labels = defaultStocks[0]?.chart.map((p) => p.label) ?? [];
  const benchmarks = await getBenchmarks(labels);

  return (
    <SiteHeader searchOptions={searchOptions} showMarketTabs={false} contentMaxWidthClass="max-w-5xl">
      <div className="pb-10">
        <nav className="flex items-center gap-1 text-[13px] text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">
            Market
          </Link>
          <span className="text-neutral-400">/</span>
          <span className="font-medium text-neutral-900">Compare</span>
        </nav>

        <h1 className="mt-4 text-2xl font-semibold text-neutral-900">Compare symbols</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Side-by-side price action with benchmark overlays for up to five tickers.
        </p>

        <div className="mt-6">
          <CompareWorkspace
            stocks={defaultStocks.map((s) => ({
              symbol: s!.symbol,
              name: s!.name,
              chart: s!.chart,
              changePercent: s!.changePercent,
            }))}
            benchmarks={benchmarks}
            allSymbols={searchOptions}
          />
        </div>
      </div>
    </SiteHeader>
  );
}
