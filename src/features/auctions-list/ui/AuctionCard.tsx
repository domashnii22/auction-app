import React, { useCallback } from 'react';
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
  HelpOutlined,
  type SvgIconComponent,
} from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import type {
  AuctionTypesValues,
  IAuction,
  StatusValues,
} from '@/shared/types/api/auctions';
import { usePrefetchAuction } from '../model/usePrefetchAuction';

export const TYPE_LABELS: Record<AuctionTypesValues, string> = {
  Request: 'Запрос',
  Up: 'Повышение',
  Down: 'Понижение',
  FixPrice: 'Фиксированная цена',
};

export const TYPE_ICONS: Record<AuctionTypesValues, SvgIconComponent> = {
  Request: HelpOutlined,
  Up: TrendingUp,
  Down: TrendingDown,
  FixPrice: HelpOutlined,
};

export const STATUS_LABELS: Record<StatusValues, string> = {
  Active: 'Активный',
  Completed: 'Завершён',
  Cancelled: 'Отменён',
};

export const STATUS_COLORS: Record<
  StatusValues,
  'success' | 'default' | 'error'
> = {
  Active: 'success',
  Completed: 'default',
  Cancelled: 'error',
};

export type UserStatus = 'Leading' | 'Losing' | 'Winner' | 'NotParticipating';

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  Leading: 'Лидируете',
  Losing: 'Отстаёте',
  Winner: 'Победитель',
  NotParticipating: 'Не участвуете',
};

export const USER_STATUS_COLORS: Record<
  UserStatus,
  'info' | 'warning' | 'success' | 'default'
> = {
  Leading: 'info',
  Losing: 'warning',
  Winner: 'success',
  NotParticipating: 'default',
};

interface AuctionCardProps {
  auction: IAuction;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const navigate = useNavigate();
  const { prefetchAuction } = usePrefetchAuction();

  const TypeIcon = TYPE_ICONS[auction.type];

  const handleMouseEnter = useCallback(() => {
    prefetchAuction(auction.id);
  }, [prefetchAuction, auction.id]);

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
      onMouseEnter={handleMouseEnter}
      onClick={handleCardClick}
    >
      <CardContent>
        <Stack spacing={1}>
          <Box>
            <Typography variant="h6" component="div">
              Заявка #{auction.cargoNumber}
            </Typography>
            <Chip
              label={TYPE_LABELS[auction.type]}
              size="small"
              variant="outlined"
              icon={<TypeIcon />}
              sx={{ mt: 0.5 }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip
              label={STATUS_LABELS[auction.status]}
              color={STATUS_COLORS[auction.status]}
              size="small"
            />
            <Chip
              label={USER_STATUS_LABELS[auction.trading.userStatus]}
              color={USER_STATUS_COLORS[auction.trading.userStatus]}
              size="small"
              variant="outlined"
            />
            <Chip
              label={
                auction.trading.myBet ? 'Моя ставка есть' : 'Моей ставки нет'
              }
              color={auction.trading.myBet ? 'success' : 'error'}
              size="small"
              variant="outlined"
            />
          </Stack>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Stack direction={'row'} spacing={1}>
          <LocationOn fontSize="small" color="action" />
          <Typography variant="body2">
            {auction.route.from} → {auction.route.to}
          </Typography>
        </Stack>

        <Stack direction={'row'} spacing={1}>
          <CalendarToday fontSize="small" color="action" />
          <Typography variant="body2">
            Погрузка: {new Date(auction.dates.loading).toLocaleDateString()}
          </Typography>
        </Stack>

        <Stack direction={'row'} spacing={1}>
          <CalendarToday fontSize="small" color="action" />
          <Typography variant="body2">
            Загрузка: {new Date(auction.dates.unloading).toLocaleDateString()}
          </Typography>
        </Stack>

        <Stack direction={'row'} spacing={1}>
          <LocalShipping fontSize="small" color="action" />
          <Typography variant="body2">
            {auction.cargo.name} · {auction.cargo.weight}т ·{' '}
            {auction.cargo.volume}м³ · {auction.cargo.bodyType}
          </Typography>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1}>
          <Stack spacing={1}>
            <Typography variant="h6">
              Текущая цена: {auction.currentPrice.toLocaleString()} ₽
            </Typography>

            <Stack spacing={0.1}>
              <Typography variant="caption" color="text.secondary">
                Шаг: {auction.step} ₽
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Цена за км: {auction.pricePerKm} ₽
              </Typography>
            </Stack>
          </Stack>

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
