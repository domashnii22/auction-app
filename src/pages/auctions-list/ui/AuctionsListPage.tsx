import React, { useCallback } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { Filters } from '@features/auctions-list/ui/Filters';
import { searchParamsToFilters } from '@/features/auctions-list/model/filter-utils';
import { AuctionsList } from '@/features/auctions-list/ui/AuctionsList';
import { PAGINATION } from '@/shared/config/pagination';
import type { SearchParams } from '@/features/auctions-list/model/searchSchema';

export const AuctionsListPage: React.FC = () => {
  const search = useSearch({ from: '/' });
  const navigate = useNavigate();

  const filters = searchParamsToFilters(search);

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
    (newFilters: SearchParams) => {
      navigate({
        to: '/',
        search: {
          ...search,
          ...newFilters,
          page: PAGINATION.DEFAULT_PAGE,
        },
      });
    },
    [navigate, search],
  );

  const handleResetFilters = useCallback(() => {
    navigate({
      to: '/',
      search: {
        page: 1,
        limit: 10,
        cargo_num: undefined,
        status: undefined,
        statuses: [],
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
      <Filters onFilterChange={handleFilterChange} initialFilters={filters} />
      <AuctionsList
        page={search.page}
        limit={search.limit}
        filters={filters}
        onPageChange={handlePageChange}
        onResetFilters={handleResetFilters}
      />
    </>
  );
};
