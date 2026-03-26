import { NextRequest, NextResponse } from "next/server";
import { paginate, parsePaginationParams } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  const params = parsePaginationParams(request);
  return NextResponse.json({ unread: 0, ...paginate([], params) });
}

export async function PATCH() {
  return NextResponse.json({ marked: 0 });
}
