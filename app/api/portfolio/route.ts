import { NextResponse } from "next/server";
import { getPortfolioSnapshot } from "@/lib/market-data";

export async function GET() {
  const portfolio = await getPortfolioSnapshot();

  return NextResponse.json(
    {
      ...portfolio,
      netLiquidity: portfolio.totalValue - portfolio.cashBalance,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=1, stale-while-revalidate=59",
      },
    },
  );
}
