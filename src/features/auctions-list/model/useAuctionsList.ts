import { useQuery } from '@tanstack/react-query';
import { auctionApi } from '@shared/api/client';
import type { IAuctionsListRequest } from '@/shared/types/api/auctions';

export const AUCTIONS_QUERY_KEY = 'auctions';

export const useAuctionsList = (params: IAuctionsListRequest) => {
  return useQuery({
    queryKey: [AUCTIONS_QUERY_KEY, params],
    queryFn: () => auctionApi.getList(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
