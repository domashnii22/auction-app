import React from 'react';
import { useAuctionsList } from '../model/useAuctionsList';
import {
  Box,
  Grid,
  CircularProgress,
  Alert,
  Pagination,
  Typography,
} from '@mui/material';
import { AuctionCard } from '@/features/auctions-list/ui/AuctionCard';
import type { IAuctionFilters } from '@/shared/types/api/auctions';

interface AuctionsListProps {
  page: number;
  filters?: IAuctionFilters;
  onPageChange: (page: number) => void;
}

export const AuctionsList: React.FC<AuctionsListProps> = ({
  page,
  filters,
  onPageChange,
}) => {
  const { data, isLoading, error } = useAuctionsList({
    page,
    limit: 10,
    filters,
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (!data?.items.length) return <Typography>Нет аукционов</Typography>;

  return (
    <Box>
      <Grid container spacing={3}>
        {data.items.map((auction) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={auction.id}>
            <AuctionCard auction={auction} />
          </Grid>
        ))}
      </Grid>
      {data.totalPages > 1 && (
        <Pagination
          count={data.totalPages}
          page={data.page}
          onChange={(_, value) => onPageChange(value)}
        />
      )}
    </Box>
  );
};
