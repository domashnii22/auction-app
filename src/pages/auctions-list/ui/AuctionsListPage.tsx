import React, { useCallback } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { Filters } from '@features/auctions-list/ui/Filters';
import { PAGINATION } from '@/shared/config/pagination';
import {
  getDefaultSearchParams,
  type SearchParams,
} from '@/features/auctions-list/model/searchSchema';

export type SearchFilters = Omit<SearchParams, 'page' | 'limit'>;

export const AuctionsListPage: React.FC = () => {
  const search = useSearch({ from: '/' });
  const navigate = useNavigate();

  const { page, limit, ...filters } = search;

  const handlePageChange = useCallback(
    (newPage: number) => {
      navigate({
        to: '/',
        search: { ...search, page: newPage },
      });
    },
    [navigate, search],
  );

  const handleFilterChange = useCallback(
    (newFilters: Partial<SearchParams>) => {
      const serializedFilters = {
        ...newFilters,
        statuses: newFilters.statuses?.length
          ? JSON.stringify(newFilters.statuses)
          : undefined,
      };

      navigate({
        to: '/',
        search: {
          ...search,
          ...serializedFilters,
          page: PAGINATION.DEFAULT_PAGE,
        } as SearchParams,
      });
    },
    [navigate, search],
  );

  const handleResetFilters = useCallback(() => {
    navigate({
      to: '/',
      search: getDefaultSearchParams(),
    });
  }, [navigate]);

  return (
    <>
      <Filters
        onFilterChange={handleFilterChange}
        filters={filters}
        onResetFilters={handleResetFilters}
      />
      {/* <AuctionsList
        page={search.page}
        limit={search.limit}
        filters={filters}
        onPageChange={handlePageChange}
        onResetFilters={handleResetFilters}
      /> */}
    </>
  );
};
