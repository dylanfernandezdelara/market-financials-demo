import { Newspaper } from "lucide-react";
import { NewsArticle } from "@/types/finance";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SectionHeader } from "@/components/ui/section-header";

type NewsFeedCardProps = {
  news: NewsArticle[];
};

function sentimentTone(sentiment: NewsArticle["sentiment"]) {
  if (sentiment === "positive") {
    return "border-emerald-300 bg-emerald-50 text-emerald-700";
  }

  if (sentiment === "negative") {
    return "border-rose-300 bg-rose-50 text-rose-700";
  }

  return "border-slate-300 bg-slate-100 text-slate-600";
}

export function NewsFeedCard({ news }: NewsFeedCardProps) {
  const [leadArticle, ...remainingArticles] = news;
  const sideArticles = remainingArticles;

  return (
    <SurfaceCard className="bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(245,249,253,0.88))]">
      <SectionHeader
        eyebrow="News"
        title="Market headlines"
        description="Mock editorial coverage connected to the current symbol universe."
      />
      <div className="mt-5 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        {leadArticle ? (
          <article
            key={leadArticle.id}
            className="rounded-[30px] border border-slate-900/10 bg-[linear-gradient(180deg,#0f172a,#1b2c40)] p-6 text-white shadow-[0_18px_48px_rgba(15,23,42,0.24)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-sm text-slate-300">
                <Newspaper className="size-4 text-amber-300" />
                {leadArticle.source}
              </div>
              <span
                className={`rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.22em] ${sentimentTone(leadArticle.sentiment)}`}
              >
                {leadArticle.sentiment}
              </span>
            </div>
            <h3 className="mt-6 max-w-xl text-3xl font-semibold tracking-[-0.04em] text-white">
              {leadArticle.headline}
            </h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              {leadArticle.summary}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-400">{leadArticle.publishedAt}</p>
              <div className="flex flex-wrap gap-2">
                {leadArticle.relatedSymbols.map((symbol) => (
                  <span
                    key={`${leadArticle.id}-${symbol}`}
                    className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-slate-200"
                  >
                    {symbol}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ) : null}
        <div className="grid gap-4">
          {sideArticles.map((article) => (
            <article
              key={article.id}
              className="rounded-[24px] border border-white/70 bg-white/78 p-5 shadow-[0_14px_36px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                  <Newspaper className="size-4 text-amber-600" />
                  {article.source}
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.22em] ${sentimentTone(article.sentiment)}`}
                >
                  {article.sentiment}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
                {article.headline}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{article.summary}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">{article.publishedAt}</p>
                <div className="flex flex-wrap gap-2">
                  {article.relatedSymbols.map((symbol) => (
                    <span
                      key={`${article.id}-${symbol}`}
                      className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs text-slate-600"
                    >
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SurfaceCard>
  );
}
