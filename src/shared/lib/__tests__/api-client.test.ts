import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/shared/api/client';

describe('api-client', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('apiClient', () => {
    it('выполняет GET-запрос с параметрами', async () => {
      const mockResponse = { items: [], total: 0 };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient('/auctions/list?page=1&limit=10');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/auctions/list?page=1&limit=10',
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it('выполняет POST-запрос с телом', async () => {
      const mockResponse = { success: true };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const body = { price: 15000 };
      const result = await apiClient('/auctions/1/bets', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/auctions/1/bets', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(body),
      });
      expect(result).toEqual(mockResponse);
    });

    it('обрабатывает ошибку 422', async () => {
      const errorResponse = {
        message: 'Некорректная ставка',
        errors: { price: ['Минимальная ставка: 1000 ₽'] },
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: () => Promise.resolve(errorResponse),
      });

      await expect(
        apiClient('/auctions/1/bets', {
          method: 'POST',
          body: JSON.stringify({ price: 0 }),
        }),
      ).rejects.toThrow('Некорректная ставка');
    });
  });
});
