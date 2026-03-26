import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-error";

export async function POST(request: NextRequest) {
  const fmt = request.nextUrl.searchParams.get("format") ?? "csv";
  if (fmt === "pdf") {
    return errorResponse("unsupported", 501);
  }
  return NextResponse.json({ url: "/api/export", ready: true });
}
