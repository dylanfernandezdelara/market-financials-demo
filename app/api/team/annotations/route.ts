import { NextRequest, NextResponse } from "next/server";
import { getTeamAnnotations } from "@/lib/market-data";
import type { TeamAnnotation } from "@/types/finance";

const VALID_ENTITY_TYPES: TeamAnnotation["entityType"][] = [
  "stock",
  "portfolio",
  "watchlist",
  "sector",
];

export async function GET(request: NextRequest) {
  const entityType = request.nextUrl.searchParams.get("entityType");

  if (
    entityType &&
    !VALID_ENTITY_TYPES.includes(entityType as TeamAnnotation["entityType"])
  ) {
    return NextResponse.json(
      { error: "Invalid entityType" },
      { status: 400 },
    );
  }

  const annotations = await getTeamAnnotations(
    entityType as TeamAnnotation["entityType"] | undefined,
  );

  return NextResponse.json({ annotations });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "expected JSON" }, { status: 400 });
  }

  return NextResponse.json(
    { id: "ann_placeholder", created: true },
    { status: 201 },
  );
}
