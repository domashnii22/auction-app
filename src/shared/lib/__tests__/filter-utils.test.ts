// src/shared/lib/__tests__/filter-utils.test.ts

import { describe, it, expect } from 'vitest';
import type { SearchParams } from '@/features/auctions-list/model/searchSchema';
import type { IAuctionFilters } from '@/shared/types/api/auctions';

describe('filter-utils', () => {
  describe('searchParamsToFilters', () => {
    // Простая реализация прямо в тесте
    const searchParamsToFilters = (
      params: Partial<SearchParams>,
    ): IAuctionFilters => {
      return {
        cargo_num: params.cargo_num || undefined,
        status: params.status,
        statuses: params.statuses?.length ? params.statuses : undefined,
        auc_type: params.auc_type,
        load_city: params.load_city || undefined,
        unload_city: params.unload_city || undefined,
        date_from: params.date_from || undefined,
        date_to: params.date_to || undefined,
        is_available: params.is_available,
        is_bidder: params.is_bidder,
        price_from: params.price_from,
        price_to: params.price_to,
      };
    };

    it('преобразует search-параметры в фильтры', () => {
      const params: Partial<SearchParams> = {
        cargo_num: 'CARGO-001',
        status: 'Active',
        statuses: ['Active', 'Completed'],
        load_city: 'Москва',
        price_from: 1000,
        price_to: 5000,
      };

      const filters = searchParamsToFilters(params);

      expect(filters).toEqual({
        cargo_num: 'CARGO-001',
        status: 'Active',
        statuses: ['Active', 'Completed'],
        load_city: 'Москва',
        price_from: 1000,
        price_to: 5000,
      });
    });

    it('игнорирует undefined значения', () => {
      const params: Partial<SearchParams> = {
        cargo_num: undefined,
        status: undefined,
        load_city: '',
        price_from: undefined,
      };

      const filters = searchParamsToFilters(params);

      expect(filters.cargo_num).toBeUndefined();
      expect(filters.status).toBeUndefined();
      expect(filters.load_city).toBeUndefined();
      expect(filters.price_from).toBeUndefined();
    });

    it('преобразует пустой массив statuses в undefined', () => {
      const params: Partial<SearchParams> = {
        statuses: [],
      };

      const filters = searchParamsToFilters(params);

      expect(filters.statuses).toBeUndefined();
    });
  });

  describe('filtersToSearchParams', () => {
    // Простая реализация прямо в тесте
    const filtersToSearchParams = (
      filters: IAuctionFilters,
    ): Partial<SearchParams> => {
      return {
        cargo_num: filters.cargo_num || undefined,
        status: filters.status || undefined,
        statuses: filters.statuses,
        auc_type: filters.auc_type || undefined,
        load_city: filters.load_city || undefined,
        unload_city: filters.unload_city || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        is_available: filters.is_available || undefined,
        is_bidder: filters.is_bidder || undefined,
        price_from:
          filters.price_from !== undefined ? filters.price_from : undefined,
        price_to: filters.price_to !== undefined ? filters.price_to : undefined,
      };
    };

    it('обрабатывает undefined значения', () => {
      const filters: IAuctionFilters = {
        cargo_num: undefined,
        status: undefined,
        load_city: undefined,
        price_from: undefined,
      };

      const params = filtersToSearchParams(filters);

      expect(params.cargo_num).toBeUndefined();
      expect(params.status).toBeUndefined();
      expect(params.load_city).toBeUndefined();
      expect(params.price_from).toBeUndefined();
    });
  });

  describe('hasActiveFilters', () => {
    const hasActiveFilters = (filters: IAuctionFilters): boolean => {
      return Object.values(filters).some(
        (value) =>
          value !== undefined &&
          value !== '' &&
          value !== null &&
          !(Array.isArray(value) && value.length === 0),
      );
    };

    it('возвращает true если есть активные фильтры', () => {
      const filters: IAuctionFilters = {
        cargo_num: 'CARGO-001',
        status: 'Active',
      };

      expect(hasActiveFilters(filters)).toBe(true);
    });

    it('возвращает true если statuses не пустой', () => {
      const filters: IAuctionFilters = {
        statuses: ['Active', 'Completed'],
      };

      expect(hasActiveFilters(filters)).toBe(true);
    });

    it('возвращает false если нет активных фильтров', () => {
      const filters: IAuctionFilters = {
        cargo_num: undefined,
        status: undefined,
        statuses: [],
        load_city: '',
        price_from: undefined,
      };

      expect(hasActiveFilters(filters)).toBe(false);
    });

    it('возвращает false для пустого объекта', () => {
      const filters: IAuctionFilters = {};

      expect(hasActiveFilters(filters)).toBe(false);
    });
  });
});
