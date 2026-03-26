"use client";

import { useEffect, useState } from "react";

const LOCALE_OPTIONS = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "de-DE", label: "Deutsch" },
  { value: "fr-FR", label: "Francais" },
  { value: "ja-JP", label: "Japanese" },
  { value: "zh-CN", label: "Chinese (Simplified)" },
];

const TIMEZONE_OPTIONS = [
  { value: "America/New_York", label: "Eastern (ET)" },
  { value: "America/Chicago", label: "Central (CT)" },
  { value: "America/Denver", label: "Mountain (MT)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
];

const DENSITY_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
];

export function PreferencesForm() {
  const [locale, setLocale] = useState("en-US");
  const [timezone, setTimezone] = useState("America/New_York");
  const [density, setDensity] = useState("comfortable");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/user/preferences")
      .then((res) => res.json())
      .then((data: { locale?: string; timezone?: string; density?: string }) => {
        if (data.locale) setLocale(data.locale);
        if (data.timezone) setTimezone(data.timezone);
        if (data.density) setDensity(data.density);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, timezone, density }),
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return <p className="text-sm text-neutral-400">Loading preferences\u2026</p>;
  }

  const selectClasses =
    "mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm bg-white";

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-neutral-700">
        Locale
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className={selectClasses}
        >
          {LOCALE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-neutral-700">
        Timezone
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className={selectClasses}
        >
          {TIMEZONE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-neutral-700">
        Display density
        <select
          value={density}
          onChange={(e) => setDensity(e.target.value)}
          className={selectClasses}
        >
          {DENSITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? "Saving\u2026" : "Save preferences"}
      </button>

      {saved ? (
        <p className="text-sm text-emerald-600">Preferences saved.</p>
      ) : null}
    </div>
  );
}
