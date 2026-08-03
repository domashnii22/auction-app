import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Alert,
  Button,
} from '@mui/material';
import { Phone, Email, LocationOn, Business } from '@mui/icons-material';
import type { IAuction } from '@/shared/types/api/auctions';
import {
  STATUS_COLORS,
  STATUS_LABELS,
  TYPE_LABELS,
  USER_STATUS_LABELS,
} from '@/features/auctions-list/ui/AuctionCard';

interface InfoTabProps {
  auction: IAuction;
}

export const InfoTab: React.FC<InfoTabProps> = ({ auction }) => {
  const navigate = useNavigate();

  const { hidePointsAddressAndContacts, noViewCargoPrice } = auction;

  const showContacts =
    !hidePointsAddressAndContacts && auction.organizer.contacts;

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Основные данные
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Номер заявки
                </Typography>
                <Typography variant="body1">{auction.cargoNumber}</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Тип аукциона
                </Typography>
                <Typography variant="body1">
                  {TYPE_LABELS[auction.type] || auction.type}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack
                  direction={'row'}
                  spacing={1}
                  style={{ alignItems: 'center' }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Статус аукциона
                  </Typography>
                  <Chip
                    label={STATUS_LABELS[auction.status]}
                    color={STATUS_COLORS[auction.status]}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack
                  direction={'row'}
                  spacing={1}
                  style={{ alignItems: 'center' }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Ваш торговый статус
                  </Typography>
                  <Chip
                    label={
                      USER_STATUS_LABELS[auction.trading.userStatus] ||
                      auction.trading.userStatus
                    }
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Организатор
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack
              direction={'row'}
              spacing={1}
              style={{ alignItems: 'center' }}
            >
              <Business fontSize="small" color="action" />
              <Typography variant="body1">{auction.organizer.name}</Typography>
            </Stack>

            {showContacts && (
              <Stack spacing={1}>
                {auction.organizer.contacts?.phone && (
                  <Stack
                    direction={'row'}
                    spacing={1}
                    style={{ alignItems: 'center' }}
                  >
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body1">
                      {auction.organizer.contacts.phone}
                    </Typography>
                  </Stack>
                )}
                {auction.organizer.contacts?.email && (
                  <Stack
                    direction={'row'}
                    spacing={1}
                    style={{ alignItems: 'center' }}
                  >
                    <Email fontSize="small" color="action" />
                    <Typography variant="body1">
                      {auction.organizer.contacts.email}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            )}

            {!showContacts && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Контакты скрыты организатором
              </Alert>
            )}
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Маршрут
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack
              direction={'row'}
              spacing={1}
              style={{ alignItems: 'center' }}
            >
              <LocationOn color="primary" />
              <Typography variant="body1">
                {auction.route.from} → {auction.route.to}
              </Typography>
            </Stack>

            {!hidePointsAddressAndContacts && (
              <Stack spacing={1}>
                <Alert severity="info" sx={{ mt: 1 }}>
                  Погрузка: {auction.route.from}
                  <br />
                  Выгрузка: {auction.route.to}
                </Alert>
              </Stack>
            )}
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Груз и требования к ТС
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Наименование груза
                </Typography>
                <Typography variant="body1">
                  {noViewCargoPrice ? '***' : auction.cargo.name}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Вес
                </Typography>
                <Typography variant="body1">
                  {noViewCargoPrice
                    ? '***'
                    : `${auction.cargo.weight / 1000} т`}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Объём
                </Typography>
                <Typography variant="body1">
                  {noViewCargoPrice ? '***' : `${auction.cargo.volume} м³`}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Тип кузова
                </Typography>
                <Typography variant="body1">
                  {auction.cargo.bodyType}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Условия оплаты
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Цена за км
                </Typography>
                <Typography variant="body1">
                  {auction.pricePerKm} ₽/км
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Текущая цена
                </Typography>
                <Typography variant="body1" color="primary">
                  {auction.currentPrice.toLocaleString()} ₽
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Параметры торгов
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Текущая цена
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {auction.currentPrice.toLocaleString()} ₽
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Доступная цена
                  </Typography>
                  <Typography variant="body1">
                    {auction.trading.canSetBet ? 'Доступна' : 'Недоступна'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Диапазон цен
                  </Typography>
                  <Typography variant="body1">
                    {auction.trading.minPrice.toLocaleString()} ₽ —{' '}
                    {auction.trading.maxPrice.toLocaleString()} ₽
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Шаг ставки
                  </Typography>
                  <Typography variant="body1">
                    {auction.step.toLocaleString()} ₽
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ваша ставка
                  </Typography>
                  <Typography variant="body1">
                    {auction.trading.myBet
                      ? `${auction.trading.myBet.toLocaleString()} ₽`
                      : 'Нет ставки'}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Дата погрузки
                  </Typography>
                  <Typography variant="body2">
                    {new Date(auction.dates.loading).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Дата выгрузки
                  </Typography>
                  <Typography variant="body2">
                    {new Date(auction.dates.unloading).toLocaleDateString()}
                  </Typography>
                </Box>

                <Divider />

                <Stack spacing={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!auction.trading.canSetBet}
                    onClick={() => navigate({ to: `/bet-form/${auction.id}` })}
                  >
                    {auction.trading.myBet
                      ? 'Изменить ставку'
                      : 'Сделать ставку'}
                  </Button>
                </Stack>

                {!auction.trading.canSetBet && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    Вы не можете сделать ставку в этом аукционе
                  </Alert>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
