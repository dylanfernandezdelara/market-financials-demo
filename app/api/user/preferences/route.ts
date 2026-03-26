import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { theme: "light", density: "comfortable", defaultTab: "overview" },
    {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    },
  );
}

export async function PUT(request: NextRequest) {
  await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true });
}
