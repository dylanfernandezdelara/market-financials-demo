import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    theme: "light",
    density: "comfortable",
    defaultTab: "overview",
    defaultLayoutId: "default",
  });
}

export async function PUT(request: NextRequest) {
  await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true });
}
