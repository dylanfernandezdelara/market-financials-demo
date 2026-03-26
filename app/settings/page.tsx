"use client";

import { useState } from "react";
import Link from "next/link";

const DEFAULTS = {
  displayName: "Demo user",
};

export default function SettingsPage() {
  const [resetKey, setResetKey] = useState(0);

  function handleReset() {
    setResetKey((k) => k + 1);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Account settings</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Update profile details, sessions, and data export preferences.
      </p>
      <form key={resetKey} className="mt-8 space-y-4">
        <label className="block text-sm font-medium text-neutral-700">
          Display name
          <input
            type="text"
            defaultValue={DEFAULTS.displayName}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
          >
            Save changes
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Reset to defaults
          </button>
        </div>
      </form>
      <p className="mt-6 text-sm text-neutral-500">
        <Link href="/portfolio" className="text-neutral-900 underline">
          Back to portfolio
        </Link>
      </p>
    </div>
  );
}
