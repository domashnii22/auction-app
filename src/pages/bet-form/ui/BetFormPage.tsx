import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import {
  Container,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Typography,
  Stack,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { BetForm } from '@/features/bet-form/ui/BetForm';
import { useAuctionDetail } from '@/features/auction-detail/model/useAuctionDetail';

export const BetFormPage: React.FC = () => {
  const { id } = useParams({ from: '/bet-form/$id' }) as { id: string };
  const navigate = useNavigate();

  const { data: auction, isLoading, error, refetch } = useAuctionDetail(id);

  const handleGoBack = () => {
    navigate({
      to: `/auctions/${id}`,
    });
  };

  const handleSuccess = () => {
    navigate({
      to: `/auctions/${id}`,
    });
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack>
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  if (error || !auction) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Повторить
            </Button>
          }
        >
          Не удалось загрузить аукцион: {error?.message || 'Аукцион не найден'}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={handleGoBack} sx={{ mt: 2 }}>
          Назад к аукциону
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={1}>
        <IconButton onClick={handleGoBack} size="small">
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" component="h1">
          {auction.trading.myBet ? 'Изменить ставку' : 'Сделать ставку'}
        </Typography>
      </Stack>

      <BetForm auction={auction} onSuccess={handleSuccess} />
    </Container>
  );
};
