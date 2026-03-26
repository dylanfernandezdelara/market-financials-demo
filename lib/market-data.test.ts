import { describe, expect, it, vi } from "vitest";
import type { Holding } from "@/types/finance";

/**
 * Known mock-data values used to derive expected results.
 *
 * AAPL: 48 shares @ $172.12, price $192.40, change +$2.31
 * MSFT: 18 shares @ $386.55, price $428.10, change -$2.58
 * NVDA:  7 shares @ $694.20, price $942.70, change +$43.12
 * JPM:  32 shares @ $168.40, price $198.42, change +$1.72
 * V:    21 shares @ $246.80, price $278.74, change +$2.86
 */

describe("buildPortfolioSnapshot – default mock data", () => {
  it("computes totalValue as sum of market values plus cash balance", async () => {
    const { buildPortfolioSnapshot } = await import("@/lib/market-data");
    const snapshot = buildPortfolioSnapshot();

    const expectedMarketValue =
      192.4 * 48 + 428.1 * 18 + 942.7 * 7 + 198.42 * 32 + 278.74 * 21;
    const cashBalance = 11_640;

    expect(snapshot.totalValue).toBeCloseTo(expectedMarketValue + cashBalance, 2);
  });

  it("computes totalCost from average cost and shares", async () => {
    const { buildPortfolioSnapshot } = await import("@/lib/market-data");
    const snapshot = buildPortfolioSnapshot();

    const expectedCost =
      172.12 * 48 + 386.55 * 18 + 694.2 * 7 + 168.4 * 32 + 246.8 * 21;

    expect(snapshot.totalCost).toBeCloseTo(expectedCost, 2);
  });

  it("computes dayChange as sum of stock.change * shares (P&L model)", async () => {
    const { buildPortfolioSnapshot } = await import("@/lib/market-data");
    const snapshot = buildPortfolioSnapshot();

    const expectedDayChange =
      2.31 * 48 + -2.58 * 18 + 43.12 * 7 + 1.72 * 32 + 2.86 * 21;

    expect(snapshot.dayChange).toBeCloseTo(expectedDayChange, 2);
  });

  it("computes dayChangePercent relative to total market value", async () => {
    const { buildPortfolioSnapshot } = await import("@/lib/market-data");
    const snapshot = buildPortfolioSnapshot();

    const totalMarketValue =
      192.4 * 48 + 428.1 * 18 + 942.7 * 7 + 198.42 * 32 + 278.74 * 21;
    const expectedDayChange =
      2.31 * 48 + -2.58 * 18 + 43.12 * 7 + 1.72 * 32 + 2.86 * 21;

    expect(snapshot.dayChangePercent).toBeCloseTo(
      (expectedDayChange / totalMarketValue) * 100,
      4,
    );
  });

  it("returns the correct number of holdings", async () => {
    const { buildPortfolioSnapshot } = await import("@/lib/market-data");
    const snapshot = buildPortfolioSnapshot();

    expect(snapshot.holdings).toHaveLength(5);
  });

  it("allocation percentages sum to approximately 100", async () => {
    const { buildPortfolioSnapshot } = await import("@/lib/market-data");
    const snapshot = buildPortfolioSnapshot();

    const totalAllocation = snapshot.holdings.reduce(
      (sum, h) => sum + h.allocationPercent,
      0,
    );

    expect(totalAllocation).toBeCloseTo(100, 1);
  });

  it("groups sector exposure by sector and sorts descending by value", async () => {
    const { buildPortfolioSnapshot } = await import("@/lib/market-data");
    const snapshot = buildPortfolioSnapshot();

    expect(snapshot.sectorExposure.length).toBeGreaterThan(0);

    for (let i = 1; i < snapshot.sectorExposure.length; i++) {
      expect(snapshot.sectorExposure[i - 1].value).toBeGreaterThanOrEqual(
        snapshot.sectorExposure[i].value,
      );
    }
  });

  it("includes cashBalance of 11640", async () => {
    const { buildPortfolioSnapshot } = await import("@/lib/market-data");
    const snapshot = buildPortfolioSnapshot();

    expect(snapshot.cashBalance).toBe(11_640);
  });
});

describe("buildPortfolioSnapshot – orphan holdings", () => {
  it("includes holdings whose symbol has no matching stock profile", async () => {
    vi.resetModules();

    vi.doMock("@/lib/mock-data", async () => {
      const actual = await vi.importActual<typeof import("@/lib/mock-data")>(
        "@/lib/mock-data",
      );

      const orphanHolding: Holding = {
        symbol: "FAKE",
        shares: 10,
        averageCost: 50,
      };

      return {
        ...actual,
        portfolioHoldings: [...actual.portfolioHoldings, orphanHolding],
      };
    });

    const { buildPortfolioSnapshot } = await import("@/lib/market-data");
    const snapshot = buildPortfolioSnapshot();

    const orphan = snapshot.holdings.find((h) => h.symbol === "FAKE");
    expect(orphan).toBeDefined();
    expect(orphan!.name).toBe("FAKE");
    expect(orphan!.sector).toBe("Unknown");
    expect(orphan!.currentPrice).toBe(50);
    expect(orphan!.marketValue).toBe(500);
    expect(orphan!.gainLoss).toBe(0);
    expect(orphan!.gainLossPercent).toBe(0);
  });

  it("orphan holdings do not contribute to dayChange", async () => {
    vi.resetModules();

    vi.doMock("@/lib/mock-data", async () => {
      const actual = await vi.importActual<typeof import("@/lib/mock-data")>(
        "@/lib/mock-data",
      );

      const orphanHolding: Holding = {
        symbol: "GHOST",
        shares: 100,
        averageCost: 200,
      };

      return {
        ...actual,
        portfolioHoldings: [orphanHolding],
      };
    });

    const { buildPortfolioSnapshot } = await import("@/lib/market-data");
    const snapshot = buildPortfolioSnapshot();

    expect(snapshot.dayChange).toBe(0);
  });
});
