import { MarketIndex } from "@/types/finance";
import { changeToneClasses, formatPercent } from "@/lib/utils";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SectionHeader } from "@/components/ui/section-header";

type MarketSnapshotGridProps = {
  indices: MarketIndex[];
};

export function MarketSnapshotGrid({ indices }: MarketSnapshotGridProps) {
  return (
    <SurfaceCard className="h-full">
      <SectionHeader
        eyebrow="Macro board"
        title="Session snapshot"
        description="A quick scan across indices, volatility, and rates with a tighter market-terminal feel."
      />
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-2">
        {indices.map((index) => (
          <div
            key={index.symbol}
            className="rounded-[26px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(243,247,251,0.82))] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                  {index.symbol}
                </p>
                <h3 className="mt-2 text-sm font-medium text-slate-700">{index.name}</h3>
              </div>
              <div
                className={`rounded-full border px-2.5 py-1 font-mono text-[11px] ${index.changePercent >= 0 ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}
              >
                {formatPercent(index.changePercent)}
              </div>
            </div>
            <p className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              {index.displayValue}
            </p>
            <div className="mt-4 flex items-center justify-between gap-4 text-sm">
              <p className={`font-medium ${changeToneClasses(index.changePercent)}`}>
                {index.displayChange}
              </p>
              <p className="text-slate-500">Range {index.sessionRange}</p>
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
