import React from 'react';
import { Card, CardContent, Skeleton, Box, Stack } from '@mui/material';

export const SkeletonCard: React.FC = () => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={1}>
          <Box>
            <Skeleton variant="text" width={120} height={28} />
            <Skeleton
              variant="rounded"
              width={60}
              height={24}
              sx={{ mt: 0.5 }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rounded" width={70} height={24} />
            <Skeleton variant="rounded" width={80} height={24} />
          </Stack>
        </Stack>

        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />

        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />

        <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1.5 }} />

        <Stack spacing={1}>
          <Box>
            <Skeleton variant="text" width={80} height={16} />
            <Skeleton variant="text" width={100} height={28} />
          </Box>
          <Skeleton variant="rounded" width={130} height={36} />
        </Stack>
      </CardContent>
    </Card>
  );
};
