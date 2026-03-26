import { NextRequest, NextResponse } from "next/server";

let stored: Record<string, unknown> = {
  theme: "light",
  density: "comfortable",
  defaultTab: "overview",
  displayName: "Demo user",
};

export async function GET() {
  return NextResponse.json(stored);
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  stored = { ...stored, ...(body as Record<string, unknown>) };
  return NextResponse.json({ ok: true });
}
