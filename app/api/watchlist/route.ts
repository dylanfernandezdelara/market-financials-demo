import { NextRequest, NextResponse } from "next/server";
import { paginate, parsePaginationParams } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  const lists = [{ id: "primary", name: "Primary", symbols: ["AAPL", "MSFT"] }];
  const params = parsePaginationParams(request);
  return NextResponse.json(paginate(lists, params));
}

export async function POST(request: NextRequest) {
  await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true }, { status: 200 });
}
