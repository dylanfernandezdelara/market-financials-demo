"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import {
  DEFAULT_SECTIONS,
  loadLayout,
  loadSavedLayouts,
  persistSavedLayouts,
  saveLayout,
  type HomeLayout,
  type HomeSectionEntry,
} from "@/lib/home-layout";

function subscribeLayout(callback: () => void) {
  const handler = () => callback();
  window.addEventListener("home-layout-change", handler);
  window.addEventListener("saved-layouts-change", handler);
  return () => {
    window.removeEventListener("home-layout-change", handler);
    window.removeEventListener("saved-layouts-change", handler);
  };
}
function getLayoutSnapshot(): HomeSectionEntry[] {
  return loadLayout();
}
function getLayoutServerSnapshot(): HomeSectionEntry[] {
  return DEFAULT_SECTIONS;
}
function getSavedSnapshot(): HomeLayout[] {
  return loadSavedLayouts();
}
function getSavedServerSnapshot(): HomeLayout[] {
  return [];
}
function notifyChange() {
  window.dispatchEvent(new Event("home-layout-change"));
  window.dispatchEvent(new Event("saved-layouts-change"));
}

export function SavedLayoutsManager() {
  const currentLayout = useSyncExternalStore(
    subscribeLayout,
    getLayoutSnapshot,
    getLayoutServerSnapshot,
  );
  const savedLayouts = useSyncExternalStore(
    subscribeLayout,
    getSavedSnapshot,
    getSavedServerSnapshot,
  );
  const [newName, setNewName] = useState("");

  const handleSaveCurrent = useCallback(() => {
    const name = newName.trim();
    if (!name) return;
    const current = loadLayout();
    const layout: HomeLayout = { name, sections: current };
    const existing = loadSavedLayouts();
    persistSavedLayouts([...existing, layout]);
    notifyChange();
    setNewName("");
  }, [newName]);

  const handleApply = useCallback((layout: HomeLayout) => {
    saveLayout(layout.sections);
    notifyChange();
  }, []);

  const handleDelete = useCallback((index: number) => {
    const existing = loadSavedLayouts();
    persistSavedLayouts(existing.filter((_, i) => i !== index));
    notifyChange();
  }, []);

  const handleResetToDefault = useCallback(() => {
    saveLayout(DEFAULT_SECTIONS);
    notifyChange();
  }, []);

  const visibleCount = currentLayout.filter((s) => s.visible).length;

  return (
    <div className="mt-6 space-y-6">
      {/* Current layout preview */}
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">Current layout</h2>
          <span className="text-xs text-neutral-500">
            {visibleCount} of {currentLayout.length} sections visible
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {currentLayout.map((section) => (
            <span
              key={section.id}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                section.visible
                  ? "border-neutral-200 bg-neutral-50 text-neutral-700"
                  : "border-neutral-100 bg-neutral-50/50 text-neutral-400 line-through"
              }`}
            >
              {section.visible ? (
                <Eye className="size-3" />
              ) : (
                <EyeOff className="size-3" />
              )}
              {section.label}
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-[12px] font-medium text-neutral-600 hover:bg-neutral-50"
          >
            Reset to default
          </button>
          <Link
            href="/"
            className="rounded-md border border-neutral-200 bg-neutral-900 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-neutral-800"
          >
            Customize on home
          </Link>
        </div>
      </div>

      {/* Save current layout */}
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-900">Save current layout</h2>
        <p className="mt-1 text-xs text-neutral-500">
          Save your current arrangement for quick access later.
        </p>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Layout name"
            className="flex-1 rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400"
          />
          <button
            type="button"
            onClick={handleSaveCurrent}
            disabled={!newName.trim()}
            className="rounded-md bg-neutral-900 px-4 py-1.5 text-[12px] font-medium text-white hover:bg-neutral-800 disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>

      {/* Saved layouts list */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-900">
          Saved layouts{savedLayouts.length > 0 ? ` (${savedLayouts.length})` : ""}
        </h2>
        {savedLayouts.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">
            No saved layouts yet. Save your current layout above.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {savedLayouts.map((layout, index) => {
              const layoutVisibleCount = layout.sections.filter((s) => s.visible).length;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{layout.name}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {layoutVisibleCount} of {layout.sections.length} sections visible
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleApply(layout)}
                      className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="rounded-md border border-neutral-200 bg-white p-1.5 text-neutral-400 hover:text-red-600"
                      aria-label={`Delete ${layout.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Link href="/settings" className="inline-block text-sm text-neutral-400 underline">
        Manage in settings
      </Link>
    </div>
  );
}
