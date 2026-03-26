import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sector = request.nextUrl.searchParams.get("sector") ?? "any";
  return NextResponse.json({ sector, results: [], total: 0 });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  return NextResponse.json({ saved: false }, { status: 200 });
}
