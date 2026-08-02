import { useQuery } from '@tanstack/react-query';
import { auctionApi } from '@/shared/api/client';

export const AUCTION_DETAIL_QUERY_KEY = 'auction-detail';

export const useAuctionDetail = (id: string) => {
  return useQuery({
    queryKey: [AUCTION_DETAIL_QUERY_KEY, id],
    queryFn: () => auctionApi.getDetail(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 1,
  });
};
