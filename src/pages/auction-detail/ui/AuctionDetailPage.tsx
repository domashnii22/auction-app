import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Stack,
} from '@mui/material';
import { ArrowBack, Info, Gavel } from '@mui/icons-material';
import { useAuctionDetail } from '@/features/auction-detail/model/useAuctionDetail';
import { getDefaultSearchParams } from '@/features/auctions-list/model/searchSchema';
import { InfoTab } from '@/features/auction-detail/ui/InfoTab';
import { BetsTab } from '@/features/auction-detail/ui/BetsTab';

const TABS = [
  { value: 0, label: 'Информация', icon: <Info /> },
  { value: 1, label: 'Ставки', icon: <Gavel /> },
];

export const AuctionDetailPage: React.FC = () => {
  const { id } = useParams({ from: '/auctions/$id' }) as { id: string };
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const { data: auction, isLoading, error, refetch } = useAuctionDetail(id);

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
    },
    [],
  );

  const handleGoBack = useCallback(() => {
    navigate({
      to: '/',
      search: getDefaultSearchParams(),
    });
  }, [navigate]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={1}>
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  if (error || !auction) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
          Назад к списку
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction={'row'} spacing={3} style={{ paddingBottom: 20 }}>
        <IconButton onClick={handleGoBack} size="small">
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          Аукцион #{auction.cargoNumber}
        </Typography>
      </Stack>

      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange}>
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && <InfoTab auction={auction} />}
          {tabValue === 1 && <BetsTab auction={auction} />}
        </Box>
      </Paper>
    </Container>
  );
};
