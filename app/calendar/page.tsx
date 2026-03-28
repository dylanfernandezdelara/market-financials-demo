"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

/* ── static mock earnings data ─────────────────────────────────────── */

type EarningsEvent = {
  symbol: string;
  date: string;
  time: "BMO" | "AMC";
};

const EARNINGS_EVENTS: EarningsEvent[] = [
  { symbol: "AAPL", date: "2026-04-24", time: "AMC" },
  { symbol: "MSFT", date: "2026-04-24", time: "AMC" },
  { symbol: "GOOGL", date: "2026-04-22", time: "AMC" },
  { symbol: "AMZN", date: "2026-04-25", time: "AMC" },
  { symbol: "META", date: "2026-04-23", time: "AMC" },
  { symbol: "TSLA", date: "2026-04-22", time: "AMC" },
  { symbol: "NVDA", date: "2026-05-28", time: "AMC" },
  { symbol: "JPM", date: "2026-04-14", time: "BMO" },
  { symbol: "V", date: "2026-04-22", time: "AMC" },
  { symbol: "AMD", date: "2026-04-29", time: "AMC" },
];

/* ── timezone helpers ──────────────────────────────────────────────── */

const TIMEZONES = [
  { label: "ET (New York)", value: "America/New_York" },
  { label: "CT (Chicago)", value: "America/Chicago" },
  { label: "MT (Denver)", value: "America/Denver" },
  { label: "PT (Los Angeles)", value: "America/Los_Angeles" },
  { label: "UTC", value: "UTC" },
  { label: "GMT (London)", value: "Europe/London" },
  { label: "CET (Berlin)", value: "Europe/Berlin" },
  { label: "JST (Tokyo)", value: "Asia/Tokyo" },
] as const;

/* ── saved-layout types ────────────────────────────────────────────── */

type SavedLayout = {
  id: string;
  name: string;
  isDefault: boolean;
};

const INITIAL_LAYOUTS: SavedLayout[] = [
  { id: "layout-1", name: "Earnings Week", isDefault: true },
  { id: "layout-2", name: "Tech Only", isDefault: false },
  { id: "layout-3", name: "Financials", isDefault: false },
];

/* ── date helpers (all string-based to avoid browser-tz drift) ──────── */

function todayIso(tz: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: tz,
  }).format(new Date());
}

function toUtcNoon(iso: string): Date {
  return new Date(iso + "T12:00:00Z");
}

function addDaysIso(iso: string, days: number): string {
  const d = toUtcNoon(iso);
  d.setUTCDate(d.getUTCDate() + days);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function startOfWeekIso(iso: string): string {
  const dow = toUtcNoon(iso).getUTCDay();
  return addDaysIso(iso, -dow);
}

function formatDateRange(weekStartIso: string, weekEndIso: string, tz: string): string {
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: tz,
  });
  return `${fmt.format(toUtcNoon(weekStartIso))} \u2013 ${fmt.format(toUtcNoon(weekEndIso))}`;
}

function formatEventDate(dateStr: string, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: tz,
  }).format(toUtcNoon(dateStr));
}

/* ── page component ────────────────────────────────────────────────── */

