import { NextRequest, NextResponse } from "next/server";
import { runAllInsightMetrics } from "@/lib/insights/runner";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim().toLowerCase();
  let rows = runAllInsightMetrics();

  if (q) {
    rows = rows.filter((r) => r.id.toLowerCase().includes(q));
  }

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    count: rows.length,
    rows,
  });
}
