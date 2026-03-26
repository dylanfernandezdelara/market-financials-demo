import { NextRequest, NextResponse } from "next/server";
import { getSearchUniverse } from "@/lib/market-data";
import { parseCommaSeparated } from "@/lib/query-params";

export async function GET(request: NextRequest) {
  const parts = parseCommaSeparated(request, "symbols");
  const universe = await getSearchUniverse();
  const quotes = parts.map((sym) => {
    const row = universe.find((u) => u.symbol === sym);
    return row ?? { symbol: sym, price: 0 };
  });
  return NextResponse.json({ count: quotes.length, quotes });
}
