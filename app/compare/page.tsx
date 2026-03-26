import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Compare symbols</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Side-by-side fundamentals and price action for up to five tickers.
      </p>
      <EmptyState
        message="Comparison workspace is not available for this account tier."
        className="mt-8"
      />
      <Link href="/" className="mt-6 inline-block text-sm text-neutral-900 underline">
        Return home
      </Link>
    </div>
  );
}
