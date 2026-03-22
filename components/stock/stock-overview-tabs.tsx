"use client";

const tabs = [
  "Overview",
  "Financials",
  "Holders",
  "Predictions",
  "Historical Data",
  "Analysis",
] as const;

export function StockOverviewTabs() {
  return (
    <div className="border-b border-[#ebebeb]">
      <nav className="flex flex-wrap gap-1" aria-label="Stock sections">
        {tabs.map((label) => {
          const active = label === "Overview";
          return (
            <button
              key={label}
              type="button"
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
  );
}
