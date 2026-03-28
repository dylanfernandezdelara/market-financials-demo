import { Info } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-[13px] text-amber-800">
      <span className="inline-flex items-center gap-1.5">
        <Info className="size-3.5 shrink-0" />
        <span>
          <strong className="font-semibold">Demo mode</strong> — All data shown
          is simulated and does not reflect real market conditions.
        </span>
      </span>
    </div>
  );
}
