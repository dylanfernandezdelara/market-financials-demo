import { NextRequest, NextResponse } from "next/server";
import { runAllInsightMetrics } from "@/lib/insights/runner";
import { paginate, parsePaginationParams } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  const rows = runAllInsightMetrics();
  const params = parsePaginationParams(request);

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    ...paginate(rows, params),
  });
}
