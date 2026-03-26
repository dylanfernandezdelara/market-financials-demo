import { NextRequest, NextResponse } from "next/server";

/* ------------------------------------------------------------------ */
/*  FDL-860 – Simple in-memory rate-limiter for this demo route       */
/* ------------------------------------------------------------------ */
const RATE_WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;
const requestLog: number[] = [];

function isRateLimited(): boolean {
  const now = Date.now();
  // Evict entries outside the window
  while (requestLog.length > 0 && requestLog[0] <= now - RATE_WINDOW_MS) {
    requestLog.shift();
  }
  if (requestLog.length >= MAX_REQUESTS) {
    return true;
  }
  requestLog.push(now);
  return false;
}

/* ------------------------------------------------------------------ */
/*  FDL-708 – In-memory export history for previous-download visibility */
/* ------------------------------------------------------------------ */
interface ExportRecord {
  id: string;
  format: string;
  exportedAt: string;
  recordCount: number;
}

const exportHistory: ExportRecord[] = [];

/** GET – return the list of previous exports (FDL-708) */
export async function GET() {
  return NextResponse.json({ exports: exportHistory });
}

/** POST – trigger a new export */
export async function POST(request: NextRequest) {
  // FDL-860 – rate-limit check
  if (isRateLimited()) {
    return NextResponse.json(
      { error: "rate limit exceeded – try again shortly" },
      { status: 429 },
    );
  }

  const fmt = request.nextUrl.searchParams.get("format") ?? "csv";

  if (fmt === "pdf") {
    return NextResponse.json({ error: "unsupported" }, { status: 501 });
  }

  // FDL-708 – record this export in history
  const record: ExportRecord = {
    id: crypto.randomUUID(),
    format: fmt,
    exportedAt: new Date().toISOString(),
    recordCount: 0,
  };
  exportHistory.unshift(record);

  // FDL-706 – return artifact metadata instead of a self-referential URL
  // FDL-860 – include a non-production demo warning
  return NextResponse.json({
    demo: true,
    warning: "Non-production demo endpoint – do not rely on for real data",
    artifact: {
      id: record.id,
      format: record.format,
      exportedAt: record.exportedAt,
      recordCount: record.recordCount,
    },
  });
}
