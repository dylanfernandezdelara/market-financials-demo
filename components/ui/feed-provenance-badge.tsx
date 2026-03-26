import { Database, Radio } from "lucide-react";
import type { FeedProvenance } from "@/types/finance";

type FeedProvenanceBadgeProps = {
  provenance: FeedProvenance;
};

export function FeedProvenanceBadge({ provenance }: FeedProvenanceBadgeProps) {
  const isMock = provenance.source === "mock";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${
        isMock
          ? "border-amber-200/80 bg-amber-50/60 text-amber-700"
          : "border-emerald-300/80 bg-emerald-50/60 text-emerald-700"
      }`}
      title={`Source: ${provenance.label} (${provenance.source})`}
    >
      {isMock ? (
        <Database className="size-3" />
      ) : (
        <Radio className="size-3" />
      )}
      {isMock ? "Mock" : "Live"}
    </span>
  );
}
