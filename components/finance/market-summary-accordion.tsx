"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { MarketSummaryBlock } from "@/types/finance";

type MarketSummaryAccordionProps = {
  summary: MarketSummaryBlock;
};

export function MarketSummaryAccordion({ summary }: MarketSummaryAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  const items: { title: string; body?: string }[] = [
    { title: summary.headline, body: summary.bullets[0] ?? "" },
    ...summary.bullets.slice(1).map((title) => ({ title })),
  ];

  return (
    <section id="market-summary" className="scroll-mt-28" aria-labelledby="market-summary-heading">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="market-summary-heading" className="text-[17px] font-semibold text-[#1a1a1a]">
          Market Summary
        </h2>
        <span className="text-xs text-neutral-500">{summary.updatedLabel}</span>
      </div>
      <div className="overflow-hidden rounded-lg border border-[#ebebeb] bg-white shadow-sm">
        <div className="divide-y divide-[#ebebeb]">
          {items.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-neutral-50/80"
                >
                  <span className="min-w-0 flex-1 text-[15px] font-semibold leading-snug text-[#1a1a1a]">
                    {item.title}
                  </span>
                  {open ? (
                    <ChevronUp className="size-4 shrink-0 text-neutral-400" aria-hidden />
                  ) : (
                    <ChevronDown className="size-4 shrink-0 text-neutral-400" aria-hidden />
                  )}
                </button>
                {open && item.body ? (
                  <div className="border-t border-[#f0f0f0] px-4 pb-4">
                    <p className="pt-2 text-[13px] leading-relaxed text-neutral-600">{item.body}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 border-t border-[#ebebeb] px-4 py-3">
          <div className="flex -space-x-1">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="inline-block size-5 rounded-full border border-white bg-gradient-to-br from-neutral-200 to-neutral-300"
              />
            ))}
          </div>
          <span className="rounded-full border border-[#ebebeb] bg-[#fafafa] px-2.5 py-1 text-[11px] font-medium text-neutral-600">
            {summary.sourceCount} sources
          </span>
        </div>
      </div>
    </section>
  );
}
