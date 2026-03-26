import { NextRequest, NextResponse } from "next/server";
import { marketIndices } from "@/lib/mock-data";
import { paginate, parsePaginationParams } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  const params = parsePaginationParams(request);
  return NextResponse.json(paginate(marketIndices, params));
}
