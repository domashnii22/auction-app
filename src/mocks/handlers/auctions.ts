import { http, HttpResponse } from 'msw';
import { auctionStore } from '../store/auction-store';

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
      filters?: any;
    };

    const page = body?.page || 1;
    const limit = body?.limit || 10;
    const filters = body?.filters || {};

    const result = auctionStore.getAuctions(page, limit, filters);
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
