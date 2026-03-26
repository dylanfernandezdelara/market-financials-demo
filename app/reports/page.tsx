import { FileText, Clock, BarChart3, Receipt } from "lucide-react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SectionHeader } from "@/components/ui/section-header";
import { getReports } from "@/lib/market-data";
import type { Report } from "@/lib/market-data";

export default async function ReportsPage() {
  const { reports, nextRun } = await getReports();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <SurfaceCard>
        <SectionHeader
          eyebrow="Reports"
          title="Reports & exports"
          description="Generate and download monthly performance summaries and tax-lot details."
        />

        {/* Report-generation controls */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-left transition-colors hover:bg-neutral-100"
          >
            <BarChart3 className="size-5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-neutral-900">
                Monthly performance
              </p>
              <p className="text-xs text-neutral-500">
                Portfolio returns and benchmark comparison
              </p>
            </div>
          </button>

          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-left transition-colors hover:bg-neutral-100"
          >
            <Receipt className="size-5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-neutral-900">Tax lots</p>
              <p className="text-xs text-neutral-500">
                Cost-basis and realized gains for tax filing
              </p>
            </div>
          </button>
        </div>

        {/* Next-run notice */}
        {nextRun ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-2.5 text-xs text-amber-700">
            <Clock className="size-3.5 shrink-0" />
            <span>Next scheduled run: {nextRun}</span>
          </div>
        ) : null}

        {/* Report list or empty state */}
        <div className="mt-6">
          {reports.length > 0 ? (
            <ul className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
              {reports.map((report: Report) => (
                <li
                  key={report.id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <FileText className="size-4 shrink-0 text-neutral-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {report.title}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {report.type === "monthly-performance"
                        ? "Monthly performance"
                        : "Tax lots"}{" "}
                      &middot; {report.createdAt}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center">
              <FileText className="size-8 text-neutral-300" />
              <p className="text-sm font-medium text-neutral-600">
                No reports yet
              </p>
              <p className="max-w-xs text-xs leading-5 text-neutral-500">
                Generated reports will appear here. Use the controls above to
                create a monthly performance summary or tax-lot export.
              </p>
            </div>
          )}
        </div>
      </SurfaceCard>
    </div>
  );
}
