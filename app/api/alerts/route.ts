import { NextRequest, NextResponse } from "next/server";
import { paginate, parsePaginationParams } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  const params = parsePaginationParams(request);
  return NextResponse.json(paginate([], params));
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "expected JSON" }, { status: 400 });
  }
  return NextResponse.json({ id: "tmp" }, { status: 201 });
}

export async function DELETE() {
  return NextResponse.json({ cleared: false });
}
