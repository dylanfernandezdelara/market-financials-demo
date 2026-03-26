import { cacheLife } from "next/cache";
import Link from "next/link";

export default async function ComparePage() {
  "use cache";
  cacheLife("max");
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Compare symbols</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Side-by-side fundamentals and price action for up to five tickers.
      </p>
      <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
        Comparison workspace is not available for this account tier.
      </div>
      <Link href="/" className="mt-6 inline-block text-sm text-neutral-900 underline">
        Return home
      </Link>
    </div>
  );
}
