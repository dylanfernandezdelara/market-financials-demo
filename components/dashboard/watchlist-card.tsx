import Link from "next/link";
import { Eye } from "lucide-react";
import { WatchlistEntry } from "@/types/finance";
import { formatCurrency } from "@/lib/utils";
import { ChangePill } from "@/components/ui/change-pill";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";

type WatchlistCardProps = {
  entries: WatchlistEntry[];
};

export function WatchlistCard({ entries }: WatchlistCardProps) {
  return (
    <SurfaceCard>
      <SectionHeader
        eyebrow="Monitor"
        title="Watchlist"
        description="A compact list of symbols worth keeping in view."
      />
      {entries.length === 0 ? (
        <div className="mt-5 flex flex-col items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <Eye className="mb-3 size-8 text-slate-400" />
          <p className="text-sm font-medium text-slate-700">No watchlists yet</p>
          <p className="mt-1 max-w-xs text-xs text-slate-500">
            Add symbols to your watchlist to keep an eye on prices, alerts, and daily changes.
          </p>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-[22px] border border-slate-200/80">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50/90">
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3 font-medium">Symbol</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Sector</th>
                <th className="px-4 py-3 font-medium">Alert</th>
                <th className="px-4 py-3 font-medium">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 bg-white">
              {entries.map((entry) => (
                <tr key={entry.symbol}>
                  <td className="px-4 py-4">
                    <Link href={`/stocks/${entry.symbol}`} className="group inline-flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-2xl bg-slate-100 font-mono text-xs font-semibold text-slate-700">
                        {entry.symbol}
                      </span>
                      <div>
                        <p className="font-medium text-slate-900 group-hover:text-slate-700">
                          {entry.name}
                        </p>
                        <p className="text-xs text-slate-500">Open detail page</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {formatCurrency(entry.price)}
                  </td>
                  <td className="px-4 py-4 text-slate-600">{entry.sector}</td>
                  <td className="px-4 py-4 text-slate-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                      <Eye className="size-3.5" />
                      {entry.alertPrice ? formatCurrency(entry.alertPrice) : "No alert"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <ChangePill value={entry.changePercent} compact />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SurfaceCard>
  );
}
