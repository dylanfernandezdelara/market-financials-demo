import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ reports: [], nextRun: null });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate report. Please try again later." },
      { status: 500 },
    );
  }
}
