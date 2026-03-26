import { NextRequest, NextResponse } from "next/server";
import { parseString } from "@/lib/query-params";

export async function POST(request: NextRequest) {
  const fmt = parseString(request, "format", "csv");
  if (fmt === "pdf") {
    return NextResponse.json({ error: "unsupported" }, { status: 501 });
  }
  return NextResponse.json({ url: "/api/export", ready: true });
}
