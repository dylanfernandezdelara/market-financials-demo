import { NextResponse } from "next/server";
import type { ApiErrorResponse } from "@/types/finance";

export function errorResponse(
  message: string,
  status: number,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ error: message, status }, { status });
}
