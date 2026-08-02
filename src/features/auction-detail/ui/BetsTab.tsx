import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Stack,
  Tooltip,
} from '@mui/material';
import type { IAuction } from '@/shared/types/api/auctions';
import { useBets } from '../model/useBets';

interface BetsTabProps {
  auction: IAuction;
}

export const BetsTab: React.FC<BetsTabProps> = ({ auction }) => {
  const { data, isLoading, error } = useBets(auction.id);

  if (auction.hideBetsHistory) {
    return <Alert severity="info">История ставок скрыта организатором</Alert>;
  }

  if (isLoading) {
    return (
      <Stack>
        <CircularProgress />
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Не удалось загрузить ставки: {error.message}
      </Alert>
    );
  }

  if (!data || data.bets.length === 0) {
    return (
      <Stack>
        <Typography variant="body1" color="text.secondary">
          Пока нет ни одной ставки
        </Typography>
      </Stack>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Всего ставок: {data.bets.length}
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell>
                <strong>№</strong>
              </TableCell>
              <TableCell>
                <strong>Цена без НДС</strong>
              </TableCell>
              <TableCell>
                <strong>Цена с НДС</strong>
              </TableCell>
              <TableCell>
                <strong>Участник</strong>
              </TableCell>
              <TableCell>
                <strong>Место в рейтинге</strong>
              </TableCell>
              <TableCell>
                <strong>Дата</strong>
              </TableCell>
              <TableCell>
                <strong>Статус</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.bets.map((bet, index) => (
              <TableRow key={bet.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Typography>{bet.price.toLocaleString()} ₽</Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {(bet.price * 1.2).toLocaleString()} ₽
                  </Typography>
                </TableCell>
                <TableCell>
                  {bet.participant === 'me' ? 'Вы' : bet.participant}
                </TableCell>
                <TableCell>
                  {bet.rating ? (
                    <Chip
                      label={`#${bet.rating}`}
                      size="small"
                      color={bet.rating === 1 ? 'success' : 'default'}
                      variant={bet.rating === 1 ? 'filled' : 'outlined'}
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(bet.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {bet.isCancelled ? (
                    <Tooltip title={bet.cancelReason}>
                      <Chip label="Отменена" color="error" size="small" />
                    </Tooltip>
                  ) : bet.isWinner ? (
                    <Chip label="Победитель" color="success" size="small" />
                  ) : (
                    <Chip
                      label="Участник"
                      color="default"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
