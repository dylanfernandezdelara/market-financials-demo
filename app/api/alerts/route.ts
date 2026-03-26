import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-error";

export async function GET() {
  return NextResponse.json({ rules: [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return errorResponse("expected JSON", 400);
  }
  return NextResponse.json({ id: "tmp" }, { status: 201 });
}

export async function DELETE() {
  return NextResponse.json({ cleared: false });
}
