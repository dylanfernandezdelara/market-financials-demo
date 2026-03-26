import { NextResponse } from "next/server";
import {
  getNewsForSymbol,
  getRelatedStocks,
  getStockProfile,
} from "@/lib/market-data";
import { errorResponse } from "@/lib/api-error";

type StockRouteProps = {
  params: Promise<{
    symbol: string;
  }>;
};

export async function GET(_: Request, { params }: StockRouteProps) {
  const { symbol } = await params;
  const stock = await getStockProfile(symbol);

  if (!stock) {
    return errorResponse(`Unknown symbol: ${symbol}`, 404);
  }

  const [news, relatedStocks] = await Promise.all([
    getNewsForSymbol(stock.symbol),
    getRelatedStocks(stock.symbol),
  ]);

  return NextResponse.json({
    stock,
    news,
    relatedStocks,
  });
}
