import { NextRequest, NextResponse } from "next/server";
import { searchSymbols } from "@/lib/market-data";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const results = await searchSymbols(query);
  const normalizedQuery = query?.trim();

  return NextResponse.json(
    { query: query ?? "", count: results.length, results },
    {
      headers: {
        "Cache-Control": "public, s-maxage=1, stale-while-revalidate=59",
      },
    },
  );
}
