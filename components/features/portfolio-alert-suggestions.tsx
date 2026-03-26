import Link from "next/link";
import { AlertTriangle, TrendingUp } from "lucide-react";
import type { AlertSuggestion } from "@/types/finance";

type PortfolioAlertSuggestionsProps = {
  suggestions: AlertSuggestion[];
};

const reasonIcon = {
  concentration: AlertTriangle,
  fast_mover: TrendingUp,
} as const;

const reasonLabel = {
  concentration: "Concentrated",
  fast_mover: "Fast mover",
} as const;

export function PortfolioAlertSuggestions({
  suggestions,
}: PortfolioAlertSuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-neutral-700">
        Suggested alerts from your portfolio
      </h2>
      <ul className="space-y-2">
        {suggestions.map((suggestion) => {
          const Icon = reasonIcon[suggestion.reason];
          const label = reasonLabel[suggestion.reason];

          return (
            <li
              key={`${suggestion.symbol}-${suggestion.reason}`}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 rounded-lg border border-amber-200 bg-amber-50 p-1.5 text-amber-600">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/stocks/${suggestion.symbol}`}
                      className="font-mono text-sm font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-900"
                    >
                      {suggestion.symbol}
                    </Link>
                    <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-500">
                      {label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-neutral-800">
                    {suggestion.headline}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-neutral-500">
                    {suggestion.detail}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
