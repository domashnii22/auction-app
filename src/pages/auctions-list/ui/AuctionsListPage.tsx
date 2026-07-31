import React, { useCallback } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { Filters } from '@features/auctions-list/ui/Filters';
import type { SearchParams } from '@/features/auctions-list/model/searchSchema';
import {
  filtersToSearchParams,
  searchParamsToFilters,
} from '@/features/auctions-list/model/filter-utils';
import type { IAuctionFilters } from '@/shared/types/api/auctions';
import { AuctionsList } from '@/features/auctions-list/ui/AuctionsList';

export const AuctionsListPage: React.FC = () => {
  const search = useSearch({ from: '/' }) as Partial<SearchParams>;
  const navigate = useNavigate();

  const page = search.page || 1;
  const limit = search.limit || 10;

  const filters = searchParamsToFilters(search);

  // Создаём полный объект search для навигации
  const buildFullSearch = useCallback(
    (overrides: Partial<SearchParams>): SearchParams => {
      return {
        page: overrides.page ?? search.page ?? 1,
        limit: overrides.limit ?? search.limit ?? 10,
        cargo_num: overrides.cargo_num ?? search.cargo_num ?? '',
        status: overrides.status || 'Active',
        statuses: overrides.statuses ?? search.statuses ?? [],
        auc_type: overrides.auc_type || 'Down',
        load_city: overrides.load_city ?? search.load_city ?? '',
        unload_city: overrides.unload_city ?? search.unload_city ?? '',
        date_from: overrides.date_from ?? search.date_from ?? '',
        date_to: overrides.date_to ?? search.date_to ?? '',
        is_available: overrides.is_available || true,
        is_bidder: overrides.is_bidder || true,
        price_from: overrides.price_from ?? search.price_from,
        price_to: overrides.price_to ?? search.price_to,
      };
    },
    [search],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const fullSearch = buildFullSearch({ page: newPage });
      navigate({
        to: '/',
        search: fullSearch,
      });
    },
    [navigate, buildFullSearch],
  );

  const handleFilterChange = useCallback(
    (newFilters: IAuctionFilters) => {
      const searchParams = filtersToSearchParams(newFilters);
      const fullSearch = buildFullSearch({
        ...searchParams,
        page: 1,
      });
      navigate({
        to: '/',
        search: fullSearch,
      });
    },
    [navigate, buildFullSearch],
  );

  const handleResetFilters = useCallback(() => {
    const fullSearch = buildFullSearch({
      page: 1,
      limit: 10,
      cargo_num: '',
      status: undefined,
      statuses: [],
      auc_type: undefined,
      load_city: '',
      unload_city: '',
      date_from: '',
      date_to: '',
      is_available: undefined,
      is_bidder: undefined,
      price_from: undefined,
      price_to: undefined,
    });
    navigate({
      to: '/',
      search: fullSearch,
    });
  }, [navigate, buildFullSearch]);

  return (
    <>
      <Filters onFilterChange={handleFilterChange} initialFilters={filters} />
      <AuctionsList
        page={page}
        limit={limit}
        filters={filters}
        onPageChange={handlePageChange}
        onResetFilters={handleResetFilters}
      />
    </>
  );
};
