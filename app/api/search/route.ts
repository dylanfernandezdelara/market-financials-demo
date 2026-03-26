import { NextRequest, NextResponse } from "next/server";
import { searchSymbols } from "@/lib/market-data";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const results = await searchSymbols(query);

  return NextResponse.json({
    query: query ?? "",
    count: results.length,
    results,
  });
}
