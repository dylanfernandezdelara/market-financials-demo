import { Dot } from "lucide-react";
import { MarketIndex } from "@/types/finance";
import { changeToneClasses, formatPercent } from "@/lib/utils";

type MarketTickerStripProps = {
  indices: MarketIndex[];
};

export function MarketTickerStrip({ indices }: MarketTickerStripProps) {
  return (
    <div className="overflow-hidden rounded-[30px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,250,242,0.82),rgba(232,241,249,0.82))] px-4 py-3 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:px-6">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        <div className="mr-4 inline-flex items-center rounded-full border border-slate-200/80 bg-white/85 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-slate-600">
          Session tape
        </div>
        {indices.map((index) => (
          <div
            key={index.symbol}
            className="inline-flex min-w-[190px] items-center gap-2 rounded-full border border-slate-200/70 bg-white/78 px-3 py-2"
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                {index.symbol}
              </p>
              <p className="text-sm font-semibold text-slate-950">{index.displayValue}</p>
            </div>
            <Dot className="size-4 text-slate-300" />
            <p className={`text-sm font-medium ${changeToneClasses(index.changePercent)}`}>
              {formatPercent(index.changePercent)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
