import { NextRequest, NextResponse } from "next/server";
import type {
  SyncProviderError,
  SyncRateLimitInfo,
  SyncResponse,
  SyncStatus,
} from "@/types/finance";

/* ------------------------------------------------------------------ */
/*  In-memory rate-limit state (per-process; resets on restart)        */
/* ------------------------------------------------------------------ */

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

const buckets = new Map<string, { timestamps: number[] }>();

function clientKey(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous"
  );
}

function enforceRateLimit(key: string): {
  allowed: boolean;
  info: SyncRateLimitInfo;
} {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    buckets.set(key, bucket);
  }

  bucket.timestamps = bucket.timestamps.filter((t) => t > windowStart);

  const remaining = Math.max(0, RATE_LIMIT_MAX - bucket.timestamps.length);
  const resetAt = new Date(now + RATE_LIMIT_WINDOW_MS).toISOString();

  if (remaining === 0) {
    return {
      allowed: false,
      info: { limit: RATE_LIMIT_MAX, remaining: 0, resetAt },
    };
  }

  bucket.timestamps.push(now);

  // Evict stale buckets to prevent unbounded Map growth
  for (const [k, b] of buckets) {
    if (k !== key && b.timestamps.every((t) => t <= windowStart)) {
      buckets.delete(k);
    }
  }

  return {
    allowed: true,
    info: {
      limit: RATE_LIMIT_MAX,
      remaining: remaining - 1,
      resetAt,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Simulated provider-error modeling                                  */
/* ------------------------------------------------------------------ */

const PROVIDER_CONFIGS = [
  { provider: "market-feed", failureRate: 0.1 },
  { provider: "portfolio-svc", failureRate: 0.05 },
] as const;

function simulateProviderErrors(): SyncProviderError[] {
  const errors: SyncProviderError[] = [];
  for (const cfg of PROVIDER_CONFIGS) {
    if (Math.random() < cfg.failureRate) {
      errors.push({
        provider: cfg.provider,
        code: "UPSTREAM_TIMEOUT",
        message: `${cfg.provider} did not respond within the deadline`,
        retryable: true,
      });
    }
  }
  return errors;
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  const key = clientKey(request);
  const { allowed, info: rateLimit } = enforceRateLimit(key);

  if (!allowed) {
    const body: SyncResponse = {
      status: "failed",
      lastSync: null,
      rateLimit,
      providerErrors: [],
    };
    return NextResponse.json(body, {
      status: 429,
      headers: {
        "Retry-After": "60",
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": rateLimit.resetAt,
      },
    });
  }

  const providerErrors = simulateProviderErrors();
  const hasErrors = providerErrors.length > 0;

  const status: SyncStatus = hasErrors ? "failed" : "pending";
  const lastSync = hasErrors ? null : new Date().toISOString();

  const body: SyncResponse = {
    status,
    lastSync,
    rateLimit,
    providerErrors,
  };

  return NextResponse.json(body, {
    status: hasErrors ? 502 : 202,
    headers: {
      "X-RateLimit-Limit": String(rateLimit.limit),
      "X-RateLimit-Remaining": String(rateLimit.remaining),
      "X-RateLimit-Reset": rateLimit.resetAt,
    },
  });
}

export async function GET(request: NextRequest) {
  const key = clientKey(request);
  const bucket = buckets.get(key);
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = bucket
    ? bucket.timestamps.filter((t) => t > windowStart).length
    : 0;

  const rateLimit: SyncRateLimitInfo = {
    limit: RATE_LIMIT_MAX,
    remaining: Math.max(0, RATE_LIMIT_MAX - recent),
    resetAt: new Date(now + RATE_LIMIT_WINDOW_MS).toISOString(),
  };

  const body: SyncResponse = {
    status: "pending",
    lastSync: null,
    rateLimit,
    providerErrors: [],
  };

  return NextResponse.json(body, {
    headers: {
      "X-RateLimit-Limit": String(rateLimit.limit),
      "X-RateLimit-Remaining": String(rateLimit.remaining),
      "X-RateLimit-Reset": rateLimit.resetAt,
    },
  });
}
