import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  LocalShipping,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import type { IAuction } from '@/shared/types/api/auctions';

interface AuctionCardProps {
  auction: IAuction;
}

const statusColors = {
  Active: 'success',
  Completed: 'default',
  Cancelled: 'error',
} as const;

const userStatusLabels = {
  Leading: 'Лидируете',
  Losing: 'Отстаёте',
  Winner: 'Победитель',
  NotParticipating: 'Не участвуете',
};

const userStatusColors = {
  Leading: 'info',
  Losing: 'warning',
  Winner: 'success',
  NotParticipating: 'default',
} as const;

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate({ to: `/auctions/${auction.id}` });
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
          cursor: 'pointer',
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Stack spacing={1}>
          <Box>
            <Typography variant="h6" component="div">
              Заявка #{auction.cargoNumber}
            </Typography>
            <Chip
              label={auction.type}
              size="small"
              variant="outlined"
              icon={auction.type === 'Up' ? <TrendingUp /> : <TrendingDown />}
              sx={{ mt: 0.5 }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip
              label={auction.status}
              color={statusColors[auction.status]}
              size="small"
            />
            <Chip
              label={userStatusLabels[auction.trading.userStatus]}
              color={userStatusColors[auction.trading.userStatus]}
              size="small"
              variant="outlined"
            />
          </Stack>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        {/* Маршрут */}
        <Stack>
          <LocationOn fontSize="small" color="action" />
          <Typography variant="body2">
            {auction.route.from} → {auction.route.to}
          </Typography>
        </Stack>

        {/* Даты */}
        <Stack>
          <CalendarToday fontSize="small" color="action" />
          <Typography variant="body2">
            Погрузка: {new Date(auction.dates.loading).toLocaleDateString()}
          </Typography>
        </Stack>

        {/* Груз */}
        <Stack>
          <LocalShipping fontSize="small" color="action" />
          <Typography variant="body2">
            {auction.cargo.name} · {auction.cargo.weight}т ·{' '}
            {auction.cargo.volume}м³
          </Typography>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        {/* Цена и действия */}
        <Stack>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Текущая цена
            </Typography>
            <Typography variant="h6">
              {auction.currentPrice.toLocaleString()} ₽
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Шаг: {auction.step} ₽
            </Typography>
          </Box>

          <Button
            variant={auction.trading.myBet ? 'outlined' : 'contained'}
            color="primary"
            size="small"
            disabled={!auction.trading.canSetBet}
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: `/auctions/${auction.id}/bet-form` });
            }}
          >
            {auction.trading.myBet ? 'Изменить ставку' : 'Сделать ставку'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
