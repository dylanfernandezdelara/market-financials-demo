import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    theme: "light",
    locale: "en-US",
    timezone: "America/New_York",
    density: "comfortable",
    defaultTab: "overview",
  });
}

export async function PUT(request: NextRequest) {
  await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true });
}
