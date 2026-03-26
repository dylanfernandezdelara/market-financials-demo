import Link from "next/link";
import { getStaleIntegrations } from "@/lib/market-data";

export async function StaleDataBanner() {
  const staleOrDisconnected = await getStaleIntegrations();

  if (staleOrDisconnected.length === 0) return null;

  const names = staleOrDisconnected.map((i) => i.name);
  const label =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-[13px] text-amber-800"
    >
      <span className="font-medium">
        {label} {staleOrDisconnected.length === 1 ? "is" : "are"} disconnected
        or outdated.
      </span>
      <span className="text-amber-600">
        Market data may be stale.
      </span>
      <Link
        href="/integrations"
        className="ml-1 font-medium text-amber-900 underline underline-offset-2 hover:text-amber-950"
      >
        Review integrations
      </Link>
    </div>
  );
}
