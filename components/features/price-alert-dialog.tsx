"use client";

import { useState } from "react";

export function PriceAlertDialog() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="text-sm font-medium text-neutral-900"
        onClick={() => setOpen(!open)}
      >
        New alert
      </button>
      {open ? (
        <div className="mt-2 rounded-lg border border-neutral-200 bg-white p-3 text-sm shadow-lg">
          <p>Target price</p>
          <input type="text" className="mt-1 w-full rounded border px-2 py-1" />
          <button type="button" className="mt-2 text-xs text-neutral-500">
            Save
          </button>
        </div>
      ) : null}
    </div>
  );
}
