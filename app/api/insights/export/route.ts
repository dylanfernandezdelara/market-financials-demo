import { type NextRequest } from "next/server";
import { runAllInsightMetrics } from "@/lib/insights/runner";

export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get("format") ?? "csv";
  const rows = runAllInsightMetrics();
  const generatedAt = new Date().toISOString();

  if (format === "json") {
    const body = JSON.stringify({ generatedAt, count: rows.length, rows }, null, 2);
    return new Response(body, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="insights-${generatedAt}.json"`,
      },
    });
  }

  const header = ["id", ...rows[0]?.values.map((_, i) => `value_${i + 1}`) ?? []].join(",");
  const csvRows = rows.map((r) => [r.id, ...r.values.map((v) => v.toFixed(6))].join(","));
  const csv = [header, ...csvRows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="insights-${generatedAt}.csv"`,
    },
  });
}
