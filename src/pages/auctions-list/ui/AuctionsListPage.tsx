import { AuctionsList } from '@/features/auctions-list/ui/AuctionsList';
import { Filters } from '@/features/auctions-list/ui/Filters';
import type { IAuctionFilters } from '@/shared/types/api/auctions';
import { useNavigate, useSearch } from '@tanstack/react-router';
import React, { useCallback, useState } from 'react';

interface SearchParams {
  page?: number;
  limit?: number;
  cargo_num?: string;
  load_city?: string;
  unload_city?: string;
  price_from?: string;
  price_to?: string;
}

export const AuctionsListPage: React.FC = () => {
  const search = useSearch({ from: '/' }) as SearchParams;
  const navigate = useNavigate();

  const page = search.page || 1;
  const limit = search.limit || 3;

  const filters: IAuctionFilters = {
    cargo_num: search.cargo_num || undefined,
    load_city: search.load_city || undefined,
    unload_city: search.unload_city || undefined,
    price_from: search.price_from ? Number(search.price_from) : undefined,
    price_to: search.price_to ? Number(search.price_to) : undefined,
  };

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
    (newFilters: IAuctionFilters) => {
      navigate({
        to: '/',
        search: {
          page: 1,
          cargo_num: newFilters.cargo_num || undefined,
          load_city: newFilters.load_city || undefined,
          unload_city: newFilters.unload_city || undefined,
          price_from: newFilters.price_from
            ? String(newFilters.price_from)
            : undefined,
          price_to: newFilters.price_to
            ? String(newFilters.price_to)
            : undefined,
        },
      });
    },
    [navigate],
  );

  const handleResetFilters = useCallback(() => {
    navigate({
      to: '/',
      search: { page: 1 },
    });
  }, [navigate]);

  const handleRetry = useCallback(() => {
    navigate({
      to: '/',
      search: search,
    });
  }, [navigate, search]);

  return (
    <>
      <Filters onFilterChange={handleFilterChange} initialFilters={filters} />
      <AuctionsList
        page={page}
        limit={limit}
        filters={filters}
        onPageChange={handlePageChange}
        onResetFilters={handleResetFilters}
        onRetry={handleRetry}
      />
    </>
  );
};
