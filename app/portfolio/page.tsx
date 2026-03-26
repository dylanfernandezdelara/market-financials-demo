import { SiteHeader } from "@/components/site-header";
import { getPortfolioSnapshot, getSearchUniverse } from "@/lib/market-data";
import { PortfolioContent } from "./portfolio-content";

export default async function PortfolioPage() {
  const [portfolio, searchOptions] = await Promise.all([
    getPortfolioSnapshot(),
    getSearchUniverse(),
  ]);

  return (
    <SiteHeader searchOptions={searchOptions}>
      <PortfolioContent portfolio={portfolio} />
    </SiteHeader>
  );
}
