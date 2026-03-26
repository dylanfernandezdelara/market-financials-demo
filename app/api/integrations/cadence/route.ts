import { NextRequest, NextResponse } from "next/server";
import type { SyncCadence, SyncCadenceSettings } from "@/types/finance";

const VALID_CADENCES: SyncCadence[] = ["15m", "1h", "4h", "1d", "manual"];

const CADENCE_MS: Record<SyncCadence, number> = {
  "15m": 900_000,
  "1h": 3_600_000,
  "4h": 14_400_000,
  "1d": 86_400_000,
  manual: 0,
};

const defaultSettings: SyncCadenceSettings = {
  cadence: "1h",
  enabled: false,
  lastSync: null,
  nextSync: null,
};

export async function GET() {
  return NextResponse.json(defaultSettings);
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const cadence = body.cadence as SyncCadence | undefined;
  const enabled = typeof body.enabled === "boolean" ? body.enabled : undefined;

  if (cadence !== undefined && !VALID_CADENCES.includes(cadence)) {
    return NextResponse.json(
      { error: "Invalid cadence value" },
      { status: 400 },
    );
  }

  const updated: SyncCadenceSettings = {
    cadence: cadence ?? defaultSettings.cadence,
    enabled: enabled ?? defaultSettings.enabled,
    lastSync: defaultSettings.lastSync,
    nextSync:
      (enabled ?? defaultSettings.enabled) && (cadence ?? defaultSettings.cadence) !== "manual"
        ? new Date(Date.now() + CADENCE_MS[cadence ?? defaultSettings.cadence]).toISOString()
        : null,
  };

  return NextResponse.json(updated);
}
