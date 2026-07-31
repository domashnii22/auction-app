import React, { useCallback } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { Filters } from '@features/auctions-list/ui/Filters';
import { PAGINATION } from '@/shared/config/pagination';
import type { SearchParams } from '@/features/auctions-list/model/searchSchema';

export const AuctionsListPage: React.FC = () => {
  const search = useSearch({ from: '/' }) as SearchParams;
  const navigate = useNavigate();

  const { page, limit, ...filters } = search;

  const handlePageChange = useCallback(
    (newPage: number) => {
      navigate({
        to: '/',
        search: { ...search, page: newPage } as SearchParams,
      });
    },
    [navigate, search],
  );

  const handleFilterChange = useCallback(
    (newFilters: Partial<SearchParams>) => {
      navigate({
        to: '/',
        search: {
          ...search,
          ...newFilters,
          page: PAGINATION.DEFAULT_PAGE,
        } as SearchParams,
      });
    },
    [navigate, search],
  );

  const handleResetFilters = useCallback(() => {
    navigate({
      to: '/',
      search: {
        page: PAGINATION.DEFAULT_PAGE,
        limit: PAGINATION.DEFAULT_LIMIT,
        cargo_num: undefined,
        status: undefined,
        statuses: undefined,
        auc_type: undefined,
        load_city: undefined,
        unload_city: undefined,
        date_from: undefined,
        date_to: undefined,
        is_available: false,
        is_bidder: false,
        price_from: 0,
        price_to: 0,
      },
    });
  }, [navigate]);

  return (
    <>
      <Filters
        onFilterChange={handleFilterChange}
        filters={search}
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
