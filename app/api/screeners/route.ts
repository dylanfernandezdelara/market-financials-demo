import { NextRequest, NextResponse } from "next/server";
import { paginate, parsePaginationParams } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  const sector = request.nextUrl.searchParams.get("sector") ?? "any";
  const params = parsePaginationParams(request);
  return NextResponse.json({ sector, ...paginate([], params) });
}

export async function POST(request: NextRequest) {
  await request.json().catch(() => ({}));
  return NextResponse.json({ saved: false }, { status: 200 });
}
