/* FDL-632 / SD15 – Loading skeleton for the stock-detail hero area */
export default function StockDetailLoading() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-8">
      <div className="animate-pulse space-y-6">
        {/* Back link skeleton */}
        <div className="h-4 w-28 rounded bg-neutral-200" />

        {/* Breadcrumb skeleton */}
        <div className="h-4 w-40 rounded bg-neutral-100" />

        {/* Title area skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-64 rounded bg-neutral-200" />
          <div className="h-4 w-48 rounded bg-neutral-100" />
        </div>

        {/* Tab strip skeleton */}
        <div className="flex gap-2 border-b border-neutral-200 pb-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-5 w-20 rounded bg-neutral-100" />
          ))}
        </div>

        {/* Price hero skeleton */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-32 rounded-xl bg-neutral-100" />
          <div className="h-32 rounded-xl bg-neutral-100" />
        </div>

        {/* Chart area skeleton */}
        <div className="h-72 rounded-xl bg-neutral-100" />
      </div>
    </div>
  );
}
