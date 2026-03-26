import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const requestId =
    request.headers.get("x-request-id") ?? crypto.randomUUID();
  const start = Date.now();

  const response = NextResponse.next({
    request: {
      headers: new Headers([
        ...Array.from(request.headers.entries()),
        ["x-request-id", requestId],
      ]),
    },
  });

  response.headers.set("x-request-id", requestId);
  response.headers.set("x-response-time", `${Date.now() - start}ms`);

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
