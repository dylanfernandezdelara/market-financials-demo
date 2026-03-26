import { NextRequest, NextResponse } from "next/server";
import { getScreenerResults, getScreenerSectors } from "@/lib/market-data";

export async function GET(request: NextRequest) {
  const sector = request.nextUrl.searchParams.get("sector") ?? "any";
  const results = await getScreenerResults(sector === "any" ? undefined : sector);
  const sectors = getScreenerSectors();
  return NextResponse.json({ sector, results, total: results.length, sectors });
}

export async function POST(request: NextRequest) {
  await request.json().catch(() => ({}));
  return NextResponse.json({ saved: false }, { status: 200 });
}
