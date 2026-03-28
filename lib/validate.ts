import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";

/**
 * Parse `data` through `schema` and return a validated JSON response.
 *
 * If validation fails the route returns a 500 with a structured error
 * payload so issues surface immediately during development.
 */
export function validatedResponse<T>(
  schema: ZodSchema<T>,
  data: unknown,
  init?: { status?: number },
): NextResponse {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error("[validate] response schema mismatch", result.error.issues);

    return NextResponse.json(
      {
        error: "Response validation failed",
        issues: result.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      },
      { status: 500 },
    );
  }

  return NextResponse.json(result.data, init);
}
