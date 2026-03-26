import { NextResponse } from "next/server";
import { getReports } from "@/lib/market-data";

export async function GET() {
  const data = await getReports();
  return NextResponse.json(data);
}
