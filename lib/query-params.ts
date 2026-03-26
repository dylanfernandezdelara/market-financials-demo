import { type NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Core: typed extractors for URLSearchParams pulled from a NextRequest
// ---------------------------------------------------------------------------

/**
 * Return a single search-param as a trimmed string, or `fallback` when the
 * key is absent / blank.
 */
export function parseString(
  request: NextRequest,
  key: string,
  fallback: string = "",
): string {
  const raw = request.nextUrl.searchParams.get(key);
  const trimmed = raw?.trim();
  return trimmed || fallback;
}

/**
 * Return a single search-param parsed as a finite number, or `fallback` when
 * the key is absent or the value is not a valid number.
 */
export function parseNumber(
  request: NextRequest,
  key: string,
  fallback: number | undefined = undefined,
): number | undefined {
  const raw = request.nextUrl.searchParams.get(key);
  if (raw === null) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Return a single search-param parsed as a finite integer, or `fallback` when
 * the key is absent or the value is not a valid integer.
 */
export function parseInteger(
  request: NextRequest,
  key: string,
  fallback: number | undefined = undefined,
): number | undefined {
  const raw = request.nextUrl.searchParams.get(key);
  if (raw === null) return fallback;
  const parsed = Number(raw);
  return Number.isInteger(parsed) ? parsed : fallback;
}

/**
 * Return a search-param parsed as a boolean.
 * Treats `"true"`, `"1"`, and `"yes"` (case-insensitive) as `true`;
 * everything else (including absent keys) returns `fallback`.
 */
export function parseBoolean(
  request: NextRequest,
  key: string,
  fallback: boolean = false,
): boolean {
  const raw = request.nextUrl.searchParams.get(key);
  if (raw === null) return fallback;
  return ["true", "1", "yes"].includes(raw.trim().toLowerCase());
}

/**
 * Split a comma-separated search-param into a trimmed, non-empty string
 * array. Returns an empty array when the key is absent.
 */
export function parseCommaSeparated(
  request: NextRequest,
  key: string,
): string[] {
  const raw = request.nextUrl.searchParams.get(key) ?? "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Validate that a string value is one of the allowed literal values.
 * Returns the value when valid, or `fallback` otherwise.
 */
export function parseEnum<T extends string>(
  request: NextRequest,
  key: string,
  allowed: readonly T[],
  fallback: T,
): T {
  const raw = request.nextUrl.searchParams.get(key);
  if (raw === null) return fallback;
  const trimmed = raw.trim() as T;
  return allowed.includes(trimmed) ? trimmed : fallback;
}
