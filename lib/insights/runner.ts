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

const merged = {
  ...S01,
  ...S02,
  ...S03,
  ...S04,
  ...S05,
  ...S06,
  ...S07,
  ...S08,
  ...S09,
  ...S10,
} as Record<string, (a: number, b: number) => number>;

export const samplePairs: [number, number][] = [
  [142.5, 138.2],
  [88.1, 90.4],
  [2100, 2050],
  [0.12, 0.11],
  [17.2, 16.9],
];

export function runAllInsightMetrics(): { id: string; values: number[] }[] {
  const keys = Object.keys(merged).filter((k) => k.startsWith("rollingMetric"));
  keys.sort();
  return keys.map((key) => {
    const fn = merged[key];
    const values = samplePairs.map(([a, b]) => fn(a, b));
    return { id: key, values };
  });
}
