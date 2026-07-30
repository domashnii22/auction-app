import React from 'react';
import { useAuctionsList } from '../model/useAuctionsList';
import {
  Grid,
  CircularProgress,
  Alert,
  Pagination,
  Typography,
  Stack,
} from '@mui/material';
import { AuctionCard } from '@/features/auctions-list/ui/AuctionCard';
import type { IAuctionFilters } from '@/shared/types/api/auctions';

const LIMIT = 3;

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
    limit: LIMIT,
    filters,
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (!data?.items.length) return <Typography>Нет аукционов</Typography>;

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        {data.items.map((auction) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={auction.id}>
            <AuctionCard auction={auction} />
          </Grid>
        ))}
      </Grid>
      {data.totalPages > 1 && (
        <Stack style={{ alignItems: 'center' }}>
          <Pagination
            count={data.totalPages}
            page={data.page}
            onChange={(_, value) => onPageChange(value)}
          />
        </Stack>
      )}
    </Stack>
  );
};