export default function EarningsCalendarPage() {
  const [timezone, setTimezone] = useState("America/New_York");
  const [weekStartISO, setWeekStartISO] = useState(() =>
    startOfWeekIso(todayIso("America/New_York")),
  );
  const [layouts, setLayouts] = useState<SavedLayout[]>(INITIAL_LAYOUTS);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameCancelledRef = useRef(false);

  /* ── date navigation ── */

  const goToPrevWeek = () => setWeekStartISO((prev) => addDaysIso(prev, -7));
  const goToNextWeek = () => setWeekStartISO((prev) => addDaysIso(prev, 7));
  const goToToday = () => setWeekStartISO(startOfWeekIso(todayIso(timezone)));

  /* ── filter events to current week ── */

  const weekEndISO = addDaysIso(weekStartISO, 6);

  const visibleEvents = EARNINGS_EVENTS.filter(
    (ev) => ev.date >= weekStartISO && ev.date <= weekEndISO,
  ).sort((a, b) => a.date.localeCompare(b.date));

  /* ── layout actions ── */

  const handleSetDefault = (id: string) => {
    setLayouts((prev) =>
      prev.map((l) => ({ ...l, isDefault: l.id === id })),
    );
  };

  const handleDelete = (id: string) => {
    setLayouts((prev) => {
      const remaining = prev.filter((l) => l.id !== id);
      if (remaining.length > 0 && !remaining.some((l) => l.isDefault)) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      return remaining;
    });
  };

  const startRename = (layout: SavedLayout) => {
    renameCancelledRef.current = false;
    setRenamingId(layout.id);
    setRenameValue(layout.name);
  };

  const commitRename = () => {
    if (renamingId && renameValue.trim()) {
      setLayouts((prev) =>
        prev.map((l) =>
          l.id === renamingId ? { ...l, name: renameValue.trim() } : l,
        ),
      );
    }
    setRenamingId(null);
    setRenameValue("");
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Earnings calendar</h1>
      <p className="mt-2 text-sm text-neutral-600">Upcoming reports for watchlist names.</p>

      {/* ── FDL-717: date navigation + timezone controls ── */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToPrevWeek}
            aria-label="Previous week"
            className="rounded-md border border-neutral-200 bg-white p-1.5 text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={goToNextWeek}
            aria-label="Next week"
            className="rounded-md border border-neutral-200 bg-white p-1.5 text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <span className="text-sm font-medium text-neutral-800">
          {formatDateRange(weekStartISO, weekEndISO, timezone)}
        </span>

        <button
          type="button"
          onClick={goToToday}
          className="rounded-md border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Today
        </button>

        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          aria-label="Timezone"
          className="ml-auto rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-xs text-neutral-700"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── FDL-719: earnings table with linked symbols ── */}
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-500">
            <th className="py-2">Symbol</th>
            <th className="py-2">Date</th>
            <th className="py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {visibleEvents.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-6 text-center text-neutral-400">
                No earnings events this week.
              </td>
            </tr>
          ) : (
            visibleEvents.map((event) => (
              <tr key={`${event.symbol}-${event.date}`} className="border-b border-neutral-100">
                <td className="py-3">
                  <Link
                    href={`/stocks/${event.symbol}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {event.symbol}
                  </Link>
                </td>
                <td className="py-3 text-neutral-700">
                  {formatEventDate(event.date, timezone)}
                </td>
                <td className="py-3 text-neutral-500">{event.time}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ── FDL-718: saved layouts with rename / delete / default ── */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold text-neutral-900">Saved layouts</h2>
        {layouts.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-400">No saved layouts.</p>
        ) : (
          <ul className="mt-3 divide-y divide-neutral-100">
            {layouts.map((layout) => (
              <li key={layout.id} className="flex items-center gap-3 py-2.5">
                {renamingId === layout.id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => {
                      if (renameCancelledRef.current) {
                        renameCancelledRef.current = false;
                        return;
                      }
                      commitRename();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitRename();
                      if (e.key === "Escape") {
                        renameCancelledRef.current = true;
                        setRenamingId(null);
                        setRenameValue("");
                      }
                    }}
                    className="w-40 rounded-md border border-neutral-300 px-2 py-1 text-sm text-neutral-900 outline-none focus:border-blue-400"
                  />
                ) : (
                  <span className="text-sm text-neutral-800">{layout.name}</span>
                )}

                {layout.isDefault && (
                  <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-500">
                    default
                  </span>
                )}

                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startRename(layout)}
                    aria-label={`Rename ${layout.name}`}
                    className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  {!layout.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(layout.id)}
                      aria-label={`Set ${layout.name} as default`}
                      className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-amber-500"
                    >
                      <Star className="size-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(layout.id)}
                    aria-label={`Delete ${layout.name}`}
                    className="rounded p-1 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
