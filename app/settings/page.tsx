"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("Demo user");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/preferences")
      .then((r) => r.json())
      .then((data) => {
        if (data.displayName !== undefined) setDisplayName(data.displayName);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      });
      if (res.ok) {
        setStatus("Saved");
      } else {
        setStatus("Error saving preferences");
      }
    } catch {
      setStatus("Error saving preferences");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Account settings</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Update profile details, sessions, and data export preferences.
      </p>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-neutral-700">
          Display name
          <input
            type="text"
            name="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          Save changes
        </button>
        {status ? <p className={`mt-2 text-sm ${status === "Saved" ? "text-emerald-600" : "text-red-600"}`}>{status}</p> : null}
      </form>
      <p className="mt-6 text-sm text-neutral-500">
        <Link href="/portfolio" className="text-neutral-900 underline">
          Back to portfolio
        </Link>
      </p>
    </div>
  );
}
