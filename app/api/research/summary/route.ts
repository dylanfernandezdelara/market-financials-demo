import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? "";
  return NextResponse.json({
    symbol: symbol.toUpperCase(),
    bullets: [],
    asOf: new Date().toISOString(),
  });
}
