import { NextRequest, NextResponse } from "next/server";
import { getSearchUniverse } from "@/lib/market-data";
import { paginate, parsePaginationParams } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  const stocks = await getSearchUniverse();
  const params = parsePaginationParams(request);

  return NextResponse.json(paginate(stocks, params));
}
