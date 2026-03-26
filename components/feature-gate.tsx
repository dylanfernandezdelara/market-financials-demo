import Link from "next/link";
import {
  type AccountPlan,
  type FeatureKey,
  hasFeature,
  minimumPlanFor,
  planLabel,
} from "@/lib/feature-gates";

type FeatureGateProps = {
  /** The current account plan. */
  plan: AccountPlan;
  /** Which feature this gate protects. */
  feature: FeatureKey;
  /** Content to render when the user has access. */
  children: React.ReactNode;
};

/**
 * Renders `children` when the active plan includes `feature`.
 * Otherwise shows a standard upgrade prompt.
 */
export function FeatureGate({ plan, feature, children }: FeatureGateProps) {
  if (hasFeature(plan, feature)) {
    return <>{children}</>;
  }

  const required = minimumPlanFor(feature);
  const requiredLabel = required ? planLabel(required) : "a higher";

  return (
    <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
      <p>
        This feature requires the{" "}
        <span className="font-semibold text-neutral-900">{requiredLabel}</span>{" "}
        plan.
      </p>
      <p className="mt-1">
        You are currently on the{" "}
        <span className="font-medium text-neutral-700">{planLabel(plan)}</span>{" "}
        plan.
      </p>
      <Link
        href="/billing"
        className="mt-4 inline-block rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
      >
        View plans
      </Link>
    </div>
  );
}
