import { NextRequest, NextResponse } from "next/server";
import { addAlert, clearAlerts, getAlerts } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ rules: getAlerts() });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.symbol !== "string" || typeof body.targetPrice !== "number") {
    return NextResponse.json({ error: "expected JSON with symbol and targetPrice" }, { status: 400 });
  }
  const rule = addAlert({
    symbol: body.symbol,
    targetPrice: body.targetPrice,
    direction: body.direction === "below" ? "below" : "above",
  });
  return NextResponse.json(rule, { status: 201 });
}

export async function DELETE() {
  const count = clearAlerts();
  return NextResponse.json({ cleared: count });
}
