import {
  Activity,
  Bell,
  BrainCircuit,
  BriefcaseBusiness,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { MarketPulse, SearchResult } from "@/types/finance";
import { SymbolSearch } from "@/components/symbol-search";
import { SurfaceCard } from "@/components/ui/surface-card";

type HeroPanelProps = {
  pulse: MarketPulse;
  searchOptions: SearchResult[];
};

const quickSignals = [
  {
    label: "Market breadth",
    value: "Advancers lead",
    icon: Activity,
  },
  {
    label: "News posture",
    value: "Calm but optimistic",
    icon: BrainCircuit,
  },
  {
    label: "Risk",
    value: "Volatility contained",
    icon: ShieldCheck,
  },
];

export function HeroPanel({ pulse, searchOptions }: HeroPanelProps) {
  return (
    <SurfaceCard className="overflow-hidden border-slate-200/80 bg-[linear-gradient(135deg,#08111f,#132033_52%,#1f3448)] p-0 text-white">
      <div className="grid gap-0 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="relative overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="relative space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-amber-200/90">
              <Sparkles className="size-3.5" />
              Finance workspace
            </div>
            <div className="max-w-4xl space-y-4">
              <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                Market intelligence, portfolio monitoring, and research workflows in one local demo.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                The UI is opinionated enough to feel like a product, but the system is still intentionally incomplete so the repo has room to grow into a large issue backlog.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Activity className="size-4 text-emerald-300" />
                  Market movement
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-white">Live-feel</p>
                <p className="mt-1 text-sm text-slate-400">Mock delayed feed with charts and movers.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <BriefcaseBusiness className="size-4 text-amber-200" />
                  Portfolio
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-white">Actionable</p>
                <p className="mt-1 text-sm text-slate-400">Holdings, sector exposure, and contribution surfaces.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <BrainCircuit className="size-4 text-sky-300" />
                  Research
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-white">AI-ready</p>
                <p className="mt-1 text-sm text-slate-400">Clean seams for later summaries, copilots, and alerts.</p>
              </div>
            </div>
            <div className="max-w-4xl">
              <SymbolSearch options={searchOptions} />
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 sm:p-8 xl:border-l xl:border-t-0">
          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-amber-200/80">
                    Market pulse
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{pulse.marketStatus}</p>
                </div>
                <Bell className="size-5 text-amber-200" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[22px] bg-black/15 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Advancers</p>
                  <p className="mt-2 text-3xl font-semibold">{pulse.advancers}</p>
                </div>
                <div className="rounded-[22px] bg-black/15 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Decliners</p>
                  <p className="mt-2 text-3xl font-semibold">{pulse.decliners}</p>
                </div>
                <div className="rounded-[22px] bg-black/15 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Put / call</p>
                  <p className="mt-2 text-3xl font-semibold">{pulse.putCallRatio}</p>
                </div>
                <div className="rounded-[22px] bg-black/15 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Fear / greed</p>
                  <p className="mt-2 text-3xl font-semibold">{pulse.fearGreedScore}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-3">
              {quickSignals.map((signal) => (
                <div
                  key={signal.label}
                  className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/6 px-4 py-4 backdrop-blur"
                >
                  <div className="flex size-11 items-center justify-center rounded-[18px] bg-white/8 text-amber-200">
                    <signal.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                      {signal.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">{signal.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(245,158,11,0.16),rgba(255,255,255,0.03))] p-5">
              <div className="flex items-center gap-2 text-sm text-amber-100">
                <ShieldCheck className="size-4" />
                Backlog-ready architecture
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Mock providers, focused routes, and intentionally missing platform layers keep the repo functional now without boxing in future issue creation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
