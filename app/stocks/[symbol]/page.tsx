import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StockChartPanel } from "@/components/stock/stock-chart-panel";
import { StockCompanySidebar } from "@/components/stock/stock-company-sidebar";
import { StockFollowRow, StockPriceHero } from "@/components/stock/stock-price-hero";
import { StockKeyStatsGrid } from "@/components/stock/stock-key-stats-grid";
import { StockNoteEditor } from "@/components/stock/stock-note-editor";
import { StockNotableTimeline } from "@/components/stock/stock-notable-timeline";
import { StockOverviewTabs } from "@/components/stock/stock-overview-tabs";
import { SiteHeader } from "@/components/site-header";
import {
  getNewsForSymbol,
  getRelatedStocks,
  getSearchUniverse,
  getStockOrThrow,
} from "@/lib/market-data";
import {
  formatCurrency,
  formatPercent,
} from "@/lib/utils";

type StockPageProps = {
  params: Promise<{
    symbol: string;
  }>;
};

export async function generateMetadata({
  params,
}: StockPageProps): Promise<Metadata> {
  const { symbol } = await params;
  const stock = await getStockOrThrow(symbol);

  return {
    title: `${stock.symbol} · ${stock.name}`,
    description: stock.thesis,
  };
}

export default async function StockPage({ params }: StockPageProps) {
  const { symbol } = await params;
  const [stock, news, relatedStocks, searchOptions] = await Promise.all([
    getStockOrThrow(symbol),
    getNewsForSymbol(symbol),
    getRelatedStocks(symbol),
    getSearchUniverse(),
  ]);

  const closeTimeLabel = `At close: ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  }).format(new Date())}`;

  const trendUp = stock.changePercent >= 0;

  return (
    <SiteHeader
      searchOptions={searchOptions}
      showMarketTabs={false}
      contentMaxWidthClass="max-w-[1200px]"
    >
      <div className="pb-10">
        <nav className="flex flex-wrap items-center gap-1 text-[13px] text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">
            Market
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-neutral-400" aria-hidden />
          <span className="font-medium text-neutral-900">{stock.symbol}</span>
        </nav>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] sm:text-[2rem]">
              {stock.name}
            </h1>
            <p className="mt-1.5 text-[14px] text-neutral-600">
              {stock.symbol} · {stock.exchange} ·{" "}
              <span aria-hidden>
                🇺🇸
              </span>
            </p>
          </div>
          <StockFollowRow />
        </div>

        <div className="mt-6">
          <StockOverviewTabs />
        </div>

        <div className="mt-6">
          <StockPriceHero closeTimeLabel={closeTimeLabel} stock={stock} />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px] xl:items-start">
          <div className="space-y-8">
            <StockChartPanel chart={stock.chart} trendUp={trendUp} />
            <StockKeyStatsGrid chart={stock.chart} stock={stock} />
            <StockNotableTimeline articles={news} />

            <section>
              <h2 className="text-[17px] font-semibold text-[#1a1a1a]">Stories &amp; analysis</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {news.slice(0, 4).map((article) => (
                  <article
                    key={article.id}
                    className="rounded-xl border border-[#ebebeb] bg-white p-4 shadow-sm"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                      {article.source}
                    </p>
                    <h3 className="mt-2 text-[15px] font-semibold leading-snug text-[#1a1a1a]">
                      {article.headline}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-neutral-600">
                      {article.summary}
                    </p>
                    <p className="mt-3 text-[11px] text-neutral-400">{article.publishedAt}</p>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-[17px] font-semibold text-[#1a1a1a]">Related companies</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {relatedStocks.map((related) => (
                  <Link
                    key={related.symbol}
                    href={`/stocks/${related.symbol}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#ebebeb] bg-[#fafafa] px-3 py-2 text-[13px] font-medium text-neutral-800 transition-colors hover:border-neutral-300 hover:bg-white"
                  >
                    <span className="font-semibold text-[#1a1a1a]">{related.symbol}</span>
                    <span className="text-neutral-500">{formatCurrency(related.price)}</span>
                    <span
                      className={
                        related.changePercent >= 0 ? "text-emerald-600" : "text-red-600"
                      }
                    >
                      {formatPercent(related.changePercent)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-6">
            <StockCompanySidebar stock={stock} />
            <StockNoteEditor symbol={stock.symbol} />
          </aside>
        </div>
      </div>
    </SiteHeader>
  );
}
