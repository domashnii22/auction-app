import React from 'react';
import { Typography, Paper, Button, Stack } from '@mui/material';
import { SearchOff, Filter, Refresh } from '@mui/icons-material';

interface EmptyStateProps {
  onReset?: () => void;
  hasFilters?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onReset,
  hasFilters = false,
}) => {
  return (
    <Paper
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: 2,
        bgcolor: 'background.default',
      }}
    >
      <Stack style={{ alignItems: 'center' }}>
        {hasFilters ? (
          <Filter
            sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }}
          />
        ) : (
          <SearchOff
            sx={{
              fontSize: 64,
              color: 'text.secondary',
              opacity: 0.5,
            }}
          />
        )}
      </Stack>

      <Typography variant="h5" color="text.secondary" gutterBottom>
        {hasFilters ? 'Аукционы не найдены' : 'Пока нет аукционов'}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {hasFilters
          ? 'Попробуйте изменить параметры фильтрации или сбросить все фильтры'
          : 'Новые аукционы появятся позже. Загляните сюда позже!'}
      </Typography>

      {onReset && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<Refresh />}
          onClick={onReset}
        >
          Сбросить фильтры
        </Button>
      )}
    </Paper>
  );
};
