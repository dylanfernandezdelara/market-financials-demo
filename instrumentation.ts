import type { Instrumentation } from "next";

export function register() {
  // Server instance started — lightweight hook for future providers
}

export const onRequestError: Instrumentation.onRequestError = (
  error,
  request,
  context,
) => {
  const message =
    error instanceof Error ? error.message : String(error);
  const digest =
    error instanceof Error && "digest" in error
      ? (error as Error & { digest: string }).digest
      : undefined;

  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "error",
      message,
      digest,
      method: request.method,
      path: request.path,
      routePath: context.routePath,
      routeType: context.routeType,
      routerKind: context.routerKind,
    }),
  );
};
