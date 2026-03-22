import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ unread: 0, items: [] });
}

export async function PATCH() {
  return NextResponse.json({ marked: 0 });
}
