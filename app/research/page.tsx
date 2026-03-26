import Link from "next/link";
import { Download, FileText } from "lucide-react";

export default function ResearchHubPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Research hub</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Filings, transcripts, and third-party notes in one stream.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            <FileText className="size-3.5 text-neutral-500" />
            Reports
          </Link>
          <Link
            href="/export"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            <Download className="size-3.5 text-neutral-500" />
            Export
          </Link>
        </div>
      </div>
      <div className="mt-8 h-48 animate-pulse rounded-xl bg-neutral-100" />
    </div>
  );
}
