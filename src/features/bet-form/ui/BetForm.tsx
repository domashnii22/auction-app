import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Divider,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import {
  AttachMoney,
  Info,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { betSchema, type BetFormValues } from '../model/betSchema';
import { useBetForm } from '../model/useBetForm';
import type { IAuction } from '@/shared/types/api/auctions';

interface BetFormProps {
  auction: IAuction;
  onSuccess?: () => void;
}

export const BetForm: React.FC<BetFormProps> = ({ auction, onSuccess }) => {
  const {
    id,
    cargoNumber,
    currentPrice,
    step,
    trading: { canSetBet, minPrice, maxPrice, myBet },
  } = auction;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<BetFormValues>({
    resolver: zodResolver(betSchema(minPrice, maxPrice, step)),
    defaultValues: {
      price: myBet || minPrice,
    },
    mode: 'onChange',
  });

  const { mutate, isPending } = useBetForm({ auctionId: id, onSuccess });
  const watchedPrice = watch('price');

  const onSubmit = (data: BetFormValues) => {
    mutate(data.price);
  };

  const getPriceHint = () => {
    const current = watchedPrice || minPrice;
    const nextStep = Math.ceil((current - minPrice) / step) * step + minPrice;
    const prevStep = Math.floor((current - minPrice) / step) * step + minPrice;

    return {
      current: current,
      nextStep: nextStep > current ? nextStep : nextStep + step,
      prevStep: prevStep < current ? prevStep : prevStep - step,
    };
  };

  const priceHint = getPriceHint();

  if (!canSetBet) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Вы не можете сделать ставку в этом аукционе
        </Alert>
        <Typography variant="body2" color="text.secondary">
          {myBet
            ? 'Вы уже сделали ставку. Вы можете изменить её на странице аукциона.'
            : 'Возможно, аукцион завершён или достигнут лимит участников.'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Аукцион #{cargoNumber}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Текущая цена
              </Typography>
              <Typography variant="body1">
                {currentPrice.toLocaleString()} ₽
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Шаг ставки
              </Typography>
              <Typography variant="body1">{step.toLocaleString()} ₽</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Диапазон
              </Typography>
              <Typography variant="body1">
                {minPrice.toLocaleString()} — {maxPrice.toLocaleString()} ₽
              </Typography>
            </Box>
            {myBet && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Ваша текущая ставка
                </Typography>
                <Chip
                  label={`${myBet.toLocaleString()} ₽`}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          {myBet ? 'Изменить ставку' : 'Сделать ставку'}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              {...register('price', { valueAsNumber: true })}
              label="Сумма ставки"
              type="number"
              fullWidth
              variant="outlined"
              size="medium"
              error={!!errors.price}
              helperText={errors.price?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney />
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  step: step,
                  min: minPrice,
                  max: maxPrice,
                },
              }}
            />

            <Alert severity="info" icon={<Info />}>
              <Typography variant="body2">
                Доступная цена: {minPrice.toLocaleString()} —{' '}
                {maxPrice.toLocaleString()} ₽
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Шаг: {step.toLocaleString()} ₽
                {watchedPrice && (
                  <>
                    <br />
                    Предыдущий шаг: {priceHint.prevStep.toLocaleString()} ₽
                    {' → '}
                    Следующий шаг: {priceHint.nextStep.toLocaleString()} ₽
                  </>
                )}
              </Typography>
            </Alert>

            <Stack direction={'row'} spacing={1}>
              <Chip
                icon={<AttachMoney />}
                label={`Мин: ${minPrice.toLocaleString()} ₽`}
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<TrendingUp />}
                label={`Макс: ${maxPrice.toLocaleString()} ₽`}
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<TrendingDown />}
                label={`Шаг: ${step.toLocaleString()} ₽`}
                variant="outlined"
                size="small"
              />
            </Stack>

            <Stack direction={'row'} spacing={1}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={!isValid || isPending}
                startIcon={isPending ? <CircularProgress size={20} /> : null}
                sx={{ minWidth: 150 }}
              >
                {isPending
                  ? 'Отправка...'
                  : myBet
                    ? 'Изменить ставку'
                    : 'Сделать ставку'}
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => setValue('price', minPrice)}
              >
                Минимальная
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => setValue('price', maxPrice)}
              >
                Максимальная
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};
