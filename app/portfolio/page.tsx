import { SiteHeader } from "@/components/site-header";
import { getPortfolioSnapshot, getSearchUniverse } from "@/lib/market-data";
import { PortfolioContent } from "./portfolio-content";

export default async function PortfolioPage() {
  const [portfolio, searchOptions] = await Promise.all([
    getPortfolioSnapshot(),
    getSearchUniverse(),
  ]);

  const asOfTimestamp = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  }).format(new Date());

  return (
    <SiteHeader searchOptions={searchOptions}>
      <PortfolioContent portfolio={portfolio} asOfTimestamp={asOfTimestamp} />
    </SiteHeader>
  );
}
