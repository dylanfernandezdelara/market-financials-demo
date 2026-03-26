import { NextResponse } from "next/server";
import { runAllInsightMetrics, samplePairs } from "@/lib/insights/runner";

export async function GET() {
  const rows = runAllInsightMetrics();

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    count: rows.length,
    samplePairs,
    rows,
  });
}
