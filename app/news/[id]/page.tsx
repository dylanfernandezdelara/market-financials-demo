import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Newspaper } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getNewsArticleById, getSearchUniverse } from "@/lib/market-data";
import { notFound } from "next/navigation";

type NewsDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getNewsArticleById(id);

  if (!article) {
    return { title: "Article not found" };
  }

  return {
    title: article.headline,
    description: article.summary,
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  const [article, searchOptions] = await Promise.all([
    getNewsArticleById(id),
    getSearchUniverse(),
  ]);

  if (!article) {
    notFound();
  }

  const sentimentColor =
    article.sentiment === "positive"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : article.sentiment === "negative"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-neutral-200 bg-neutral-50 text-neutral-600";

  return (
    <SiteHeader
      searchOptions={searchOptions}
      showMarketTabs={false}
      contentMaxWidthClass="max-w-[860px]"
    >
      <div className="pb-10">
        <nav className="flex flex-wrap items-center gap-1 text-[13px] text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">
            Market
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-neutral-400" aria-hidden />
          <span className="font-medium text-neutral-900">News</span>
        </nav>

        <article className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 text-sm text-neutral-500">
              <Newspaper className="size-4 text-amber-600" />
              {article.source}
            </div>
            <span
              className={`rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.22em] ${sentimentColor}`}
            >
              {article.sentiment}
            </span>
          </div>

          <h1 className="mt-6 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] sm:text-[2rem]">
            {article.headline}
          </h1>

          <p className="mt-2 text-sm text-neutral-500">{article.publishedAt}</p>

          <p className="mt-6 text-base leading-8 text-neutral-700">
            {article.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {article.relatedSymbols.map((symbol) => (
              <Link
                key={symbol}
                href={`/stocks/${symbol}`}
                className="inline-flex items-center rounded-full border border-[#ebebeb] bg-[#fafafa] px-3 py-1.5 font-mono text-xs font-medium text-neutral-800 transition-colors hover:border-neutral-300 hover:bg-white"
              >
                {symbol}
              </Link>
            ))}
          </div>
        </article>
      </div>
    </SiteHeader>
  );
}
