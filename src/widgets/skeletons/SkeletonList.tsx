import React from 'react';
import { Grid, Box } from '@mui/material';
import { SkeletonCard } from './SkeletonCard';

interface SkeletonListProps {
  count?: number;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({ count = 6 }) => {
  return (
    <Box>
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <SkeletonCard />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
