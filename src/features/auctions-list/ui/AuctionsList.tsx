import React from 'react';
import { useAuctionsList } from '../model/useAuctionsList';
import { Grid, Pagination, Typography, Stack } from '@mui/material';
import { AuctionCard } from '@/widgets/auction-card/ui/AuctionCard';
import { SkeletonList } from '../../../widgets/skeletons/SkeletonList';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import type { SearchFilters } from './Filters';

interface AuctionsListProps {
  page: number;
  limit: number;
  filters?: SearchFilters;
  onPageChange: (page: number) => void;
  onResetFilters?: () => void;
  onRetry?: () => void;
}

export const AuctionsList: React.FC<AuctionsListProps> = ({
  page,
  limit,
  filters,
  onPageChange,
  onResetFilters,
  onRetry,
}) => {
  const { data, isLoading, error, isFetching, refetch } = useAuctionsList({
    page,
    limit,
    filters,
  });

  const hasFilters =
    filters &&
    Object.values(filters).some(
      (value) => value !== undefined && value !== '' && value !== null,
    );

  if (isLoading) {
    return <SkeletonList count={3} />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => {
          if (onRetry) {
            onRetry();
          } else {
            refetch();
          }
        }}
      />
    );
  }

  if (!data || data.items.length === 0) {
    return <EmptyState hasFilters={hasFilters} onReset={onResetFilters} />;
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        {data.items.map((auction) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={auction.id}>
            <AuctionCard auction={auction} />
          </Grid>
        ))}
      </Grid>

      {isFetching && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 1 }}
        >
          Обновление...
        </Typography>
      )}

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
