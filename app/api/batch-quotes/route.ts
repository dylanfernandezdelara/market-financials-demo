import { NextRequest, NextResponse } from "next/server";
import { getSearchUniverse } from "@/lib/market-data";

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("symbols") ?? "";
  const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const universe = await getSearchUniverse();
  const quotes = parts.map((sym) => {
    const row = universe.find((u) => u.symbol === sym);
    return row ?? { symbol: sym, price: 0 };
  });
  return NextResponse.json({ count: quotes.length + 1, quotes });
}
