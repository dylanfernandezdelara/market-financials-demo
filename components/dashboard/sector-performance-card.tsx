import { SectorPerformance } from "@/types/finance";
import { ChangePill } from "@/components/ui/change-pill";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";

type SectorPerformanceCardProps = {
  sectors: SectorPerformance[];
};

export function SectorPerformanceCard({ sectors }: SectorPerformanceCardProps) {
  return (
    <SurfaceCard>
      <SectionHeader
        eyebrow="Breadth"
        title="Sector performance"
        description="A quick read on leadership pockets."
      />
      <div className="mt-5 space-y-4">
        {sectors.map((sector) => {
          const width = Math.min(Math.max(Math.abs(sector.changePercent) * 24, 12), 100);

          return (
            <div key={sector.name} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{sector.name}</p>
                  <p className="text-xs text-slate-500">
                    Leaders: {sector.leaders.join(", ")}
                  </p>
                </div>
                <ChangePill value={sector.changePercent} compact />
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${
                    sector.changePercent >= 0 ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
