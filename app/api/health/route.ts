import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    uptimeSeconds: Math.floor(process.uptime()),
    version: "0.0.0",
  });
}
