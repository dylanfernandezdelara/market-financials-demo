import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { status: "pending", lastSync: null },
    { status: 202 },
  );
}
