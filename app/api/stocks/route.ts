import { NextResponse } from "next/server";
import { getSearchUniverse } from "@/lib/market-data";

export async function GET() {
  const stocks = await getSearchUniverse();

  return NextResponse.json({
    count: stocks.length,
    data: stocks,
  });
}
