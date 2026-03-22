import { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: "light" | "dark";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  variant = "light",
}: SectionHeaderProps) {
  const isDark = variant === "dark";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <div
            className={
              isDark
                ? "inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.26em] text-emerald-300/90"
                : "inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50/80 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.26em] text-amber-700"
            }
          >
            <span
              className={`size-1.5 rounded-full ${isDark ? "bg-emerald-400" : "bg-amber-500"}`}
            />
            {eyebrow}
          </div>
        ) : null}
        <div className="space-y-2">
          <h2
            className={`text-[1.8rem] font-semibold tracking-[-0.04em] ${isDark ? "text-zinc-50" : "text-slate-950"}`}
          >
            {title}
          </h2>
          {description ? (
            <p
              className={`max-w-2xl text-sm leading-6 ${isDark ? "text-zinc-400" : "text-slate-600/90"}`}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}
