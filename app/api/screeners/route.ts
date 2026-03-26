import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sector = request.nextUrl.searchParams.get("sector") ?? "any";
  return NextResponse.json(
    { sector, results: [], total: 0 },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}

export async function POST(request: NextRequest) {
  await request.json().catch(() => ({}));
  return NextResponse.json({ saved: false }, { status: 200 });
}
