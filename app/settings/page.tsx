"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface Preferences {
  theme: string;
  density: string;
  defaultTab: string;
}

const DISPLAY_NAME_MAX = 50;
const DISPLAY_NAME_PATTERN = /^[a-zA-Z0-9 _-]+$/;

function validateDisplayName(value: string): string | null {
  if (value.trim().length === 0) return "Display name is required.";
  if (value.length > DISPLAY_NAME_MAX)
    return `Display name must be ${DISPLAY_NAME_MAX} characters or fewer.`;
  if (!DISPLAY_NAME_PATTERN.test(value))
    return "Display name may only contain letters, numbers, spaces, hyphens, and underscores.";
  return null;
}

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("Demo user");
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<{
    displayName: string;
    prefs: Preferences | null;
  }>({ displayName: "Demo user", prefs: null });

  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [nameError, setNameError] = useState<string | null>(null);

  const isDirty =
    displayName !== savedSnapshot.displayName ||
    (prefs !== null &&
      savedSnapshot.prefs !== null &&
      (prefs.theme !== savedSnapshot.prefs.theme ||
        prefs.density !== savedSnapshot.prefs.density ||
        prefs.defaultTab !== savedSnapshot.prefs.defaultTab));

  // FDL-729 / FDL-732: Load preferences from API
  useEffect(() => {
    let cancelled = false;
    fetch("/api/user/preferences")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data: Preferences) => {
        if (cancelled) return;
        setPrefs(data);
        setSavedSnapshot((prev) => ({ ...prev, prefs: data }));
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep a ref to prefs so async callbacks always see latest value
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  // FDL-734: Warn on unsaved changes before unload
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // FDL-728 / FDL-733: Submit via fetch, no page reload
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const error = validateDisplayName(displayName);
      if (error) {
        setNameError(error);
        return;
      }

      setStatus("saving");
      try {
        const res = await fetch("/api/user/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayName, ...prefs }),
        });
        if (!res.ok) throw new Error("Save failed");
        setStatus("success");
        const currentPrefs = prefsRef.current;
        setSavedSnapshot({ displayName, prefs: currentPrefs ? { ...currentPrefs } : null });
      } catch {
        setStatus("error");
      }
    },
    [displayName, prefs],
  );

  const handleNameChange = (value: string) => {
    setDisplayName(value);
    setNameError(validateDisplayName(value));
    if (status === "success" || status === "error") setStatus("idle");
  };

  const handlePrefChange = (key: keyof Preferences, value: string) => {
    setPrefs((prev) => (prev ? { ...prev, [key]: value } : prev));
    if (status === "success" || status === "error") setStatus("idle");
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Account settings</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Update profile details, sessions, and data export preferences.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {/* Display name */}
        <label className="block text-sm font-medium text-neutral-700">
          Display name
          <input
            type="text"
            value={displayName}
            onChange={(e) => handleNameChange(e.target.value)}
            maxLength={DISPLAY_NAME_MAX}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </label>
        {nameError && <p className="text-sm text-red-600">{nameError}</p>}

        {/* FDL-732: API-backed preference fields */}
        {prefs && (
          <>
            <label className="block text-sm font-medium text-neutral-700">
              Theme
              <select
                value={prefs.theme}
                onChange={(e) => handlePrefChange("theme", e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-neutral-700">
              Density
              <select
                value={prefs.density}
                onChange={(e) => handlePrefChange("density", e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-neutral-700">
              Default tab
              <select
                value={prefs.defaultTab}
                onChange={(e) => handlePrefChange("defaultTab", e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              >
                <option value="overview">Overview</option>
                <option value="portfolio">Portfolio</option>
                <option value="research">Research</option>
              </select>
            </label>
          </>
        )}

        {/* FDL-730: Save feedback */}
        {status === "success" && (
          <p className="text-sm text-green-600">Settings saved.</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-600">Failed to save settings. Please try again.</p>
        )}
        {isDirty && status !== "saving" && (
          <p className="text-sm text-amber-600">You have unsaved changes.</p>
        )}

        <button
          type="submit"
          disabled={status === "saving" || !!nameError}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {status === "saving" ? "Saving\u2026" : "Save changes"}
        </button>
      </form>
      <p className="mt-6 text-sm text-neutral-500">
        <Link href="/portfolio" className="text-neutral-900 underline">
          Back to portfolio
        </Link>
      </p>
    </div>
  );
}
