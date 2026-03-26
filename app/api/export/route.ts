import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const fmt = request.nextUrl.searchParams.get("format") ?? "csv";
    if (fmt === "pdf") {
      return NextResponse.json(
        { error: "PDF export is not supported. Please use CSV format." },
        { status: 501 },
      );
    }
    return NextResponse.json({ url: "/api/export", ready: true });
  } catch {
    return NextResponse.json(
      { error: "Export failed. Please try again later." },
      { status: 500 },
    );
  }
}
