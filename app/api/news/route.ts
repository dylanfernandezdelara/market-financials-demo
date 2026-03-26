import { NextRequest, NextResponse } from "next/server";
import { getNews } from "@/lib/market-data";
import { paginate, parsePaginationParams } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  const news = await getNews();
  const params = parsePaginationParams(request);

  return NextResponse.json(paginate(news, params));
}
