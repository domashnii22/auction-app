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
} from '@mui/material';
import type { IAuction } from '@/shared/types/api/auctions';
import { useBets } from '../model/useBets';

interface BetsTabProps {
  auction: IAuction;
}

export const BetsTab: React.FC<BetsTabProps> = ({ auction }) => {
  const { data: bets, isLoading, error } = useBets(auction.id);

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

  if (!bets || bets.length === 0) {
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
        Всего ставок: {bets.length}
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell>
                <strong>№</strong>
              </TableCell>
              <TableCell>
                <strong>Цена</strong>
              </TableCell>
              <TableCell>
                <strong>Участник</strong>
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
            {bets.map((bet, index) => (
              <TableRow key={bet.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Typography>{bet.price.toLocaleString()} ₽</Typography>
                </TableCell>
                <TableCell>{bet.participant}</TableCell>
                <TableCell>
                  {new Date(bet.createdAt).toLocaleString('ru-RU')}
                </TableCell>
                <TableCell>
                  {bet.isCancelled ? (
                    <Chip label="Отменена" color="error" size="small" />
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
                  {bet.cancelReason && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      {bet.cancelReason}
                    </Typography>
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
