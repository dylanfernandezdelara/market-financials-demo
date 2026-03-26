"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";

const tabs = [
  { key: "overview" as const, label: "Overview" },
  { key: "financials" as const, label: "Financials" },
  { key: "holders" as const, label: "Holders" },
  { key: "predictions" as const, label: "Predictions" },
  { key: "historical-data" as const, label: "Historical Data" },
  { key: "analysis" as const, label: "Analysis" },
];

export function StockOverviewTabs() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("overview");

  return (
    <SegmentedControl
      items={tabs}
      value={tab}
      onValueChange={setTab}
      variant="underline"
      ariaLabel="Stock sections"
    />
  );
}
