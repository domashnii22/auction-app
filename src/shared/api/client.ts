import type {
  IAuction,
  IAuctionsListRequest,
  IAuctionsListResponse,
  IBetsListResponse,
} from '../types/api/auctions';

const API_BASE_URL = '/api';

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

export const auctionApi = {
  getList: (data: IAuctionsListRequest): Promise<IAuctionsListResponse> => {
    return apiClient<IAuctionsListResponse>('/auctions/list', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getDetail: (id: string): Promise<IAuction> => {
    return apiClient<IAuction>(`/auctions/${id}`, {
      method: 'GET',
    });
  },

  getBets: (id: string): Promise<IBetsListResponse> => {
    return apiClient(`/auctions/${id}/bets`, {
      method: 'GET',
    });
  },

  setBet: (id: string, price: number): Promise<{ success: boolean }> => {
    return apiClient(`/auctions/${id}/bets`, {
      method: 'POST',
      body: JSON.stringify({ price }),
    });
  },
};
