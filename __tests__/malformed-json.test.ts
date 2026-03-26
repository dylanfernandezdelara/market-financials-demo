import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";

function malformedRequest(url: string, method: string): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3000"), {
    method,
    headers: { "Content-Type": "application/json" },
    body: "NOT VALID JSON{{{",
  });
}

describe("Malformed JSON body handling", () => {
  it("POST /api/watchlist returns 400 for malformed JSON", async () => {
    const { POST } = await import("@/app/api/watchlist/route");
    const res = await POST(malformedRequest("/api/watchlist", "POST"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("PUT /api/watchlist returns 400 for malformed JSON", async () => {
    const { PUT } = await import("@/app/api/watchlist/route");
    const res = await PUT(malformedRequest("/api/watchlist", "PUT"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("DELETE /api/watchlist returns 400 for malformed JSON", async () => {
    const { DELETE } = await import("@/app/api/watchlist/route");
    const res = await DELETE(malformedRequest("/api/watchlist", "DELETE"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("POST /api/alerts returns 400 for malformed JSON", async () => {
    const { POST } = await import("@/app/api/alerts/route");
    const res = await POST(malformedRequest("/api/alerts", "POST"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("POST /api/team/invite returns 400 for malformed JSON", async () => {
    const { POST } = await import("@/app/api/team/invite/route");
    const res = await POST(malformedRequest("/api/team/invite", "POST"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("POST /api/screeners returns 400 for malformed JSON", async () => {
    const { POST } = await import("@/app/api/screeners/route");
    const res = await POST(malformedRequest("/api/screeners", "POST"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("PUT /api/user/preferences returns 400 for malformed JSON", async () => {
    const { PUT } = await import("@/app/api/user/preferences/route");
    const res = await PUT(malformedRequest("/api/user/preferences", "PUT"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });
});
