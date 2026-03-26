import { NextRequest, NextResponse } from "next/server";
import { parseString } from "@/lib/query-params";

export async function GET(request: NextRequest) {
  const symbol = parseString(request, "symbol");
  return NextResponse.json({
    symbol: symbol.toUpperCase(),
    bullets: [],
    asOf: new Date().toISOString(),
  });
}
