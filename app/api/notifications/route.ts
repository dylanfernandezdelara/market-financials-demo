import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { unread: 0, items: [] },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}

export async function PATCH() {
  return NextResponse.json({ marked: 0 });
}
