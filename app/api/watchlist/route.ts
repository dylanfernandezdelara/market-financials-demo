import { NextRequest, NextResponse } from "next/server";
import {
  getAllWatchlists,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
} from "@/lib/watchlist-store";

export async function GET() {
  return NextResponse.json({ lists: getAllWatchlists() });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, symbols } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "name is required and must be a non-empty string" },
      { status: 400 },
    );
  }

  if (!Array.isArray(symbols) || !symbols.every((s) => typeof s === "string")) {
    return NextResponse.json(
      { error: "symbols must be an array of strings" },
      { status: 400 },
    );
  }

  const watchlist = createWatchlist(name.trim(), symbols);
  return NextResponse.json(watchlist, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id, name, symbols } = body as Record<string, unknown>;

  if (typeof id !== "string" || !id.trim()) {
    return NextResponse.json(
      { error: "id is required and must be a non-empty string" },
      { status: 400 },
    );
  }

  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    return NextResponse.json(
      { error: "name must be a non-empty string when provided" },
      { status: 400 },
    );
  }

  if (
    symbols !== undefined &&
    (!Array.isArray(symbols) || !symbols.every((s) => typeof s === "string"))
  ) {
    return NextResponse.json(
      { error: "symbols must be an array of strings when provided" },
      { status: 400 },
    );
  }

  const updated = updateWatchlist(id, {
    ...(typeof name === "string" ? { name: name.trim() } : {}),
    ...(Array.isArray(symbols) ? { symbols: symbols as string[] } : {}),
  });

  if (!updated) {
    return NextResponse.json({ error: "Watchlist not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id } = body as Record<string, unknown>;

  if (typeof id !== "string" || !id.trim()) {
    return NextResponse.json(
      { error: "id is required and must be a non-empty string" },
      { status: 400 },
    );
  }

  const deleted = deleteWatchlist(id);
  if (!deleted) {
    return NextResponse.json({ error: "Watchlist not found" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
