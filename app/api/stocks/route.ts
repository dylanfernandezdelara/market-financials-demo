import { NextResponse } from "next/server";
import { getSearchUniverse } from "@/lib/market-data";

export async function GET() {
  const stocks = await getSearchUniverse();

  return NextResponse.json(
    { count: stocks.length, data: stocks },
    {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    },
  );
}
