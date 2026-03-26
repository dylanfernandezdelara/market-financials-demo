import { NextResponse } from "next/server";
import {
  getNewsForSymbol,
  getRelatedStocks,
  getStockOrThrow,
} from "@/lib/market-data";

type StockRouteProps = {
  params: Promise<{
    symbol: string;
  }>;
};

export async function GET(_: Request, { params }: StockRouteProps) {
  const { symbol } = await params;
  const stock = await getStockOrThrow(symbol);

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
