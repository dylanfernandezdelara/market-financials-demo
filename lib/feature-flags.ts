/**
 * Lightweight feature-flag helpers.
 *
 * Each flag is backed by a `NEXT_PUBLIC_FF_*` environment variable so it can
 * be toggled at build time or via a runtime config without code changes.
 * A flag is considered **enabled** when its env-var value is exactly `"true"`
 * (case-sensitive); every other value — including `undefined` — means disabled.
 */

function isEnabled(envVar: string | undefined): boolean {
  return envVar === "true";
}

/** Whether the side-by-side Compare workspace is available. */
export function isCompareEnabled(): boolean {
  return isEnabled(process.env.NEXT_PUBLIC_FF_COMPARE);
}
