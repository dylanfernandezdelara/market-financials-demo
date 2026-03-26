import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { reports: [], nextRun: null },
    {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    },
  );
}
