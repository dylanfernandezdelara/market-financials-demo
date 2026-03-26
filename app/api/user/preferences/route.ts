import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    theme: "light",
    density: "comfortable",
    defaultTab: "overview",
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
