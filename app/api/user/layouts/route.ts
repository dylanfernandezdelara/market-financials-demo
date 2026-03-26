import { NextRequest, NextResponse } from "next/server";

import type { SavedLayout } from "@/types/finance";

const seedLayouts: SavedLayout[] = [
  {
    id: "default",
    name: "Default layout",
    widgets: ["top-futures", "market-summary", "movers", "watchlist"],
    createdAt: "2025-01-01T00:00:00Z",
  },
];

export async function GET() {
  return NextResponse.json({ layouts: seedLayouts });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string") {
    return NextResponse.json({ error: "expected JSON with name" }, { status: 400 });
  }
  const created: SavedLayout = {
    id: crypto.randomUUID(),
    name: body.name,
    widgets: Array.isArray(body.widgets) ? body.widgets : [],
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "missing id param" }, { status: 400 });
  }
  return NextResponse.json({ deleted: id });
}
