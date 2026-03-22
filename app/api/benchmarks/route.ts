import { NextResponse } from "next/server";
import { marketIndices } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    benchmarks: marketIndices.slice(1),
  });
}
