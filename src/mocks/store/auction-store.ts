import { v4 as uuidv4 } from 'uuid';
import { initialAuctions } from './initial-data';
import type { IAuction, IBet } from '@/shared/types/api/auctions';

export class AuctionStore {
  private auctions: Map<string, IAuction> = new Map();

  constructor(initialData: IAuction[]) {
    initialData.forEach((auction) => {
      this.auctions.set(auction.id, auction);
    });
  }

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

    if (filters) {
      if (filters.cargo_num) {
        items = items.filter((a) => a.cargoNumber.includes(filters.cargo_num));
      }
      if (filters.status) {
        items = items.filter((a) => a.status === filters.status);
      }
      if (filters.is_bidder === true) {
        items = items.filter((a) => a.trading.myBet !== undefined);
      }
      if (filters.is_available === true) {
        items = items.filter((a) => a.trading.canSetBet === true);
      }
      if (filters.auc_type) {
        items = items.filter((a) => a.type === filters.auc_type);
      }
      if (filters.load_city) {
        items = items.filter((a) =>
          a.route.from.toLowerCase().includes(filters.load_city!.toLowerCase()),
        );
      }
      if (filters.unload_city) {
        items = items.filter((a) =>
          a.route.to.toLowerCase().includes(filters.unload_city!.toLowerCase()),
        );
      }
      if (filters.date_from) {
        items = items.filter((a) => a.dates.loading >= filters.date_from!);
      }
      if (filters.date_to) {
        items = items.filter((a) => a.dates.loading <= filters.date_to!);
      }
      if (filters.price_from) {
        const priceFrom = filters.price_from;
        items = items.filter((a) => a.currentPrice >= priceFrom);
      }
      if (filters.price_to) {
        const priceTo = filters.price_to;
        items = items.filter((a) => a.currentPrice <= priceTo);
      }
      if (filters.statuses && filters.statuses.length > 0) {
        items = items.filter((a) => filters.statuses!.includes(a.status));
      }
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

  getAuction(id: string): IAuction | undefined {
    const auction = this.auctions.get(id);
    if (!auction) return undefined;

    return {
      ...auction,
      bets: [...auction.bets],
    };
  }

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

    if (!auction.trading.canSetBet) {
      return { success: false, error: 'Вы не можете сделать ставку' };
    }

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

    const bet: IBet = {
      id: uuidv4(),
      price,
      participant,
      isWinner: false,
      isCancelled: false,
      createdAt: new Date().toISOString(),
    };

    auction.bets.push(bet);

    auction.currentPrice = price;

    if (participant === 'me') {
      auction.trading.myBet = price;
      auction.trading.userStatus = this.calculateUserStatus(auctionId);
    }

    if (price >= auction.trading.maxPrice) {
      auction.trading.canSetBet = false;
    }

    return { success: true };
  }

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

  updateStatuses() {}
}

export const auctionStore = new AuctionStore(initialAuctions);
