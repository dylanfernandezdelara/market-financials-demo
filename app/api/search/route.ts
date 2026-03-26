import { NextRequest, NextResponse } from "next/server";
import { searchSymbols } from "@/lib/market-data";
import { parseString } from "@/lib/query-params";

export async function GET(request: NextRequest) {
  const query = parseString(request, "q") || undefined;
  const results = await searchSymbols(query);

  return NextResponse.json({
    query: query ?? "",
    count: results.length,
    results,
  });
}
