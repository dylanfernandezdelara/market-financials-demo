/**
 * Feature-gating framework.
 *
 * Defines account plans, per-plan feature entitlements, and helpers that the
 * rest of the app can use to check access without scattering ad-hoc strings.
 *
 * The active plan is resolved once via `getAccountPlan()` so that every gate
 * in a single request evaluates against the same snapshot.
 */

// ---------------------------------------------------------------------------
// Plans
// ---------------------------------------------------------------------------

/** Supported account tiers, ordered from least to most capable. */
export type AccountPlan = "free" | "pro" | "enterprise";

/** The set of features that can be gated. */
export type FeatureKey =
  | "compare"
  | "export"
  | "reports"
  | "team"
  | "billing";

// ---------------------------------------------------------------------------
// Entitlement matrix
// ---------------------------------------------------------------------------

const entitlements: Record<AccountPlan, Set<FeatureKey>> = {
  free: new Set<FeatureKey>([]),
  pro: new Set<FeatureKey>(["compare", "export", "reports", "billing"]),
  enterprise: new Set<FeatureKey>([
    "compare",
    "export",
    "reports",
    "team",
    "billing",
  ]),
};

// ---------------------------------------------------------------------------
// Plan resolution
// ---------------------------------------------------------------------------

/**
 * Returns the current account plan.
 *
 * In this demo the plan is controlled by the `ACCOUNT_PLAN` environment
 * variable so that reviewers can test every tier without a real auth layer.
 * When a real auth/subscription backend is wired up, replace this function
 * body with the appropriate lookup.
 */
export function getAccountPlan(): AccountPlan {
  const raw = process.env.ACCOUNT_PLAN?.toLowerCase();

  if (raw === "pro" || raw === "enterprise") {
    return raw;
  }

  return "free";
}

// ---------------------------------------------------------------------------
// Access helpers
// ---------------------------------------------------------------------------

/** Whether the given plan includes access to `feature`. */
export function hasFeature(plan: AccountPlan, feature: FeatureKey): boolean {
  return entitlements[plan].has(feature);
}

/** Human-readable label for an account plan. */
export function planLabel(plan: AccountPlan): string {
  switch (plan) {
    case "free":
      return "Free";
    case "pro":
      return "Pro";
    case "enterprise":
      return "Enterprise";
  }
}

/** The minimum plan required to unlock `feature`, or `null` if ungated. */
export function minimumPlanFor(feature: FeatureKey): AccountPlan | null {
  if (entitlements.free.has(feature)) return null;
  if (entitlements.pro.has(feature)) return "pro";
  if (entitlements.enterprise.has(feature)) return "enterprise";
  return null;
}
