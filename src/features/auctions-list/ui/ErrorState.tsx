import React from 'react';
import { Typography, Paper, Button, Alert, AlertTitle } from '@mui/material';
import { ErrorOutlined, Refresh } from '@mui/icons-material';

interface ErrorStateProps {
  error: Error | null;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 2,
        bgcolor: 'background.default',
      }}
    >
      <Alert
        severity="error"
        icon={<ErrorOutlined fontSize="large" />}
        sx={{
          borderRadius: 2,
          '& .MuiAlert-icon': {
            alignItems: 'center',
          },
        }}
      >
        <AlertTitle sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
          Не удалось загрузить аукционы
        </AlertTitle>

        <Typography variant="body2" sx={{ mb: 2 }}>
          {error?.message || 'Произошла неизвестная ошибка при загрузке данных'}
        </Typography>

        {onRetry && (
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<Refresh />}
            onClick={onRetry}
          >
            Попробовать снова
          </Button>
        )}
      </Alert>
    </Paper>
  );
};
