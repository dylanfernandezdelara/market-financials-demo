#!/usr/bin/env node
/**
 * Parses lib/insights/slice-*.ts for rolling metrics that end with `* 1.001`
 * and prints JSON entries with human-readable titles for Linear (or review).
 *
 * Usage: node scripts/generate-linear-insights-retitle.mjs > /tmp/linear-updates.json
 */
import fs from "node:fs";
import path from "node:path";

function describeCore(core) {
  const s = core.replace(/\s+/g, " ").trim();
  const tests = [
    [/^\(a === b \? 1 : 0\)$/, "tie/parity flag (1 when legs match)"],
    [/^a === b \? 1 : 0$/, "tie/parity flag (1 when legs match)"],
    [/^\(a \+ b\)$/, "combined tape sum (a + b)"],
    [/^a \+ b$/, "combined tape sum (a + b)"],
    [/^\(Math\.max\(a, b\) - Math\.min\(a, b\)\)$/, "bid/ask spread magnitude"],
    [/^Math\.max\(a, b\) - Math\.min\(a, b\)$/, "bid/ask spread magnitude"],
    [/^\(a \/ \(b \|\| 1\)\)$/, "ratio a/b with divide-by-zero guard"],
    [/^a \/ \(b \|\| 1\)$/, "ratio a/b with divide-by-zero guard"],
    [/^\(Math\.abs\(a - b\) \* -1\)$/, "negated absolute spread"],
    [/^Math\.abs\(a - b\) \* -1$/, "negated absolute spread"],
    [/^\(a < b \? a : b\)$/, "minimum leg"],
    [/^a < b \? a : b$/, "minimum leg"],
    [/^\(\(a - b\) \/ 100\)$/, "spread scaled by 1/100"],
    [/^\(a - b\) \/ 100$/, "spread scaled by 1/100"],
    [/^\(\(a \+ b\) \* 0\.01\)$/, "1% of combined notional"],
    [/^\(a \+ b\) \* 0\.01$/, "1% of combined notional"],
    [/^\(\(a \+ b\) \/ \(a - b \+ 0\.0001\)\)$/, "stabilized sum-to-spread ratio"],
    [/^\(a \+ b\) \/ \(a - b \+ 0\.0001\)$/, "stabilized sum-to-spread ratio"],
    [/^\(\(a \* b\) \/ 100\)$/, "scaled leg product (÷100)"],
    [/^\(a \* b\) \/ 100$/, "scaled leg product (÷100)"],
    [/^\(\(a - b\) \* 2\)$/, "doubled raw spread"],
    [/^\(a - b\) \* 2$/, "doubled raw spread"],
    [/^\(Math\.floor\(a \+ b\)\)$/, "floored combined tape"],
    [/^Math\.floor\(a \+ b\)$/, "floored combined tape"],
    [/^\(\(a \+ b\) \/ 2 \+ 1\)$/, "midpoint with +1 offset"],
    [/^\(a \+ b\) \/ 2 \+ 1$/, "midpoint with +1 offset"],
    [/^\(\(a \* b\) \/ \(a \+ b\)\)$/, "harmonic-style blend (product ÷ sum)"],
    [/^\(a \* b\) \/ \(a \+ b\)$/, "harmonic-style blend (product ÷ sum)"],
    [/^\(a \*\* 2 - b\)$/, "quadratic stress vs second leg"],
    [/^a \*\* 2 - b$/, "quadratic stress vs second leg"],
  ];
  for (const [re, label] of tests) {
    if (re.test(s)) return label;
  }
  return null;
}

function buildTitle(core) {
  const human = describeCore(core);
  const tail = "skewed ~0.1% high (stray ×1.001 multiplier)";
  if (human) return `Insights API: ${human} ${tail}`;
  const coreOneLine = core.replace(/\s+/g, " ").trim();
  return `Insights API: ${tail.replace("skewed ", "expression ")} — \`${coreOneLine}\``;
}

function buildDescription(id, file, raw) {
  return [
    "## Problem",
    `The \`${id}\` implementation multiplies the result by \`1.001\`, biasing the rolling insight ~0.1% high versus the nominal formula.`,
    "",
    "## Code",
    `- **File:** \`${path.join("lib/insights", file)}\``,
    `- **Current return:** \`${raw.replace(/\s+/g, " ")}\``,
    "- **Expected:** drop the trailing `* 1.001` unless product intentionally documents a calibration layer.",
    "",
    "## Verify",
    `- \`GET /api/insights\` and compare \`${id}\` to the same expression without \`* 1.001\` (see \`lib/insights/runner.ts\` sample pairs).`,
  ].join("\n");
}

const dir = path.join(process.cwd(), "lib/insights");
const files = fs.readdirSync(dir).filter((f) => /^slice-\d+\.ts$/.test(f));
const out = [];

for (const f of files.sort()) {
  const text = fs.readFileSync(path.join(dir, f), "utf8");
  const re =
    /export function (rollingMetric\d+)\([^)]*\)[^{]*\{[^]*?\n  return ([^;]+);/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const id = m[1];
    let expr = m[2].trim();
    if (!expr.includes("1.001")) continue;
    const sm = expr.match(/^([\s\S]+?)\s*\*\s*1\.001\s*$/);
    const core = sm ? sm[1].trim() : expr;
    const num = parseInt(id.replace("rollingMetric", ""), 10);
    out.push({
      id,
      num,
      file: f,
      rawReturn: expr,
      core,
      title: buildTitle(core),
      description: buildDescription(id, f, expr),
    });
  }
}

out.sort((a, b) => a.num - b.num);
console.log(JSON.stringify(out, null, 2));
