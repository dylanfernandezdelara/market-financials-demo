"use client";

import { useState } from "react";

const FREQUENCIES = ["daily", "weekly", "monthly", "quarterly"] as const;
const FORMATS = ["pdf", "csv", "html"] as const;

export function ReportScheduleForm() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        onClick={() => setOpen(!open)}
      >
        New schedule
      </button>
      {open ? (
        <div className="mt-3 rounded-lg border border-neutral-200 bg-white p-4 text-sm shadow-lg">
          <label className="block font-medium text-neutral-700">
            Report name
            <input
              type="text"
              placeholder="e.g. Weekly portfolio summary"
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="mt-3 block font-medium text-neutral-700">
            Frequency
            <select className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm">
              {FREQUENCIES.map((freq) => (
                <option key={freq} value={freq}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block font-medium text-neutral-700">
            Format
            <select className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm">
              {FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block font-medium text-neutral-700">
            Recipients
            <input
              type="text"
              placeholder="email@example.com"
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
          </label>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white"
            >
              Create
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-sm text-neutral-500"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
