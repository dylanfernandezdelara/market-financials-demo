/** Account-tier entitlement helpers */

export type AccountTier = "free" | "pro" | "premium";

export type Feature =
  | "compare"
  | "alerts"
  | "export"
  | "insights"
  | "research"
  | "notes";

/**
 * Map each feature to the minimum tier required to access it.
 * Features not listed here are available to all tiers.
 */
const featureMinTier: Record<Feature, AccountTier> = {
  compare: "pro",
  alerts: "pro",
  export: "pro",
  insights: "premium",
  research: "pro",
  notes: "free",
};

const tierRank: Record<AccountTier, number> = {
  free: 0,
  pro: 1,
  premium: 2,
};

/**
 * Resolve the current account tier.
 *
 * In production this would read from a session / token / database.
 * For the demo we honour the `NEXT_PUBLIC_ACCOUNT_TIER` env var so the
 * tier can be switched without code changes, defaulting to "pro".
 */
export function getAccountTier(): AccountTier {
  const raw =
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_ACCOUNT_TIER) ||
    "pro";

  if (raw === "free" || raw === "pro" || raw === "premium") {
    return raw;
  }

  return "pro";
}

/** Return `true` when the current account tier can access `feature`. */
export function hasEntitlement(feature: Feature): boolean {
  const current = getAccountTier();
  const required = featureMinTier[feature];
  return tierRank[current] >= tierRank[required];
}
