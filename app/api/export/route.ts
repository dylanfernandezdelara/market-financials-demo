import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const fmt = request.nextUrl.searchParams.get("format") ?? "csv";
  if (fmt === "pdf") {
    return NextResponse.json({ error: "unsupported" }, { status: 501 });
  }
  return NextResponse.json({ url: "/api/export", ready: true });
}
