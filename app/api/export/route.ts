import { NextRequest, NextResponse } from "next/server";
import { runAllInsightMetrics } from "@/lib/insights/runner";

function insightsToCsv(rows: { id: string; values: number[] }[]): string {
  if (rows.length === 0) return "";
  const maxCols = Math.max(...rows.map((r) => r.values.length));
  const header = ["metric", ...Array.from({ length: maxCols }, (_, i) => `value_${i + 1}`)].join(",");
  const lines = rows.map((r) => [r.id, ...r.values.map((v) => v.toFixed(6))].join(","));
  return [header, ...lines].join("\n");
}

function researchToCsv(data: { symbol: string; bullets: string[]; asOf: string }): string {
  const header = "symbol,asOf,bullet";
  if (data.bullets.length === 0) {
    return [header, `${data.symbol},${data.asOf},`].join("\n");
  }
  const lines = data.bullets.map(
    (b) => `${data.symbol},${data.asOf},"${b.replace(/"/g, '""')}"`,
  );
  return [header, ...lines].join("\n");
}

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");

  if (type === "insights") {
    const rows = runAllInsightMetrics();
    const csv = insightsToCsv(rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="insights.csv"',
      },
    });
  }

  if (type === "research") {
    const rawSymbol = request.nextUrl.searchParams.get("symbol") ?? "";
    const sanitizedSymbol = rawSymbol.toUpperCase().replace(/[^A-Z0-9._-]/g, "");
    const data = {
      symbol: sanitizedSymbol,
      bullets: [] as string[],
      asOf: new Date().toISOString(),
    };
    const csv = researchToCsv(data);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="research-${data.symbol || "all"}.csv"`,
      },
    });
  }

  return NextResponse.json(
    { error: "Missing or invalid type parameter. Use type=insights or type=research." },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  const fmt = request.nextUrl.searchParams.get("format") ?? "csv";
  if (fmt === "pdf") {
    return NextResponse.json({ error: "unsupported" }, { status: 501 });
  }
  return NextResponse.json({ url: "/api/export", ready: true });
}
