"use client";

import { type ReactNode, useState } from "react";

const tabs = [
  "Overview",
  "Financials",
  "Holders",
  "Predictions",
  "Historical Data",
  "Analysis",
] as const;

type Tab = (typeof tabs)[number];

type StockOverviewTabsProps = {
  children: ReactNode;
};

const placeholders: Record<Exclude<Tab, "Overview">, string> = {
  Financials: "Income statements, balance sheets and cash-flow data will appear here.",
  Holders: "Institutional and insider ownership details will appear here.",
  Predictions: "Analyst price targets and consensus estimates will appear here.",
  "Historical Data": "End-of-day price and volume history will appear here.",
  Analysis: "Technical indicators and peer comparison will appear here.",
};

export function StockOverviewTabs({ children }: StockOverviewTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  return (
    <div>
      <div className="border-b border-[#ebebeb]">
        <nav className="flex flex-wrap gap-1" aria-label="Stock sections">
          {tabs.map((label) => {
            const active = label === activeTab;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setActiveTab(label)}
                className={`relative px-3 pb-2.5 pt-1 text-[13px] font-medium transition-colors ${
                  active ? "text-[#1a1a1a]" : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {label}
                {active ? (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#1a1a1a]" />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === "Overview" ? (
        children
      ) : (
        <div className="mt-6 rounded-xl border border-[#ebebeb] bg-white px-6 py-10 text-center">
          <p className="text-[15px] font-semibold text-[#1a1a1a]">{activeTab}</p>
          <p className="mt-2 text-[13px] text-neutral-500">
            {placeholders[activeTab]}
          </p>
        </div>
      )}
    </div>
  );
}
