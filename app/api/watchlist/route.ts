import { NextRequest, NextResponse } from "next/server";
import { addWatchlist, getWatchlists, updateWatchlist } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ lists: getWatchlists() });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "expected JSON" }, { status: 400 });
  }

  // Update an existing list when an id is provided.
  if (typeof body.id === "string") {
    const updated = updateWatchlist(body.id, {
      name: typeof body.name === "string" ? body.name : undefined,
      symbols: Array.isArray(body.symbols) ? body.symbols : undefined,
    });
    if (!updated) {
      return NextResponse.json({ error: "list not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  }

  // Create a new list.
  const name = typeof body.name === "string" ? body.name : "Untitled";
  const symbols: string[] = Array.isArray(body.symbols) ? body.symbols : [];
  const created = addWatchlist(name, symbols);
  return NextResponse.json(created, { status: 201 });
}
