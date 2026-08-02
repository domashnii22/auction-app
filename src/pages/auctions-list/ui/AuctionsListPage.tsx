import React, { useCallback } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import {
  Filters,
  type SearchFilters,
} from '@features/auctions-list/ui/Filters';
import { PAGINATION } from '@/shared/config/pagination';
import { getDefaultSearchParams } from '@/features/auctions-list/model/searchSchema';
import { AuctionsList } from '@/features/auctions-list/ui/AuctionsList';

export const AuctionsListPage: React.FC = () => {
  const search = useSearch({ from: '/' });
  const navigate = useNavigate();

  const { page, limit, ...filters } = search;

  console.log(filters.statuses);

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
    (newFilters: SearchFilters) => {
      navigate({
        to: '/',
        search: (prev) => ({
          ...prev,
          ...newFilters,
          page: PAGINATION.DEFAULT_PAGE,
          limit: PAGINATION.DEFAULT_LIMIT,
        }),
      });
    },
    [navigate],
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
