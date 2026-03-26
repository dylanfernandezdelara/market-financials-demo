import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { StockChartPanel } from "@/components/stock/stock-chart-panel";
import { StockCompanySidebar } from "@/components/stock/stock-company-sidebar";
import { StockFollowRow, StockPriceHero } from "@/components/stock/stock-price-hero";
import { StockKeyStatsGrid } from "@/components/stock/stock-key-stats-grid";
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
  changeTextClass,
  formatCurrency,
  formatPercent,
} from "@/lib/utils";
import type { NewsArticle, PricePoint, SearchResult, StockProfile } from "@/types/finance";

/* FDL-609 / SD18 – Reusable Tailwind class-string constants */
const SECTION_HEADING = "text-[17px] font-semibold text-heading";
const CARD_BORDER = "rounded-xl border border-border-card bg-white p-4 shadow-sm";

/* FDL-623 / SD06 – Normalised percentage-change helper */
function normaliseChangePercent(price: number, change: number): number {
  const prev = price - change;
  return prev === 0 ? 0 : (change / prev) * 100;
}

/* FDL-613 / SD04 – Proportional 52-week range position */
function week52RangePercent(stock: StockProfile): number {
  const span = stock.week52High - stock.week52Low;
  if (span <= 0) return 50;
  return Math.min(100, Math.max(0, ((stock.price - stock.week52Low) / span) * 100));
}


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

  /* FDL-616 / SD08 – Type-narrow raw data from Promise.all */
  const [stock, news, relatedStocks, searchOptions] = await Promise.all([
    getStockOrThrow(symbol),
    getNewsForSymbol(symbol),
    getRelatedStocks(symbol),
    getSearchUniverse(),
  ]) as [StockProfile, NewsArticle[], StockProfile[], SearchResult[]];

  /* FDL-612 / SD03 – Session clock for contextual market-hours label */
  const now = new Date();
  const estHour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "America/New_York",
    }).format(now),
  );
  const estMinute = Number(
    new Intl.DateTimeFormat("en-US", {
      minute: "numeric",
      timeZone: "America/New_York",
    }).format(now),
  );
  const dayOfWeek = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "America/New_York",
  }).format(now);
  const isWeekday = !["Sat", "Sun"].includes(dayOfWeek);
  const afterOpen = estHour > 9 || (estHour === 9 && estMinute >= 30);
  const isMarketOpen = isWeekday && afterOpen && estHour < 16;
  const sessionStatus = isMarketOpen ? "Market open" : "After-hours";
  const closeTimeLabel = `${sessionStatus}: ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  }).format(now)}`;

  /* FDL-623 / SD06 – Normalised change percent */
  const normalisedChangePercent = normaliseChangePercent(stock.price, stock.change);
  const trendUp = normalisedChangePercent >= 0;

  /* FDL-631 / SD14 – Stable reference for chart data */
  const priceHistory: PricePoint[] = stock.chart;

  /* FDL-613 / SD04 – Proportional 52-week position */
  const week52Position = week52RangePercent(stock);

  /* FDL-607 / SD11 – Detect N/A metrics for grey-out */
  const peApplicable = stock.peRatio > 0;
  const dividendApplicable = stock.dividendYield > 0;

  return (
    <SiteHeader
      searchOptions={searchOptions}
      showMarketTabs={false}
      contentMaxWidthClass="max-w-[1200px]"
    >
      <div className="pb-10">
        {/* FDL-608 / SD17 – Persistent back-to-search link */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Back to market
          </Link>
        </div>

        <nav className="flex flex-wrap items-center gap-1 text-[13px] text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">
            Market
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-neutral-400" aria-hidden />
          <span className="font-medium text-neutral-900">{stock.symbol}</span>
        </nav>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {/* FDL-610 / SD01 – Theme token for heading colour */}
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-heading sm:text-[2rem]">
              {stock.name}
            </h1>
            <p className="mt-1.5 text-[14px] text-neutral-600">
              {stock.symbol} · {stock.exchange} ·{" "}
              <span aria-hidden>
                🇺🇸
              </span>
            </p>
            {/* FDL-611 / SD02 – Description from data layer */}
            {stock.description ? (
              <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-neutral-600">
                {stock.description}
              </p>
            ) : null}
          </div>
          <StockFollowRow />
        </div>

        {/* FDL-614 / SD05 – ARIA attributes; FDL-679 / SD16 – Computed consensus */}
        <div className="mt-6">
          <StockOverviewTabs
            stock={stock}
            peApplicable={peApplicable}
            dividendApplicable={dividendApplicable}
          />
        </div>

        {/* FDL-632 / SD15 – HeroSkeleton is available for future async boundaries */}
        <div className="mt-6">
          <StockPriceHero closeTimeLabel={closeTimeLabel} stock={stock} isMarketOpen={isMarketOpen} />
        </div>

        {/* FDL-613 / SD04 – Proportional 52-week range bar */}
        <div className="mt-4 rounded-xl border border-border-card bg-white px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
            52-week range
          </p>
          <div className="mt-2 flex items-center gap-3 text-[12px] tabular-nums text-neutral-600">
            <span>{formatCurrency(stock.week52Low, { maximumFractionDigits: 0 })}</span>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                style={{ width: `${week52Position}%` }}
              />
              <div
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rounded-full border-2 border-white bg-heading shadow"
                style={{ left: `${week52Position}%` }}
              />
            </div>
            <span>{formatCurrency(stock.week52High, { maximumFractionDigits: 0 })}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px] xl:items-start">
          <div className="space-y-8">
            {/* FDL-631 / SD14 – Memoized price history */}
            <StockChartPanel chart={priceHistory} trendUp={trendUp} />

            {/* FDL-607 / SD11 – Pass applicability flags for grey-out */}
            <StockKeyStatsGrid
              chart={priceHistory}
              stock={stock}
              peApplicable={peApplicable}
              dividendApplicable={dividendApplicable}
            />
            <StockNotableTimeline articles={news} />

            <section>
              <h2 className={SECTION_HEADING}>Stories &amp; analysis</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {news.slice(0, 4).map((article) => (
                  <article
                    key={article.id}
                    className={CARD_BORDER}
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                      {article.source}
                    </p>
                    <h3 className="mt-2 text-[15px] font-semibold leading-snug text-heading">
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

            {/* FDL-630 / SD13 – Hide when sector has only one entry */}
            {relatedStocks.length > 0 ? (
              <section>
                <h2 className={SECTION_HEADING}>Related companies</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {relatedStocks.map((related) => (
                    <Link
                      key={related.symbol}
                      href={`/stocks/${related.symbol}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border-card bg-surface px-3 py-2 text-[13px] font-medium text-neutral-800 transition-colors hover:border-neutral-300 hover:bg-white"
                    >
                      <span className="font-semibold text-heading">{related.symbol}</span>
                      <span className="text-neutral-500">{formatCurrency(related.price)}</span>
                      {/* FDL-623 / SD06 – Normalised change colour */}
                      <span className={changeTextClass(related.changePercent)}>
                        {formatPercent(related.changePercent)}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="xl:sticky xl:top-6">
            <StockCompanySidebar stock={stock} />
          </aside>
        </div>
      </div>
    </SiteHeader>
  );
}
