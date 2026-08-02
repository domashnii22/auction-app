import { http, HttpResponse } from 'msw';
import { auctionStore } from '../store/auction-store';
import type { IAuctionFilters } from '@/shared/types/api/auctions';

export const auctionHandlers = [
  http.get('/api/auctions/:id', ({ params }) => {
    const { id } = params as { id: string };
    const auction = auctionStore.getAuction(id);

    if (!auction) {
      return new HttpResponse(JSON.stringify({ error: 'Аукцион не найден' }), {
        status: 404,
      });
    }

    return HttpResponse.json(auction);
  }),

  http.post('/api/auctions/list', async ({ request }) => {
    const body = (await request.json()) as {
      page?: number;
      limit?: number;
      filters?: IAuctionFilters;
    };

    const page = body?.page || 1;
    const limit = body?.limit || 10;
    const filters = body?.filters || {};

    let result = auctionStore.getAuctions(page, limit, filters);

    if (filters.is_available === true) {
      const availableItems = result.items.filter(
        (a) => a.trading.canSetBet === true,
      );

      result = {
        ...result,
        items: availableItems,
        total: availableItems.length,
      };
    }

    if (filters.is_bidder === true) {
      const bidderItems = result.items.filter(
        (a) => a.trading.myBet !== undefined,
      );

      result = {
        ...result,
        items: bidderItems,
        total: bidderItems.length,
      };
    }

    if (filters.auc_type) {
      const typeItems = result.items.filter((a) => a.type === filters.auc_type);

      result = {
        ...result,
        items: typeItems,
        total: typeItems.length,
      };
    }

    if (filters.load_city) {
      const cityItems = result.items.filter((a) =>
        a.route.from.toLowerCase().includes(filters.load_city!.toLowerCase()),
      );

      result = {
        ...result,
        items: cityItems,
        total: cityItems.length,
      };
    }

    if (filters.unload_city) {
      const cityItems = result.items.filter((a) =>
        a.route.to.toLowerCase().includes(filters.unload_city!.toLowerCase()),
      );

      result = {
        ...result,
        items: cityItems,
        total: cityItems.length,
      };
    }

    if (filters.date_from) {
      const dateItems = result.items.filter(
        (a) => a.dates.loading >= filters.date_from!,
      );

      result = {
        ...result,
        items: dateItems,
        total: dateItems.length,
      };
    }

    if (filters.date_to) {
      const dateItems = result.items.filter(
        (a) => a.dates.loading <= filters.date_to!,
      );

      result = {
        ...result,
        items: dateItems,
        total: dateItems.length,
      };
    }

    if (filters.price_from) {
      const priceFrom = filters.price_from;
      const priceItems = result.items.filter(
        (a) => a.currentPrice >= priceFrom,
      );

      result = {
        ...result,
        items: priceItems,
        total: priceItems.length,
      };
    }

    if (filters.price_to) {
      const priceTo = filters.price_to;
      const priceItems = result.items.filter((a) => a.currentPrice <= priceTo);

      result = {
        ...result,
        items: priceItems,
        total: priceItems.length,
      };
    }

    return HttpResponse.json(result);
  }),

  http.post('/api/auctions/:id/bets', async ({ params, request }) => {
    const { id } = params as { id: string };
    const body = (await request.json()) as { price: number };

    const result = auctionStore.addBet(id, body.price, 'me');

    if (!result.success) {
      return new HttpResponse(
        JSON.stringify({
          error: result.error,
          code: 422,
        }),
        { status: 422 },
      );
    }

    return HttpResponse.json({ success: true });
  }),

  http.get('/api/auctions/:id/bets', ({ params }) => {
    const { id } = params as { id: string };
    const auction = auctionStore.getAuction(id);

    if (!auction) {
      return new HttpResponse(JSON.stringify({ error: 'Аукцион не найден' }), {
        status: 404,
      });
    }

    return HttpResponse.json({
      bets: auction.bets,
      total: auction.bets.length,
    });
  }),
];
