import { NextRequest } from "next/server";
import { searchSymbols } from "@/lib/market-data";
import { SearchResponseSchema } from "@/lib/schemas";
import { validatedResponse } from "@/lib/validate";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const results = await searchSymbols(query);

  return validatedResponse(SearchResponseSchema, {
    query: query ?? "",
    count: results.length,
    results,
  });
}
