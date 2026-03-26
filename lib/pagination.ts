import { NextRequest } from "next/server";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

export function parsePaginationParams(request: NextRequest): PaginationParams {
  const rawPage = Number(request.nextUrl.searchParams.get("page"));
  const rawLimit = Number(request.nextUrl.searchParams.get("limit"));

  const page =
    Number.isNaN(rawPage) || rawPage < 1
      ? DEFAULT_PAGE
      : Math.floor(rawPage);
  const limit =
    Number.isNaN(rawLimit) || rawLimit < 1
      ? DEFAULT_LIMIT
      : Math.min(Math.floor(rawLimit), MAX_LIMIT);

  return { page, limit };
}

export function paginate<T>(
  items: T[],
  params: PaginationParams,
): PaginatedResponse<T> {
  const { page, limit } = params;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const offset = (page - 1) * limit;
  const data = items.slice(offset, offset + limit);

  return {
    data,
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
}
