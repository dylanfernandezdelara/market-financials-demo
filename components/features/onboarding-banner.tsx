"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  BarChart3,
  BriefcaseBusiness,
  Lightbulb,
  Search,
  X,
} from "lucide-react";

const STORAGE_KEY = "finance-demo-onboarding-dismissed";

const steps = [
  {
    icon: BarChart3,
    title: "Explore the market",
    description:
      "The dashboard shows top assets, market summaries, and sector performance — all powered by mock data.",
  },
  {
    icon: Search,
    title: "Search any symbol",
    description:
      "Use the search bar to look up stocks, ETFs, and crypto by ticker or company name.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Review your portfolio",
    href: "/portfolio",
    description:
      "View holdings, sector exposure, and performance trends on the Portfolio page.",
  },
  {
    icon: Lightbulb,
    title: "Check insights",
    href: "/insights",
    description:
      "Dive into rolling metrics and analytical calculations in the Insights section.",
  },
];

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "1";
}

function getServerSnapshot(): boolean {
  return true;
}

export function OnboardingBanner() {
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "1");
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  }, []);

  if (dismissed) {
    return null;
  }

  return (
    <section
      aria-label="Getting started"
      className="relative overflow-hidden rounded-xl border border-teal-200/60 bg-gradient-to-br from-teal-50/80 via-white to-sky-50/60 p-5 shadow-sm sm:p-6"
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss onboarding guide"
        className="absolute right-3 top-3 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
      >
        <X className="size-4" />
      </button>

      <div className="space-y-4">
        <div>
          <p className="text-[15px] font-semibold text-[#1a1a1a]">
            Welcome to the Finance Demo
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-neutral-600">
            This is a local-first financial dashboard for exploring market data,
            portfolios, and research workflows. Here are a few things to try:
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const content = (
              <>
                <div className="flex size-9 items-center justify-center rounded-lg bg-teal-100/70 text-teal-700">
                  <step.icon className="size-4" />
                </div>
                <p className="text-[13px] font-medium text-[#1a1a1a]">
                  {step.title}
                </p>
                <p className="text-[12px] leading-relaxed text-neutral-500">
                  {step.description}
                </p>
              </>
            );

            if (step.href) {
              return (
                <Link
                  key={step.title}
                  href={step.href}
                  className="flex flex-col gap-2 rounded-lg border border-neutral-200/80 bg-white/70 p-3 transition-colors hover:border-teal-300 hover:bg-white"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={step.title}
                className="flex flex-col gap-2 rounded-lg border border-neutral-200/80 bg-white/70 p-3"
              >
                {content}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            Got it, dismiss
          </button>
        </div>
      </div>
    </section>
  );
}
