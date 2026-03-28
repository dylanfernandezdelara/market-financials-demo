import { marketIndices } from "@/lib/mock-data";
import { BenchmarksResponseSchema } from "@/lib/schemas";
import { validatedResponse } from "@/lib/validate";

export async function GET() {
  return validatedResponse(BenchmarksResponseSchema, {
    benchmarks: marketIndices,
  });
}
