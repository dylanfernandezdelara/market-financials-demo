import { NextRequest, NextResponse } from "next/server";
import { paginate, parsePaginationParams } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  const params = parsePaginationParams(request);
  return NextResponse.json({ nextRun: null, ...paginate([], params) });
}
