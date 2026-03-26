import { NextRequest, NextResponse } from "next/server";
import { getReportSchedule, getReportSchedules } from "@/lib/report-scheduling";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (id) {
    const schedule = await getReportSchedule(id);

    if (!schedule) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json(schedule);
  }

  const schedules = await getReportSchedules();

  return NextResponse.json({ schedules });
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "expected JSON" }, { status: 400 });
  }

  return NextResponse.json({ updated: true });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "missing id" }, { status: 400 });
  }

  return NextResponse.json({ deleted: true });
}
