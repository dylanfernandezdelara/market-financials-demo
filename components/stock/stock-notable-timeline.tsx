import type { NewsArticle } from "@/types/finance";
import { SourceAvatarStack } from "@/components/ui/source-avatar-stack";

type StockNotableTimelineProps = {
  articles: NewsArticle[];
};

export function StockNotableTimeline({ articles }: StockNotableTimelineProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[17px] font-semibold text-[#1a1a1a]">Notable price movement</h2>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
          Market narrative
        </span>
      </div>
      <div className="relative mt-6 border-l border-[#e5e5e5] pl-6">
        {articles.map((article, index) => (
          <article key={article.id} className="relative pb-10 last:pb-0">
            <span
              className="absolute -left-[29px] top-1.5 size-2.5 rounded-full border-2 border-white bg-neutral-400 shadow"
              aria-hidden
            />
            <p className="text-[12px] font-medium text-neutral-500">{article.publishedAt}</p>
            <h3 className="mt-1 text-[15px] font-semibold leading-snug text-[#1a1a1a]">
              {article.headline}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">{article.summary}</p>
            <p className="mt-2 text-[11px] text-neutral-400">{article.source}</p>
            {index === 0 ? (
              <div className="mt-3">
                <SourceAvatarStack count={3} />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
