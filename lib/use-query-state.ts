"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Reusable hook that syncs a single query-string parameter with component
 * state.  When the parameter is absent from the URL the provided
 * `defaultValue` is returned; calling the setter updates the URL
 * (via `router.replace`) so the value is shareable / bookmark-able.
 *
 * Works for tabs, ranges, or any discrete string value that should be
 * persisted in the query string.
 */
export function useQueryState<T extends string>(
  key: string,
  defaultValue: T,
  validValues?: readonly T[],
): [T, (value: T) => void] {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const raw = searchParams.get(key);
  const value =
    raw !== null && (!validValues || validValues.includes(raw as T))
      ? (raw as T)
      : defaultValue;

  const setValue = useCallback(
    (next: T) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next === defaultValue) {
        params.delete(key);
      } else {
        params.set(key, next);
      }

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router, key, defaultValue],
  );

  return [value, setValue];
}
