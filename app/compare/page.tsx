import Link from "next/link";
import { FeatureGate } from "@/components/feature-gate";
import { getAccountPlan } from "@/lib/feature-gates";

export default function ComparePage() {
  const plan = getAccountPlan();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Compare symbols</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Side-by-side fundamentals and price action for up to five tickers.
      </p>
      <FeatureGate plan={plan} feature="compare">
        <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
          Comparison workspace ready. Select up to five tickers to begin.
        </div>
      </FeatureGate>
      <Link href="/" className="mt-6 inline-block text-sm text-neutral-900 underline">
        Return home
      </Link>
    </div>
  );
}
