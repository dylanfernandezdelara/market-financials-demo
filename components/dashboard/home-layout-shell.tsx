"use client";

import { useCallback, useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowUp, ArrowDown, Eye, EyeOff, Settings, X } from "lucide-react";
import Link from "next/link";
import {
  DEFAULT_SECTIONS,
  loadLayout,
  saveLayout,
  type HomeSectionEntry,
  type HomeSectionId,
} from "@/lib/home-layout";

type HomeSectionMap = Record<HomeSectionId, ReactNode>;

type HomeLayoutShellProps = {
  sectionMap: HomeSectionMap;
};

function subscribeLayout(callback: () => void) {
  const handler = () => {
    callback();
  };
  window.addEventListener("home-layout-change", handler);
  return () => window.removeEventListener("home-layout-change", handler);
}
function getLayoutSnapshot(): HomeSectionEntry[] {
  return loadLayout();
}
function getLayoutServerSnapshot(): HomeSectionEntry[] {
  return DEFAULT_SECTIONS;
}
function notifyLayoutChange() {
  window.dispatchEvent(new Event("home-layout-change"));
}

export function HomeLayoutShell({ sectionMap }: HomeLayoutShellProps) {
  const sections = useSyncExternalStore(
    subscribeLayout,
    getLayoutSnapshot,
    getLayoutServerSnapshot,
  );
  const [editing, setEditing] = useState(false);

  const persist = useCallback((next: HomeSectionEntry[]) => {
    saveLayout(next);
    notifyLayoutChange();
  }, []);

  const moveSection = useCallback(
    (index: number, direction: -1 | 1) => {
      const current = loadLayout();
      const target = index + direction;
      if (target < 0 || target >= current.length) return;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      persist(next);
    },
    [persist],
  );

  const toggleVisibility = useCallback(
    (index: number) => {
      const current = loadLayout();
      const next = current.map((s, i) =>
        i === index ? { ...s, visible: !s.visible } : s,
      );
      persist(next);
    },
    [persist],
  );

  const resetLayout = useCallback(() => {
    persist(DEFAULT_SECTIONS);
  }, [persist]);

  const displaySections = sections;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-2">
          {editing && (
            <button
              type="button"
              onClick={resetLayout}
              className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-[12px] font-medium text-neutral-600 shadow-sm hover:bg-neutral-50"
            >
              Reset to default
            </button>
          )}
          <button
            type="button"
            onClick={() => setEditing((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-[12px] font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
          >
            {editing ? (
              <>
                <X className="size-3.5" />
                Done
              </>
            ) : (
              <>
                <Settings className="size-3.5" />
                Customize
              </>
            )}
          </button>
          <Link
            href="/saved"
            className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-[12px] font-medium text-neutral-600 shadow-sm hover:bg-neutral-50"
          >
            Saved layouts
          </Link>
        </div>
      </div>

      {editing ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-[13px] font-medium text-neutral-700">
            Use arrows to reorder sections or toggle their visibility.
          </p>
          <div className="flex flex-col gap-1">
            {displaySections.map((section, index) => (
              <div
                key={section.id}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 ${
                  section.visible
                    ? "border-neutral-200 bg-white"
                    : "border-neutral-100 bg-neutral-50 opacity-60"
                }`}
              >
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveSection(index, -1)}
                    disabled={index === 0}
                    className="rounded p-0.5 text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                    aria-label={`Move ${section.label} up`}
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(index, 1)}
                    disabled={index === displaySections.length - 1}
                    className="rounded p-0.5 text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                    aria-label={`Move ${section.label} down`}
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                </div>
                <span className="flex-1 text-[13px] font-medium text-neutral-800">
                  {section.label}
                </span>
                <button
                  type="button"
                  onClick={() => toggleVisibility(index)}
                  className="rounded p-0.5 text-neutral-400 hover:text-neutral-700"
                  aria-label={
                    section.visible
                      ? `Hide ${section.label}`
                      : `Show ${section.label}`
                  }
                >
                  {section.visible ? (
                    <Eye className="size-4" />
                  ) : (
                    <EyeOff className="size-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {displaySections
        .filter((s) => s.visible)
        .map((section) => (
          <div key={section.id}>{sectionMap[section.id]}</div>
        ))}
    </div>
  );
}
