import Link from "next/link";
import { Pin } from "lucide-react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getTeamAnnotations } from "@/lib/market-data";

const entityLabel: Record<string, string> = {
  stock: "Stock",
  portfolio: "Portfolio",
  watchlist: "Watchlist",
  sector: "Sector",
};

export default async function TeamAnnotationsPage() {
  const annotations = await getTeamAnnotations();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Team annotations
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Shared comments and notes tied to workspace entities.
          </p>
        </div>
        <Link
          href="/team"
          className="text-sm font-medium text-neutral-900 underline"
        >
          Back to team
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {annotations.map((annotation) => (
          <SurfaceCard key={annotation.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="font-medium text-neutral-800">
                    {annotation.authorName}
                  </span>
                  <span>&middot;</span>
                  <span>{annotation.authorRole}</span>
                  <span>&middot;</span>
                  <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">
                    {entityLabel[annotation.entityType] ?? annotation.entityType}{" "}
                    / {annotation.entityId}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-neutral-700">
                  {annotation.body}
                </p>
                <p className="mt-2 text-xs text-neutral-400">
                  {new Date(annotation.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {annotation.pinned ? (
                <Pin className="mt-0.5 size-4 shrink-0 text-amber-500" />
              ) : null}
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
