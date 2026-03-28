import type { Metadata } from "next";
import Link from "next/link";

/* FDL-883 -- normalised metadata for the settings page */
export const metadata: Metadata = {
  title: "Settings",
  description:
    "Update your profile details, sessions, and data export preferences.",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Account settings</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Update profile details, sessions, and data export preferences.
      </p>
      <form className="mt-8 space-y-4">
        <label className="block text-sm font-medium text-neutral-700">
          Display name
          <input
            type="text"
            defaultValue="Demo user"
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          Save changes
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
