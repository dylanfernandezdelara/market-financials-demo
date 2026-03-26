import { NextRequest, NextResponse } from "next/server";
import { searchSymbols } from "@/lib/market-data";
import { paginate, parsePaginationParams } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const results = await searchSymbols(query);
  const params = parsePaginationParams(request);

  return NextResponse.json({ query: query ?? "", ...paginate(results, params) });
}
