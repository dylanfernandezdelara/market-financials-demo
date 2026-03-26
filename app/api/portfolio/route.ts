import { NextResponse } from "next/server";
import { getPortfolioSnapshot, addImportedHoldings } from "@/lib/market-data";
import type { Holding } from "@/types/finance";

export async function GET() {
  const portfolio = await getPortfolioSnapshot();

  return NextResponse.json({
    ...portfolio,
    netLiquidity: portfolio.totalValue - portfolio.cashBalance,
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body)) {
    return NextResponse.json(
      { error: "Request body must be an array of holdings" },
      { status: 400 },
    );
  }

  const holdings: Holding[] = [];
  const errors: string[] = [];

  for (let i = 0; i < body.length; i++) {
    const row = body[i];
    if (row === null || typeof row !== "object" || Array.isArray(row)) {
      errors.push(`Row ${i + 1}: must be a JSON object`);
      continue;
    }
    const record = row as Record<string, unknown>;
    const symbol = typeof record.symbol === "string" ? record.symbol.trim().toUpperCase() : "";
    const shares = Number(record.shares);
    const averageCost = Number(record.averageCost);

    if (!symbol) {
      errors.push(`Row ${i + 1}: missing or empty symbol`);
      continue;
    }
    if (!Number.isFinite(shares) || shares <= 0) {
      errors.push(`Row ${i + 1}: shares must be a positive number`);
      continue;
    }
    if (!Number.isFinite(averageCost) || averageCost <= 0) {
      errors.push(`Row ${i + 1}: averageCost must be a positive number`);
      continue;
    }

    holdings.push({ symbol, shares, averageCost });
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
  }

  addImportedHoldings(holdings);

  return NextResponse.json({ imported: holdings.length });
}
