import * as S01 from "./slice-01";
import * as S02 from "./slice-02";
import * as S03 from "./slice-03";
import * as S04 from "./slice-04";
import * as S05 from "./slice-05";
import * as S06 from "./slice-06";
import * as S07 from "./slice-07";
import * as S08 from "./slice-08";
import * as S09 from "./slice-09";
import * as S10 from "./slice-10";

const slices: { label: string; fns: Record<string, (a: number, b: number) => number> }[] = [
  { label: "slice-01", fns: S01 as Record<string, (a: number, b: number) => number> },
  { label: "slice-02", fns: S02 as Record<string, (a: number, b: number) => number> },
  { label: "slice-03", fns: S03 as Record<string, (a: number, b: number) => number> },
  { label: "slice-04", fns: S04 as Record<string, (a: number, b: number) => number> },
  { label: "slice-05", fns: S05 as Record<string, (a: number, b: number) => number> },
  { label: "slice-06", fns: S06 as Record<string, (a: number, b: number) => number> },
  { label: "slice-07", fns: S07 as Record<string, (a: number, b: number) => number> },
  { label: "slice-08", fns: S08 as Record<string, (a: number, b: number) => number> },
  { label: "slice-09", fns: S09 as Record<string, (a: number, b: number) => number> },
  { label: "slice-10", fns: S10 as Record<string, (a: number, b: number) => number> },
];

const samplePairs: [number, number][] = [
  [142.5, 138.2],
  [88.1, 90.4],
  [2100, 2050],
  [0.12, 0.11],
  [17.2, 16.9],
];

export function runAllInsightMetrics(): { id: string; slice: string; values: number[] }[] {
  const results: { id: string; slice: string; values: number[] }[] = [];
  for (const { label, fns } of slices) {
    const keys = Object.keys(fns)
      .filter((k) => k.startsWith("rollingMetric"))
      .sort();
    for (const key of keys) {
      const fn = fns[key];
      const values = samplePairs.map(([a, b]) => fn(a, b));
      results.push({ id: key, slice: label, values });
    }
  }
  return results;
}
