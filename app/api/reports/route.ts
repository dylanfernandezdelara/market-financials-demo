import { NextRequest, NextResponse } from "next/server";
import { getReportSchedules } from "@/lib/report-scheduling";

export async function GET() {
  const schedules = await getReportSchedules();
  const nextRun =
    schedules
      .filter((s) => s.enabled)
      .map((s) => s.nextRunAt)
      .sort()[0] ?? null;

  return NextResponse.json({ reports: schedules, nextRun });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "expected JSON" }, { status: 400 });
  }

  return NextResponse.json(
    { id: `sched_${Date.now()}`, created: true },
    { status: 201 },
  );
}
