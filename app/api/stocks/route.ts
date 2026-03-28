import { getSearchUniverse } from "@/lib/market-data";
import { StocksListResponseSchema } from "@/lib/schemas";
import { validatedResponse } from "@/lib/validate";

export async function GET() {
  const stocks = await getSearchUniverse();

  return validatedResponse(StocksListResponseSchema, {
    count: stocks.length,
    data: stocks,
  });
}
