import { NextRequest, NextResponse } from "next/server";
import { getNews } from "@/lib/market-data";

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get("limit"));
  const news = await getNews(Number.isNaN(limit) ? undefined : limit);

  return NextResponse.json(
    { data: news, total: news.length },
    {
      headers: {
        "Cache-Control": "public, s-maxage=1, stale-while-revalidate=59",
      },
    },
  );
}
