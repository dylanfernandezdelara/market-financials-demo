import { getPortfolioSnapshot } from "@/lib/market-data";
import { PortfolioResponseSchema } from "@/lib/schemas";
import { validatedResponse } from "@/lib/validate";

export async function GET() {
  const portfolio = await getPortfolioSnapshot();

  return validatedResponse(PortfolioResponseSchema, {
    ...portfolio,
    netLiquidity: portfolio.totalValue - portfolio.cashBalance,
  });
}
