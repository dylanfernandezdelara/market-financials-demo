import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TopMover } from "@/types/finance";
import { formatCurrency } from "@/lib/utils";
import { ChangePill } from "@/components/ui/change-pill";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";

type TopMoversCardProps = {
  movers: TopMover[];
};

export function TopMoversCard({ movers }: TopMoversCardProps) {
  return (
    <SurfaceCard className="bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(245,249,253,0.86))]">
      <SectionHeader
        eyebrow="Leaders"
        title="Top movers"
        description="Names carrying the session narrative."
      />
      <div className="mt-5 space-y-3">
        {movers.map((mover, index) => (
          <Link
            key={mover.symbol}
            href={`/stocks/${mover.symbol}`}
            className="block rounded-[24px] border border-white/75 bg-white/78 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-[18px] bg-slate-950 font-mono text-sm text-white">
                  {index + 1}
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                    {mover.symbol}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-slate-950">{mover.name}</h3>
                </div>
              </div>
              <ChangePill value={mover.changePercent} compact />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-600">
              <span className="font-medium">{formatCurrency(mover.price)}</span>
              <span className="inline-flex items-center gap-1 text-slate-500">
                Details
                <ArrowRight className="size-4" />
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{mover.narrative}</p>
          </Link>
        ))}
      </div>
    </SurfaceCard>
  );
}
