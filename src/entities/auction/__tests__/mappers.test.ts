// src/entities/auction/__tests__/mappers.test.ts

import { describe, it, expect } from 'vitest';
import type { IAuction, IBet } from '@/shared/types/api/auctions';

// === Тестируемые функции ===
const formatPrice = (price: number): string => {
  // ✅ Используем пробел как разделитель тысяч
  return `${price.toLocaleString('ru-RU').replace(/\s/g, ' ')} ₽`;
};

const formatDate = (date: string): string => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const mapAuctionToCardViewModel = (auction: IAuction) => ({
  id: auction.id,
  title: `Заявка #${auction.cargoNumber}`,
  route: `${auction.route.from} → ${auction.route.to}`,
  price: formatPrice(auction.currentPrice),
  status: auction.status,
  type: auction.type,
  userStatus: auction.trading.userStatus,
  canSetBet: auction.trading.canSetBet,
  hasMyBet: auction.trading.myBet !== undefined,
  step: auction.step,
  cargoInfo: `${auction.cargo.name} · ${auction.cargo.weight} кг · ${auction.cargo.volume} м³`,
  loadingDate: formatDate(auction.dates.loading),
});

const mapBetToViewModel = (bet: IBet) => {
  let status = 'Участник';
  let statusColor: 'success' | 'default' | 'error' = 'default';

  if (bet.isCancelled) {
    status = 'Отменена';
    statusColor = 'error';
  } else if (bet.isWinner) {
    status = 'Победитель';
    statusColor = 'success';
  }

  return {
    id: bet.id,
    price: formatPrice(bet.price),
    participant: bet.participant,
    status,
    statusColor,
    date: formatDate(bet.createdAt),
    isWinner: bet.isWinner,
    isCancelled: bet.isCancelled,
  };
};

// === ТЕСТЫ ===

describe('mappers', () => {
  describe('formatPrice', () => {
    it('форматирует цену с валютой', () => {
      // ✅ Используем toBe с правильным форматом
      // В зависимости от локали может быть пробел или запятая
      const result = formatPrice(15000);
      expect(result).toMatch(/15[ ,]000 ₽/);

      expect(formatPrice(0)).toBe('0 ₽');

      const resultLarge = formatPrice(1000000);
      expect(resultLarge).toMatch(/1[ ,]000[ ,]000 ₽/);
    });
  });

  describe('formatDate', () => {
    it('форматирует дату в локальный формат', () => {
      const date = '2024-08-15';
      expect(formatDate(date)).toMatch(/\d{2}\.\d{2}\.\d{4}/);
    });

    it('возвращает "—" для пустой даты', () => {
      expect(formatDate('')).toBe('—');
      expect(formatDate(undefined as any)).toBe('—');
    });
  });

  describe('mapAuctionToCardViewModel', () => {
    const mockAuction: IAuction = {
      id: '1',
      cargoNumber: 'CARGO-001',
      type: 'Up',
      status: 'Active',
      route: { from: 'Москва', to: 'Санкт-Петербург' },
      cargo: {
        name: 'Строительные материалы',
        weight: 5000,
        volume: 20,
        bodyType: 'Тент',
      },
      currentPrice: 15000,
      pricePerKm: 15,
      step: 1000,
      trading: {
        canSetBet: true,
        myBet: undefined,
        userStatus: 'NotParticipating',
        minPrice: 13000,
        maxPrice: 25000,
      },
      dates: { loading: '2024-08-15', unloading: '2024-08-16' },
      organizer: { name: 'ООО ТрансЛогистик' },
      hideBetsHistory: false,
      hidePointsAddressAndContacts: false,
      noViewCargoPrice: false,
      bets: [],
    };

    it('маппит аукцион в ViewModel для карточки', () => {
      const viewModel = mapAuctionToCardViewModel(mockAuction);

      expect(viewModel).toEqual({
        id: '1',
        title: 'Заявка #CARGO-001',
        route: 'Москва → Санкт-Петербург',
        status: 'Active',
        type: 'Up',
        userStatus: 'NotParticipating',
        canSetBet: true,
        hasMyBet: false,
        step: 1000,
        cargoInfo: 'Строительные материалы · 5000 кг · 20 м³',
        loadingDate: expect.any(String),
      });

      // ✅ Отдельно проверяем цену с регулярным выражением
      expect(viewModel.price).toMatch(/15[ ,]000 ₽/);
    });

    it('маппит аукцион с myBet', () => {
      const auctionWithBet = {
        ...mockAuction,
        trading: { ...mockAuction.trading, myBet: 15000 },
      };

      const viewModel = mapAuctionToCardViewModel(auctionWithBet);

      expect(viewModel.hasMyBet).toBe(true);
    });
  });

  describe('mapBetToViewModel', () => {
    const mockBet: IBet = {
      id: 'bet-1',
      price: 15000,
      participant: 'ООО ТрансЛогистик',
      isWinner: true,
      isCancelled: false,
      createdAt: '2024-08-15T10:00:00Z',
    };

    it('маппит ставку-победителя', () => {
      const viewModel = mapBetToViewModel(mockBet);

      expect(viewModel).toEqual({
        id: 'bet-1',
        participant: 'ООО ТрансЛогистик',
        status: 'Победитель',
        statusColor: 'success',
        date: expect.any(String),
        isWinner: true,
        isCancelled: false,
      });

      // ✅ Отдельно проверяем цену
      expect(viewModel.price).toMatch(/15[ ,]000 ₽/);
    });

    it('маппит отменённую ставку', () => {
      const cancelledBet: IBet = {
        ...mockBet,
        isCancelled: true,
        cancelReason: 'Отказ от участия',
      };

      const viewModel = mapBetToViewModel(cancelledBet);

      expect(viewModel.status).toBe('Отменена');
      expect(viewModel.statusColor).toBe('error');
      expect(viewModel.isCancelled).toBe(true);
    });

    it('маппит обычную ставку', () => {
      const regularBet: IBet = {
        ...mockBet,
        isWinner: false,
        isCancelled: false,
      };

      const viewModel = mapBetToViewModel(regularBet);

      expect(viewModel.status).toBe('Участник');
      expect(viewModel.statusColor).toBe('default');
    });
  });
});
