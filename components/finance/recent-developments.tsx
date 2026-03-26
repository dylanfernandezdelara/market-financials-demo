import Link from "next/link";
import type { RecentDevelopment } from "@/types/finance";

type RecentDevelopmentsProps = {
  developments: RecentDevelopment[];
};

export function RecentDevelopments({ developments }: RecentDevelopmentsProps) {
  return (
    <section aria-labelledby="recent-dev-heading">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="recent-dev-heading" className="text-[17px] font-semibold text-neutral-900">
          Recent Developments
        </h2>
        {developments.length > 0 && (
          <span className="text-xs text-neutral-500">Updated 1 minute ago</span>
        )}
      </div>
      {developments.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm">
          <p className="text-[15px] font-semibold text-neutral-900">No recent developments</p>
          <p className="mt-1 text-[13px] text-neutral-500">
            Check back later for the latest market updates.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {developments.map((item) => (
            <Link
              key={item.id}
              href="/"
              className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-xs text-neutral-500">{item.timeAgo}</p>
              <p className="mt-1 text-[15px] font-semibold text-neutral-900">{item.title}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">{item.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
