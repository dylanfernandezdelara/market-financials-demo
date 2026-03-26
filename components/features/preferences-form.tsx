"use client";

import { useEffect, useState } from "react";

type Preferences = {
  theme: string;
  density: string;
  defaultTab: string;
};

const themeOptions = ["light", "dark", "system"] as const;
const densityOptions = ["comfortable", "compact"] as const;
const tabOptions = ["overview", "portfolio", "markets"] as const;

export function PreferencesForm() {
  const [prefs, setPrefs] = useState<Preferences>({
    theme: "light",
    density: "comfortable",
    defaultTab: "overview",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/user/preferences")
      .then((r) => r.json())
      .then((data: Preferences) => setPrefs(data))
      .catch(() => {});
  }, []);

  function handleChange(key: keyof Preferences, value: string) {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
    } finally {
      setSaving(false);
    }
  }

  const selectClass =
    "mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm bg-white";

  return (
    <form onSubmit={handleSave} className="mt-8 space-y-4">
      <label className="block text-sm font-medium text-neutral-700">
        Theme
        <select
          value={prefs.theme}
          onChange={(e) => handleChange("theme", e.target.value)}
          className={selectClass}
        >
          {themeOptions.map((o) => (
            <option key={o} value={o}>
              {o.charAt(0).toUpperCase() + o.slice(1)}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-neutral-700">
        Density
        <select
          value={prefs.density}
          onChange={(e) => handleChange("density", e.target.value)}
          className={selectClass}
        >
          {densityOptions.map((o) => (
            <option key={o} value={o}>
              {o.charAt(0).toUpperCase() + o.slice(1)}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-neutral-700">
        Default tab
        <select
          value={prefs.defaultTab}
          onChange={(e) => handleChange("defaultTab", e.target.value)}
          className={selectClass}
        >
          {tabOptions.map((o) => (
            <option key={o} value={o}>
              {o.charAt(0).toUpperCase() + o.slice(1)}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? "Saving\u2026" : "Save preferences"}
      </button>
    </form>
  );
}
