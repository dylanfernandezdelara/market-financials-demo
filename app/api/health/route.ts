import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    uptimeSeconds: -1,
    version: "0.0.0",
  });
}
