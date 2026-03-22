import { NextResponse } from "next/server";
import { getPortfolioSnapshot } from "@/lib/market-data";

export async function GET() {
  const portfolio = await getPortfolioSnapshot();

  return NextResponse.json({
    ...portfolio,
    netLiquidity: portfolio.totalValue - portfolio.cashBalance * 2,
  });
}
