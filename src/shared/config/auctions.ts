import {
  HelpOutlined,
  TrendingDown,
  TrendingUp,
  type SvgIconComponent,
} from '@mui/icons-material';
import type {
  AuctionStatusValues,
  AuctionTypesValues,
  UserStatusValues,
} from '../types/api';

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

export const STATUS_LABELS: Record<AuctionStatusValues, string> = {
  Active: 'Активный',
  Completed: 'Завершён',
  Cancelled: 'Отменён',
};

export const STATUS_COLORS: Record<
  AuctionStatusValues,
  'success' | 'default' | 'error'
> = {
  Active: 'success',
  Completed: 'default',
  Cancelled: 'error',
};

export const USER_STATUS_LABELS: Record<UserStatusValues, string> = {
  Leading: 'Лидируете',
  Losing: 'Отстаёте',
  Winner: 'Победитель',
  NotParticipating: 'Не участвуете',
};

export const USER_STATUS_COLORS: Record<
  UserStatusValues,
  'info' | 'warning' | 'success' | 'default'
> = {
  Leading: 'info',
  Losing: 'warning',
  Winner: 'success',
  NotParticipating: 'default',
};
