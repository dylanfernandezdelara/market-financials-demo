import { NextRequest, NextResponse } from "next/server";
import { getStockProfile } from "@/lib/market-data";
import { formatCompactCurrency, formatPercent } from "@/lib/utils";

function buildBullets(stock: {
  name: string;
  symbol: string;
  thesis: string;
  sector: string;
  industry: string;
  price: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  week52Low: number;
  week52High: number;
  beta: number;
}): string[] {
  const bullets: string[] = [];

  bullets.push(stock.thesis);

  bullets.push(
    `${stock.name} operates in the ${stock.industry} industry within the ${stock.sector} sector.`,
  );

  bullets.push(
    `Shares trade at ${formatCompactCurrency(stock.price)} (${formatPercent(stock.changePercent)}), with a market cap of ${formatCompactCurrency(stock.marketCap)}.`,
  );

  const range = `52-week range spans ${formatCompactCurrency(stock.week52Low)} to ${formatCompactCurrency(stock.week52High)}.`;
  const pe =
    stock.peRatio > 0
      ? ` P/E ratio stands at ${stock.peRatio.toFixed(1)}x.`
      : "";
  bullets.push(`${range}${pe}`);

  if (stock.dividendYield > 0) {
    bullets.push(
      `Dividend yield of ${stock.dividendYield.toFixed(2)}% with a beta of ${stock.beta.toFixed(2)}.`,
    );
  } else {
    bullets.push(
      `The stock does not currently pay a dividend. Beta is ${stock.beta.toFixed(2)}.`,
    );
  }

  return bullets;
}

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? "";
  const stock = await getStockProfile(symbol);

  if (!stock) {
    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      bullets: [],
      asOf: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    symbol: stock.symbol,
    bullets: buildBullets(stock),
    asOf: new Date().toISOString(),
  });
}
