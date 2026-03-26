import { NextResponse } from "next/server";
import {
  getNewsForSymbol,
  getRelatedStocks,
  getStockProfile,
} from "@/lib/market-data";
import { StockDetailResponseSchema } from "@/lib/schemas";
import { validatedResponse } from "@/lib/validate";

type StockRouteProps = {
  params: Promise<{
    symbol: string;
  }>;
};

export async function GET(_: Request, { params }: StockRouteProps) {
  const { symbol } = await params;
  const stock = await getStockProfile(symbol);

  if (!stock) {
    return NextResponse.json(
      { error: `Unknown symbol: ${symbol}` },
      { status: 404 },
    );
  }

  const [news, relatedStocks] = await Promise.all([
    getNewsForSymbol(stock.symbol),
    getRelatedStocks(stock.symbol),
  ]);

  return validatedResponse(StockDetailResponseSchema, {
    stock,
    news,
    relatedStocks,
  });
}
