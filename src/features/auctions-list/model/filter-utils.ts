import type { IAuctionFilters } from '@/shared/types/api/auctions';
import type { SearchParams } from './searchSchema';

export const searchParamsToFilters = (
  params: Partial<SearchParams>,
): IAuctionFilters => {
  return {
    cargo_num: params.cargo_num || undefined,
    status: params.status,
    statuses: params.statuses?.length ? params.statuses : [],
    auc_type: params.auc_type,
    load_city: params.load_city || undefined,
    unload_city: params.unload_city || undefined,
    date_from: params.date_from || undefined,
    date_to: params.date_to || undefined,
    is_available: params.is_available,
    is_bidder: params.is_bidder,
    price_from: params.price_from,
    price_to: params.price_to,
  };
};

export const filtersToSearchParams = (
  filters: IAuctionFilters,
): Partial<SearchParams> => {
  return {
    cargo_num: filters.cargo_num || undefined,
    status: filters.status || undefined,
    statuses: filters.statuses?.length ? filters.statuses : [],
    auc_type: filters.auc_type || undefined,
    load_city: filters.load_city || undefined,
    unload_city: filters.unload_city || undefined,
    date_from: filters.date_from || undefined,
    date_to: filters.date_to || undefined,
    is_available: filters.is_available,
    is_bidder: filters.is_bidder,
    price_from: filters.price_from || undefined,
    price_to: filters.price_to || undefined,
  };
};

export const hasActiveFilters = (filters: IAuctionFilters): boolean => {
  return Object.values(filters).some(
    (value) =>
      value !== undefined &&
      value !== '' &&
      value !== null &&
      !(Array.isArray(value) && value.length === 0),
  );
};
