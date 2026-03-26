import { NextRequest, NextResponse } from "next/server";
import { getNews } from "@/lib/market-data";
import { parseInteger } from "@/lib/query-params";

export async function GET(request: NextRequest) {
  const limit = parseInteger(request, "limit");
  const news = await getNews(limit);

  return NextResponse.json({
    data: news,
    total: news.length,
  });
}
