import Link from "next/link";
import type { PoliticianTrade } from "@/types/finance";

type PoliticiansPanelProps = {
  trades: PoliticianTrade[];
};

const partyColor: Record<PoliticianTrade["party"], string> = {
  D: "bg-blue-100 text-blue-700",
  R: "bg-red-100 text-red-700",
  I: "bg-neutral-100 text-neutral-700",
};

const tradeTypeClass: Record<PoliticianTrade["tradeType"], string> = {
  Buy: "text-emerald-600",
  Sell: "text-red-600",
};

export function PoliticiansPanel({ trades }: PoliticiansPanelProps) {
  return (
    <section id="politicians" className="scroll-mt-28" aria-labelledby="politicians-heading">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="politicians-heading" className="text-[17px] font-semibold text-neutral-900">
          Politician Trades
        </h2>
        <span className="text-xs text-neutral-500">Source: Congressional disclosures</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {trades.map((trade) => (
          <Link
            key={trade.id}
            href={`/stocks/${trade.symbol}`}
            className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-xs font-semibold text-neutral-700">
                {trade.symbol.slice(0, 1)}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="truncate text-[13px] font-semibold text-neutral-900">
                    {trade.politician}
                  </p>
                  <span
                    className={`inline-flex shrink-0 rounded px-1 py-0.5 text-[10px] font-semibold leading-none ${partyColor[trade.party]}`}
                  >
                    {trade.party}
                  </span>
                  <span className="text-[11px] text-neutral-400">{trade.chamber}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-neutral-500">
                  <span className={`font-medium ${tradeTypeClass[trade.tradeType]}`}>
                    {trade.tradeType}
                  </span>
                  {" "}
                  {trade.symbol} · {trade.companyName} · {trade.estimatedAmount}
                </p>
              </div>
            </div>
            <span className="shrink-0 text-right text-xs text-neutral-500">
              {trade.daysAgo}d ago
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
