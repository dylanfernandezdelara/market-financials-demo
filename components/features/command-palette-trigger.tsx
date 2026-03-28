"use client";

import { Command } from "lucide-react";

export function CommandPaletteTrigger() {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", { key: "k", metaKey: true }),
        );
      }}
      className="hidden items-center gap-1.5 rounded-lg border border-[#e5e5e5] bg-white px-2.5 py-1.5 text-[12px] text-neutral-500 shadow-sm transition-colors hover:bg-neutral-50 sm:inline-flex"
      aria-label="Open command palette"
    >
      <Command className="size-3" />
      <span className="font-medium">K</span>
    </button>
  );
}
