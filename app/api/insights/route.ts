import { runAllInsightMetrics } from "@/lib/insights/runner";
import { InsightsResponseSchema } from "@/lib/schemas";
import { validatedResponse } from "@/lib/validate";

export async function GET() {
  const rows = runAllInsightMetrics();

  return validatedResponse(InsightsResponseSchema, {
    generatedAt: new Date().toISOString(),
    count: rows.length,
    rows,
  });
}
