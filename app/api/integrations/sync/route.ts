import { NextResponse } from "next/server";

/**
 * In-memory store for sync jobs keyed by provider.
 * Each entry tracks lifecycle state, timestamps, retry count, and provider identity.
 *
 * FDL-758: meaningful sync lifecycle (syncing -> completed | failed)
 * FDL-759: provider identity and last-success timestamps
 * FDL-760: failure and retry states
 */
interface SyncJob {
  provider: string;
  status: "syncing" | "completed" | "failed";
  startedAt: string;
  completedAt: string | null;
  lastSuccess: string | null;
  retryCount: number;
  error: string | null;
}

const syncJobs = new Map<string, SyncJob>();

export async function POST(request: Request) {
  let provider = "broker";
  let retry = false;

  try {
    const body = await request.json();
    if (body.provider) provider = body.provider;
    if (body.retry) retry = body.retry;
  } catch {
    // Default to broker if no body provided
  }

  const existing = syncJobs.get(provider);

  // FDL-760: If retrying a failed job, increment retry count
  const retryCount =
    retry && existing?.status === "failed"
      ? existing.retryCount + 1
      : (existing?.retryCount ?? 0);

  // FDL-758: Simulate sync lifecycle — randomly succeed or fail
  const willSucceed = Math.random() > 0.2;
  const now = new Date().toISOString();

  const job: SyncJob = {
    provider,
    status: willSucceed ? "completed" : "failed",
    startedAt: now,
    completedAt: now,
    lastSuccess: willSucceed ? now : (existing?.lastSuccess ?? null),
    retryCount: willSucceed ? 0 : retryCount + (retry ? 0 : 1),
    error: willSucceed ? null : "Upstream provider timeout",
  };

  syncJobs.set(provider, job);

  // FDL-759: Include provider identity and last-success timestamp in response
  return NextResponse.json(
    {
      provider: job.provider,
      status: job.status,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      lastSuccess: job.lastSuccess,
      retryCount: job.retryCount,
      error: job.error,
    },
    { status: job.status === "completed" ? 200 : 502 },
  );
}
