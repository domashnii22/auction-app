import { AuctionsList } from '@/features/auctions-list/ui/AuctionsList';
import { Filters } from '@/features/auctions-list/ui/Filters';
import React, { useState } from 'react';

export const AuctionsListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});

  return (
    <>
      <Filters onFilterChange={setFilters} />
      <AuctionsList page={page} filters={filters} onPageChange={setPage} />
    </>
  );
};
