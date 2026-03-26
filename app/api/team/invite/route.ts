import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-error";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return errorResponse("invalid", 400);
  }
  return NextResponse.json({ sent: true, inviteId: "inv_placeholder" });
}
