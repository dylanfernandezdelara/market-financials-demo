import { NextRequest } from "next/server";
import { getNews } from "@/lib/market-data";
import { NewsResponseSchema } from "@/lib/schemas";
import { validatedResponse } from "@/lib/validate";

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get("limit"));
  const news = await getNews(Number.isNaN(limit) ? undefined : limit);

  return validatedResponse(NewsResponseSchema, {
    data: news,
    total: news.length,
  });
}
