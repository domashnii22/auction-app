import { v4 as uuidv4 } from 'uuid';
import { initialAuctions } from './initial-data';

export interface IBet {
  id: string;
  price: number;
  participant: string;
  isWinner: boolean;
  isCancelled: boolean;
  cancelReason?: string;
  createdAt: string;
}

export interface IAuction {
  id: string;
  cargoNumber: string;
  type: 'Request' | 'Up' | 'Down' | 'FixPrice';
  status: 'Active' | 'Completed' | 'Cancelled';
  route: {
    from: string;
    to: string;
  };
  cargo: {
    name: string;
    weight: number;
    volume: number;
    bodyType: string;
  };
  currentPrice: number;
  pricePerKm: number;
  step: number;
  trading: {
    canSetBet: boolean;
    myBet?: number;
    userStatus: 'Leading' | 'Losing' | 'Winner' | 'NotParticipating';
    minPrice: number;
    maxPrice: number;
  };
  dates: {
    loading: string;
    unloading: string;
  };
  organizer: {
    name: string;
    contacts?: {
      phone?: string;
      email?: string;
    };
  };
  hideBetsHistory: boolean;
  hidePointsAddressAndContacts: boolean;
  noViewCargoPrice: boolean;
  bets: IBet[];
}

export class AuctionStore {
  private auctions: Map<string, IAuction> = new Map();

  constructor(initialData: IAuction[]) {
    initialData.forEach((auction) => {
      this.auctions.set(auction.id, auction);
    });
  }

  // Получить все аукционы с пагинацией и фильтрами
  getAuctions(
    page: number = 1,
    limit: number = 10,
    filters?: any,
  ): {
    items: IAuction[];
    total: number;
    page: number;
    totalPages: number;
  } {
    let items = Array.from(this.auctions.values());

    // Применяем фильтры (упрощённо)
    if (filters) {
      if (filters.cargo_num) {
        items = items.filter((a) => a.cargoNumber.includes(filters.cargo_num));
      }
      if (filters.status) {
        items = items.filter((a) => a.status === filters.status);
      }
      // ... остальные фильтры
    }

    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      items: items.slice(start, end),
      total,
      page,
      totalPages,
    };
  }

  // Получить аукцион по ID
  getAuction(id: string): IAuction | undefined {
    const auction = this.auctions.get(id);
    if (!auction) return undefined;

    // Возвращаем копию, чтобы избежать мутаций
    return {
      ...auction,
      bets: [...auction.bets],
    };
  }

  // Добавить ставку
  addBet(
    auctionId: string,
    price: number,
    participant: string,
  ): {
    success: boolean;
    error?: string;
  } {
    const auction = this.auctions.get(auctionId);
    if (!auction) {
      return { success: false, error: 'Аукцион не найден' };
    }

    // Проверяем, можно ли ставить
    if (!auction.trading.canSetBet) {
      return { success: false, error: 'Вы не можете сделать ставку' };
    }

    // Проверяем min/max
    if (price < auction.trading.minPrice) {
      return {
        success: false,
        error: `Минимальная ставка: ${auction.trading.minPrice} ₽`,
      };
    }
    if (price > auction.trading.maxPrice) {
      return {
        success: false,
        error: `Максимальная ставка: ${auction.trading.maxPrice} ₽`,
      };
    }

    // Создаём ставку
    const bet: IBet = {
      id: uuidv4(),
      price,
      participant,
      isWinner: false,
      isCancelled: false,
      createdAt: new Date().toISOString(),
    };

    // Добавляем в историю
    auction.bets.push(bet);

    // Обновляем текущую цену
    auction.currentPrice = price;

    // Обновляем статус пользователя
    if (participant === 'me') {
      auction.trading.myBet = price;
      auction.trading.userStatus = this.calculateUserStatus(auctionId);
    }

    // Проверяем, можно ли ещё ставить
    if (price >= auction.trading.maxPrice) {
      auction.trading.canSetBet = false;
    }

    return { success: true };
  }

  // Рассчитать статус пользователя
  private calculateUserStatus(
    auctionId: string,
  ): 'Leading' | 'Losing' | 'Winner' | 'NotParticipating' {
    const auction = this.auctions.get(auctionId);
    if (!auction) return 'NotParticipating';

    const myBets = auction.bets.filter((b) => b.participant === 'me');
    if (myBets.length === 0) return 'NotParticipating';

    const sortedBets = [...auction.bets].sort((a, b) => b.price - a.price);
    const myIndex = sortedBets.findIndex((b) => b.participant === 'me');

    if (myIndex === 0) return 'Winner';
    if (myIndex === 1) return 'Leading';
    return 'Losing';
  }

  // Обновить статус всех аукционов (для симуляции)
  updateStatuses() {
    // Здесь можно добавить логику автоматического обновления статусов
  }
}

// Создаём экземпляр store с начальными данными
export const auctionStore = new AuctionStore(initialAuctions);
