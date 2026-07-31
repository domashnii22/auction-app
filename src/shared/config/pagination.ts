export const PAGINATION = {
  DEFAULT_LIMIT: 3,
  MAX_LIMIT: 50,
  MIN_LIMIT: 1,
  DEFAULT_PAGE: 1,
} as const;

export type PaginationConfig = typeof PAGINATION;
