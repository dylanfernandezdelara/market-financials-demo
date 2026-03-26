import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getStockProfile } from "@/lib/market-data";

type NotesPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { symbol } = await searchParams;
  const resolvedSymbol = typeof symbol === "string" ? symbol : undefined;
  const stock = resolvedSymbol ? await getStockProfile(resolvedSymbol) : undefined;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Notes</h1>

      {stock ? (
        <div className="mt-4 rounded-lg border border-neutral-200 bg-[#fafafa] px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
            Attached to
          </p>
          <div className="mt-1 flex items-center gap-2">
            <Link
              href={`/stocks/${stock.symbol}`}
              className="text-[15px] font-semibold text-[#1a1a1a] underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-500"
            >
              {stock.symbol}
            </Link>
            <span className="text-[13px] text-neutral-600">{stock.name}</span>
            <span className="text-[13px] text-neutral-500">·</span>
            <span className="text-[13px] text-neutral-500">{stock.sector}</span>
          </div>
        </div>
      ) : null}

      <textarea
        className="mt-4 min-h-[200px] w-full rounded-lg border border-neutral-200 p-3 text-sm"
        placeholder={
          stock
            ? `Thesis notes for ${stock.symbol}…`
            : "Jot thesis bullets…"
        }
        readOnly
      />

      <div className="mt-4 flex items-center gap-3">
        {stock ? (
          <Link
            href={`/stocks/${stock.symbol}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5e5e5] bg-white px-3 py-2 text-[13px] font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
          >
            <ArrowLeft className="size-3.5" />
            Back to {stock.symbol}
          </Link>
        ) : null}
        <Link
          href="/research"
          className="rounded-lg px-3 py-2 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          View Research Hub
        </Link>
      </div>
    </div>
  );
}
