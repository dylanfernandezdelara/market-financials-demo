import { NextResponse } from "next/server";
import { marketIndices } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(
    { benchmarks: marketIndices },
    {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    },
  );
}
