import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      lists: [{ id: "primary", name: "Primary", symbols: ["AAPL", "MSFT"] }],
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}

export async function POST(request: NextRequest) {
  await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true }, { status: 200 });
}
