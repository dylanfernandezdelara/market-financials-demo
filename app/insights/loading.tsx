export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded bg-neutral-100" />
      <div className="mt-4 h-4 w-32 animate-pulse rounded bg-neutral-100" />
      <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border-b border-neutral-100 px-2 py-1"
          >
            <div className="h-3.5 w-full animate-pulse rounded bg-neutral-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
